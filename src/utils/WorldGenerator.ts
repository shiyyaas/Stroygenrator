// Algorithmic world generation from 3-letter seeds

export interface GeneratedWorld {
  id: string;
  seed: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    glow: string;
  };
  particles: {
    count: number;
    size: { min: number; max: number };
    speed: { min: number; max: number };
    direction: 'up' | 'down' | 'horizontal' | 'radial' | 'chaotic';
    opacity: { min: number; max: number };
    shape: 'circle' | 'line' | 'square';
  };
  sound: {
    baseFreq: number;
    harmonic: number;
    waveform: OscillatorType;
    filter: BiquadFilterType;
    filterFreq: number;
    volume: number;
    modulation: number;
  };
  atmosphere: {
    mood: string;
    intensity: number;
    motion: 'calm' | 'turbulent' | 'flowing' | 'pulsing';
  };
  story: string;
}

// Seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    this.seed = this.hashString(seed);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }
}

// Generate world from seed
export function generateWorld(seed: string, id: string): GeneratedWorld {
  const rng = new SeededRandom(seed);

  // Generate color palette
  const hue = rng.range(0, 360);
  const saturation = rng.range(50, 90);
  const lightness = rng.range(20, 50);
  
  const colors = {
    primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    secondary: `hsl(${(hue + 120) % 360}, ${saturation * 0.8}%, ${lightness * 1.2}%)`,
    accent: `hsl(${(hue + 240) % 360}, ${saturation * 0.9}%, ${lightness * 1.5}%)`,
    background: `hsl(${hue}, ${saturation * 0.3}%, ${lightness * 0.4}%)`,
    glow: `hsl(${hue}, ${saturation * 1.2}%, ${lightness * 1.8}%)`,
  };

  // Generate particle behavior
  const particleCount = Math.floor(rng.range(50, 200));
  const particles = {
    count: particleCount,
    size: {
      min: rng.range(1, 3),
      max: rng.range(3, 8),
    },
    speed: {
      min: rng.range(0.5, 2),
      max: rng.range(2, 6),
    },
    direction: rng.choice(['up', 'down', 'horizontal', 'radial', 'chaotic'] as const),
    opacity: {
      min: rng.range(0.2, 0.4),
      max: rng.range(0.6, 0.9),
    },
    shape: rng.choice(['circle', 'line', 'square'] as const),
  };

  // Generate sound parameters
  const baseFreq = rng.range(60, 880);
  const sound = {
    baseFreq,
    harmonic: rng.range(1.5, 2.5),
    waveform: rng.choice(['sine', 'triangle', 'sawtooth', 'square'] as OscillatorType[]),
    filter: rng.choice(['lowpass', 'highpass', 'bandpass'] as BiquadFilterType[]),
    filterFreq: rng.range(200, 2000),
    volume: rng.range(0.03, 0.12),
    modulation: rng.range(0.1, 0.5),
  };

  // Generate atmosphere
  const intensity = rng.next();
  const atmosphere = {
    mood: intensity > 0.7 ? 'intense' : intensity > 0.4 ? 'balanced' : 'serene',
    intensity,
    motion: rng.choice(['calm', 'turbulent', 'flowing', 'pulsing'] as const),
  };

  // Generate story
  const story = generateStory(seed, colors, atmosphere, rng);

  return {
    id,
    seed,
    colors,
    particles,
    sound,
    atmosphere,
    story,
  };
}

// Procedural story generation
function generateStory(
  seed: string,
  colors: GeneratedWorld['colors'],
  atmosphere: GeneratedWorld['atmosphere'],
  rng: SeededRandom
): string {
  const elements = {
    settings: [
      'Beneath the {color} expanse',
      'Where {color} horizons meet',
      'In the realm of {color} whispers',
      'Among {color} echoes',
      'Through {color} veils',
      'Within the {color} void',
    ],
    phenomena: [
      'light dances in patterns unknown',
      'silence hums with ancient frequencies',
      'time flows in reverse',
      'memories crystallize into form',
      'gravity bends to whispers',
      'shadows breathe with luminescence',
    ],
    invitations: [
      'Enter, and become part of the composition.',
      'Step through, and reshape what remains.',
      'Your presence will alter everything.',
      'The world awaits your influence.',
      'Type to sculpt this reality.',
      'Each letter reshapes the fabric of being.',
    ],
  };

  // Extract dominant color name from hue
  const colorName = extractColorName(colors.primary);

  const setting = rng.choice(elements.settings).replace('{color}', colorName);
  const phenomenon = rng.choice(elements.phenomena);
  const invitation = rng.choice(elements.invitations);

  return `${setting}, ${phenomenon}. ${invitation}`;
}

function extractColorName(hslColor: string): string {
  const hueMatch = hslColor.match(/hsl\((\d+)/);
  if (!hueMatch) return 'ethereal';

  const hue = parseInt(hueMatch[1]);

  if (hue < 30) return 'crimson';
  if (hue < 60) return 'amber';
  if (hue < 90) return 'golden';
  if (hue < 150) return 'emerald';
  if (hue < 180) return 'jade';
  if (hue < 210) return 'azure';
  if (hue < 240) return 'sapphire';
  if (hue < 270) return 'violet';
  if (hue < 300) return 'indigo';
  if (hue < 330) return 'magenta';
  return 'rose';
}

// Evolve world based on new input
export function evolveWorld(world: GeneratedWorld, newSeed: string): GeneratedWorld {
  // Combine old and new seeds for evolution
  const combinedSeed = world.seed + newSeed;
  const evolved = generateWorld(combinedSeed, world.id);
  
  // Interpolate between old and new for smooth transitions
  return {
    ...evolved,
    seed: combinedSeed,
    story: `${world.story.split('.')[0]}... The world shifts. ${evolved.story}`,
  };
}
