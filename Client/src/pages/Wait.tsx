import { useEffect } from "react";
import {  useNavigate, useParams } from "react-router-dom";
import socket from "../Utils/socket";

const Wait = () => {
  const params=useParams();
  const navigate = useNavigate();
  const duelId=params.id;

  useEffect(() => {
    socket.on("startGame", ({ sequence }) => {
      console.log(sequence);
      navigate(`/game/${duelId}`, { state: { sequence } });
    });

    return () => {
      socket.off("startGame");
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-[#e0e0e0]">
      <h1 className="text-3xl font-bold">Waiting for Opponent...</h1>
      {duelId && (
        <div className="mt-4">
          <p className="text-xl">Your Duel ID:</p>
          <span className="text-[#00ffff] font-mono text-2xl">{duelId}</span>
        </div>
      )}
    </div>
  );
};

export default Wait;
