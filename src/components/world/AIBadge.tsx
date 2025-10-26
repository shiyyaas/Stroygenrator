import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AIBadgeProps {
  isActive: boolean;
}

export function AIBadge({ isActive }: AIBadgeProps) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs shadow-lg"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <Sparkles size={12} />
      </motion.div>
      <span>AI Story</span>
    </motion.div>
  );
}
