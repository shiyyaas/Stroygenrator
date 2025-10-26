import { ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
}

export function ScreenContainer({ children }: ScreenContainerProps) {
  return (
    <div className="relative w-screen h-screen">
      {children}
    </div>
  );
}
