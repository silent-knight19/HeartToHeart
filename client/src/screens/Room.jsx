import React, { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiPhone,
  FiShare,
  FiSettings,
  FiMoreVertical,
  FiUsers,
  FiMessageSquare,
  FiMonitor,
} from "react-icons/fi";

const RoomPage = () => {
  // Mock socket and peer for demo
  const socket = { 
    emit: (event, data) => console.log('Socket emit:', event, data),
    on: (event, callback) => console.log('Socket on:', event),
    off: (event, callback) => console.log('Socket off:', event)
  };
  
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [participants] = useState([
    { id: 1, name: "Alex Chen", avatar: "AC", isHost: true },
    { id: 2, name: "Sarah Johnson", avatar: "SJ", isHost: false }
  ]);

  // Simulate remote connection after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setRemoteSocketId("demo-remote-id");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let timeout;
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const handleMouseMove = () => resetTimeout();
    window.addEventListener('mousemove', handleMouseMove);
    resetTimeout();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    console.log("Starting call...");
    setMyStream("demo-stream");
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const VideoPlayer = ({ stream, muted, name, isLocal, avatar }) => (
    <motion.div 
      className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden aspect-video shadow-2xl border border-slate-700/50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-slate-900 to-cyan-900/20" />
      
      <AnimatePresence>
        {stream || !isLocal ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full relative"
          >
            {/* Simulated video background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-4xl font-bold text-white"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotateY: [0, 5, 0, -5, 0] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  {avatar}
                </motion.div>
              </div>
            </div>
            
            {(isLocal && isVideoOff) && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center">
                  <FiVideoOff className="text-white/50 text-6xl mx-auto mb-4" />
                  <p className="text-white/70 text-lg">Video is turned off</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full mx-auto mb-4"
              />
              <p className="text-lg">Connecting...</p>
            </div>
          </div>
        )}
      </AnimatePresence>
      
      {/* User info overlay */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isLocal && isMuted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-2 rounded-full bg-red-500/20 border border-red-500/30"
              >
                <FiMicOff className="text-red-400 w-4 h-4" />
              </motion.div>
            )}
            <div>
              <h3 className="font-semibold text-white text-lg" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                {name}
              </h3>
              <p className="text-white/60 text-sm">
                {isLocal ? "You" : remoteSocketId ? "Connected" : "Connecting..."}
              </p>
            </div>
          </div>
          
          <motion.button
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMoreVertical className="text-white w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Network quality indicator */}
      <div className="absolute top-4 right-4 flex space-x-1">
        {[1, 2, 3, 4].map((bar) => (
          <motion.div
            key={bar}
            className="w-1 bg-green-500 rounded-full"
            style={{ height: `${bar * 3 + 6}px` }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ 
              duration: 1.5, 
              delay: bar * 0.1, 
              repeat: Infinity 
            }}
          />
        ))}
      </div>
    </motion.div>
);

function ControlButton({ onClick, icon, title, className, disabled, isActive }) {
    return (
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={`relative p-4 rounded-2xl text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white/10 ${className} ${isActive ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
        title={title}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center">
          {icon}
        </div>
        {isActive && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }} />
        )}
      </motion.button>
    );
  }

  const ParticipantCard = ({ participant }) => (
    <motion.div 
      className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
        {participant.avatar}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm font-medium">{participant.name}</span>
          {participant.isHost && (
            <span className="px-2 py-1 text-xs bg-violet-500/20 text-violet-300 rounded-full border border-violet-500/30">
              Host
            </span>
          )}
        </div>
      </div>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
    </motion.div>
  );

  return (
    <div 
      className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-900 text-white flex flex-col relative overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-600/5 to-cyan-600/5 rounded-full filter blur-3xl" />
      </div>

      {/* Header */}
      <AnimatePresence>
        {showControls && (
          <motion.header 
            className="relative z-20 w-full max-w-7xl mx-auto flex justify-between items-center p-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <FiVideo className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Video Conference
                </h1>
                <p className="text-white/60 text-sm">Room: meeting-2024</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className={`w-3 h-3 rounded-full ${remoteSocketId ? 'bg-green-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
                <span className="text-sm font-medium">
                  {remoteSocketId ? 'Connected' : 'Connecting...'}
                </span>
                <FiUsers className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/60">{participants.length}</span>
              </div>
              
              <motion.button 
                className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSettings className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main video area */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-4">
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Local video */}
          <VideoPlayer 
            stream={myStream || "demo"} 
            muted={true} 
            name="Alex Chen" 
            isLocal={true} 
            avatar="AC"
          />
          
          {/* Remote video */}
          <VideoPlayer 
            stream={remoteStream || (remoteSocketId ? "demo" : null)} 
            muted={false} 
            name="Sarah Johnson" 
            isLocal={false} 
            avatar="SJ"
          />
        </div>
      </main>

      {/* Participants sidebar (hidden for mobile) */}
      <motion.div 
        className="hidden xl:block fixed right-6 top-1/2 transform -translate-y-1/2 w-72 z-30"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FiUsers className="w-5 h-5 mr-2 text-violet-400" />
            Participants ({participants.length})
          </h3>
          <div className="space-y-3">
            {participants.map((participant) => (
              <ParticipantCard key={participant.id} participant={participant} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Control bar */}
      <AnimatePresence>
        {showControls && (
          <motion.footer 
            className="relative z-20 w-full flex justify-center p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-4 border border-white/20 shadow-2xl">
              <div className="flex items-center space-x-3">
                <ControlButton
                  onClick={toggleMute}
                  icon={<FiMic className="w-5 h-5" />}
                  title={isMuted ? "Unmute" : "Mute"}
                  className={isMuted ? "bg-red-500/80 hover:bg-red-500" : ""}
                  isActive={isMuted}
                />
                
                <ControlButton
                  onClick={toggleVideo}
                  icon={<FiVideo className="w-5 h-5" />}
                  title={isVideoOff ? "Start Video" : "Stop Video"}
                  className={isVideoOff ? "bg-red-500/80 hover:bg-red-500" : ""}
                  isActive={isVideoOff}
                />
                
                <div className="w-px h-8 bg-white/20" />
                
                <ControlButton
                  onClick={() => console.log("Share screen")}
                  icon={<FiMonitor className="w-5 h-5" />}
                  title="Share Screen"
                  className="hover:bg-blue-500/20 hover:border-blue-500/30"
                />
                
                <ControlButton
                  onClick={() => console.log("Open chat")}
                  icon={<FiMessageSquare className="w-5 h-5" />}
                  title="Chat"
                  className="hover:bg-green-500/20 hover:border-green-500/30"
                />
                
                {remoteSocketId && !myStream && (
                  <ControlButton
                    onClick={handleCallUser}
                    icon={<FiPhone className="w-5 h-5" />}
                    title="Start Call"
                    className="bg-green-500/80 hover:bg-green-500"
                  />
                )}
                
                {myStream && (
                  <ControlButton
                    onClick={() => console.log("Send streams")}
                    icon={<FiShare className="w-5 h-5" />}
                    title="Send Stream"
                    className="bg-blue-500/80 hover:bg-blue-500"
                  />
                )}
                
                <div className="w-px h-8 bg-white/20" />
                
                <ControlButton
                  onClick={() => console.log("End call")}
                  icon={<FiPhone className="w-5 h-5 rotate-[135deg]" />}
                  title="End Call"
                  className="bg-red-500/80 hover:bg-red-500 hover:scale-110"
                />
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>

      {/* Connection status toast */}
      <AnimatePresence>
        {!remoteSocketId && (
          <motion.div 
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <div className="bg-amber-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-2xl border border-amber-400/30 shadow-lg">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="font-medium">Waiting for participants to join...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RoomPage;