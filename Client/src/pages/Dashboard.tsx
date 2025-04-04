import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swords, Users } from "lucide-react";
import socket from "../Utils/socket";
import { useGetMe } from "../services/queries";

const Dashboard = () => {
  const [duelId, setDuelId] = useState<string>("");
  const [showCopied, setShowCopied] = useState(false);
  const [isJoiningDuel, setIsJoiningDuel] = useState(false);
  const {data:user,isLoading,isError}=useGetMe();
  const navigate = useNavigate();
  useEffect(()=>{
    if(isError){
      navigate('/login')
    }
  },[isError  ]);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  const generateDuelId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  const handleCreateDuel = () => {
    const newDuelId = generateDuelId();
    setDuelId(newDuelId);
  
    // Emit socket event to join room
    // socket.emit("joinRoom", { roomId: newDuelId, playerId:user._id });
  
    navigate(`/game/${newDuelId}`);
  };
  
  const handleJoinDuel = () => {
    if (duelId.trim()) {
      navigate(`/game/${duelId}`); 
      // socket.emit("joinRoom", { roomId: duelId, playerId:user._id});
  
    }
  };

  const handleCopyDuelId = () => {
    navigator.clipboard.writeText(duelId);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

 

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4">
      {/* Duel Options Section */}
      {!isJoiningDuel && (
        <div className="bg-[#2a2a2a] rounded-xl p-6 mb-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-[#e0e0e0] text-2xl font-bold mb-4">Choose Your Battle</h2>
            <button
              onClick={handleCreateDuel}
              className="flex items-center justify-center gap-2 bg-[#00ffff] text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold hover:bg-[#00cccc] transition-colors"
            >
              <Swords className="w-5 h-5" />
              Create New Duel
            </button>
            <button
              onClick={() => setIsJoiningDuel(true)}
              className="flex items-center justify-center gap-2 bg-[#3a3a3a] text-[#e0e0e0] px-6 py-3 rounded-lg font-semibold hover:bg-[#4a4a4a] transition-colors"
            >
              <Users className="w-5 h-5" />
              Join Existing Duel
            </button>
          </div>
        </div>
      )}

      {/* Join Duel Section */}
      {isJoiningDuel && (
        <div className="bg-[#2a2a2a] rounded-xl p-6 mb-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-[#e0e0e0] text-2xl font-bold">Join Duel</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={duelId}
                onChange={(e) => setDuelId(e.target.value.toUpperCase())}
                placeholder="Enter Duel ID"
                className="flex-1 bg-[#3a3a3a] text-[#e0e0e0] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffff] placeholder-[#918a8a]"
                maxLength={8}
              />
              <button
                onClick={handleJoinDuel}
                disabled={!duelId.trim()}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  duelId.trim()
                    ? "bg-[#00ffff] text-[#1a1a1a] hover:bg-[#00cccc]"
                    : "bg-[#3a3a3a] text-[#918a8a] cursor-not-allowed"
                }`}
              >
                Join
              </button>
            </div>
            <button
              onClick={() => {
                setIsJoiningDuel(false);
                setDuelId("");
              }}
              className="text-[#918a8a] hover:text-[#e0e0e0] transition-colors"
            >
              Back to options
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
