import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Clock, Target, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';

interface AnalysisProps {
  sequences: string[][];
  solutions: string[];
  timeSpent: number;
  score: number;
  totalPossible: number;
}

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const analysisData = location.state as AnalysisProps;

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-[#1a1a1a]">
        <Header/>
        <div className="container mx-auto px-4 py-12 text-center text-white">
          <h1 className="text-2xl">No analysis data available</h1>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-[#2a2a2a] px-4 py-2 rounded-lg hover:bg-[#3a3a3a] transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { sequences, solutions, timeSpent, score, totalPossible } = analysisData;
  const accuracy = ((score / totalPossible) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[#00ffff] hover:text-[#00cccc] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-white">Game Analysis</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#2a2a2a] rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-6 w-6 text-[#00ffff]" />
              <h2 className="text-xl font-semibold text-white">Score</h2>
            </div>
            <p className="text-3xl font-bold text-[#00ffff]">{score}/{totalPossible}</p>
            <p className="text-gray-400 mt-2">Accuracy: {accuracy}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2a2a2a] rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-[#00ffff]" />
              <h2 className="text-xl font-semibold text-white">Time Spent</h2>
            </div>
            <p className="text-3xl font-bold text-[#00ffff]">
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-gray-400 mt-2">Total seconds: {timeSpent}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-[#2a2a2a] rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-[#00ffff]" />
              <h2 className="text-xl font-semibold text-white">Sequences</h2>
            </div>
            <p className="text-3xl font-bold text-[#00ffff]">{sequences.length}</p>
            <p className="text-gray-400 mt-2">Total challenges attempted</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#2a2a2a] rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Sequence Analysis</h2>
          <div className="space-y-6">
            {sequences.map((sequence, index) => (
              <div key={index} className="border-b border-[#3a3a3a] pb-6 last:border-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Sequence {index + 1}</h3>
                  <span className="text-[#00ffff]">{sequence.join(' ')}</span>
                </div>
                <div className="bg-[#1a1a1a] rounded p-4">
                  <p className="text-gray-400">Solution:</p>
                  <p className="text-white font-mono mt-2">{solutions[index]}</p>
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