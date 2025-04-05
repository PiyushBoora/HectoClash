"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Swords, Users, Trophy, Timer, Target, TrendingUp, X, ChevronRight } from "lucide-react"
import { useGetMe, useGetLeaderboard } from "../services/queries"

const Dashboard = () => {
  const [duelId, setDuelId] = useState("")
  const [isJoiningDuel, setIsJoiningDuel] = useState(false)
  const [leaderboardType, setLeaderboardType] = useState("allTime") // "weekly" or "allTime"
  const { data: user, isLoading, isError } = useGetMe()
  const { data: allTimeLeaderboardData, isLoading: isAllTimeLeaderboardLoading } = useGetLeaderboard("allTime")
  const { data: weeklyLeaderboardData, isLoading: isWeeklyLeaderboardLoading } = useGetLeaderboard("weekly")
  const navigate = useNavigate()

  useEffect(() => {
    if (isError) navigate("/login")
  }, [isError])

  const stats = user
    ? [
        {
          icon: Trophy,
          label: "Total Score",
          value: user.stats.totalScore.toString(),
          color: "from-amber-500 to-yellow-300",
          bgColor: "bg-amber-950/30",
        },
        {
          icon: Timer,
          label: "Avg. Time",
          value: `${Math.round(user.stats.averageTime)}s`,
          color: "from-blue-500 to-cyan-300",
          bgColor: "bg-blue-950/30",
        },
        {
          icon: Target,
          label: "Accuracy",
          value: `${Math.round(user.stats.accuracy)}%`,
          color: "from-green-500 to-emerald-300",
          bgColor: "bg-green-950/30",
          percentage: user.stats.accuracy,
        },
        {
          icon: TrendingUp,
          label: "Win Rate",
          value: user.stats.gamesPlayed > 0 ? `${Math.round((user.stats.wins / user.stats.gamesPlayed) * 100)}%` : "0%",
          color: "from-purple-500 to-fuchsia-300",
          bgColor: "bg-purple-950/30",
          percentage: user.stats.gamesPlayed > 0 ? Math.round((user.stats.wins / user.stats.gamesPlayed) * 100) : 0,
        },
      ]
    : [
        {
          icon: Trophy,
          label: "Total Score",
          value: "0",
          color: "from-amber-500 to-yellow-300",
          bgColor: "bg-amber-950/30",
        },
        {
          icon: Timer,
          label: "Avg. Time",
          value: "0s",
          color: "from-blue-500 to-cyan-300",
          bgColor: "bg-blue-950/30",
        },
        {
          icon: Target,
          label: "Accuracy",
          value: "0%",
          color: "from-green-500 to-emerald-300",
          bgColor: "bg-green-950/30",
          percentage: 0,
        },
        {
          icon: TrendingUp,
          label: "Win Rate",
          value: "0%",
          color: "from-purple-500 to-fuchsia-300",
          bgColor: "bg-purple-950/30",
          percentage: 0,
        },
      ]

  const generateDuelId = () => Math.random().toString(36).substring(2, 10).toUpperCase()

  const leaderboardData = leaderboardType === "weekly" ? weeklyLeaderboardData : allTimeLeaderboardData
  const isLeaderboardLoading = leaderboardType === "weekly" ? isWeeklyLeaderboardLoading : isAllTimeLeaderboardLoading

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1d1d1d] pt-30 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Section */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={item}
              whileHover={{
                y: -5,
                boxShadow: "0 15px 30px rgba(0, 255, 255, 0.1)",
              }}
              className={`bg-[#2a2a2a] rounded-xl p-6 text-center shadow-lg border border-[#3a3a3a]/50 relative overflow-hidden ${stat.bgColor}`}
            >
              <div className="relative z-10">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-[#00ffff]" />
                </div>
                <h4 className="text-sm text-[#918a8a] mb-1">{stat.label}</h4>
                <p className="text-2xl font-bold">{stat.value}</p>

                {stat.percentage !== undefined && (
                  <div className="mt-2 h-1.5 bg-[#3a3a3a] rounded-full w-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br opacity-10 blur-xl"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content - 2 Columns */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Quick Actions - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="md:col-span-1"
          >
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a]/50 shadow-lg overflow-hidden h-full">
              <div className="p-6 border-b border-[#3a3a3a]">
                <h2 className="text-xl font-semibold flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-[#00ffff]" />
                  Quick Actions
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/game/${generateDuelId()}`)}
                  className="w-full bg-gradient-to-r from-[#00ffff] to-[#0088ff] text-[#1a1a1a] px-6 py-4 rounded-lg font-semibold transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Swords className="inline-block mr-2" />
                      Create New Duel
                    </div>
                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsJoiningDuel(true)}
                  className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-6 py-4 rounded-lg font-semibold transition-all border border-[#4a4a4a] group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="inline-block mr-2" />
                      Join Existing Duel
                    </div>
                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/practice")}
                  className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white px-6 py-4 rounded-lg font-semibold transition-all border border-[#4a4a4a] group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="inline-block mr-2" />
                      Practice Mode
                    </div>
                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Leaderboard - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="md:col-span-2"
          >
            <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a]/50 shadow-lg overflow-hidden h-full">
              <div className="p-6 border-b border-[#3a3a3a] flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-amber-400" />
                  Global Leaderboard
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLeaderboardType("weekly")}
                    className={`text-sm px-3 py-1 rounded-md transition-colors ${
                      leaderboardType === "weekly"
                        ? "bg-[#00ffff] text-[#1a1a1a]"
                        : "bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setLeaderboardType("allTime")}
                    className={`text-sm px-3 py-1 rounded-md transition-colors ${
                      leaderboardType === "allTime"
                        ? "bg-[#00ffff] text-[#1a1a1a]"
                        : "bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white"
                    }`}
                  >
                    All Time
                  </button>
                </div>
              </div>

              <div className="p-6">
                {isLeaderboardLoading ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-10 h-10 border-4 border-[#3a3a3a] border-t-[#00ffff] rounded-full animate-spin mb-4"></div>
                    <p className="text-[#918a8a]">Loading leaderboard...</p>
                  </div>
                ) : leaderboardData?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[#918a8a] border-b border-[#3a3a3a]">
                          <th className="py-3 px-4">Rank</th>
                          <th className="py-3 px-4">Player</th>
                          <th className="py-3 px-4">Win Rate</th>
                          <th className="py-3 px-4 text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboardData.map((player, i) => (
                          <motion.tr
                            key={player._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.05 }}
                            className="border-b border-[#3a3a3a] hover:bg-[#3a3a3a]/30 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                  ${
                                    i === 0
                                      ? "bg-gradient-to-r from-amber-500 to-yellow-300 text-[#1a1a1a]"
                                      : i === 1
                                        ? "bg-gradient-to-r from-slate-300 to-slate-100 text-[#1a1a1a]"
                                        : i === 2
                                          ? "bg-gradient-to-r from-amber-700 to-amber-500 text-[#1a1a1a]"
                                          : "bg-[#3a3a3a] text-white"
                                  }`}
                                >
                                  {i + 1}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                                  ${
                                    i === 0
                                      ? "bg-gradient-to-br from-amber-500 to-yellow-300 text-[#1a1a1a]"
                                      : i === 1
                                        ? "bg-gradient-to-br from-slate-300 to-slate-100 text-[#1a1a1a]"
                                        : i === 2
                                          ? "bg-gradient-to-br from-amber-700 to-amber-500 text-[#1a1a1a]"
                                          : "bg-gradient-to-br from-[#3a3a3a] to-[#4a4a4a] text-white"
                                  }`}
                                >
                                  {player.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium">{player.name}</p>
                                  <p className="text-xs text-[#918a8a]">Level {player.level || 1}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="w-full bg-[#3a3a3a] rounded-full h-2.5">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${player.stats.gamesPlayed > 0 ? Math.round((player.stats.wins / player.stats.gamesPlayed) * 100) : 0}%`,
                                  }}
                                  transition={{ duration: 1, delay: 0.7 + i * 0.05 }}
                                  className={`h-full rounded-full ${
                                    i === 0
                                      ? "bg-gradient-to-r from-amber-500 to-yellow-300"
                                      : i === 1
                                        ? "bg-gradient-to-r from-slate-300 to-slate-100"
                                        : i === 2
                                          ? "bg-gradient-to-r from-amber-700 to-amber-500"
                                          : "bg-gradient-to-r from-[#00ffff] to-[#0088ff]"
                                  }`}
                                />
                              </div>
                              <p className="text-sm mt-1">
                                {player.stats.gamesPlayed > 0
                                  ? Math.round((player.stats.wins / player.stats.gamesPlayed) * 100)
                                  : 0}
                                %
                                <span className="text-xs text-[#918a8a] ml-1">
                                  ({player.stats.wins}/{player.stats.gamesPlayed})
                                </span>
                              </p>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="text-xl font-bold bg-gradient-to-r from-[#00ffff] to-[#0088ff] bg-clip-text text-transparent">
                                {player.stats.totalScore.toLocaleString()}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Trophy className="w-12 h-12 text-[#3a3a3a] mb-4" />
                    <p className="text-[#918a8a]">No leaderboard data available</p>
                    <p className="text-xs text-[#918a8a] mt-1">Be the first to compete!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Join Duel Modal */}
      <AnimatePresence>
        {isJoiningDuel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-[#2a2a2a] to-[#222] p-6 rounded-xl w-full max-w-sm mx-4 border border-[#3a3a3a] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#00ffff]" />
                  Join Duel
                </h2>
                <button
                  onClick={() => {
                    setIsJoiningDuel(false)
                    setDuelId("")
                  }}
                  className="text-[#918a8a] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-[#918a8a] mb-2">Duel ID</label>
                <input
                  type="text"
                  value={duelId}
                  onChange={(e) => setDuelId(e.target.value.toUpperCase())}
                  maxLength={8}
                  placeholder="Enter Duel ID"
                  className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg border border-[#3a3a3a] focus:ring-2 focus:ring-[#00ffff] focus:border-transparent outline-none transition-all text-center text-lg tracking-wider"
                />
                <p className="text-xs text-[#918a8a] mt-2 text-center">
                  Enter the 8-character code shared by your opponent
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (duelId.trim()) navigate(`/game/${duelId}`)
                  }}
                  disabled={!duelId.trim()}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    duelId.trim()
                      ? "bg-gradient-to-r from-[#00ffff] to-[#0088ff] text-[#1a1a1a] hover:shadow-lg hover:shadow-cyan-500/20"
                      : "bg-[#3a3a3a] text-[#777] cursor-not-allowed"
                  }`}
                >
                  Join Duel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsJoiningDuel(false)
                    setDuelId("")
                  }}
                  className="flex-1 py-3 bg-[#3a3a3a] text-white rounded-lg hover:bg-[#4a4a4a] transition-all font-semibold"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dashboard

