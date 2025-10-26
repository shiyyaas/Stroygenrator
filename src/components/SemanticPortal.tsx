import { motion, AnimatePresence } from 'motion/react';
import { SemanticWorld } from '../utils/SemanticWorldGenerator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

interface SemanticPortalProps {
  world: SemanticWorld;
  position: { x: number; y: number };
  onClick: () => void;
  isActive: boolean;
}

export function SemanticPortal({ world, position, onClick, isActive }: SemanticPortalProps) {
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
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseDown={(e) => {
        // Prevent the multiverse drag from starting when clicking portal
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 pointer-events-none z-50"
          >
            <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-4">
              <div 
                className="mb-2 uppercase tracking-widest"
                style={{ color: world.colors.accent }}
              >
                {world.word}
              </div>
              <div className="text-white/60 text-xs uppercase tracking-wider mb-2">
                {world.theme}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                {world.story}
              </p>
              <div className="text-white/50 text-xs">
                {world.content.elements.slice(0, 3).join(' • ')}
              </div>
              <div className="mt-3 text-white/40 text-xs uppercase tracking-wider">
                Click to enter this world
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
          className="absolute inset-4 rounded-full overflow-hidden flex flex-col items-center justify-center"
        >
          {/* Background image preview */}
          <ImageWithFallback
            src={world.imageUrl}
            alt={world.theme}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div 
            className="absolute inset-0 rounded-full" 
            style={{ 
              background: `radial-gradient(circle, ${world.colors.primary}80, ${world.colors.background})`
            }}
          />
          
          {/* Word text */}
          <motion.div
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="text-white/90 uppercase tracking-widest text-center z-10 relative px-2"
          >
            <div className="text-sm">{world.word}</div>
          </motion.div>

          {/* Category-specific mini preview */}
          {world.category === 'rain' && (
            <div className="absolute inset-0">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-3 rounded-full"
                  style={{
                    backgroundColor: world.colors.accent,
                    left: `${Math.random() * 100}%`,
                    top: '-5%',
                  }}
                  animate={{
                    y: ['0%', '150%'],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: Math.random(),
                  }}
                />
              ))}
            </div>
          )}

          {world.category === 'fire' && (
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: world.colors.accent,
                    left: `${Math.random() * 100}%`,
                    bottom: '0%',
                  }}
                  animate={{
                    y: ['0%', '-150%'],
                    opacity: [0.9, 0],
                    scale: [1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: Math.random(),
                  }}
                />
              ))}
            </div>
          )}

          {world.category === 'forest' && (
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-1 rounded-full"
                  style={{
                    backgroundColor: world.colors.secondary,
                    left: `${10 + Math.random() * 80}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, -10, 0],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random(),
                  }}
                />
              ))}
            </div>
          )}

          {world.category === 'night' && (
            <div className="absolute inset-0">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 rounded-full bg-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5 + Math.random(),
                    repeat: Infinity,
                    delay: Math.random(),
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Hover effect */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/0 group-hover:border-white/30 transition-colors"
        />
      </div>
    </motion.div>
  );
}
