// AI-powered story generation for worlds
// This service generates creative, playful stories for each world based on emojis and words

interface StoryGenerationOptions {
  word: string;
  emojis: string[];
  category: string;
  isEvolution?: boolean;
  previousWords?: string[];
}

interface AIStoryResponse {
  story: string;
  source: 'ai' | 'fallback';
}

// Configuration
const AI_CONFIG = {
  enabled: true, // Set to false to use only fallback stories
  apiEndpoint: 'https://api.openai.com/v1/chat/completions', // Replace with your AI API
  model: 'gpt-4',
  maxTokens: 150,
  temperature: 0.9, // High creativity
};

/**
 * Generate a playful, creative story using AI
 */
export async function generateAIStory(options: StoryGenerationOptions): Promise<AIStoryResponse> {
  const { word, emojis, category, isEvolution = false, previousWords = [] } = options;
  
  // Check if AI is enabled and API key is available
  const apiKey = localStorage.getItem('openai_api_key') || '';
  
  if (!AI_CONFIG.enabled || !apiKey) {
    return { story: getFallbackStory(options), source: 'fallback' };
  }
  
  try {
    const prompt = buildPrompt(options);
    const response = await fetch(AI_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: 'You are a creative storyteller for a playful world-creation app. Generate SHORT (2-3 sentences max), whimsical, humorous stories that are cartoonish and fun. Stories should be silly, unexpected, and delightful. Use the emojis provided in the story.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: AI_CONFIG.maxTokens,
        temperature: AI_CONFIG.temperature,
      }),
    });
    
    if (!response.ok) {
      throw new Error('AI API request failed');
    }
    
    const data = await response.json();
    const aiStory = data.choices?.[0]?.message?.content?.trim();
    
    if (!aiStory) {
      throw new Error('No story generated');
    }
    
    return { story: aiStory, source: 'ai' };
  } catch (error) {
    console.warn('AI story generation failed, using fallback:', error);
    return { story: getFallbackStory(options), source: 'fallback' };
  }
}

/**
 * Build the AI prompt based on the context
 */
function buildPrompt(options: StoryGenerationOptions): string {
  const { word, emojis, category, isEvolution, previousWords } = options;
  
  const emojiStr = emojis.join('');
  const cleanWord = word.replace(/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu, '').trim() || word;
  
  if (isEvolution && previousWords && previousWords.length > 0) {
    const previousWord = previousWords[previousWords.length - 1];
    return `Create a humorous 2-3 sentence story about a world that just evolved by combining "${previousWord}" with "${cleanWord}". Use these emojis: ${emojiStr}. The world category is "${category}". Make it funny, unexpected, and playful. Focus on how the combination creates something weird and wonderful.`;
  }
  
  return `Create a humorous 2-3 sentence story about a brand new "${category}" world called "${cleanWord}". Use these emojis: ${emojiStr}. Make it silly, whimsical, and full of personality. The world should feel alive and playful.`;
}

/**
 * Get fallback story when AI is unavailable
 * Uses the original template-based stories
 */
function getFallbackStory(options: StoryGenerationOptions): string {
  const { word, emojis, category, isEvolution, previousWords } = options;
  
  const emojiStr = emojis.join('');
  const cleanWord = word.replace(/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu, '').trim() || word;
  const hasEmojis = emojis.length > 0;
  
  if (isEvolution && previousWords && previousWords.length > 0) {
    const previousWord = previousWords[0];
    const evolutionStories = [
      `🌟 EVOLUTION ALERT! ${emojiStr} You just mixed "${previousWord}" with "${cleanWord}"! The result? Pure magnificent chaos! Things are getting WEIRD.`,
      `💥 MASHUP MADNESS! ${emojiStr} "${previousWord}" and "${cleanWord}" have merged! Local inhabitants don't know whether to celebrate or panic. (They're doing both.)`,
      `✨ WORLD FUSION! ${emojiStr} The "${previousWord}" realm just absorbed "${cleanWord}"! It's like peanut butter and jelly, but for dimensions. Chef's kiss!`,
      `🎭 COMBO BREAKER! ${emojiStr} "${previousWord}" + "${cleanWord}" = something nobody expected! The physics engine is confused but excited.`,
      `🔮 TRANSFORMATION! ${emojiStr} You've combined "${previousWord}" and "${cleanWord}"! A wizard nearby just said "I didn't know you could do that!" (You can!)`,
      `🎨 REMIX TIME! ${emojiStr} "${previousWord}" meets "${cleanWord}"! It's like a collaboration nobody asked for but everyone needed. Art!`,
    ];
    
    return evolutionStories[Math.floor(Math.random() * evolutionStories.length)];
  }
  
  // Category-specific stories for new worlds
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
      ? `${e} ROAR! A ${w}-themed dragon realm emerges! Dragons are very confused but excited about "${w}." One is trying to eat it.`
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
  return storyGenerator(cleanWord, emojiStr);
}

/**
 * Generate story synchronously (uses fallback)
 * For components that can't use async
 */
export function generateStorySync(options: StoryGenerationOptions): string {
  return getFallbackStory(options);
}

/**
 * Check if AI is available and configured
 */
export function isAIAvailable(): boolean {
  const apiKey = localStorage.getItem('openai_api_key') || '';
  return AI_CONFIG.enabled && apiKey.length > 0;
}

/**
 * Set AI API key
 */
export function setAIApiKey(apiKey: string): void {
  localStorage.setItem('openai_api_key', apiKey);
}

/**
 * Clear AI API key
 */
export function clearAIApiKey(): void {
  localStorage.removeItem('openai_api_key');
}
