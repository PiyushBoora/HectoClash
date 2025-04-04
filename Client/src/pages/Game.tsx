import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Trophy, Users } from "lucide-react";
import Sequence from "./Sequence";
import socket from "../Utils/socket";
import { useGetMe } from "../services/queries";
import axios from "../Utils/axios";
import { getRandomQuestions } from "../data/questions";

const Game = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const { data: user, isLoading: userFetching, isError: userError } = useGetMe();
  const [score, setScore] = useState(0);
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
  const [solutions, setSolutions] = useState([]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const fetchOpponent = async (userId) => {
    if (!userId) return;
    setOpponentState((prev) => ({ ...prev, isLoading: true, isError: false }));

    try {
      const response = await axios.get(`/api/user/get/${userId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch user");
      }
      setOpponentState((prev) => ({
        ...prev,
        opponent: response.data.user,
        isLoading: false,
      }));
      socket.emit("playerReady", { roomId, playerId: user?._id });
    } catch (error) {
      setOpponentState((prev) => ({ ...prev, isError: true, isLoading: false }));
    }
  };

  useEffect(() => {
    if (user?._id) {
      socket.emit("joinRoom", { roomId: roomId, playerId: user._id });
    }
    return () => {
      socket.off("joinRoom");
    };
  }, [user]);

  useEffect(() => {
    socket.on("bothPlayersReady", () => {
      setGameCanStart(true);
      socket.emit("startGame", { roomId });
    });

    socket.on("GameStarted", async ({ sequence }) => {
      setSequence(sequence);
      setIsGameActive(true);
      
      // Get solutions for the sequence
      try {
        const response = await axios.post('/api/game/solutions', { sequence });
        if (response.data.success) {
          setSolutions(response.data.solutions);
        }
      } catch (error) {
        console.error('Failed to fetch solutions:', error);
      }
    });

    socket.on("timerUpdate", ({ timer }) => {
      setTime(timer);
    });

    socket.on("nextSequence", async ({ sequence }) => {
      setSequence(sequence);
      
      // Get solutions for the new sequence
      try {
        const response = await axios.post('/api/game/solutions', { sequence });
        if (response.data.success) {
          setSolutions(response.data.solutions);
        }
      } catch (error) {
        console.error('Failed to fetch solutions:', error);
      }
    });

    socket.on("gameOver", () => {
      setIsGameActive(false);
      navigate(`/analysis/${roomId}`);
    });

    socket.on("roomUpdate", (room) => {
      const otherPlayer = room.players.find((p) => p.playerId !== user?._id);
      if (otherPlayer) {
        fetchOpponent(otherPlayer.playerId);
        setOpponentState((prev) => ({ ...prev, score: otherPlayer.score }));
      }
    });

    socket.on("latestScore", ({ players }) => {
      const otherPlayer = players.find((p) => p.playerId !== user?._id);
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
    socket.emit("updateScore", { roomId, score: newScore });
  };

  if (isGameActive && (userFetching || opponentState.isLoading || opponentState.isError || userError)) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20">
      <AnimatePresence mode="wait">
        {isGameActive ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4"
          >
            {/* Game Header */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              {/* Player Score */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-[#2a2a2a] rounded-xl p-6"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={user?.profileImage}
                    alt={user?.name}
                    className="w-12 h-12 rounded-xl"
                  />
                  <div>
                    <h3 className="text-white font-semibold">You</h3>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[#00ffff]" />
                      <span className="text-[#00ffff] font-bold">{score}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Timer */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-center items-center"
              >
                <div className="bg-[#2a2a2a] rounded-xl px-6 py-3 flex items-center gap-3">
                  <Timer className="w-5 h-5 text-[#00ffff]" />
                  <span className="text-[#00ffff] text-xl font-bold">
                    {formatTime(time)}
                  </span>
                </div>
              </motion.div>

              {/* Opponent Score */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-[#2a2a2a] rounded-xl p-6"
              >
                <div className="flex items-center justify-end gap-4">
                  <div className="text-right">
                    <h3 className="text-white font-semibold">
                      {opponentState.opponent?.name}
                    </h3>
                    <div className="flex items-center justify-end gap-2">
                      <Trophy className="w-4 h-4 text-[#00ffff]" />
                      <span className="text-[#00ffff] font-bold">
                        {opponentState.score}
                      </span>
                    </div>
                  </div>
                  <img
                    src={opponentState.opponent?.profileImage}
                    alt={opponentState.opponent?.name}
                    className="w-12 h-12 rounded-xl"
                  />
                </div>
              </motion.div>
            </div>

            {/* Game Area */}
            <div className="flex-1">
              {sequence.length > 0 && (
                <Sequence
                  sequence={sequence}
                  solutions={solutions}
                  handleScoreUpdate={handleScoreUpdate}
                />
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto px-4 text-center"
          >
            <div className="bg-[#2a2a2a] rounded-xl p-8">
              <Users className="w-16 h-16 text-[#00ffff] mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">
                Waiting for Opponent...
              </h1>
              {roomId && (
                <div className="mt-6">
                  <p className="text-[#918a8a] mb-2">Share this Duel ID:</p>
                  <div className="bg-[#1a1a1a] rounded-lg px-4 py-2 flex items-center justify-center">
                    <span className="text-[#00ffff] font-mono text-xl">
                      {roomId}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;