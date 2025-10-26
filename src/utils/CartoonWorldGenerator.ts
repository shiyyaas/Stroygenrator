// Emoji-based world generation - type emojis to create worlds!
import { generateStorySync } from './AIStoryGenerator';

export interface CartoonWorld {
  id: string;
  word: string;
  emojis: string[]; // All emojis in this world
  category: string;
  theme: string;
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
    direction: 'up' | 'down' | 'horizontal' | 'radial' | 'chaotic' | 'swirling' | 'bouncing';
    opacity: { min: number; max: number };
    shape: 'circle' | 'square' | 'star' | 'heart' | 'blob';
    color: string;
    emoji?: string;
  };
  sound: {
    type: string;
    playful: boolean;
    pitch: number;
    rhythm: 'bouncy' | 'smooth' | 'chaotic' | 'steady';
  };
  creatures: {
    types: string[];
    behaviors: string[];
    emoji: string;
  };
  atmosphere: {
    mood: string;
    energy: 'hyper' | 'chill' | 'silly' | 'chaotic';
    lighting: 'bright' | 'colorful' | 'sparkly' | 'glowy';
  };
  story: string;
}

// Emoji to category mapping - type these emojis directly!
const EMOJI_MAP: Record<string, { category: string; keywords: string[] }> = {
  // Nature & Plants
  '🌳': { category: 'forest', keywords: ['tree', 'trees', 'forest', 'woods'] },
  '🌲': { category: 'forest', keywords: ['pine', 'evergreen', 'forest'] },
  '🌴': { category: 'forest', keywords: ['palm', 'tropical', 'island'] },
  '🌱': { category: 'forest', keywords: ['plant', 'sprout', 'grow'] },
  '🍃': { category: 'forest', keywords: ['leaf', 'leaves', 'wind'] },
  '🌿': { category: 'forest', keywords: ['herb', 'green', 'nature'] },
  '🌾': { category: 'forest', keywords: ['grain', 'wheat', 'crop'] },
  
  // Flowers
  '🌸': { category: 'flower', keywords: ['flower', 'blossom', 'cherry'] },
  '🌺': { category: 'flower', keywords: ['hibiscus', 'tropical', 'flower'] },
  '🌻': { category: 'flower', keywords: ['sunflower', 'sun', 'yellow'] },
  '🌷': { category: 'flower', keywords: ['tulip', 'spring', 'flower'] },
  '🌹': { category: 'flower', keywords: ['rose', 'red', 'love'] },
  '💐': { category: 'flower', keywords: ['bouquet', 'flowers', 'gift'] },
  '🏵️': { category: 'flower', keywords: ['rosette', 'flower', 'prize'] },
  
  // Fire & Heat
  '🔥': { category: 'fire', keywords: ['fire', 'flame', 'burn', 'hot'] },
  '💥': { category: 'fire', keywords: ['explosion', 'boom', 'blast'] },
  '⚡': { category: 'fire', keywords: ['lightning', 'electric', 'power'] },
  '🌋': { category: 'fire', keywords: ['volcano', 'lava', 'eruption'] },
  '☄️': { category: 'fire', keywords: ['comet', 'meteor', 'shooting'] },
  
  // Water & Ocean
  '🌊': { category: 'water', keywords: ['wave', 'ocean', 'sea', 'water'] },
  '💧': { category: 'water', keywords: ['drop', 'water', 'liquid'] },
  '💦': { category: 'water', keywords: ['splash', 'sweat', 'water'] },
  '🌀': { category: 'water', keywords: ['cyclone', 'whirl', 'spiral'] },
  '🏖️': { category: 'water', keywords: ['beach', 'sand', 'ocean'] },
  '🏝️': { category: 'water', keywords: ['island', 'tropical', 'beach'] },
  '🐠': { category: 'water', keywords: ['fish', 'tropical', 'ocean'] },
  '🐟': { category: 'water', keywords: ['fish', 'sea', 'water'] },
  '🐡': { category: 'water', keywords: ['blowfish', 'puffer', 'ocean'] },
  '🐬': { category: 'water', keywords: ['dolphin', 'ocean', 'smart'] },
  '🐳': { category: 'water', keywords: ['whale', 'ocean', 'big'] },
  '🐋': { category: 'water', keywords: ['whale', 'ocean', 'huge'] },
  '🦈': { category: 'water', keywords: ['shark', 'ocean', 'predator'] },
  '🐙': { category: 'water', keywords: ['octopus', 'tentacle', 'ocean'] },
  
  // Rain & Weather
  '🌧️': { category: 'rain', keywords: ['rain', 'rainy', 'weather', 'wet'] },
  '⛈️': { category: 'rain', keywords: ['storm', 'thunder', 'lightning'] },
  '🌩️': { category: 'rain', keywords: ['lightning', 'cloud', 'storm'] },
  '💨': { category: 'cloud', keywords: ['wind', 'blow', 'air'] },
  
  // Ice & Snow
  '❄️': { category: 'ice', keywords: ['snow', 'ice', 'cold', 'winter'] },
  '⛄': { category: 'ice', keywords: ['snowman', 'winter', 'snow'] },
  '☃️': { category: 'ice', keywords: ['snowman', 'winter', 'cold'] },
  '🧊': { category: 'ice', keywords: ['ice', 'cube', 'cold'] },
  
  // Sky & Clouds
  '☁️': { category: 'cloud', keywords: ['cloud', 'sky', 'weather'] },
  '⛅': { category: 'cloud', keywords: ['cloud', 'sun', 'partly'] },
  '🌤️': { category: 'cloud', keywords: ['sun', 'cloud', 'weather'] },
  '🌥️': { category: 'cloud', keywords: ['cloud', 'sun', 'behind'] },
  '🌦️': { category: 'cloud', keywords: ['rain', 'sun', 'shower'] },
  
  // Night & Space
  '🌙': { category: 'night', keywords: ['moon', 'night', 'crescent'] },
  '🌛': { category: 'night', keywords: ['moon', 'night', 'quarter'] },
  '🌜': { category: 'night', keywords: ['moon', 'night', 'last'] },
  '🌚': { category: 'night', keywords: ['moon', 'dark', 'new'] },
  '🌕': { category: 'night', keywords: ['moon', 'full', 'night'] },
  '🌖': { category: 'night', keywords: ['moon', 'waning', 'night'] },
  '🌗': { category: 'night', keywords: ['moon', 'quarter', 'night'] },
  '🌘': { category: 'night', keywords: ['moon', 'crescent', 'night'] },
  '⭐': { category: 'space', keywords: ['star', 'night', 'bright'] },
  '🌟': { category: 'space', keywords: ['star', 'sparkle', 'glow'] },
  '✨': { category: 'magic', keywords: ['sparkle', 'magic', 'shine'] },
  '💫': { category: 'space', keywords: ['dizzy', 'star', 'sparkle'] },
  '🌠': { category: 'space', keywords: ['shooting', 'star', 'wish'] },
  '🪐': { category: 'space', keywords: ['saturn', 'planet', 'ring'] },
  '🌌': { category: 'space', keywords: ['galaxy', 'milky', 'space'] },
  '🌍': { category: 'space', keywords: ['earth', 'world', 'planet'] },
  '🌎': { category: 'space', keywords: ['earth', 'americas', 'planet'] },
  '🌏': { category: 'space', keywords: ['earth', 'asia', 'planet'] },
  '🚀': { category: 'space', keywords: ['rocket', 'space', 'launch'] },
  '🛸': { category: 'space', keywords: ['ufo', 'alien', 'space'] },
  '👽': { category: 'space', keywords: ['alien', 'extraterrestrial', 'space'] },
  
  // Dragons & Fantasy
  '🐉': { category: 'dragon', keywords: ['dragon', 'chinese', 'mythical'] },
  '🐲': { category: 'dragon', keywords: ['dragon', 'face', 'mythical'] },
  '🦕': { category: 'dragon', keywords: ['dinosaur', 'sauropod', 'ancient'] },
  '🦖': { category: 'dragon', keywords: ['trex', 'dinosaur', 'ancient'] },
  
  // Magic & Fantasy
  '🔮': { category: 'magic', keywords: ['crystal', 'ball', 'fortune'] },
  '🪄': { category: 'magic', keywords: ['wand', 'magic', 'spell'] },
  '✨': { category: 'magic', keywords: ['sparkles', 'magic', 'shine'] },
  '⚗️': { category: 'magic', keywords: ['alembic', 'potion', 'chemistry'] },
  '🧙': { category: 'magic', keywords: ['wizard', 'mage', 'magic'] },
  '🧚': { category: 'magic', keywords: ['fairy', 'magic', 'pixie'] },
  '🦄': { category: 'magic', keywords: ['unicorn', 'magic', 'rainbow'] },
  '🌈': { category: 'magic', keywords: ['rainbow', 'color', 'arc'] },
  
  // Desert
  '🏜️': { category: 'desert', keywords: ['desert', 'sand', 'dry'] },
  '🌵': { category: 'desert', keywords: ['cactus', 'desert', 'plant'] },
  '🐪': { category: 'desert', keywords: ['camel', 'desert', 'hump'] },
  '🦎': { category: 'desert', keywords: ['lizard', 'reptile', 'desert'] },
  
  // Mountain
  '⛰️': { category: 'mountain', keywords: ['mountain', 'peak', 'high'] },
  '🏔️': { category: 'mountain', keywords: ['mountain', 'snow', 'peak'] },
  '🗻': { category: 'mountain', keywords: ['fuji', 'mountain', 'japan'] },
  '🪨': { category: 'mountain', keywords: ['rock', 'stone', 'boulder'] },
  
  // Animals
  '🦋': { category: 'flower', keywords: ['butterfly', 'insect', 'pretty'] },
  '🐝': { category: 'flower', keywords: ['bee', 'honey', 'buzz'] },
  '🐛': { category: 'flower', keywords: ['bug', 'caterpillar', 'insect'] },
  '🦅': { category: 'mountain', keywords: ['eagle', 'bird', 'fly'] },
  '🦉': { category: 'night', keywords: ['owl', 'night', 'wise'] },
  '🦇': { category: 'night', keywords: ['bat', 'vampire', 'night'] },
  '🐺': { category: 'night', keywords: ['wolf', 'howl', 'night'] },
  '🦊': { category: 'forest', keywords: ['fox', 'clever', 'forest'] },
  '🐻': { category: 'forest', keywords: ['bear', 'big', 'forest'] },
  '🦌': { category: 'forest', keywords: ['deer', 'forest', 'antler'] },
  '🐿️': { category: 'forest', keywords: ['squirrel', 'nut', 'tree'] },
  '🦔': { category: 'forest', keywords: ['hedgehog', 'spike', 'cute'] },
  '🐧': { category: 'ice', keywords: ['penguin', 'ice', 'cold'] },
  '🦭': { category: 'ice', keywords: ['seal', 'ice', 'arctic'] },
  '🐋': { category: 'water', keywords: ['whale', 'ocean', 'big'] },
};

// Category configurations
const CARTOON_CATEGORIES: Record<string, {
  theme: string;
  colors: string[];
  emoji: string;
}> = {
  forest: {
    theme: 'Giggly Forest',
    colors: ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'],
    emoji: '🌳',
  },
  fire: {
    theme: 'Toasty Flame Zone',
    colors: ['#f97316', '#ea580c', '#fb923c', '#fdba74', '#fed7aa'],
    emoji: '🔥',
  },
  water: {
    theme: 'Splashy Splash Zone',
    colors: ['#0ea5e9', '#0284c7', '#38bdf8', '#7dd3fc', '#bae6fd'],
    emoji: '🌊',
  },
  dragon: {
    theme: 'Dragon Daycare',
    colors: ['#a855f7', '#9333ea', '#c084fc', '#d8b4fe', '#e9d5ff'],
    emoji: '🐉',
  },
  rain: {
    theme: 'Puddle Jump Paradise',
    colors: ['#3b82f6', '#2563eb', '#60a5fa', '#93c5fd', '#bfdbfe'],
    emoji: '🌧️',
  },
  ice: {
    theme: 'Snowball Fight Stadium',
    colors: ['#7dd3fc', '#38bdf8', '#bae6fd', '#e0f2fe', '#f0f9ff'],
    emoji: '❄️',
  },
  night: {
    theme: 'Sleepover Sky',
    colors: ['#6366f1', '#4f46e5', '#818cf8', '#a5b4fc', '#c7d2fe'],
    emoji: '🌙',
  },
  flower: {
    theme: 'Petal Party Garden',
    colors: ['#f43f5e', '#e11d48', '#fb7185', '#fda4af', '#fecdd3'],
    emoji: '🌸',
  },
  magic: {
    theme: 'Oops All Magic',
    colors: ['#d946ef', '#c026d3', '#e879f9', '#f0abfc', '#f5d0fe'],
    emoji: '✨',
  },
  space: {
    theme: 'Cosmic Playground',
    colors: ['#8b5cf6', '#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe'],
    emoji: '🌟',
  },
  cloud: {
    theme: 'Cloud Castle Chaos',
    colors: ['#bfdbfe', '#93c5fd', '#dbeafe', '#eff6ff', '#ffffff'],
    emoji: '☁️',
  },
  desert: {
    theme: 'Sandy Slide Paradise',
    colors: ['#fed7aa', '#fdba74', '#fef3c7', '#fef9c3', '#fefce8'],
    emoji: '🏜️',
  },
  mountain: {
    theme: 'Peak Performance Zone',
    colors: ['#94a3b8', '#64748b', '#cbd5e1', '#e2e8f0', '#f1f5f9'],
    emoji: '⛰️',
  },
};

// Extract emojis from text
function extractEmojis(text: string): string[] {
  const emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu;
  return [...new Set((text.match(emojiRegex) || []))];
}

// Find category from word or emojis
function findCategory(word: string): { category: string; emojis: string[] } {
  const emojis = extractEmojis(word);
  
  // Check if any emoji directly maps to a category
  for (const emoji of emojis) {
    if (EMOJI_MAP[emoji]) {
      return { category: EMOJI_MAP[emoji].category, emojis };
    }
  }
  
  // Check keywords
  const lowercaseWord = word.toLowerCase().trim();
  for (const [emoji, config] of Object.entries(EMOJI_MAP)) {
    if (config.keywords.some(keyword => lowercaseWord.includes(keyword))) {
      return { category: config.category, emojis: [emoji, ...emojis] };
    }
  }
  
  return { category: 'space', emojis: emojis.length > 0 ? emojis : ['🌟'] };
}

// Generate story from word and emojis (now uses AI!)
function generateStoryFromWord(word: string, emojis: string[], category: string): string {
  // Use AI story generation (falls back to templates if AI unavailable)
  return generateStorySync({
    word,
    emojis,
    category,
    isEvolution: false,
  });
  
  /* Original template code kept below for reference
  const emojiStr = emojis.join('');
  const cleanWord = word.toLowerCase().trim();
  
  // Extract just emojis from the word if it contains any
  const wordEmojis = extractEmojis(word);
  const hasEmojis = wordEmojis.length > 0;
  
  // Get text portion (remove emojis)
  const textOnly = word.replace(/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu, '').trim();
  
  // Create personalized stories based on what they typed
  const stories: Record<string, (w: string, e: string) => string> = {
    forest: (w, e) => hasEmojis 
      ? `${e} Behold! A ${w} world springs to life! Trees are gossiping about your creation. One just said "Nice choice!" 🌳`
      : `Welcome to the ${w.toUpperCase()} realm ${e}! Trees here identify as "${w}" and take it very seriously. They host weekly ${w} appreciation meetings.`,
    
    fire: (w, e) => hasEmojis
      ? `${e} WHOOSH! Your ${w} world ignites! The flames are spelling out "${w}" in the sky. Very show-off-y.`
      : `${e} A blazing ${w.toUpperCase()} dimension materializes! Everything is on fire (in a good way). Local fire sprites just named their band "${w}."`,
    
    water: (w, e) => hasEmojis
      ? `${e} SPLASH! Your ${w} ocean appears! The waves are chanting "${w}! ${w}! ${w}!" This is getting weird.`
      : `${e} Dive into the ${w.toUpperCase()} seas! Fish here only respond to the word "${w}." Try it! Also, they've formed a ${w} appreciation society.`,
    
    dragon: (w, e) => hasEmojis
      ? `${e} ROAR! A ${w}-themed dragon realm emerges! Dragons are very confused but excited about "${w}."  One is trying to eat it.`
      : `${e} The legendary ${w.toUpperCase()} Dragon Kingdom rises! Every dragon here is named "${w}" (it gets confusing at parties). They hoard ${w}-related treasures.`,
    
    rain: (w, e) => hasEmojis
      ? `${e} PITTER-PATTER! Your ${w} rainscape cascades into existence! Each raindrop whispers "${w}" as it falls. Poetic!`
      : `${e} The ${w.toUpperCase()} Rain Realm descends! Clouds are 3D-printing ${w} out of raindrops. Physics no longer applies here.`,
    
    ice: (w, e) => hasEmojis
      ? `${e} FROSTY! A ${w} winter wonderland freezes into place! Snowflakes are forming the shape of "${w}." They practiced for weeks.`
      : `${e} The ${w.toUpperCase()} Ice Kingdom crystallizes! Everything is frozen in the shape of ${w}. Penguins are sliding around chanting "${w}! ${w}!"`,
    
    night: (w, e) => hasEmojis
      ? `${e} The ${w} night awakens! Stars have arranged themselves to spell "${w}." The moon is taking credit for it.`
      : `${e} Enter the ${w.toUpperCase()} Night! The moon just renamed itself "Moon ${w}" and all the stars are "${w} Jr." They're very committed.`,
    
    flower: (w, e) => hasEmojis
      ? `${e} BLOOM! A ${w} garden explodes into color! Flowers are arguing whether "${w}" is a good name for their band. (It is.)`
      : `${e} The ${w.toUpperCase()} Garden flourishes! Every flower blooms in the pattern of "${w}." Butterflies are using it as their dance floor.`,
    
    magic: (w, e) => hasEmojis
      ? `${e} ABRACADABRA ${w.toUpperCase()}! A magical ${w} dimension appears! A wizard tried to say "${w}" as a spell. It worked TOO well.`
      : `${e} The Mystical ${w.toUpperCase()} Realm materializes! Magic wands only work if you yell "${w}!" first. Yes, ALL spells. It's chaos.`,
    
    space: (w, e) => hasEmojis
      ? `${e} BLAST OFF! A cosmic ${w} universe expands! Aliens just discovered "${w}" and they're OBSESSED. It's their new meme.`
      : `${e} The ${w.toUpperCase()} Galaxy spirals into existence! A planet named "${w}" orbits a star named "Also ${w}." Aliens are very creative here.`,
    
    cloud: (w, e) => hasEmojis
      ? `${e} FLUFFY! A ${w} cloudscape drifts in! Sky whales are skywriting "${w}" with their blowholes. Majestic!`
      : `${e} The ${w.toUpperCase()} Nimbus Realm floats to life! Clouds have formed into the shape of ${w}. Wind currents keep whispering the name.`,
    
    desert: (w, e) => hasEmojis
      ? `${e} SANDY! A ${w} desert manifests! Sand dunes have shifted into the pattern of "${w}." A tumbleweed just nodded approvingly.`
      : `${e} The ${w.toUpperCase()} Sands stretch out! Cacti are spelling "${w}" with their arms. Tumbleweeds are having a ${w}-themed party. You're invited!`,
    
    mountain: (w, e) => hasEmojis
      ? `${e} PEAK! A ${w} mountain range erupts skyward! Peaks have arranged themselves to spell "${w}." Mountain goats are impressed.`
      : `${e} The ${w.toUpperCase()} Peaks rise! The tallest mountain renamed itself "Mount ${w}." Eagles keep screeching the word. It echoes dramatically.`,
  };
  
  const storyGenerator = stories[category] || stories.space;
  return storyGenerator(textOnly || word, emojiStr);
  */
}

// Generate world
export function generateCartoonWorld(word: string, id: string): CartoonWorld {
  const { category, emojis } = findCategory(word);
  const config = CARTOON_CATEGORIES[category];
  
  const seed = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = () => {
    const x = Math.sin(seed * Math.random()) * 10000;
    return x - Math.floor(x);
  };
  
  const colors = {
    primary: config.colors[0],
    secondary: config.colors[1],
    accent: config.colors[2],
    background: config.colors[3],
    glow: config.colors[4],
  };
  
  const particles = {
    count: 60 + Math.floor(random() * 40),
    size: { min: 8, max: 20 },
    speed: { min: 0.5, max: 3 },
    direction: (category === 'fire' ? 'up' :
                category === 'rain' ? 'down' :
                category === 'water' ? 'swirling' :
                'bouncing') as any,
    opacity: { min: 0.6, max: 1 },
    shape: 'blob' as const,
    color: colors.accent,
    emoji: emojis[0] || config.emoji,
  };
  
  const sound = {
    type: category,
    playful: true,
    pitch: 1.2 + random() * 0.8,
    rhythm: (random() > 0.5 ? 'bouncy' : random() > 0.25 ? 'chaotic' : 'smooth') as any,
  };
  
  const creatures = {
    types: [`${emojis[0] || config.emoji} beings`],
    behaviors: ['having fun', 'causing chaos', 'being adorable'],
    emoji: emojis[0] || config.emoji,
  };
  
  const atmosphere = {
    mood: config.theme,
    energy: (category === 'fire' || category === 'magic' ? 'chaotic' :
             category === 'night' ? 'chill' :
             'silly') as any,
    lighting: (category === 'night' ? 'glowy' :
               category === 'magic' ? 'sparkly' :
               'colorful') as any,
  };
  
  const story = generateStoryFromWord(word, emojis, category);
  
  return {
    id,
    word,
    emojis,
    category,
    theme: config.theme,
    colors,
    particles,
    sound,
    creatures,
    atmosphere,
    story,
  };
}

// Evolve world with new emojis
export function evolveCartoonWorld(world: CartoonWorld, newWord: string): CartoonWorld {
  const { emojis: newEmojis } = findCategory(newWord);
  const allEmojis = [...world.emojis, ...newEmojis];
  
  // Find dominant category
  let categoryVotes: Record<string, number> = {};
  for (const emoji of allEmojis) {
    if (EMOJI_MAP[emoji]) {
      const cat = EMOJI_MAP[emoji].category;
      categoryVotes[cat] = (categoryVotes[cat] || 0) + 1;
    }
  }
  
  const dominantCategory = Object.entries(categoryVotes).sort((a, b) => b[1] - a[1])[0]?.[0] || world.category;
  
  const mashupWord = `${world.word}+${newWord}`;
  const config = CARTOON_CATEGORIES[dominantCategory];
  
  // Evolved story based on word combination (now uses AI!)
  const previousWords = world.word.split('+');
  const evolvedStory = generateStorySync({
    word: newWord,
    emojis: allEmojis,
    category: dominantCategory,
    isEvolution: true,
    previousWords,
  });
  
  const creatures = {
    types: [`${allEmojis.slice(0, 3).join('')} creatures`],
    behaviors: ['adapting', 'evolving', 'partying'],
    emoji: allEmojis.join(''),
  };
  
  return {
    ...world,
    word: mashupWord,
    emojis: allEmojis,
    category: dominantCategory,
    creatures,
    story: evolvedStory,
    colors: {
      primary: world.colors.primary,
      secondary: config.colors[1],
      accent: config.colors[2],
      background: world.colors.background,
      glow: config.colors[4],
    },
  };
}
