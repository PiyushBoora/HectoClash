import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, ArrowRight, BarChart2 } from "lucide-react";
import Sequence from "./Sequence";
import { getRandomQuestions } from "../data/questions";
import axios from "../Utils/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const timerOptions = [2, 3, 4, 5, 6, 10];

interface PracticeStats {
  timeSpent: number[];
  correctAnswers: number;
  totalQuestions: number;
  solutions: string[];
}

const Practice = () => {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [stats, setStats] = useState<PracticeStats>({
    timeSpent: [],
    correctAnswers: 0,
    totalQuestions: 0,
    solutions: [],
  });
  const [solutions, setSolutions] = useState([]);
  const [questions, setQuestions] = useState<string[][]>([]);

  const handleStartGame = async (minutes: number) => {
    const selectedQuestions = getRandomQuestions(5);
    setQuestions(selectedQuestions);
    setSelectedTime(minutes);
    setTimeRemaining(minutes * 60);
    setIsGameStarted(true);
    setCurrentSequence(selectedQuestions[0]);
    setQuestionIndex(0);
    setScore(0);
    setStats({
      timeSpent: [],
      correctAnswers: 0,
      totalQuestions: 0,
      solutions: [],
    });

    // Get solutions for the first sequence
    try {
      const response = await axios.post('/api/game/solutions', { sequence: selectedQuestions[0] });
      if (response.data.success) {
        setSolutions(response.data.solutions);
      }
    } catch (error) {
      console.error('Failed to fetch solutions:', error);
    }
  };

  const handleScoreUpdate = async () => {
    setScore((prev) => prev + 1);
    setStats((prev) => ({
      ...prev,
      correctAnswers: prev.correctAnswers + 1,
      timeSpent: [...prev.timeSpent, selectedTime! * 60 - timeRemaining],
    }));
    
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      const nextSequence = questions[questionIndex + 1];
      setCurrentSequence(nextSequence);

      // Get solutions for the next sequence
      try {
        const response = await axios.post('/api/game/solutions', { sequence: nextSequence });
        if (response.data.success) {
          setSolutions(response.data.solutions);
        }
      } catch (error) {
        console.error('Failed to fetch solutions:', error);
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsGameStarted(false);
            setShowAnalysis(true);
            setStats((prev) => ({
              ...prev,
              totalQuestions: questionIndex + 1,
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameStarted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20 px-4">
      <AnimatePresence mode="wait">
        {!isGameStarted && !showAnalysis && (
          <motion.div
            key="timer-selection"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              variants={item}
              className="text-3xl font-bold text-white text-center mb-8"
            >
              Practice Mode
            </motion.h1>
            <motion.p
              variants={item}
              className="text-[#918a8a] text-center mb-12"
            >
              Select your practice duration and challenge yourself to solve as many
              sequences as possible!
            </motion.p>
            <motion.div
              variants={item}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {timerOptions.map((minutes) => (
                <motion.button
                  key={minutes}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStartGame(minutes)}
                  className="bg-[#2a2a2a] rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-[#3a3a3a] transition-colors"
                >
                  <Timer className="w-8 h-8 text-[#00ffff]" />
                  <span className="text-2xl font-bold text-white">
                    {minutes} min
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {isGameStarted && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-[#2a2a2a] rounded-lg p-3">
                  <Timer className="w-6 h-6 text-[#00ffff]" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#918a8a]">Score:</span>
                <span className="text-2xl font-bold text-white">{score}</span>
              </div>
            </div>
            {currentSequence.length > 0 && (
              <Sequence
                sequence={currentSequence}
                solutions={solutions}
                handleScoreUpdate={handleScoreUpdate}
              />
            )}
          </motion.div>
        )}

        {showAnalysis && (
          <motion.div
            key="analysis"
            variants={container}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              variants={item}
              className="text-3xl font-bold text-white text-center mb-8"
            >
              Practice Analysis
            </motion.h2>

            <motion.div
              variants={item}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
            >
              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Performance Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#918a8a]">Correct Answers:</span>
                    <span className="text-white font-bold">
                      {stats.correctAnswers}/{stats.totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#918a8a]">Accuracy:</span>
                    <span className="text-white font-bold">
                      {Math.round(
                        (stats.correctAnswers / stats.totalQuestions) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#918a8a]">Average Time:</span>
                    <span className="text-white font-bold">
                      {stats.timeSpent.length > 0
                        ? `${Math.round(
                            stats.timeSpent.reduce((a, b) => a + b, 0) /
                              stats.timeSpent.length
                          )}s`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#2a2a2a] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Time Distribution
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.timeSpent.map((time, index) => ({
                      question: `Q${index + 1}`,
                      time,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                      <XAxis
                        dataKey="question"
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
                        dataKey="time"
                        fill="#00ffff"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="space-y-6">
              <h3 className="text-xl font-bold text-white">Solutions</h3>
              {questions.map((sequence, index) => (
                <div
                  key={index}
                  className="bg-[#2a2a2a] rounded-xl p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#918a8a]">Question {index + 1}</span>
                    <div className="flex gap-2">
                      {sequence.map((num, i) => (
                        <span
                          key={i}
                          className="w-8 h-8 flex items-center justify-center bg-[#3a3a3a] rounded-lg text-white font-bold"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {solutions[index]?.map((solution, solutionIndex) => (
                      <div
                        key={solutionIndex}
                        className="bg-[#3a3a3a] rounded-lg p-3 flex justify-between items-center"
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
              ))}
            </motion.div>

            <motion.div
              variants={item}
              className="flex justify-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowAnalysis(false);
                  setSelectedTime(null);
                }}
                className="bg-[#00ffff] text-[#1a1a1a] px-8 py-3 rounded-lg font-semibold hover:bg-[#00cccc] transition-colors"
              >
                Practice Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Practice;