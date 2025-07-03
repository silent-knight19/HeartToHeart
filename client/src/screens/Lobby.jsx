import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiHash, FiArrowRight, FiUsers, FiClock, FiGlobe, FiLock, FiStar, FiZap, FiShield, FiVideo, FiMic, FiShare } from "react-icons/fi";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mock socket and navigate for demo
  const socket = { 
    emit: (event, data) => console.log('Socket emit:', event, data),
    on: (event, callback) => console.log('Socket on:', event),
    off: (event, callback) => console.log('Socket off:', event)
  };
  const navigate = (path) => console.log('Navigate to:', path);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmitForm = useCallback(
    () => {
      if (!email || !room) {
        setError("Please fill in all fields");
        return;
      }
      setIsLoading(true);
      setError("");
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { room } = data;
      setIsLoading(false);
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    socket.on("error", (error) => {
      setError(error.message || "An error occurred");
      setIsLoading(false);
    });

    return () => {
      socket.off("room:join", handleJoinRoom);
      socket.off("error");
    };
  }, [socket, handleJoinRoom]);

  const FloatingParticle = ({ delay = 0, size = "w-1 h-1" }) => (
    <motion.div
      className={`absolute rounded-full ${size} bg-gradient-to-r from-emerald-400/10 to-blue-400/10 blur-[0.5px]`}
      style={{
        left: `${20 + Math.random() * 60}%`,
        top: `${20 + Math.random() * 60}%`,
      }}
      animate={{
        y: [0, -100, 0],
        x: [0, Math.random() * 30 - 15, 0],
        opacity: [0, 0.6, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 8 + Math.random() * 4,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: Math.random() * 2,
      }}
    />
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0">
        {/* Dark mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_70%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_70%)]" />
        
        {/* Floating particles */}
        {Array.from({ length: 30 }, (_, i) => (
          <FloatingParticle 
            key={i} 
            delay={i * 0.3} 
            size="w-1 h-1"
          />
        ))}
        
        {/* Cursor interaction */}
        <motion.div
          className="absolute w-60 h-60 rounded-full pointer-events-none opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.02) 0%, transparent 70%)",
            left: mousePosition.x - 120,
            top: mousePosition.y - 120,
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-20 flex items-center justify-between p-6 md:p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
            <FiVideo className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">ConnectPro</span>
        </div>
        
        <div className="flex items-center space-x-6 text-gray-400">
          <button className="hover:text-white transition-colors">Features</button>
          <button className="hover:text-white transition-colors">Pricing</button>
          <button className="hover:text-white transition-colors">About</button>
        </div>
      </motion.nav>

      {/* Main content */}
      <div className="relative z-10 px-6 md:px-8 pb-20">
        {/* Centered hero section */}
        <div className="max-w-4xl mx-auto text-center pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900/50 border border-gray-800 text-sm text-gray-300 mb-8">
              <FiZap className="w-4 h-4 mr-2 text-emerald-400" />
              Now with AI-powered noise cancellation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Video calls that
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                just work
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
              Experience seamless video conferencing with crystal-clear quality, 
              enterprise security, and tools that adapt to your workflow.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
              {[
                { icon: <FiVideo className="w-5 h-5" />, text: "4K Video" },
                { icon: <FiMic className="w-5 h-5" />, text: "Crystal Audio" },
                { icon: <FiShare className="w-5 h-5" />, text: "Screen Share" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gray-900/50 border border-gray-800 flex items-center justify-center text-emerald-400">
                    {feature.icon}
                  </div>
                  <span className="text-sm text-gray-300 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Form section */}
        <div className="max-w-md mx-auto">
          <motion.div
            className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white mb-2">Join a room</h3>
              <p className="text-gray-400">Enter your details to get started</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Room ID
                </label>
                <div className="relative">
                  <FiHash className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-200"
                    placeholder="room-123"
                  />
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="p-4 bg-red-900/20 border border-red-800/30 rounded-xl text-red-400 text-sm"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={handleSubmitForm}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Joining...
                  </>
                ) : (
                  <>
                    Join Room
                    <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800/50">
              <p className="text-center text-gray-500 text-sm mb-4">
                Or continue with
              </p>
              <div className="flex justify-center space-x-4">
                {[
                  { icon: <FaGithub />, color: "hover:bg-gray-700" },
                  { icon: <FaDiscord />, color: "hover:bg-indigo-600" },
                  { icon: <FaTwitter />, color: "hover:bg-blue-600" },
                ].map((social, index) => (
                  <motion.button
                    key={index}
                    className={`w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white ${social.color} transition-all duration-200 flex items-center justify-center`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <motion.div
          className="max-w-4xl mx-auto mt-20 grid grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            { number: "10M+", label: "Active Users" },
            { number: "99.9%", label: "Uptime" },
            { number: "150+", label: "Countries" },
          ].map((stat, index) => (
            <div key={index} className="border border-gray-800/50 rounded-xl p-6 bg-gray-900/20">
              <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LobbyScreen;