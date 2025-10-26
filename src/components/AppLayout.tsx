import { ReactNode } from 'react';
import { ScreenContainer } from './layout/ScreenContainer';
import { OverflowContainer } from './layout/OverflowContainer';
import { GradientBackground } from './layout/GradientBackground';
import { RoundedBorder } from './layout/RoundedBorder';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ScreenContainer>
      <OverflowContainer>
        <RoundedBorder radius="484px">
          <GradientBackground from="slate-50" to="slate-100" direction="br">
            {children}
          </GradientBackground>
        </RoundedBorder>
      </OverflowContainer>
    </ScreenContainer>
  );
}
