import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetMe } from "../services/queries";
import { getChallengeByType } from "./challenge";
import { toast } from 'react-toastify';
interface DailyChallengeProps {
  type: 'daily' | 'weekly';
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ type }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { data: me, isLoading: meLoading } = useGetMe();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [type]);

  const updateTimeLeft = () => {
    const now = new Date();
    const target = new Date();

    if (type === 'daily') {
      target.setHours(23, 59, 59, 999);
    } else {
      target.setDate(target.getDate() + (7 - target.getDay()));
      target.setHours(23, 59, 59, 999);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
  };

  const handleStartChallenge = async () => {
    if (!me?._id) return;

    try {
      const response = await getChallengeByType(type, me._id);
      navigate(`/challenge-game/${type}`, {
        state: {
          sequence: response.sequence,
          challengeType: type,
          challengeId: response._id
        }
      });
    }catch (err) {
      console.log(err);
    
        toast.success("You’ve already completed this challenge.");
      
      navigate("/dashboard");
    }
  };

  const container = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (meLoading) {
    return (
      <div className="bg-[#2a2a2a] rounded-xl p-6 h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ffff]"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a]/50 shadow-lg overflow-hidden"
    >
      <div className="p-6 border-b border-[#3a3a3a]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {type === 'daily' ? (
              <Calendar className="w-5 h-5 text-[#00ffff]" />
            ) : (
              <Trophy className="w-5 h-5 text-[#00ffff]" />
            )}
            <h2 className="text-xl font-semibold text-white">
              {type === 'daily' ? 'Daily' : 'Weekly'} Challenge
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#918a8a]" />
            <span className="text-sm text-[#918a8a]">{timeLeft}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-center">
          <button
            onClick={handleStartChallenge}
            className="bg-[#00ffff] text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold hover:bg-[#00cccc] transition-colors"
          >
            Start {type === 'daily' ? 'Daily' : 'Weekly'} Challenge
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DailyChallenge;
