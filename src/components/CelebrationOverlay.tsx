import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, CheckCircle2, Award } from "lucide-react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: "circle" | "square" | "triangle" | "star";
  delay: number;
  duration: number;
  rotation: number;
  horizontalMovement: number;
}

const CONFETTI_COLORS = [
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EF4444", // Red
  "#06B6D4"  // Cyan
];

const SHAPES: ("circle" | "square" | "triangle" | "star")[] = ["circle", "square", "triangle", "star"];

export default function CelebrationOverlay() {
  const [isActive, setIsActive] = useState(false);
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [message, setMessage] = useState("");

  const triggerCelebration = (customMessage?: string) => {
    setMessage(customMessage || "Action Successful!");
    
    // Generate 75 random confetti pieces
    const newPieces: ConfettiPiece[] = Array.from({ length: 75 }).map((_, index) => {
      const size = Math.random() * 8 + 6; // between 6px and 14px
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const delay = Math.random() * 0.4; // staggered starts up to 400ms
      const duration = Math.random() * 1.5 + 2.5; // fall durations between 2.5s and 4s
      const rotation = Math.random() * 360;
      const horizontalMovement = Math.random() * 400 - 200; // sway left or right by up to 200px
      
      // Start near center-bottom or spread across the bottom, burst upward, then fall
      const startX = Math.random() * 80 + 10; // 10vw to 90vw
      
      return {
        id: index,
        x: startX,
        y: -10, // Start above screen
        size,
        color,
        shape,
        delay,
        duration,
        rotation,
        horizontalMovement
      };
    });

    setPieces(newPieces);
    setIsActive(true);

    // Auto-disable overlay after 4 seconds
    const timer = setTimeout(() => {
      setIsActive(false);
      setPieces([]);
    }, 4500);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const handleTrigger = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      triggerCelebration(customEvent.detail?.message);
    };

    window.addEventListener("celebration-trigger", handleTrigger);
    return () => {
      window.removeEventListener("celebration-trigger", handleTrigger);
    };
  }, []);

  const renderShape = (piece: ConfettiPiece) => {
    const style = {
      width: piece.size,
      height: piece.size,
      backgroundColor: piece.color,
    };

    switch (piece.shape) {
      case "circle":
        return <div style={{ ...style, borderRadius: "50%" }} />;
      case "square":
        return <div style={style} />;
      case "triangle":
        return (
          <div 
            style={{
              width: 0,
              height: 0,
              borderLeft: `${piece.size / 2}px solid transparent`,
              borderRight: `${piece.size / 2}px solid transparent`,
              borderBottom: `${piece.size}px solid ${piece.color}`,
            }} 
          />
        );
      case "star":
        return (
          <svg 
            viewBox="0 0 24 24" 
            style={{ width: piece.size, height: piece.size, fill: piece.color }}
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z" />
          </svg>
        );
    }
  };

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 z-110 pointer-events-none flex items-center justify-center overflow-hidden">
          {/* Confetti rain */}
          <div className="absolute inset-0">
            {pieces.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{ 
                  y: "110vh", // start at bottom or burst
                  x: `${piece.x}vw`, 
                  opacity: 1, 
                  rotate: piece.rotation,
                  scale: 0.5 
                }}
                animate={{ 
                  y: "-10vh", // burst upward first
                  x: `${piece.x + piece.horizontalMovement / 15}vw`,
                  rotate: piece.rotation + 360,
                  opacity: [0, 1, 1, 0.8, 0],
                  scale: [0.5, 1.2, 1, 0.8]
                }}
                transition={{
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: "easeOut"
                }}
                className="absolute"
                style={{
                  top: 0,
                  transform: "translate(-50%, -50%)"
                }}
              >
                {renderShape(piece)}
              </motion.div>
            ))}
          </div>

          {/* Fallback falling confetti from top */}
          <div className="absolute inset-0">
            {pieces.slice(0, 30).map((piece) => (
              <motion.div
                key={`top-${piece.id}`}
                initial={{ 
                  y: "-10vh", 
                  x: `${piece.x}vw`, 
                  opacity: 0, 
                  rotate: 0 
                }}
                animate={{ 
                  y: "110vh", 
                  x: `${piece.x + piece.horizontalMovement / 10}vw`,
                  rotate: piece.rotation * 2,
                  opacity: [0, 1, 1, 0.5, 0]
                }}
                transition={{
                  duration: piece.duration + 1,
                  delay: piece.delay + 0.5,
                  ease: "linear"
                }}
                className="absolute"
              >
                {renderShape(piece)}
              </motion.div>
            ))}
          </div>

          {/* Success Notification Alert HUD with user active guidance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-slate-900/95 border-2 border-emerald-500/50 text-white rounded-2xl shadow-2xl p-4 sm:p-5 max-w-sm mx-4 flex items-center gap-4 relative z-50 backdrop-blur-md pointer-events-auto"
          >
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div className="text-left min-w-0">
              <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>Success confirmed</span>
              </h4>
              <p className="text-sm font-black text-slate-100 mt-0.5 truncate leading-tight">
                {message}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-semibold">
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span>Infinite SEO workspace updated</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
