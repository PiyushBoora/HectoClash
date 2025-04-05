import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Timer, Eye } from "lucide-react";
import socket from "../Utils/socket";
import { useGetUserById } from "../services/queries";
import SpectatingSequence from "../components/SpectatingSequence";

const SpectatorMode = () => {
  const navigate=useNavigate();
  const { id: roomId } = useParams();
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [players, setPlayers] = useState({ player1: null, player2: null });

  // Fetch player data using the custom hook
  console.log(players.player1?.playerId);
  const { data: player1, isLoading: isPlayer1Loading } = useGetUserById(players.player1?.playerId);
  const { data: player2, isLoading: isPlayer2Loading } = useGetUserById(players.player2?.playerId);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };


  useEffect(() => {
    socket.emit("spectatorJoin");

    socket.on("roomsUpdate", ({rooms}) => {
      console.log("Room update received:", rooms);
      const room = rooms.find((room) => room.roomId === roomId);

      if (room) {
        console.log('room',room);
        setIsGameActive(!!room.gameStarted);
        if (room.timer !== undefined){
          if(room.timer<=1){
            navigate('/spectate');
          }
          setTime(room.timer);}

        if (room.players?.length > 0) {
          setPlayers({
            player1: room.players[0] || null,
            player2: room.players[1] || null,
          });
        }
      }
    });

    return () => {
      socket.off("roomsUpdate");
    };
  }, [roomId]);

  if (isPlayer1Loading || isPlayer2Loading||!player1||!player2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-[#e0e0e0]">
        <h1 className="text-3xl font-bold">Preparing the game to start...</h1>
      </div>
    );
  }

  if (!isGameActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a1a1a] text-[#e0e0e0]">
        <h1 className="text-3xl font-bold">Waiting for Game to Start...</h1>
        {roomId && (
          <div className="mt-4">
            <p className="text-xl">Spectating Duel:</p>
            <span className="text-[#00ffff] font-mono text-2xl">{roomId}</span>
          </div>
        )}
        <div className="mt-6 flex items-center gap-2">
          <Eye className="text-[#00ffff]" />
          <span className="text-[#e0e0e0]">Spectator Mode</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-black pt-30 max-md:px-5 flex flex-col ">
      {/* Spectator Badge */}
      <div className="absolute top-4 right-4 bg-[#2a2a2a] px-3 py-1 rounded-full flex items-center gap-2">
        <Eye className="size-4 text-[#00ffff]" />
        <span className="text-[#e0e0e0] text-sm">Spectator</span>
      </div>

      <div className="flex flex-col h-full flex-1">
      <div className="flex items-center justify-center">
            <div className="flex gap-1 items-center p-2 px-4 border-[1px] border-main-white/30 rounded-[10px]">
              <Timer className="size-[1rem] text-[#00ffff]" />
              <span className="text-[#00ffff] text-lg font-bold">{formatTime(time)}</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">

          
        <div className="w-full flex items-center justify-between">
          {/* Player 1 */}
          <div className="flex flex-col justify-center flex-1 gap-4">

          
          {players.player1 && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={player1?.profileImage}
                  className="size-[2.5rem] rounded-xl"
                  alt="Player 1"
                />
                <span className="text-main-white text-[1.25rem] font-semibold">
                  {player1?.name || "Player 1"}
                </span>
              </div>
              <div className="py-1 px-5 bg-[#2a2a2a] border-[1px] border-main-green rounded-[10px]">
                <span className="text-main-white">{players.player1.score}</span>
              </div>
            </div>
          )}

<div className="flex-1 flex-col flex items-center justify-center mt-6">
          {players.player1?.currentExpression && (
            <div className="w-full">
              <SpectatingSequence sequence={players.player1.currentExpression} />
            </div>
          )}
        </div>
        </div>
         {/* Player 2 */}
        <div className="flex flex-col justify-center flex-1 gap-4">

          
{players.player2 && (
  <div className="flex flex-col items-center gap-4">
    <div className="flex items-center gap-2">
      <img
        src={player2?.profileImage}
        className="size-[2.5rem] rounded-xl"
        alt="Player 1"
      />
      <span className="text-main-white text-[1.25rem] font-semibold">
        {player2?.name || "Player 2"}
      </span>
    </div>
    <div className="py-1 px-5 bg-[#2a2a2a] border-[1px] border-main-green rounded-[10px]">
      <span className="text-main-white">{players.player2.score}</span>
    </div>
  </div>
)}

<div className="flex-1 flex-col flex items-center justify-center mt-6">
{players.player2?.currentExpression && (
  <div className="w-full">
    <SpectatingSequence sequence={players.player2.currentExpression} />
  </div>
)}
</div>
</div>
         
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default SpectatorMode;
