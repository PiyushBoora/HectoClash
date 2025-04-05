import { motion } from "framer-motion";
import { Brain, Trophy, Swords, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useGetMe } from "../services/queries";
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();
  const { data: user } = useGetMe();
  const[isLoginPage,setIsLoginPage]=useState(false);
  const navItems = [
    { path: "/dashboard", icon: Trophy, label: "Dashboard" },
    { path: "/practice", icon: BookOpen, label: "Practice" },
    { path: "/duel", icon: Swords, label: "Duel" },
  ];
  useEffect(()=>{
    console.log(location)
    if(location.pathname==='/login'){
      setIsLoginPage(true);
    }
  },[location.pathname])
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/80 backdrop-blur-lg border-b border-[#2a2a2a] ${isLoginPage?'hidden':'block'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Brain className="h-8 w-8 text-[#00ffff]" />
            </motion.div>
            <span className="text-2xl font-bold text-white">Hectoc</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <div className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors">
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive ? "text-[#00ffff]" : "text-gray-400"
                      } group-hover:text-[#00ffff]`}
                    />
                    <span
                      className={`${
                        isActive ? "text-[#00ffff]" : "text-gray-400"
                      } group-hover:text-[#00ffff]`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00ffff]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center space-x-3"
              >
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border-2 border-[#00ffff]"
                />
                <span className="text-white font-medium">{user.name}</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;