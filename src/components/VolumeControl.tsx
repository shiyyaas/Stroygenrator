import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { useState } from 'react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    onVolumeChange(volume > 0 ? 0 : 0.5);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 0.5) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => !isDragging && setIsExpanded(false)}
    >
      <motion.div
        initial={false}
        animate={{
          width: isExpanded ? 200 : 44,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
        }}
        className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-full shadow-lg overflow-hidden"
      >
        <div className="flex items-center h-11 px-3">
          {/* Volume Icon Button */}
          <button
            onClick={toggleMute}
            className="flex-shrink-0 text-slate-700 hover:text-slate-900 transition-colors"
          >
            {getVolumeIcon()}
          </button>

          {/* Volume Slider */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 ml-3 mr-2"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  className="w-full h-1 appearance-none bg-slate-200 rounded-full outline-none cursor-pointer volume-slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e2e8f0 ${volume * 100}%, #e2e8f0 100%)`,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Volume Percentage */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 text-xs text-slate-500 w-8 text-right"
              >
                {Math.round(volume * 100)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
