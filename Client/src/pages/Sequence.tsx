  // import React, { useState } from 'react';

  // type ItemType = 'number' | 'operator';

  // interface AvailableItem {
  //   value: string;
  //   type: ItemType;
  // }

  // function HectocGame() {
  //   // Target sequence the user needs to create
  //   const [targetSequence] = useState('123456');

  //   // Sequence the user is building
  //   const [currentSequence, setCurrentSequence] = useState<string[]>(
  //     Array(11).fill('')
  //   );

  //   // Predefined set of numbers and operators to use
  //   const [availableItems, setAvailableItems] = useState<AvailableItem[]>([
  //     { value: '1', type: 'number' },
  //     { value: '2', type: 'number' },
  //     { value: '3', type: 'number' },
  //     { value: '4', type: 'number' },
  //     { value: '5', type: 'number' },
  //     { value: '6', type: 'number' },
  //     { value: '+', type: 'operator' },
  //     { value: '-', type: 'operator' },
  //     { value: '*', type: 'operator' },
  //     { value: '/', type: 'operator' },
  //   ]);

  //   // Track game state
  //   const [gameStatus, setGameStatus] = useState('Playing');

  //   // Handle clicking an available item to add to sequence
  //   const handleItemClick = (item: AvailableItem) => {
  //     // Find the rightmost empty position
  //     const rightmostBlankIndex = currentSequence.lastIndexOf('');
      
  //     if (rightmostBlankIndex !== -1) {
  //       const newSequence = [...currentSequence];
  //       newSequence[rightmostBlankIndex] = item.value;
  //       setCurrentSequence(newSequence);

  //       // Remove the item from available items
  //       const newAvailableItems = availableItems.filter(
  //         availableItem => availableItem.value !== item.value
  //       );
  //       setAvailableItems(newAvailableItems);

  //       // Check if all items have been used
  //       checkGameCompletion(newSequence, newAvailableItems);
  //     }
  //   };

  //   // Handle clicking an item in the sequence to remove it
  //   const handleSequenceItemClick = (index: number) => {
  //     const removedValue = currentSequence[index];
      
  //     if (removedValue) {
  //       // Create a new sequence by removing the clicked item
  //       const newSequence = currentSequence.filter((_, i) => i !== index);
  //       // Add an empty string to the end to maintain the original length
  //       newSequence.push('');

  //       // Return the removed item to available items
  //       const itemType = index % 2 === 0 ? 'number' : 'operator';
  //       const newAvailableItems = [
  //         ...availableItems, 
  //         { value: removedValue, type: itemType }
  //       ];

  //       setCurrentSequence(newSequence);
  //       setAvailableItems(newAvailableItems);

  //       // Reset game status if it was previously won or lost
  //       if (gameStatus !== 'Playing') {
  //         setGameStatus('Playing');
  //       }
  //     }
  //   };

  //   // Check if the game is completed
  //   const checkGameCompletion = (currentSeq: string[], currentAvailableItems: AvailableItem[]) => {
  //     // Check if all positions are filled and no items left
  //     if (currentSeq.every(item => item !== '') && currentAvailableItems.length === 0) {
  //       const sequence = currentSeq
  //         .filter((_, index) => index % 2 === 0)
  //         .join('');
        
  //       if (sequence === targetSequence) {
  //         setGameStatus('Won');
  //       } else {
  //         setGameStatus('Lost');
  //       }
  //     }
  //   };

  //   // Reset the game
  //   const resetGame = () => {
  //     setCurrentSequence(Array(11).fill(''));
  //     setAvailableItems([
  //       { value: '1', type: 'number' },
  //       { value: '2', type: 'number' },
  //       { value: '3', type: 'number' },
  //       { value: '4', type: 'number' },
  //       { value: '5', type: 'number' },
  //       { value: '6', type: 'number' },
  //       { value: '+', type: 'operator' },
  //       { value: '-', type: 'operator' },
  //       { value: '*', type: 'operator' },
  //       { value: '/', type: 'operator' },
  //     ]);
  //     setGameStatus('Playing');
  //   };

  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
  //       <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 w-full max-w-4xl">
  //         <h1 className="text-3xl font-bold text-white text-center mb-4">
  //           Hectoc Sequence Game
  //         </h1>
          
  //         {/* Target Sequence Display */}
  //         <div className="text-center text-white mb-6">
  //           <p className="text-xl">Target Sequence: {targetSequence}</p>
  //         </div>

  //         {/* Game Status */}
  //         {gameStatus !== 'Playing' && (
  //           <div className="text-center mb-6">
  //             <p className={`text-2xl font-bold ${gameStatus === 'Won' ? 'text-green-500' : 'text-red-500'}`}>
  //               {gameStatus === 'Won' ? 'Congratulations! You Won!' : 'Game Over! Try Again.'}
  //             </p>
  //             <button 
  //               onClick={resetGame}
  //               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
  //             >
  //               Reset Game
  //             </button>
  //           </div>
  //         )}

  //         {/* Sequence Input */}
  //         <div className="flex justify-center items-center space-x-2 mb-12">
  //           {currentSequence.map((item, index) => (
  //             <div 
  //               key={index} 
  //               className="relative cursor-pointer"
  //               onClick={() => handleSequenceItemClick(index)}
  //             >
  //               <div className="w-12 h-12 flex items-center justify-center">
  //                 <span className="text-white text-2xl">{item}</span>
  //               </div>
  //               <div className="w-12 h-1 bg-white/50"></div>
  //             </div>
  //           ))}
  //         </div>

  //         {/* Available Items */}
  //         <div className="flex flex-col items-center">
  //           {/* Available Numbers */}
  //           <div className="flex justify-center gap-4 mb-4">
  //             <span className="text-white text-lg mr-2">Numbers:</span>
  //             {availableItems.filter(item => item.type === 'number').map((item) => (
  //               <button
  //                 key={item.value}
  //                 onClick={() => handleItemClick(item)}
  //                 className="w-12 h-12 bg-blue-500/50 rounded-lg flex items-center justify-center text-white text-2xl font-bold hover:bg-blue-500/70 transition"
  //               >
  //                 {item.value}
  //               </button>
  //             ))}
  //           </div>

  //           {/* Available Operators */}
  //           <div className="flex justify-center gap-4">
  //             <span className="text-white text-lg mr-2">Operators:</span>
  //             {availableItems.filter(item => item.type === 'operator').map((item) => (
  //               <button
  //                 key={item.value}
  //                 onClick={() => handleItemClick(item)}
  //                 className="w-12 h-12 bg-green-500/50 rounded-lg flex items-center justify-center text-white text-2xl font-bold hover:bg-green-500/70 transition"
  //               >
  //                 {item.value}
  //               </button>
  //             ))}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // export default HectocGame;


  import { useState, useRef, useEffect } from "react";
  import { motion } from "framer-motion";
  import { isequalto100 } from "../Utils/SequenceChecker";
  import { useGetMe } from "../services/queries";
  import socket from "../Utils/socket";
import { useParams } from "react-router-dom";

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

  const generateBoxes=(sequence:string[])=>{
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
  }

  const Sequence = ({ sequence, handleScoreUpdate }: SequenceProps) => {
    const { id: roomId } = useParams();
    const fixedOperators: OperatorType[] = ["+", "-", "*", "/"];
    const { data: user } = useGetMe();
    // console.log(sequence);
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

    // Generate a mathematical expression string from the boxes
    const generateMathExpression = () => {
      let expression = "";
      boxes.forEach((box) => {
        if (box.hasLeftParenthesis) expression += "(";
        expression += box.value;
        if (box.hasRightParenthesis) expression += ")";
      });

      // console.log("Generated Expression:", expression);

      // Check if the expression is valid and equal to 100
      const isValid = isequalto100(expression);
      if (user && user._id) {
        socket.emit("mathExpression", {
          expression,
          playerId: user._id,
          roomId
        });
      }
      if(isValid)handleScoreUpdate();
    };

    // Call `generateMathExpression` whenever `boxes` changes
    useEffect(() => {
      generateMathExpression();
    }, [boxes]);

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
                    onClick={() =>
                      box.type === "operator" && handleOperatorDelete(index)
                    }
                  >
                    {box.type === "number" && (
                      <div className="size-11 relative group rounded-lg">
                        {/* Left Parenthesis */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleParenthesis(index, "left");
                          }}
                          className={`absolute left-0 top-[45%] -translate-y-1/2 -translate-x-1 px-1 text-3xl font-bold cursor-pointer ${
                            box.hasLeftParenthesis
                              ? "text-[#00ffff]"
                              : "text-transparent group-hover:text-[#6a6a6a]"
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
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleParenthesis(index, "right");
                          }}
                          className={`absolute right-0 top-[45%] -translate-y-1/2 translate-x-1 px-1 text-3xl font-bold cursor-pointer ${
                            box.hasRightParenthesis
                              ? "text-[#00ffff]"
                              : "text-transparent group-hover:text-[#6a6a6a]"
                          }`}
                        >
                          )
                        </button>
                      </div>
                    )}

                    {box.type === "operator" && (
                      <div className="w-4 h-7 rounded-lg border-[#3a3a3a] flex items-center justify-center text-2xl font-bold cursor-pointer text-[#918a8a]">
                        {box.value}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex justify-center gap-4 mt-8">
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
            </div>
          </div>
        </div>
    );
  };

  export default Sequence;
