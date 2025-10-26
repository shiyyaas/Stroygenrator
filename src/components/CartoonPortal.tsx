import { motion, AnimatePresence } from 'motion/react';
import { CartoonWorld } from '../utils/CartoonWorldGenerator';
import { useState } from 'react';

interface CartoonPortalProps {
  world: CartoonWorld;
  position: { x: number; y: number };
  onClick: () => void;
  isActive: boolean;
}

export function CartoonPortal({ world, position, onClick, isActive }: CartoonPortalProps) {
  const [showStory, setShowStory] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: position.x,
        y: position.y,
      }}
      whileHover={{ scale: 1.05 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      onMouseEnter={() => setShowStory(true)}
      onMouseLeave={() => setShowStory(false)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      className="absolute cursor-pointer group"
      style={{
        left: '50%',
        top: '50%',
        marginLeft: '-80px',
        marginTop: '-80px',
      }}
    >
      {/* Story tooltip */}
      <AnimatePresence>
        {showStory && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 pointer-events-none z-50"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex gap-1">
                  {world.emojis.slice(0, 3).map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl" style={{
                      background: `linear-gradient(135deg, ${world.colors.primary}20, ${world.colors.accent}20)`,
                    }}>
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="text-slate-900 text-sm">{world.word}</div>
                  <div className="text-xs text-slate-500">{world.theme}</div>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-3">
                {world.story}
              </p>
              <div className="text-xs text-slate-500 mb-3 flex gap-2 flex-wrap">
                {world.emojis.slice(0, 6).map((emoji, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100/80 rounded-lg">{emoji}</span>
                ))}
              </div>
              <div className="text-center text-xs text-slate-500 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl py-2.5 border border-slate-200/50">
                Click to enter
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal container */}
      <div className="relative w-40 h-40 rounded-full flex items-center justify-center">
        {/* Outer ring */}
        <div 
          className="absolute inset-0 rounded-full p-[3px] shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${world.colors.primary}, ${world.colors.accent})`,
          }}
        >
          <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-sm" />
        </div>

        {/* Inner world preview */}
        <div
          className="absolute inset-3 rounded-full overflow-hidden flex flex-col items-center justify-center shadow-inner"
          style={{
            background: `linear-gradient(135deg, ${world.colors.background}, ${world.colors.primary})`,
          }}
        >
          {/* Emoji particles */}
          {[...Array(6)].map((_, i) => {
            const emojiToShow = world.emojis[i % world.emojis.length];
            return (
              <motion.div
                key={i}
                className="absolute text-xl opacity-60"
                style={{
                  left: `${20 + (i * 60) / 6}%`,
                  top: `${20 + ((i * 17) % 60)}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2 + (i % 2),
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                {emojiToShow}
              </motion.div>
            );
          })}
          
          {/* Center emojis */}
          <div className="text-center z-10 relative">
            <div className="text-2xl mb-1 flex gap-0.5 items-center justify-center">
              {world.emojis.slice(0, 2).map((emoji, i) => (
                <span key={i}>{emoji}</span>
              ))}
            </div>
            <div className="text-white text-xs uppercase tracking-wider drop-shadow">
              {world.word.split('+')[0]}
            </div>
          </div>
        </div>

        {/* Hover border */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/50 transition-all" />
      </div>
    </motion.div>
  );
}
