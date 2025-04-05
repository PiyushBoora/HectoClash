import { motion } from 'motion/react';
import { Brain, Swords, Trophy, Eye, BookOpen, Sparkles } from 'lucide-react';
import Header from '../components/Header';

const About = () => {
  const features = [
    {
      icon: <Swords className="h-8 w-8 text-[#00ffff]" />,
      title: "Real-Time Duels",
      description: "Challenge other players in live, timed Hectoc battles"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-[#00ffff]" />,
      title: "Dynamic Puzzles",
      description: "Each game features unique six-digit sequences for unpredictable challenges"
    },
    {
      icon: <Trophy className="h-8 w-8 text-[#00ffff]" />,
      title: "Leaderboards & Rankings",
      description: "Compete globally and track your performance against other players"
    },
    {
      icon: <Eye className="h-8 w-8 text-[#00ffff]" />,
      title: "Spectator Mode",
      description: "Watch live duels and learn from other players"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-[#00ffff]" />,
      title: "Educational Insights",
      description: "Get detailed post-game analysis to improve your skills"
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#1a1a1a]">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
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
              <Brain className="h-16 w-16 text-[#00ffff]" />
            </motion.div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">What is Hectoc?</h1>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Hectoc is an engaging mental calculation game developed by Yusnier Viera in the 2010s. Players are presented with a sequence of six digits and must use mathematical operations to make the expression equal to 100. The challenge lies in using the digits in their given order while strategically placing operators and parentheses.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-[#2a2a2a] rounded-lg p-6 hover:transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#2a2a2a] rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>
          <div className="text-gray-300 space-y-4">
            <p>1. You'll be given a sequence of six digits (1-9)</p>
            <p>2. Use mathematical operations (+, -, ×, ÷) and parentheses</p>
            <p>3. Create an expression that equals 100</p>
            <p>4. Digits must be used in the given order</p>
            <p>5. Example: Given "123456", a solution could be: 1 + (2 + 3 + 4) × (5 + 6) = 100</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default About;