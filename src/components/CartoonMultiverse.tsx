import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Home } from 'lucide-react';
import { CartoonPortal } from './CartoonPortal';
import { CartoonWorld } from '../utils/CartoonWorldGenerator';

interface CartoonMultiverseProps {
  worlds: CartoonWorld[];
  onWorldClick: (worldId: string) => void;
  activeWorldId: string | null;
}

export function CartoonMultiverse({ worlds, onWorldClick, activeWorldId }: CartoonMultiverseProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setHasDragged(false);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      
      const dragDistance = Math.sqrt(
        Math.pow(newX - pan.x, 2) + Math.pow(newY - pan.y, 2)
      );
      
      if (dragDistance > 5) {
        setHasDragged(true);
      }
      
      setPan({ x: newX, y: newY });
    }
  }, [isDragging, pan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setHasDragged(false), 50);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-30 overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging && hasDragged ? 'grabbing' : 'grab' }}
    >
      {/* Clean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />

      {/* Subtle grid pattern */}


      {/* Portals container */}
      <motion.div
        className="relative w-full h-full"
        style={{
          x: pan.x,
          y: pan.y,
        }}
      >
        {worlds.map((world, index) => {
          // Spiral positioning
          const angle = index * 0.618 * Math.PI * 2;
          const radius = 200 + index * 120;
          const position = {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
          };

          return (
            <CartoonPortal
              key={world.id}
              world={world}
              position={position}
              onClick={() => {
                if (!hasDragged) {
                  onWorldClick(world.id);
                }
              }}
              isActive={world.id === activeWorldId}
            />
          );
        })}
      </motion.div>

      {/* Welcome message */}
      {worlds.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-2xl px-8">
            <div className="text-6xl mb-6">🌍</div>
            <div className="text-slate-800 mb-4">
              Your Multiverse Awaits
            </div>
            <p className="text-slate-500 mb-4 leading-relaxed">
              Type words to create unique worlds. Each word becomes a visual universe with its own story.
            </p>
            <p className="text-slate-400 text-sm">
              Drag to explore • Click to enter • Type to evolve
            </p>
          </div>
        </div>
      )}

      {/* World count */}
      {worlds.length > 0 && (
        <div className="absolute top-8 left-8 flex flex-col gap-3">
          {/* Home/Reset button */}
          <button
            onClick={() => setPan({ x: 0, y: 0 })}
            className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-full p-3 shadow-xl hover:bg-white/90 transition-colors pointer-events-auto"
          >
            <Home size={20} className="text-slate-700" />
          </button>
          
          <div className="pointer-events-none">
            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl px-6 py-4 shadow-xl">
              <div className="text-slate-700 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm">{worlds.length} / 10 Worlds</span>
              </div>
              <div className="flex flex-wrap gap-2 max-w-xs">
                {worlds.slice(-5).map((world, i) => (
                  <div
                    key={i}
                    className="text-xs px-3 py-1.5 bg-slate-100/80 backdrop-blur-sm border border-slate-200/50 rounded-full text-slate-700"
                  >
                    {world.emojis.slice(0, 3).join('')} {world.word.split('+')[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drag hint */}
      {worlds.length > 3 && !isDragging && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-white/50 rounded-full px-6 py-2.5 text-slate-500 text-sm shadow-xl pointer-events-none flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-400">
            <path d="M8 3L8 13M3 8L13 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Drag to navigate
        </div>
      )}
    </div>
  );
}
