import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Swords,
  Users,
  Trophy,
  Timer,
  Target,
  TrendingUp,
} from "lucide-react";
import socket from "../Utils/socket";
import { useGetMe, useGetLeaderboard } from "../services/queries";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [duelId, setDuelId] = useState<string>("");
  const [showCopied, setShowCopied] = useState(false);
  const [isJoiningDuel, setIsJoiningDuel] = useState(false);
  const { data: user, isLoading, isError } = useGetMe();
  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useGetLeaderboard();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const generateDuelId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCreateDuel = () => {
    const newDuelId = generateDuelId();
    setDuelId(newDuelId);
    navigate(`/game/${newDuelId}`);
  };
  const handleRandomMatch=()=>{
    const newDuelId = generateDuelId();
    setDuelId(newDuelId);
    navigate(`/random/match/${newDuelId}`);
  }
  const handleJoinDuel = () => {
    if (duelId.trim()) {
      navigate(`/game/${duelId}`);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  // Default stats when user data is not available
  const defaultStats = [
    { icon: Trophy, label: "Total Score", value: "0" },
    { icon: Timer, label: "Avg. Time", value: "0s" },
    { icon: Target, label: "Accuracy", value: "0%" },
    { icon: TrendingUp, label: "Win Rate", value: "0%" },
  ];

  // Calculate real stats from user data
  const stats = user ? [
    { 
      icon: Trophy, 
      label: "Total Score", 
      value: user.stats.totalScore.toString() 
    },
    { 
      icon: Timer, 
      label: "Avg. Time", 
      value: `${Math.round(user.stats.averageTime)}s` 
    },
    { 
      icon: Target, 
      label: "Accuracy", 
      value: `${Math.round(user.stats.accuracy)}%` 
    },
    { 
      icon: TrendingUp, 
      label: "Win Rate", 
      value: user.stats.gamesPlayed > 0 
        ? `${Math.round((user.stats.wins / user.stats.gamesPlayed) * 100)}%` 
        : "0%" 
    },
  ] : defaultStats;

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Stats Section */}
        <motion.div
          variants={item}
          className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-[#2a2a2a] rounded-xl p-4 flex flex-col items-center justify-center"
            >
              <stat.icon className="w-8 h-8 text-[#00ffff] mb-2" />
              <h3 className="text-[#918a8a] text-sm">{stat.label}</h3>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="lg:row-span-2">
          <div className="bg-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-[#e0e0e0] text-xl font-bold mb-4">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateDuel}
                className="w-full flex items-center justify-center gap-2 bg-[#00ffff] text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold hover:bg-[#00cccc] transition-colors"
              >
                <Swords className="w-5 h-5" />
                Create New Duel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsJoiningDuel(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#3a3a3a] text-[#e0e0e0] px-6 py-3 rounded-lg font-semibold hover:bg-[#4a4a4a] transition-colors"
              >
                <Users className="w-5 h-5" />
                Join Existing Duel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/practice")}
                className="w-full flex items-center justify-center gap-2 bg-[#3a3a3a] text-[#e0e0e0] px-6 py-3 rounded-lg font-semibold hover:bg-[#4a4a4a] transition-colors"
              >
                <Target className="w-5 h-5" />
                Practice Mode
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/random/match")}
                className="w-full flex items-center justify-center gap-2 bg-[#3a3a3a] text-[#e0e0e0] px-6 py-3 rounded-lg font-semibold hover:bg-[#4a4a4a] transition-colors"
              >
                <Target className="w-5 h-5" />
                Random Join
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <div className="bg-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-[#e0e0e0] text-xl font-bold mb-4">
              Weekly Performance
            </h2>
            <div className="h-64">
              {user && user.stats.gamesPlayed > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={user.weeklyPerformance || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                    <XAxis
                      dataKey="name"
                      stroke="#918a8a"
                      tick={{ fill: "#918a8a" }}
                    />
                    <YAxis stroke="#918a8a" tick={{ fill: "#918a8a" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2a2a2a",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="score"
                      fill="#00ffff"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[#918a8a]">
                  No performance data available yet
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div variants={item} className="lg:col-span-3">
          <div className="bg-[#2a2a2a] rounded-xl p-6">
            <h2 className="text-[#e0e0e0] text-xl font-bold mb-4">
              Global Leaderboard
            </h2>
            <div className="overflow-x-auto">
              {isLeaderboardLoading ? (
                <div className="text-center text-[#918a8a] py-4">Loading leaderboard...</div>
              ) : leaderboardData && leaderboardData.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="text-[#918a8a]">
                      <th className="text-left py-2">Rank</th>
                      <th className="text-left py-2">Player</th>
                      <th className="text-right py-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((player, index) => (
                      <motion.tr
                        key={player._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ backgroundColor: "#3a3a3a" }}
                        className="text-white border-t border-[#3a3a3a]"
                      >
                        <td className="py-3">#{index + 1}</td>
                        <td className="py-3">{player.name}</td>
                        <td className="py-3 text-right">{player.stats.totalScore}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-[#918a8a] py-4">No leaderboard data available</div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Join Duel Modal */}
      {isJoiningDuel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#2a2a2a] rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-[#e0e0e0] text-2xl font-bold mb-4">
              Join Duel
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                value={duelId}
                onChange={(e) => setDuelId(e.target.value.toUpperCase())}
                placeholder="Enter Duel ID"
                className="w-full bg-[#3a3a3a] text-[#e0e0e0] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffff] placeholder-[#918a8a]"
                maxLength={8}
              />
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJoinDuel}
                  disabled={!duelId.trim()}
                  className={`flex-1 py-2 rounded-lg font-semibold ${
                    duelId.trim()
                      ? "bg-[#00ffff] text-[#1a1a1a] hover:bg-[#00cccc]"
                      : "bg-[#3a3a3a] text-[#918a8a] cursor-not-allowed"
                  }`}
                >
                  Join
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsJoiningDuel(false);
                    setDuelId("");
                  }}
                  className="flex-1 bg-[#3a3a3a] text-[#e0e0e0] py-2 rounded-lg font-semibold hover:bg-[#4a4a4a]"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
