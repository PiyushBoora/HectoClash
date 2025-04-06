import { motion } from "motion/react"
import { Brain } from 'lucide-react';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/api/auth/google";
  };

  return (
    <div className="min-h-screen flex bg-[#1a1a1a]">
      {/* Left side - Hectoc branding */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 bg-gradient-to-br from-[#2a2a2a] to-[#3a3a3a] p-12 flex flex-col justify-center items-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <Brain size={80} className="mb-8 text-[#00ffff]" />
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold mb-6 text-white"
        >
          Hectoc
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-center max-w-md text-gray-300"
        >
          Challenge your mind with our engaging number puzzle game. Train your brain while having fun!
        </motion.p>
      </motion.div>

      {/* Right side - Login */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 bg-[#1a1a1a] flex justify-center items-center p-12"
      >
        <div className="max-w-md w-full">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-8 text-center"
          >
            Welcome Back
          </motion.h2>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin}
            className="w-full cursor-pointer flex items-center justify-center gap-3 bg-[#2a2a2a] text-white px-6 py-3 rounded-lg hover:bg-[#3a3a3a] transition-all duration-200 border border-[#4a4a4a]"
          >
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="w-5 h-5"
            />
            <span>Continue with Google</span>
          </motion.button>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center text-gray-400"
          >
            By continuing, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;