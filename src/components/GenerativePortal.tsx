import { motion } from 'motion/react';
import { GeneratedWorld } from '../utils/WorldGenerator';
import { useState } from 'react';

interface GenerativePortalProps {
  world: GeneratedWorld;
  position: { x: number; y: number };
  onClick: () => void;
  isActive: boolean;
}

export function GenerativePortal({ world, position, onClick, isActive }: GenerativePortalProps) {
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
      whileHover={{ scale: 1.15 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      onMouseEnter={() => setShowStory(true)}
      onMouseLeave={() => setShowStory(false)}
      onClick={onClick}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 pointer-events-none z-50"
          >
            <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-4">
              <div 
                className="mb-2 uppercase tracking-widest"
                style={{ color: world.colors.accent }}
              >
                {world.seed}
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                {world.story}
              </p>
              <div className="mt-2 text-white/40 text-xs uppercase tracking-wider">
                Click to enter
              </div>
            </div>
            {/* Arrow */}
            <div 
              className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-3 h-3 rotate-45 bg-black/90 border-r border-b border-white/20"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Outer glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full blur-xl"
        style={{ backgroundColor: world.colors.glow }}
      />

      {/* Portal ring */}
      <div className="relative w-40 h-40 rounded-full flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, ${world.colors.primary}, ${world.colors.accent}, ${world.colors.secondary}, ${world.colors.primary})`,
            padding: '3px',
          }}
        >
          <div className="w-full h-full rounded-full bg-black" />
        </motion.div>

        {/* Inner world preview */}
        <motion.div
          className="absolute inset-4 rounded-full overflow-hidden flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${world.colors.primary}, ${world.colors.background})`,
          }}
        >
          {/* Seed text */}
          <motion.div
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-white/90 uppercase tracking-widest text-center z-10 relative"
          >
            <div>{world.seed}</div>
          </motion.div>

          {/* Mini particle preview */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const radius = 30 + Math.random() * 20;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: i % 3 === 0 ? world.colors.accent : world.colors.secondary,
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: [
                      Math.cos(angle) * radius,
                      Math.cos(angle + Math.PI) * radius,
                      Math.cos(angle) * radius,
                    ],
                    y: [
                      Math.sin(angle) * radius,
                      Math.sin(angle + Math.PI) * radius,
                      Math.sin(angle) * radius,
                    ],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/0 group-hover:border-white/30 transition-colors"
        />
      </div>
    </motion.div>
  );
}

// Need to import AnimatePresence
import { AnimatePresence } from 'motion/react';
