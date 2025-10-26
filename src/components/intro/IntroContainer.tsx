import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface IntroContainerProps {
  children: ReactNode;
}

export function IntroContainer({ children }: IntroContainerProps) {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
      }}
    >
      {children}
    </motion.div>
  );
}
