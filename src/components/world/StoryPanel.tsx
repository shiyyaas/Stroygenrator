import { motion } from 'motion/react';
import { EmojiHeader } from './EmojiHeader';
import { StoryContent } from './StoryContent';
import { AIBadge } from './AIBadge';
import { isAIAvailable } from '../../utils/AIStoryGenerator';

interface StoryPanelProps {
  emojis: string[];
  primaryColor: string;
  accentColor: string;
  word: string;
  theme: string;
  story: string;
  mood: string;
  energy: string;
}

export function StoryPanel({ 
  emojis, 
  primaryColor, 
  accentColor, 
  word, 
  theme, 
  story, 
  mood, 
  energy 
}: StoryPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 p-8"
    >
      <div className="bg-white/95 backdrop-blur-xl border-4 border-white/60 rounded-[3rem] p-10 shadow-2xl max-w-4xl w-full">
        {/* Emoji Header - Shows all emojis in order */}
        <EmojiHeader emojis={emojis} primaryColor={primaryColor} accentColor={accentColor} />
        
        {/* Story Content - Main focus */}
        <StoryContent story={story} />
        
        {/* World info footer - subtle and playful */}
        <div className="text-center space-y-2">
          <div className="text-slate-900 text-xl">{theme}</div>
          <div className="flex gap-2 items-center justify-center flex-wrap">
            <AIBadge isActive={isAIAvailable()} />
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-slate-700 rounded-full text-sm">
              {mood}
            </span>
            <span className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-orange-100 text-slate-700 rounded-full text-sm">
              {energy} energy
            </span>
            <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-slate-700 rounded-full text-sm">
              {emojis.length} emoji{emojis.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
