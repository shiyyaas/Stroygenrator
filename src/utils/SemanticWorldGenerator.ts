// Semantic world generation from meaningful words

export interface SemanticWorld {
  id: string;
  word: string;
  category: string;
  theme: string;
  imageUrl: string; // Background image URL
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
    direction: 'up' | 'down' | 'horizontal' | 'radial' | 'chaotic' | 'swirling';
    opacity: { min: number; max: number };
    shape: 'circle' | 'line' | 'square' | 'leaf' | 'spark';
    color: string;
  };
  sound: {
    type: string; // descriptive type like 'rain', 'fire', 'wind'
    baseFreq: number;
    harmonic: number;
    waveform: OscillatorType;
    filter: BiquadFilterType;
    filterFreq: number;
    volume: number;
    modulation: number;
    melody?: number[]; // Musical melody notes (frequencies)
    rhythm?: number[]; // Rhythm pattern (durations)
  };
  atmosphere: {
    mood: string;
    intensity: number;
    motion: 'calm' | 'turbulent' | 'flowing' | 'pulsing' | 'gentle';
    lighting: 'bright' | 'dim' | 'ethereal' | 'warm' | 'cool';
  };
  content: {
    elements: string[]; // What exists in this world
    description: string; // Rich description
  };
  story: string;
}

// Semantic word categories and their world configurations
const SEMANTIC_CATEGORIES: Record<string, {
  keywords: string[];
  theme: string;
  colors: string[];
  particleType: string;
  soundType: string;
  elements: string[];
  moods: string[];
  imageUrl: string;
}> = {
  forest: {
    keywords: ['tree', 'trees', 'forest', 'woods', 'oak', 'pine', 'jungle', 'grove', 'leaf', 'leaves'],
    theme: 'Ancient Forest',
    colors: ['#2d5016', '#4a7c29', '#7cb342', '#1b3a0f', '#aed581'],
    particleType: 'leaf',
    soundType: 'forest',
    elements: ['towering trees', 'rustling leaves', 'dappled sunlight', 'woodland creatures', 'moss-covered stones'],
    moods: ['serene', 'ancient', 'peaceful', 'verdant'],
    imageUrl: 'https://images.unsplash.com/photo-1638893055241-6a34177ee30b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmNpZW50JTIwZm9yZXN0JTIwdHJlZXN8ZW58MXx8fHwxNzYxNDYxMjI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  fire: {
    keywords: ['fire', 'flame', 'blaze', 'inferno', 'ember', 'burn', 'lava', 'volcano', 'heat'],
    theme: 'Realm of Fire',
    colors: ['#d84315', '#ff5722', '#ff9800', '#bf360c', '#ffb74d'],
    particleType: 'spark',
    soundType: 'fire',
    elements: ['dancing flames', 'rising embers', 'molten streams', 'heat waves', 'ash clouds'],
    moods: ['intense', 'fierce', 'passionate', 'consuming'],
    imageUrl: 'https://images.unsplash.com/photo-1598557429123-f50d46fe4987?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXJlJTIwZmxhbWVzJTIwbGF2YXxlbnwxfHx8fDE3NjE0NjEyMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  water: {
    keywords: ['water', 'ocean', 'sea', 'wave', 'waves', 'lake', 'river', 'stream', 'tide', 'blue'],
    theme: 'Aquatic Depths',
    colors: ['#006064', '#0097a7', '#00bcd4', '#004d40', '#80deea'],
    particleType: 'circle',
    soundType: 'water',
    elements: ['rolling waves', 'deep currents', 'aquatic life', 'light ripples', 'coral formations'],
    moods: ['flowing', 'deep', 'mysterious', 'tranquil'],
    imageUrl: 'https://images.unsplash.com/photo-1753645132504-e378fe980984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwd2F0ZXJ8ZW58MXx8fHwxNzYxNDA1OTU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  rain: {
    keywords: ['rain', 'storm', 'thunder', 'lightning', 'wet', 'drizzle', 'downpour', 'monsoon'],
    theme: 'Storm Realm',
    colors: ['#37474f', '#546e7a', '#78909c', '#263238', '#90a4ae'],
    particleType: 'line',
    soundType: 'rain',
    elements: ['falling rain', 'dark clouds', 'thunder rumbling', 'lightning flashes', 'wet earth'],
    moods: ['dramatic', 'cleansing', 'powerful', 'somber'],
    imageUrl: 'https://images.unsplash.com/photo-1565636541773-07ffeb0ba8bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluJTIwc3Rvcm0lMjBjbG91ZHN8ZW58MXx8fHwxNzYxNDYxMjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  wind: {
    keywords: ['wind', 'breeze', 'air', 'gust', 'gale', 'sky', 'cloud', 'clouds'],
    theme: 'Windswept Plains',
    colors: ['#e3f2fd', '#90caf9', '#64b5f6', '#bbdefb', '#42a5f5'],
    particleType: 'line',
    soundType: 'wind',
    elements: ['rushing winds', 'swirling currents', 'floating clouds', 'endless sky', 'dancing air'],
    moods: ['free', 'flowing', 'dynamic', 'open'],
    imageUrl: 'https://images.unsplash.com/photo-1573680212786-1446d98e3345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kJTIwc2t5JTIwY2xvdWRzfGVufDF8fHx8MTc2MTQ2MTIyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  ice: {
    keywords: ['ice', 'snow', 'frost', 'frozen', 'cold', 'winter', 'freeze', 'glacier', 'crystal'],
    theme: 'Frozen Tundra',
    colors: ['#e1f5fe', '#81d4fa', '#4fc3f7', '#b3e5fc', '#03a9f4'],
    particleType: 'circle',
    soundType: 'ice',
    elements: ['crystalline ice', 'falling snow', 'frost patterns', 'frozen landscapes', 'shimmering crystals'],
    moods: ['serene', 'crystalline', 'pristine', 'still'],
    imageUrl: 'https://images.unsplash.com/photo-1706471570138-e9024fa1c6bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2UlMjBzbm93JTIwZnJvemVufGVufDF8fHx8MTc2MTQ2MTIyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  dragon: {
    keywords: ['dragon', 'dragons', 'wyvern', 'drake', 'wyrm'],
    theme: 'Dragon Domain',
    colors: ['#4a148c', '#7b1fa2', '#9c27b0', '#311b92', '#ba68c8'],
    particleType: 'spark',
    soundType: 'mystical',
    elements: ['ancient dragons', 'soaring beasts', 'dragon fire', 'scaled creatures', 'mystical energy'],
    moods: ['legendary', 'powerful', 'ancient', 'majestic'],
    imageUrl: 'https://images.unsplash.com/photo-1610926597998-fc7f2c1b89b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFnb24lMjBmYW50YXN5fGVufDF8fHx8MTc2MTM0OTE0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  mountain: {
    keywords: ['mountain', 'mountains', 'peak', 'summit', 'cliff', 'rock', 'stone', 'canyon'],
    theme: 'Mountain Peaks',
    colors: ['#5d4037', '#6d4c41', '#8d6e63', '#4e342e', '#a1887f'],
    particleType: 'square',
    soundType: 'mountain',
    elements: ['towering peaks', 'rocky cliffs', 'mountain winds', 'stone formations', 'thin air'],
    moods: ['majestic', 'enduring', 'grand', 'timeless'],
    imageUrl: 'https://images.unsplash.com/photo-1504629231549-80d5980f26d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBlYWtzJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2MTQ2MTIyOHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  desert: {
    keywords: ['desert', 'sand', 'dune', 'dunes', 'arid', 'dry', 'sahara', 'oasis'],
    theme: 'Desert Expanse',
    colors: ['#f57c00', '#ffa726', '#ffb74d', '#e65100', '#ffd54f'],
    particleType: 'circle',
    soundType: 'desert',
    elements: ['endless sand', 'shifting dunes', 'heat mirages', 'dry winds', 'hidden oases'],
    moods: ['vast', 'desolate', 'timeless', 'harsh'],
    imageUrl: 'https://images.unsplash.com/photo-1718886723864-9ef3be5cfc60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzYW5kJTIwZHVuZXN8ZW58MXx8fHwxNzYxMzc2MzczfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  night: {
    keywords: ['night', 'dark', 'darkness', 'midnight', 'stars', 'moon', 'lunar', 'nocturnal'],
    theme: 'Eternal Night',
    colors: ['#1a237e', '#283593', '#3f51b5', '#0d47a1', '#5c6bc0'],
    particleType: 'circle',
    soundType: 'night',
    elements: ['starlit sky', 'moonlight', 'shadows', 'nocturnal creatures', 'cosmic silence'],
    moods: ['mysterious', 'quiet', 'ethereal', 'contemplative'],
    imageUrl: 'https://images.unsplash.com/photo-1666279887088-a3342fcf1726?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodCUyMHN0YXJzJTIwbW9vbnxlbnwxfHx8fDE3NjEzNDQyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  flower: {
    keywords: ['flower', 'flowers', 'bloom', 'blossom', 'petal', 'petals', 'garden', 'rose'],
    theme: 'Blooming Garden',
    colors: ['#f06292', '#ec407a', '#e91e63', '#f8bbd0', '#ff4081'],
    particleType: 'leaf',
    soundType: 'garden',
    elements: ['blooming flowers', 'colorful petals', 'sweet fragrance', 'gentle breezes', 'butterflies'],
    moods: ['beautiful', 'vibrant', 'gentle', 'romantic'],
    imageUrl: 'https://images.unsplash.com/photo-1699378537091-288035b4f478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG93ZXJzJTIwZ2FyZGVuJTIwYmxvb218ZW58MXx8fHwxNzYxNDYxMjI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  light: {
    keywords: ['light', 'sun', 'sunshine', 'bright', 'glow', 'radiant', 'luminous', 'dawn'],
    theme: 'Radiant Light',
    colors: ['#fff9c4', '#fff59d', '#ffeb3b', '#fdd835', '#ffee58'],
    particleType: 'circle',
    soundType: 'ethereal',
    elements: ['brilliant light', 'golden rays', 'warm glow', 'shimmering air', 'pure radiance'],
    moods: ['uplifting', 'warm', 'hopeful', 'bright'],
    imageUrl: 'https://images.unsplash.com/photo-1681286413243-4a7e39fac3cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwZ29sZGVuJTIwbGlnaHR8ZW58MXx8fHwxNzYxMzY3MDE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  magic: {
    keywords: ['magic', 'spell', 'wizard', 'witch', 'enchant', 'mystical', 'arcane', 'rune'],
    theme: 'Arcane Realm',
    colors: ['#6a1b9a', '#8e24aa', '#9c27b0', '#4a148c', '#ce93d8'],
    particleType: 'spark',
    soundType: 'mystical',
    elements: ['magical energy', 'floating runes', 'arcane symbols', 'mystical auras', 'enchanted artifacts'],
    moods: ['mysterious', 'powerful', 'enchanting', 'otherworldly'],
    imageUrl: 'https://images.unsplash.com/photo-1578701190956-49a6d98c9702?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpYyUyMG15c3RpY2FsJTIwcHVycGxlfGVufDF8fHx8MTc2MTQ2MTIzMHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  space: {
    keywords: ['space', 'galaxy', 'star', 'cosmos', 'universe', 'nebula', 'planet', 'cosmic'],
    theme: 'Cosmic Void',
    colors: ['#1a0033', '#4a148c', '#6a1b9a', '#311b92', '#7b1fa2'],
    particleType: 'circle',
    soundType: 'cosmic',
    elements: ['distant stars', 'nebulae', 'cosmic dust', 'gravitational waves', 'void of space'],
    moods: ['infinite', 'vast', 'mysterious', 'awe-inspiring'],
    imageUrl: 'https://images.unsplash.com/photo-1585575141647-c2c436949374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMGdhbGF4eSUyMHN0YXJzfGVufDF8fHx8MTc2MTM5NTA1NXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
};

// Find semantic category for a word
function findCategory(word: string): string | null {
  const lowercaseWord = word.toLowerCase().trim();
  
  for (const [category, config] of Object.entries(SEMANTIC_CATEGORIES)) {
    if (config.keywords.includes(lowercaseWord)) {
      return category;
    }
  }
  
  return null;
}

// Generate world from semantic word
export function generateSemanticWorld(word: string, id: string): SemanticWorld {
  const category = findCategory(word) || 'space'; // Default to space for unknown words
  const config = SEMANTIC_CATEGORIES[category];
  
  // Use word as seed for variation
  const seed = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rng = () => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  // Select colors from config
  const colors = {
    primary: config.colors[0],
    secondary: config.colors[1],
    accent: config.colors[2],
    background: config.colors[3],
    glow: config.colors[4],
  };
  
  // Configure particles
  const particles = {
    count: category === 'rain' ? 150 : category === 'fire' ? 200 : 100,
    size: {
      min: config.particleType === 'leaf' ? 3 : 1,
      max: config.particleType === 'leaf' ? 6 : config.particleType === 'spark' ? 4 : 3,
    },
    speed: {
      min: category === 'wind' ? 3 : category === 'rain' ? 4 : 1,
      max: category === 'wind' ? 7 : category === 'rain' ? 8 : 4,
    },
    direction: category === 'fire' ? 'up' as const : 
                category === 'rain' ? 'down' as const :
                category === 'wind' ? 'horizontal' as const :
                category === 'water' ? 'swirling' as const :
                'chaotic' as const,
    opacity: {
      min: 0.3,
      max: 0.8,
    },
    shape: config.particleType as any,
    color: colors.accent,
  };
  
  // Configure sound
  const sound = getSoundConfig(config.soundType);
  
  // Configure atmosphere
  const moodIndex = Math.floor(rng() * config.moods.length);
  const atmosphere = {
    mood: config.moods[moodIndex],
    intensity: category === 'fire' || category === 'storm' ? 0.8 : 0.5,
    motion: category === 'wind' ? 'flowing' as const :
            category === 'water' ? 'flowing' as const :
            category === 'fire' ? 'turbulent' as const :
            'gentle' as const,
    lighting: category === 'night' ? 'dim' as const :
              category === 'light' ? 'bright' as const :
              category === 'fire' ? 'warm' as const :
              'ethereal' as const,
  };
  
  // Generate content description
  const elementIndex = Math.floor(rng() * config.elements.length);
  const content = {
    elements: config.elements,
    description: `A world of ${config.theme.toLowerCase()}, where ${config.elements[elementIndex]} define the landscape.`,
  };
  
  // Generate story
  const story = generateSemanticStory(word, config, atmosphere);
  
  return {
    id,
    word,
    category,
    theme: config.theme,
    imageUrl: config.imageUrl,
    colors,
    particles,
    sound,
    atmosphere,
    content,
    story,
  };
}

// Sound configurations by type
function getSoundConfig(type: string): SemanticWorld['sound'] {
  const configs: Record<string, Partial<SemanticWorld['sound']>> = {
    rain: {
      type: 'rain',
      baseFreq: 150,
      harmonic: 1.8,
      waveform: 'sine',
      filter: 'lowpass',
      filterFreq: 800,
      volume: 0.08,
      modulation: 0.3,
    },
    fire: {
      type: 'fire',
      baseFreq: 100,
      harmonic: 2.2,
      waveform: 'sawtooth',
      filter: 'lowpass',
      filterFreq: 600,
      volume: 0.1,
      modulation: 0.5,
    },
    wind: {
      type: 'wind',
      baseFreq: 180,
      harmonic: 1.5,
      waveform: 'triangle',
      filter: 'bandpass',
      filterFreq: 900,
      volume: 0.07,
      modulation: 0.4,
    },
    water: {
      type: 'water',
      baseFreq: 120,
      harmonic: 1.6,
      waveform: 'sine',
      filter: 'lowpass',
      filterFreq: 500,
      volume: 0.09,
      modulation: 0.2,
    },
    forest: {
      type: 'forest',
      baseFreq: 200,
      harmonic: 1.4,
      waveform: 'triangle',
      filter: 'bandpass',
      filterFreq: 700,
      volume: 0.06,
      modulation: 0.15,
    },
    ice: {
      type: 'ice',
      baseFreq: 880,
      harmonic: 2.0,
      waveform: 'sine',
      filter: 'highpass',
      filterFreq: 600,
      volume: 0.05,
      modulation: 0.1,
    },
    mystical: {
      type: 'mystical',
      baseFreq: 440,
      harmonic: 1.618,
      waveform: 'sine',
      filter: 'bandpass',
      filterFreq: 1000,
      volume: 0.07,
      modulation: 0.25,
    },
    cosmic: {
      type: 'cosmic',
      baseFreq: 330,
      harmonic: 1.5,
      waveform: 'sine',
      filter: 'bandpass',
      filterFreq: 800,
      volume: 0.06,
      modulation: 0.2,
    },
    mountain: {
      type: 'mountain',
      baseFreq: 110,
      harmonic: 1.5,
      waveform: 'triangle',
      filter: 'lowpass',
      filterFreq: 600,
      volume: 0.06,
      modulation: 0.15,
    },
    desert: {
      type: 'desert',
      baseFreq: 220,
      harmonic: 1.4,
      waveform: 'sine',
      filter: 'bandpass',
      filterFreq: 900,
      volume: 0.05,
      modulation: 0.2,
    },
    night: {
      type: 'night',
      baseFreq: 165,
      harmonic: 1.6,
      waveform: 'sine',
      filter: 'lowpass',
      filterFreq: 400,
      volume: 0.04,
      modulation: 0.1,
    },
    garden: {
      type: 'garden',
      baseFreq: 349,
      harmonic: 1.5,
      waveform: 'sine',
      filter: 'bandpass',
      filterFreq: 1200,
      volume: 0.06,
      modulation: 0.2,
    },
    ethereal: {
      type: 'ethereal',
      baseFreq: 262,
      harmonic: 1.618,
      waveform: 'sine',
      filter: 'bandpass',
      filterFreq: 1500,
      volume: 0.07,
      modulation: 0.3,
    },
  };
  
  return configs[type] || configs.cosmic;
}

// Generate semantic story
function generateSemanticStory(
  word: string,
  config: typeof SEMANTIC_CATEGORIES[string],
  atmosphere: SemanticWorld['atmosphere']
): string {
  const storyTemplates = [
    `In the ${config.theme.toLowerCase()}, ${config.elements[0]} stretch endlessly. ${config.elements[1]} ${atmosphere.mood === 'mysterious' ? 'whisper secrets' : 'dance freely'} as you enter this realm. ${word.charAt(0).toUpperCase() + word.slice(1)} shapes everything here.`,
    
    `Beneath ${config.elements[2]}, a world of ${word} unfolds. ${config.elements[3]} fill the space, creating a ${atmosphere.mood} atmosphere that invites exploration.`,
    
    `${config.theme} reveals itself: ${config.elements[0]} dominate the landscape while ${config.elements[1]} add depth. This is a place where ${word} defines reality itself.`,
    
    `Welcome to a realm born of ${word}. Here, ${config.elements[4]} ${atmosphere.motion === 'flowing' ? 'flow gracefully' : 'pulse with energy'}, and ${config.elements[0]} ${atmosphere.intensity > 0.6 ? 'command your attention' : 'gently surround you'}.`,
  ];
  
  const templateIndex = word.length % storyTemplates.length;
  return storyTemplates[templateIndex];
}

// Evolve world with new word
export function evolveSemanticWorld(world: SemanticWorld, newWord: string): SemanticWorld {
  // Combine words for compound meaning
  const combinedWord = `${world.word}-${newWord}`;
  const evolved = generateSemanticWorld(newWord, world.id);
  
  // Blend properties for smooth transition
  return {
    ...evolved,
    word: combinedWord,
    story: `${world.story.split('.')[0]}... The world shifts as "${newWord}" reshapes it. ${evolved.story}`,
  };
}
