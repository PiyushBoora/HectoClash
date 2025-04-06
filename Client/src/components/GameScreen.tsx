import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sequence from "../pages/Sequence";
import axios from "../Utils/axios";
import { useGetMe } from "../services/queries";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface GameScreenProps {
  mode: "daily" | "weekly";
  sequence: string[][]; // Only 1 question expected
  challengeId: string;
}

const GameScreen = ({ mode, sequence, challengeId }: GameScreenProps) => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const { data: me } = useGetMe();
  const navigate = useNavigate();

  useEffect(() => {
    if (sequence.length > 0) {
      setCurrentSequence(sequence[0]);
      setIsGameStarted(true);

      axios
        .post("/api/game/solutions", { sequence: sequence[0] })
        .then((res) => setSolutions(res.data.solutions || []))
        .catch(() => setSolutions([]));
    }
  }, [sequence]);

  const handleScoreUpdate = async () => {
    try {
      await axios.post(`/api/challenge-game/${mode}/complete`, {
        userId: me?._id,
      });
      toast.success("Challenge Completed!");
    } catch (err) {
      toast.error("Failed to complete challenge.");
    } finally {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-20 px-4">
      <AnimatePresence mode="wait">
        {isGameStarted && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white capitalize">{mode} Challenge</h2>
              <div className="flex items-center gap-4">
                <span className="text-[#918a8a]">Score:</span>
                <span className="text-2xl font-bold text-white">0</span>
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
      </AnimatePresence>
    </div>
  );
};

export default GameScreen;
