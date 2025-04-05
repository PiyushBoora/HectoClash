  // @ts-nocheck
  import { useState, useRef, useEffect } from "react";
  import { motion } from "framer-motion";

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
  }

  const generateBoxes = (expression: string): Box[] => {
    const boxes: Box[] = [];
    let id = 0;
  
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
  
      if (/\d/.test(char)) {
        boxes.push({
          id: id++,
          value: char,
          type: "number",
          isFixed: true,
          hasLeftParenthesis: i > 0 && expression[i - 1] === "(",
          hasRightParenthesis: i < expression.length - 1 && expression[i + 1] === ")",
        });
      } 
      else if (["+", "-", "*", "/", "^"].includes(char)) {
        boxes.push({
          id: id++,
          value: char,
          type: "operator",
          isFixed: false,
          hasLeftParenthesis: false,
          hasRightParenthesis: false,
        });
      } 
      else if (char === "m") {
        // Treat 'm' as the special '*10+' operator
        boxes.push({
          id: id++,
          value: "*10+",
          type: "operator",
          isFixed: false,
          hasLeftParenthesis: false,
          hasRightParenthesis: false,
        });
      }
  
      // Ignore actual parentheses
    }
  
    return boxes;
  };
  
  const SpectatingSequence = ({ sequence }: SequenceProps) => {
    const fixedOperators: OperatorType[] = ["+", "-", "*", "/"];
    const [boxes, setBoxes] = useState<Box[]>(() => {
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
    });
    useEffect(()=>{
      const newBoxes=generateBoxes(sequence);
      setBoxes(newBoxes);

    },[sequence])
    const [operators, setOperators] = useState<OperatorType[]>(fixedOperators);
    const [draggedOperator, setDraggedOperator] = useState<OperatorType | null>(
      null
    );
    const [hoveredBoxIndex, setHoveredBoxIndex] = useState<number | null>(null);
    const operatorRefs = useRef<(HTMLDivElement | null)[]>([]);
    const boxesRef = useRef<(HTMLDivElement | null)[]>([]);

    const handleOperatorDrop = (index: number) => {
      if (boxes[index].type === "operator" && draggedOperator) {
        const newBoxes = [...boxes];
        newBoxes[index] = {
          ...newBoxes[index],
          value: draggedOperator,
        };
        setBoxes(newBoxes);
        setHoveredBoxIndex(index);
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
      }
    };


    return (
        <div className=" flex flex-col items-center justify-center p-4">
          <div className="rounded-xl p-8 flex flex-col ">
            <div className="flex items-center gap- mb-12">
              {boxes.map((box, index) => {
                return (
                  <motion.div
                    key={box.id}
                    ref={(el) => {
                      boxesRef.current[index] = el;
                    }}
                    className={`relative border-blue-900 w-full rounded-lg flex items-center justify-center`}
                    
                    // onClick={() =>
                    //   box.type === "operator" && handleOperatorDelete(index)
                    // }
                  >
                    {box.type === "number" && (
                      <div className="size-11 relative group rounded-lg">
                        {/* Left Parenthesis */}
                        <button
                        //   onClick={(e) => {
                        //     e.stopPropagation();
                        //     toggleParenthesis(index, "left");
                        //   }}
                          className={`absolute left-0 top-[45%] -translate-y-1/2 -translate-x-1 px-1 text-3xl font-bold ${
                            box.hasLeftParenthesis
                              ? "text-[#00ffff]"
                              : "text-transparent"
                          }`}
                        >
                          (
                        </button>

                        {/* Number Value */}
                        <div
                          className={`w-full h-full flex flex-col items-center justify-center bg-transparent text-center text-3xl font-bold focus:outline-none text-[#e0e0e0]`}
                        >
                          {box.value}
                        </div>

                        {/* Right Parenthesis */}
                        <button
                        //   onClick={(e) => {
                        //     e.stopPropagation();
                        //     toggleParenthesis(index, "right");
                        //   }}
                          className={`absolute right-0 top-[45%] -translate-y-1/2 translate-x-1 px-1 text-3xl font-bold ${
                            box.hasRightParenthesis
                              ? "text-[#00ffff]"
                              : "text-transparent"
                          }`}
                        >
                          )
                        </button>
                      </div>
                    )}

                    {box.type === "operator" && (
                      <div className={`w-4 h-7 rounded-lg border-[#3a3a3a] flex items-center justify-center font-bold cursor-pointer text-[#918a8a] ${box.value==='*10+'?'text-l':'text-2xl'}`}>
                        {box.value}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* <div className="flex justify-center gap-4 mt-8">
              {operators.map((operator, index) => (
                <motion.div
                  key={`${operator}-${index}`}
                  ref={(el) => {
                    operatorRefs.current[index] = el;
                  }}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  dragElastic={1}
                  dragMomentum={false}
                  animate={
                    hoveredBoxIndex !== null && draggedOperator === operator
                      ? {
                          scale: 0,
                          opacity: 0,
                          transition: { duration: 0.2 },
                        }
                      : {
                          scale: 1,
                          opacity: 1,
                          transition: { duration: 0.2 },
                        }
                  }
                  className="w-12 h-12 bg-[#2a2a2a] rounded-lg flex items-center justify-center hover:bg-[#3a3a3a] transition-colors shadow-lg border border-[#3a3a3a]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onDragStart={() => {
                    setDraggedOperator(operator);
                  }}
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
                  <span className="text-2xl font-bold text-[#e0e0e0]">
                    {operator}
                  </span>
                </motion.div>
              ))}
            </div> */}
          </div>
        </div>
    );
  };

  export default SpectatingSequence;
