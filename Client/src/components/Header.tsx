import { motion } from "framer-motion";
import { Brain, Trophy, Swords, BookOpen, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetMe } from "../services/queries";
import { useEffect, useRef, useState } from "react";
import axios from "../Utils/axios";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useGetMe();

  const [isLoginPage, setIsLoginPage] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: "/dashboard", icon: Trophy, label: "Dashboard" },
    { path: "/practice", icon: BookOpen, label: "Practice" },
    { path: "/about", icon: Swords, label: "About Us" },
  ];

  useEffect(() => {
    setIsLoginPage(location.pathname === "/login");
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await axios.post("/api/auth/signout", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/80 backdrop-blur-lg border-b border-[#2a2a2a] ${
        isLoginPage ? "hidden" : "block"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className="relative group">
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

          {/* User Profile + Dropdown */}
          {user && (
            <div className="relative flex items-center space-x-3" ref={dropdownRef}>
              <span className="text-white font-medium">{user.name}</span>
              <motion.img
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                src={user.profileImage}
                alt={user.name}
                className="h-8 w-8 rounded-full border-2 border-[#00ffff] cursor-pointer"
                onClick={() => setDropdownOpen((prev) => !prev)}
              />
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-40 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md shadow-lg z-50"
                >
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2a2a] hover:text-[#00ffff] flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
