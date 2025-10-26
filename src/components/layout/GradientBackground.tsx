import { ReactNode } from 'react';

interface GradientBackgroundProps {
  children: ReactNode;
  from?: string;
  via?: string;
  to?: string;
  direction?: 'br' | 'bl' | 'tr' | 'tl' | 'r' | 'l' | 't' | 'b';
}

export function GradientBackground({ 
  children, 
  from = 'slate-50', 
  to = 'slate-100',
  via,
  direction = 'br' 
}: GradientBackgroundProps) {
  const directionClass = `bg-gradient-to-${direction}`;
  const fromClass = `from-${from}`;
  const toClass = `to-${to}`;
  const viaClass = via ? `via-${via}` : '';
  
  return (
    <div className={`${directionClass} ${fromClass} ${viaClass} ${toClass} w-full h-full`}>
      {children}
    </div>
  );
}
