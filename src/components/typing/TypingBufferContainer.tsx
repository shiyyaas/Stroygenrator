import { ReactNode } from 'react';

interface TypingBufferContainerProps {
  children: ReactNode;
}

export function TypingBufferContainer({ children }: TypingBufferContainerProps) {
  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl px-8 py-4 shadow-xl">
        {children}
      </div>
    </div>
  );
}
