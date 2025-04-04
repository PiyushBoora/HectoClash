import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import axios from "../Utils/axios";
import { Trophy, Clock, Target, Award } from "lucide-react";

interface Player {
  userId: {
    name: string;
    profileImage: string;
  };
  score: number;
  timeSpent: number[];
  correctAnswers: number;
  totalQuestions: number;
}

interface Solution {
  expression: string;
  difficulty: number;
}

interface GameStats {
  type: string;
  players: Player[];
  sequences: string[][];
  solutions: Solution[][];
  startTime: string;
  endTime: string;
}

const Analysis = () => {
  const { gameId } = useParams();
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameStats = async () => {
      try {
        const response = await axios.get(`/api/game/${gameId}/stats`);
        setGameStats(response.data.game);
      } catch (error) {
        console.error("Error fetching game stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameStats();
  }, [gameId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] pt-20 flex items-center justify-center">
        <div className="text-white">Loading analysis...</div>
      </div>
    );
  }

  if (!gameStats) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] pt-20 flex items-center justify-center">
        <div className="text-white">Game not found</div>
      </div>
    );
  }

  const getWinner = () => {
    return gameStats.players.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );
  };

  const winner = getWinner();
  const gameDuration = new Date(gameStats.endTime).getTime() - new Date(gameStats.startTime).getTime();
  const durationMinutes = Math.floor(gameDuration / 1000 / 60);

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {/* Winner Section */}
          <div className="bg-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Winner</h2>
            <div className="flex items-center gap-4">
              <img
                src={winner.userId.profileImage}
                alt={winner.userId.name}
                className="w-16 h-16 rounded-full border-4 border-[#00ffff]"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{winner.userId.name}</h3>
                <div className="flex items-center gap-2 text-[#00ffff]">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold">{winner.score} points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Summary */}
          <div className="bg-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Game Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#00ffff]" />
                <span className="text-white">{durationMinutes} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#00ffff]" />
                <span className="text-white">
                  {gameStats.sequences.length} sequences
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Player Performance Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {gameStats.players.map((player, index) => (
            <div key={index} className="bg-[#2a2a2a] rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={player.userId.profileImage}
                  alt={player.userId.name}
                  className="w-12 h-12 rounded-full"
                />
                <h3 className="text-xl font-bold text-white">
                  {player.userId.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#3a3a3a] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-[#00ffff]" />
                    <span className="text-[#918a8a]">Score</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {player.score}
                  </span>
                </div>
                <div className="bg-[#3a3a3a] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-[#00ffff]" />
                    <span className="text-[#918a8a]">Accuracy</span>
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {Math.round((player.correctAnswers / player.totalQuestions) * 100)}%
                  </span>
                </div>
              </div>

              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={player.timeSpent.map((time, i) => ({
                    sequence: `S${i + 1}`,
                    time
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                    <XAxis dataKey="sequence" stroke="#918a8a" />
                    <YAxis stroke="#918a8a" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2a2a2a",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="#00ffff"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Sequence Analysis with Solutions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a2a2a] rounded-xl p-6 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Sequence Analysis
          </h2>
          <div className="space-y-4">
            {gameStats.sequences.map((sequence, index) => (
              <div
                key={index}
                className="bg-[#3a3a3a] rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[#918a8a]">Sequence {index + 1}</span>
                    <div className="flex gap-2">
                      {sequence.map((num, i) => (
                        <span
                          key={i}
                          className="w-8 h-8 flex items-center justify-center bg-[#2a2a2a] rounded-lg text-white font-bold"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    {gameStats.players.map((player, playerIndex) => (
                      <div
                        key={playerIndex}
                        className="flex items-center gap-2"
                      >
                        <img
                          src={player.userId.profileImage}
                          alt={player.userId.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-[#00ffff]">
                          {player.timeSpent[index]}s
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Solutions */}
                <div className="mt-4 border-t border-[#4a4a4a] pt-4">
                  <h4 className="text-[#918a8a] mb-2">Possible Solutions:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {gameStats.solutions[index].map((solution, solutionIndex) => (
                      <div
                        key={solutionIndex}
                        className="bg-[#2a2a2a] rounded-lg p-3 flex justify-between items-center"
                      >
                        <span className="font-mono text-white">
                          {solution.expression}
                        </span>
                        <span className="text-[#918a8a] text-sm">
                          Difficulty: {solution.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analysis;