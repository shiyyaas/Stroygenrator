import { IntroContainer } from './intro/IntroContainer';
import { IntroTitle } from './intro/IntroTitle';
import { IntroDescription } from './intro/IntroDescription';
import { IntroInstructions } from './intro/IntroInstructions';

export function IntroScreen() {
  return (
    <IntroContainer>
      <div className="text-center px-8 max-w-3xl">
        <IntroTitle />
        <IntroDescription />
        <IntroInstructions />
      </div>
    </IntroContainer>
  );
}
