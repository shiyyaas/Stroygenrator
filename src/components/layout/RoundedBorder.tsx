import { ReactNode } from 'react';

interface RoundedBorderProps {
  children: ReactNode;
  radius?: string;
}

export function RoundedBorder({ children, radius = '484px' }: RoundedBorderProps) {
  return (
    <div className="w-full h-full" style={{ borderRadius: radius }}>
      {children}
    </div>
  );
}
