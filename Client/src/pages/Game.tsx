// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Timer } from "lucide-react";
import Sequence from "./Sequence";
import socket from "../Utils/socket";
import { useGetMe } from "../services/queries";
import axios from "../Utils/axios";
import { useCreateDuel } from "../services/mutations";
import { toast } from "sonner";
import showToast from "@/components/Toast";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Game = () => {
  const { id: roomId } = useParams(); // Room ID
  const navigate = useNavigate();
  const { data: user, isLoading: userFetching, isError: userError } = useGetMe();
  const [score, setScore] = useState(0);
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
  // Add countdown state
  const [countdown, setCountdown] = useState(null);

  const { mutate: createDuel, isPending: creatingDuel } = useCreateDuel();
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const fetchOpponent = async (userId) => {
    console.log(userId);
    if (!userId) return;
    setOpponentState((prev) => ({ ...prev, isLoading: true, isError: false }));

    try {
      const response = await axios.get(`/api/user/get/${userId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch user");
      }
      setOpponentState((prev) => ({ ...prev, opponent: response.data.user, isLoading: false }));

      // Emit playerReady event when opponent is fetched successfully
      socket.emit("playerReady", { roomId, playerId: user?._id });

    } catch (error) {
      setOpponentState((prev) => ({ ...prev, isError: true, isLoading: false }));
    }
  };
  
  useEffect(() => {
    socket.emit("joinRoom", { roomId: roomId, playerId: user._id, gameTime: 120 });
    return () => {
      socket.off("joinRoom");
    };
  }, []);
  
  console.log(opponentState);
  
  useEffect(() => {
    // Listen for both players being ready
    socket.on("bothPlayersReady", () => {
      console.log("Both players are ready, starting countdown...");
      setGameCanStart(true);
      // Start the 3 second countdown
      setCountdown(3);
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
      console.log(room);
      const otherPlayer = room.players.find((p) => p.playerId !== user?._id);
      if (otherPlayer) {
        fetchOpponent(otherPlayer.playerId);
        setOpponentState((prev) => ({ ...prev, score: otherPlayer.score }));
      }
    });

    // Listen for score updates from other players
    socket.on("latestScore", ({ players }) => {
      const otherPlayer = players.find((p) => p.playerId !== user?._id);
      if (otherPlayer) {
        setOpponentState((prev) => ({ ...prev, score: otherPlayer.score }));
      }
    });
    socket.on("message",({message})=>{
      console.log(message);
      showToast(message);
    })

    return () => {
      socket.off("bothPlayersReady");
      socket.off("startGame");
      socket.off("timerUpdate");
      socket.off("nextSequence");
      socket.off("gameOver");
      socket.off("roomUpdate");
      socket.off("latestScore");
      socket.off("message");
      socket.emit('leftRoom',{roomId,playerId:user._id});
    };
  }, []);

  // Add countdown effect
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      // When countdown reaches 0, emit the startGame event
      // socket.emit("startGame", { roomId });
      setCountdown(null);
      return;
    }
    if (countdown === 1) {
      // When countdown reaches 0, emit the startGame event
      socket.emit("startGame", { roomId });
      // setCountdown(null);
      // return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, roomId]);

  const handleScoreUpdate = () => {
    const newScore = score + 1;
    setScore(newScore);
    socket.emit("updateScore", { roomId, score: newScore });
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
      {gameEnded ? (
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
        </div>
      ) : countdown !== null ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-white">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl mb-6">Get Ready!</h2>
            <div className="text-8xl font-bold text-main-green animate-pulse">
              {countdown}
            </div>
          </div>
        </div>
      ) : isGameActive ? (
        <div className="min-h-screen bg-main-black pt-24 max-md:px-5 flex flex-col items-center justify-start relative overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[#1a1a1a]">
            <div className="absolute inset-0" 
                 style={{
                   backgroundImage: `
                     linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                     linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
                   `,
                   backgroundSize: '50px 50px',
                   opacity: '0.5'
                 }}>
            </div>
            {/* Radial gradient overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#1a1a1a]/80 to-[#1a1a1a] opacity-90"></div>
          </div>

          <div className="flex flex-col h-full w-[50%] max-w-full max-md:w-full relative z-10">
            <div className="w-full flex items-center justify-between">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  {user.profileImage && <img src={user?.profileImage} className="size-[2.5rem] rounded-xl" />}
                  <span className="text-main-white text-[1.25rem] font-semibold">You</span>
                </div>
                <div className="py-2 px-5 bg-[#2a2a2a] border-[1px] border-main-green rounded-[10px]">
                  <span className="text-main-white">{score}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  {opponentState.opponent?.profileImage && <img src={opponentState.opponent?.profileImage} className="size-[2.5rem] rounded-xl" />}
                  <span className="text-main-white text-[1.25rem] font-semibold">{opponentState.opponent?.name}</span>
                </div>
                <div className="py-2 px-5 bg-[#2a2a2a] border-[1px] border-main-green rounded-[10px]">
                  <span className="text-main-white">{opponentState.score}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mt-6">
              <div className="flex gap-1 items-center p-1 px-2 border-[1px] border-main-white/30 rounded-[10px] bg-[#2a2a2a]/50 backdrop-blur-sm">
                <Timer className="size-[0.9rem] text-[#00ffff]" />
                <span className="text-[#00ffff] text-s font-bold">{formatTime(time)}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex-col flex items-center justify-center relative z-10">
            {sequence.length > 0 && <Sequence sequence={sequence} handleScoreUpdate={handleScoreUpdate} />}
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-[#e0e0e0]">
          <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold">Waiting for Opponent...</h1>
          {roomId && (
            <div className="mt-4">
              <p className="text-xl">Your Duel ID:</p>
              <span className="text-[#00ffff] font-mono text-2xl">{roomId}</span>
            </div>
            
          )}
           <div className="w-40 h-40">
      <DotLottieReact
        src="https://lottie.host/dd384f93-16d7-4e61-8b36-01bb0f7d2c61/6G5pYY2H9H.lottie"
        loop
        autoplay
      />
    </div>
    </div>
        </div>
      )}
    </>
  );
};

export default Game;