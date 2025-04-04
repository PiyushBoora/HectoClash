import { useEffect, useState } from 'react';
import socket from '../Utils/socket';
import { Timer } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Player {
  id: string;
  playerId: string;
  score: number;
  sequenceIndex: number;
  ready: boolean;
}

interface Room {
  roomId: string;
  players: Player[];
  timer: number;
  gameStarted: boolean;
}

const Spectator = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    // socket.emit('spectatorJoin');

    socket.on('roomsUpdate', ({ rooms }) => {
        console.log(rooms);
      setRooms(rooms);
    });

    return () => {
      socket.off('roomsUpdate');
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-10 px-4">
      <h2 className="text-3xl font-bold text-[#e0e0e0] text-center mb-8">Active Duels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {rooms.length === 0 ? (
          <div className="col-span-full text-center mt-10">
            <p className="text-xl text-[#918a8a]">No active duels at the moment</p>
          </div>
        ) : (
          rooms.map((room) => (
            <Link key={room.roomId} to={`/spectate/${room.roomId}`} className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#3a3a3a]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#e0e0e0]">Room: {room.roomId}</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-[#1a1a1a] rounded-lg border border-[#3a3a3a]">
                  <Timer className="size-4 text-[#00ffff]" />
                  <span className="text-[#00ffff] font-bold">{formatTime(room.timer)}</span>
                </div>
              </div>
              <div className="mb-4 px-3 py-2 bg-[#1a1a1a] rounded-lg border border-[#3a3a3a]">
                <span className="text-[#e0e0e0]">
                  Status: <span className={room.gameStarted ? 'text-[#00ffff]' : 'text-[#918a8a]'}>
                    {room.gameStarted ? 'In Progress' : 'Waiting'}
                  </span>
                </span>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-[#e0e0e0]">Players:</h4>
                {room.players.map((player) => (
                  <div key={player.id} 
                    className="flex items-center justify-between px-3 py-2 bg-[#1a1a1a] rounded-lg border border-[#3a3a3a]">
                    <span className="text-[#e0e0e0]">{player.playerId}</span>
                    <div className="px-3 py-1 bg-[#2a2a2a] border border-[#00ffff] rounded-lg">
                      <span className="text-[#00ffff] font-bold">{player.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Spectator;
