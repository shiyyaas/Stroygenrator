import { ReactNode } from 'react';

interface WorldBackgroundProps {
  children: ReactNode;
  primaryColor: string;
  backgroundColor: string;
}

export function WorldBackground({ children, primaryColor, backgroundColor }: WorldBackgroundProps) {
  return (
    <div
      className="fixed inset-0 z-40"
      style={{
        background: `linear-gradient(135deg, ${backgroundColor}, ${primaryColor})`,
      }}
    >
      {children}
    </div>
  );
}
