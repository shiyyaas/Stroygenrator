import { ReactNode } from 'react';

interface OverflowContainerProps {
  children: ReactNode;
}

export function OverflowContainer({ children }: OverflowContainerProps) {
  return (
    <div className="overflow-hidden w-full h-full">
      {children}
    </div>
  );
}
