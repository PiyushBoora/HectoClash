import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Send, Trash2 } from "lucide-react";
import { isequalto100 } from "../Utils/SequenceChecker";

type OperatorType = "+" | "-" | "*" | "/" | "";
type BoxType = "number" | "operator";

interface Box {
  id: number;
  value: string;
  type: BoxType;
  isFixed?: boolean;
  hasLeftParenthesis?: boolean;
  hasRightParenthesis?: boolean;
}

interface SequenceProps {
  sequence: string[];
  handleScoreUpdate: () => void;
}

const generateBoxes = (sequence: string[]) => {
  const newBoxes: Box[] = Array(sequence.length * 2 - 1)
    .fill(null)
    .map((_, i) => {
      const isNumberBox = i % 2 === 0;
      return {
        id: i,
        value: isNumberBox ? sequence[Math.floor(i / 2)] || "" : "",
        type: isNumberBox ? "number" : "operator",
        isFixed: isNumberBox,
        hasLeftParenthesis: false,
        hasRightParenthesis: false,
      };
    });
  return newBoxes;
};

const Sequence = ({ sequence, handleScoreUpdate }: SequenceProps) => {
  const fixedOperators: OperatorType[] = ["+", "-", "*", "/"];
  const [boxes, setBoxes] = useState<Box[]>(() => generateBoxes(sequence));
  const [draggedOperator, setDraggedOperator] = useState<OperatorType | null>(null);
  const [hoveredBoxIndex, setHoveredBoxIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>("");
  const operatorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const boxesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const newBoxes = generateBoxes(sequence);
    setBoxes(newBoxes);
    setShowFeedback(false);
    setIsCorrect(false);
    setExpression("");
  }, [sequence]);

  const handleOperatorDrop = (index: number) => {
    if (boxes[index].type === "operator" && draggedOperator) {
      const newBoxes = [...boxes];
      newBoxes[index] = {
        ...newBoxes[index],
        value: draggedOperator,
      };
      setBoxes(newBoxes);
      setHoveredBoxIndex(index);
      setShowFeedback(false);
    }
  };

  const handleOperatorDelete = (index: number) => {
    if (boxes[index].type === "operator") {
      const newBoxes = [...boxes];
      newBoxes[index] = {
        ...newBoxes[index],
        value: "",
      };
      setBoxes(newBoxes);
      setShowFeedback(false);
    }
  };

  const toggleParenthesis = (index: number, side: "left" | "right") => {
    if (boxes[index].type === "number") {
      const newBoxes = [...boxes];
      if (side === "left") {
        newBoxes[index] = {
          ...newBoxes[index],
          hasLeftParenthesis: !newBoxes[index].hasLeftParenthesis,
        };
      } else {
        newBoxes[index] = {
          ...newBoxes[index],
          hasRightParenthesis: !newBoxes[index].hasRightParenthesis,
        };
      }
      setBoxes(newBoxes);
      setShowFeedback(false);
    }
  };

  const handleSubmit = () => {
    let expr = "";
    boxes.forEach((box) => {
      if (box.hasLeftParenthesis) expr += "(";
      expr += box.value;
      if (box.hasRightParenthesis) expr += ")";
    });
    setExpression(expr);

    const isValid = isequalto100(expr);
    setIsCorrect(isValid);
    setShowFeedback(true);

    if (isValid) {
      handleScoreUpdate();
    }
  };

  const isComplete = boxes.every((box) => 
    box.type === "number" || (box.type === "operator" && box.value !== "")
  );

  const handleReset = () => {
    setBoxes(generateBoxes(sequence));
    setShowFeedback(false);
    setIsCorrect(false);
    setExpression("");
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-8">
      {/* Sequence Display */}
      <div className="bg-[#2a2a2a] rounded-xl p-8 w-full max-w-3xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          {boxes.map((box, index) => (
            <motion.div
              key={box.id}
              ref={(el) => (boxesRef.current[index] = el)}
              className={`relative ${
                box.type === "number" ? "w-16 h-16" : "w-10 h-16"
              }`}
              onHoverStart={() => {
                if (draggedOperator && box.type === "operator") {
                  setHoveredBoxIndex(index);
                }
              }}
              onHoverEnd={() => {
                if (draggedOperator) {
                  setHoveredBoxIndex(null);
                }
              }}
              onClick={() => box.type === "operator" && handleOperatorDelete(index)}
            >
              {box.type === "number" ? (
                <div className="relative group">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleParenthesis(index, "left");
                    }}
                    className={`absolute -left-3 top-1/2 -translate-y-1/2 text-3xl font-bold transition-colors ${
                      box.hasLeftParenthesis
                        ? "text-[#00ffff]"
                        : "text-transparent group-hover:text-[#6a6a6a]"
                    }`}
                  >
                    (
                  </button>
                  <div className="w-full h-full flex items-center justify-center bg-[#3a3a3a] rounded-xl text-2xl font-bold text-white">
                    {box.value}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleParenthesis(index, "right");
                    }}
                    className={`absolute -right-3 top-1/2 -translate-y-1/2 text-3xl font-bold transition-colors ${
                      box.hasRightParenthesis
                        ? "text-[#00ffff]"
                        : "text-transparent group-hover:text-[#6a6a6a]"
                    }`}
                  >
                    )
                  </button>
                </div>
              ) : (
                <motion.div
                  className={`w-full h-full flex items-center justify-center rounded-lg border-2 transition-colors ${
                    box.value
                      ? "border-[#00ffff] bg-[#00ffff]/10"
                      : "border-dashed border-[#4a4a4a] hover:border-[#00ffff]/50"
                  }`}
                  animate={
                    hoveredBoxIndex === index
                      ? { scale: 1.1, borderColor: "#00ffff" }
                      : { scale: 1 }
                  }
                >
                  <span className="text-2xl font-bold text-white">
                    {box.value}
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Operators */}
        <div className="flex justify-center gap-4">
          {fixedOperators.map((operator, index) => (
            <motion.div
              key={`${operator}-${index}`}
              ref={(el) => (operatorRefs.current[index] = el)}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={1}
              dragMomentum={false}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-[#3a3a3a] rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
              onDragStart={() => setDraggedOperator(operator)}
              onDragEnd={(event, _) => {
                boxesRef.current.forEach((boxElement, index) => {
                  if (boxElement) {
                    const rect = boxElement.getBoundingClientRect();
                    if (
                      event.clientX >= rect.left &&
                      event.clientX <= rect.right &&
                      event.clientY >= rect.top &&
                      event.clientY <= rect.bottom &&
                      boxes[index].type === "operator"
                    ) {
                      handleOperatorDrop(index);
                    }
                  }
                });
                setDraggedOperator(null);
                setHoveredBoxIndex(null);
              }}
            >
              <span className="text-2xl font-bold text-[#00ffff]">
                {operator}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="px-6 py-3 rounded-lg bg-[#3a3a3a] text-white font-semibold flex items-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          Reset
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
            isComplete
              ? "bg-[#00ffff] text-[#1a1a1a]"
              : "bg-[#3a3a3a] text-[#6a6a6a] cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
          Submit
        </motion.button>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg ${
              isCorrect ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            {isCorrect ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
            <span
              className={`font-medium ${
                isCorrect ? "text-green-500" : "text-red-500"
              }`}
            >
              {isCorrect
                ? "Correct! The expression equals 100."
                : "Try again. The expression doesn't equal 100."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sequence;