// @ts-nocheck

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Timer } from "lucide-react";
import Sequence from "./Sequence";
import socket from "../Utils/socket";
import { useGetMe } from "../services/queries";
import axios from "../Utils/axios";
import { useCreateDuel } from "../services/mutations";

const RandomMatch = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: userFetching, isError: userError } = useGetMe();
  const [score, setScore] = useState(0);
  // Use a ref to maintain a consistent roomId that doesn't trigger re-renders
  const roomIdRef = useRef('');
  
  // Opponent state with all relevant data
  const [opponentState, setOpponentState] = useState({
    opponent: null,
    isLoading: false,
    isError: false,
    score: 0,
  });

  const [time, setTime] = useState();
  const [sequence, setSequence] = useState([]);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameCanStart, setGameCanStart] = useState(false);  
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResultMessage, setGameResultMessage] = useState("");

  const { mutate: createDuel, isPending: creatingDuel } = useCreateDuel();
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const fetchOpponent = async (userId, roomId) => {
    console.log(userId);
    if (!userId) return;
    setOpponentState((prev) => ({ ...prev, isLoading: true, isError: false }));

    try {
      const response = await axios.get(`/api/user/get/${userId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch user");
      }
      setOpponentState((prev) => ({ ...prev, opponent: response.data.user, isLoading: false }));
      console.log(response);
      // Emit playerReady event when opponent is fetched successfully
      socket.emit("playerReady", { roomId, playerId: user?._id });

    } catch (error) {
      setOpponentState((prev) => ({ ...prev, isError: true, isLoading: false }));
    }
  };
  
  useEffect(() => {
    if (!user?._id) return;
    
    socket.emit("joinMatchRoom", { playerId: user._id });
    
    return () => {   
      socket.off("joinMatchRoom");
    };
  }, [user]);
  
  useEffect(() => {
    if (!user?._id) return;
    
    // Listen for both players being ready
    socket.on("bothPlayersReady", ({roomId}) => {
      console.log("Both players are ready, starting game...");
      setGameCanStart(true);
      socket.emit("startGame", { roomId });
    });

    // Listen for game start event
    socket.on("GameStarted", ({ sequence }) => {
      console.log("Game started! Sequence:", sequence);
      setSequence(sequence);
      setIsGameActive(true);
    });

    // Listen for the timer update from backend
    socket.on("timerUpdate", ({ timer }) => {
      console.log(timer);
      setTime(timer);
    });

    // Listen for the next sequence to update the sequence state
    socket.on("nextSequence", ({ sequence }) => {
      setSequence(sequence);
    });

    // Handle game over
    socket.on("gameOver", ({ message, room }) => {
      console.log(room);
    
      const isPlayer1 = room.players[0].playerId === user._id;
      const currentPlayer = isPlayer1 ? room.players[0] : room.players[1];
      const opponentPlayer = isPlayer1 ? room.players[1] : room.players[0];
    
      createDuel(
        {
          player1Id: room.players[0].playerId,
          player2Id: room.players[1].playerId,
          player1Score: room.players[0].score,
          player2Score: room.players[1].score,
          duelTime: room.duelTime,
        },
        {
          onSuccess: () => {
            // Compare currentPlayer and opponent scores
            let resultMsg = "It's a draw!";
            if (currentPlayer.score > opponentPlayer.score) resultMsg = "You won!";
            else if (currentPlayer.score < opponentPlayer.score) resultMsg = "You missed this time!";
            setGameResultMessage(resultMsg);
            setGameEnded(true);
          },
          onError: () => {
            setGameResultMessage("Error saving duel. Please try again.");
            setGameEnded(true);
          },
        }
      );
    });
    

    // Handle room update, fetch opponent details and update score
    socket.on("roomUpdate", (room) => {
      console.log(user._id);
      roomIdRef.current = room.roomId; // Store roomId in the ref
      const otherPlayer = room.players.find((p) => p.playerId !== user._id);
      if (otherPlayer) {
        fetchOpponent(otherPlayer.playerId, room.roomId);
        setOpponentState((prev) => ({ ...prev, score: otherPlayer.score }));
      }
    });

    // Listen for score updates from other players
    socket.on("latestScore", ({ players }) => {
      const otherPlayer = players.find((p) => p.playerId !== user._id);
      if (otherPlayer) {
        setOpponentState((prev) => ({ ...prev, score: otherPlayer.score }));
      }
    });

    return () => {
      socket.off("bothPlayersReady");
      socket.off("startGame");
      socket.off("timerUpdate");
      socket.off("nextSequence");
      socket.off("gameOver");
      socket.off("roomUpdate");
      socket.off("latestScore");
    };
  }, [user]);

  const handleScoreUpdate = () => {
    const newScore = score + 1;
    setScore(newScore);
    socket.emit("updateScore", { roomId: roomIdRef.current, score: newScore });
  };

  if (isGameActive && (userFetching || opponentState.isLoading || opponentState.isError || userError)) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  if (creatingDuel) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-xl">Preparing the Result...</div>
      </div>
    );
  }

  return (
    <>
    {
      gameEnded ?
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-white px-4">
        <h1 className="text-4xl font-bold mb-6">{gameResultMessage}</h1>
        <div className="flex gap-10 items-center justify-center text-center">
          <div>
            <p className="text-xl font-semibold mb-2">You</p>
            <p className="text-main-green text-2xl font-bold">{score}</p>
          </div>
          <span className="text-3xl font-bold">vs</span>
          <div>
            <p className="text-xl font-semibold mb-2">{opponentState.opponent?.name}</p>
            <p className="text-main-green text-2xl font-bold">{opponentState.score}</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 bg-main-green text-black px-6 py-2 rounded-xl cursor-pointer font-semibold hover:bg-opacity-80 transition"
        >
          Play Again
        </button>
      </div>: 
      isGameActive ? (
        <div className="min-h-screen bg-main-black pt-30 max-md:px-5 flex flex-col items-center justify-start">
          <div className="flex flex-col h-full w-[50%] max-w-full max-md:w-full">
            <div className="w-full flex items-center justify-between">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <img src={user?.profileImage} className="size-[2.5rem] rounded-xl" />
                  <span className="text-main-white text-[1.25rem] font-semibold">You</span>
                </div>
                <div className="py- px-5 bg-[#2a2a2a] border-[1px] border-main-green rounded-[10px]">
                  <span className="text-main-white ">{score}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <img src={opponentState.opponent?.profileImage} className="size-[2.5rem] rounded-xl" />
                  <span className="text-main-white text-[1.25rem] font-semibold">{opponentState.opponent?.name}</span>
                </div>
                <div className="py- px-5 bg-[#2a2a2a] border-[1px] border-main-green rounded-[10px]">
                  <span className="text-main-white ">{opponentState.score}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex gap-1 items-center p-1 px-2 border-[1px] border-main-white/30 rounded-[10px]">
                <Timer className="size-[0.9rem] text-[#00ffff]" />
                <span className="text-[#00ffff] text-s font-bold">{formatTime(time)}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex-col flex items-center justify-center">
            {sequence.length > 0 && <Sequence sequence={sequence} handleScoreUpdate={handleScoreUpdate} roomId={roomIdRef.current} />}
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-[#e0e0e0]">
          <h1 className="text-3xl font-bold">Searching for Opponent...</h1>
        </div>
      )
    }
    </>
  );
};

export default RandomMatch;