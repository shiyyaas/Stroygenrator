import { motion } from 'motion/react';
import { WorldType } from './AudioEngine';

interface WorldProps {
  world: WorldType;
}

export function World({ world }: WorldProps) {
  const worldStyles: Record<WorldType, { 
    gradient: string; 
    overlay?: string;
    glow?: string;
  }> = {
    void: {
      gradient: 'from-slate-950 via-slate-900 to-slate-950',
      glow: 'bg-slate-700/20',
    },
    rain: {
      gradient: 'from-slate-800 via-blue-900 to-slate-800',
      overlay: 'bg-blue-500/10',
      glow: 'bg-blue-400/20',
    },
    fire: {
      gradient: 'from-orange-950 via-red-900 to-orange-950',
      overlay: 'bg-orange-500/20',
      glow: 'bg-orange-400/30',
    },
    ice: {
      gradient: 'from-cyan-950 via-blue-950 to-slate-950',
      overlay: 'bg-cyan-300/10',
      glow: 'bg-cyan-400/20',
    },
    neon: {
      gradient: 'from-purple-950 via-pink-950 to-slate-950',
      overlay: 'bg-gradient-to-br from-pink-500/20 to-purple-500/20',
      glow: 'bg-pink-500/30',
    },
    ocean: {
      gradient: 'from-blue-950 via-cyan-900 to-blue-950',
      overlay: 'bg-blue-400/15',
      glow: 'bg-blue-500/20',
    },
    forest: {
      gradient: 'from-green-950 via-emerald-900 to-green-950',
      overlay: 'bg-green-500/15',
      glow: 'bg-green-400/20',
    },
    thunder: {
      gradient: 'from-slate-950 via-slate-800 to-slate-950',
      overlay: 'bg-yellow-300/10',
      glow: 'bg-yellow-400/40',
    },
    cosmic: {
      gradient: 'from-indigo-950 via-purple-950 to-black',
      overlay: 'bg-gradient-to-br from-purple-500/20 to-pink-500/10',
      glow: 'bg-purple-400/30',
    },
    desert: {
      gradient: 'from-yellow-950 via-orange-900 to-yellow-950',
      overlay: 'bg-yellow-600/15',
      glow: 'bg-yellow-500/20',
    },
  };

  const style = worldStyles[world];

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient */}
      <motion.div
        key={`gradient-${world}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`}
      />

      {/* Overlay */}
      {style.overlay && (
        <motion.div
          key={`overlay-${world}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className={`absolute inset-0 ${style.overlay}`}
        />
      )}

      {/* Animated glow orbs */}
      <motion.div
        key={`glow-1-${world}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${style.glow}`}
      />

      <motion.div
        key={`glow-2-${world}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1.1, 0.9, 1.1],
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] rounded-full blur-3xl ${style.glow}`}
      />

      {/* Pulse effect for thunder */}
      {world === 'thunder' && (
        <motion.div
          key="thunder-flash"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: Math.random() * 5 + 2,
          }}
          className="absolute inset-0 bg-white"
        />
      )}

      {/* Shimmer for neon */}
      {world === 'neon' && (
        <motion.div
          key="neon-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      )}
    </div>
  );
}
