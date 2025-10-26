import { useEffect, useRef, useCallback } from 'react';
import { SemanticWorld } from '../utils/SemanticWorldGenerator';

interface MusicalAudioEngineProps {
  world: SemanticWorld | null;
  isTyping: boolean;
}

export function MusicalAudioEngine({ world, isTyping }: MusicalAudioEngineProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const mainGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const melodyIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const mainGain = audioContextRef.current.createGain();
    mainGain.connect(audioContextRef.current.destination);
    mainGain.gain.setValueAtTime(0.7, audioContextRef.current.currentTime);
    mainGainRef.current = mainGain;

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Create noise buffer
  const createNoiseBuffer = useCallback((ctx: AudioContext, type: 'white' | 'pink'): AudioBuffer => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }
    }
    
    return buffer;
  }, []);

  // Play a musical note
  const playNote = useCallback((frequency: number, duration: number, volume: number = 0.15) => {
    if (!audioContextRef.current || !mainGainRef.current || !world) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = world.sound.waveform;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);

    // ADSR envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05); // Attack
    gain.gain.linearRampToValueAtTime(volume * 0.7, ctx.currentTime + 0.15); // Decay
    gain.gain.setValueAtTime(volume * 0.7, ctx.currentTime + duration - 0.1); // Sustain
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration); // Release

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(mainGainRef.current);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }, [world]);

  // Musical scales and melodies
  const getMelodyForWorld = useCallback((soundType: string): number[] => {
    const melodies: Record<string, number[]> = {
      forest: [261.63, 293.66, 329.63, 392.00, 440.00], // C major pentatonic
      fire: [293.66, 329.63, 392.00, 466.16, 523.25], // D minor scale
      water: [220.00, 246.94, 277.18, 329.63, 369.99], // A minor pentatonic
      rain: [196.00, 220.00, 246.94, 293.66, 329.63], // G minor scale
      wind: [246.94, 293.66, 329.63, 369.99, 415.30], // B minor pentatonic
      ice: [523.25, 587.33, 659.25, 783.99, 880.00], // C major high octave
      mystical: [277.18, 329.63, 369.99, 440.00, 493.88], // C# minor pentatonic
      mountain: [196.00, 220.00, 261.63, 293.66, 329.63], // Low G major
      desert: [220.00, 261.63, 293.66, 349.23, 392.00], // A major pentatonic
      night: [164.81, 185.00, 207.65, 246.94, 277.18], // E minor low
      garden: [349.23, 392.00, 440.00, 493.88, 554.37], // F major pentatonic
      ethereal: [261.63, 311.13, 349.23, 415.30, 466.16], // C major ethereal
      cosmic: [130.81, 146.83, 164.81, 185.00, 207.65], // Deep space tones
    };

    return melodies[soundType] || melodies.cosmic;
  }, []);

  // Main soundscape engine
  useEffect(() => {
    if (!audioContextRef.current || !mainGainRef.current || !world) return;

    const ctx = audioContextRef.current;
    const mainGain = mainGainRef.current;

    // Clean up previous
    oscillatorsRef.current.forEach(osc => osc.stop());
    noiseNodeRef.current?.stop();
    if (melodyIntervalRef.current) clearInterval(melodyIntervalRef.current);
    oscillatorsRef.current = [];

    // Ambient layer based on world type
    if (world.sound.type === 'rain' || world.sound.type === 'wind' || world.sound.type === 'fire') {
      // Nature sounds: use filtered noise
      const noise = ctx.createBufferSource();
      noise.buffer = createNoiseBuffer(ctx, 'pink');
      noise.loop = true;
      
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      
      if (world.sound.type === 'rain') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
      } else if (world.sound.type === 'wind') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        
        // Modulate wind sound
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.3, ctx.currentTime);
        lfoGain.gain.setValueAtTime(300, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        oscillatorsRef.current.push(lfo);
      } else if (world.sound.type === 'fire') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
      }
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(mainGain);
      noise.start();
      noiseNodeRef.current = noise;
    }

    // Musical layer: ambient drone
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(world.sound.baseFreq * 0.5, ctx.currentTime);
    bassGain.gain.setValueAtTime(0.04, ctx.currentTime);
    bass.connect(bassGain);
    bassGain.connect(mainGain);
    bass.start();
    oscillatorsRef.current.push(bass);

    // Harmonic pad
    const pad = ctx.createOscillator();
    const padGain = ctx.createGain();
    const padFilter = ctx.createBiquadFilter();
    pad.type = world.sound.waveform;
    pad.frequency.setValueAtTime(world.sound.baseFreq, ctx.currentTime);
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(800, ctx.currentTime);
    padGain.gain.setValueAtTime(0.03, ctx.currentTime);
    pad.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(mainGain);
    pad.start();
    oscillatorsRef.current.push(pad);

    // Melodic layer (plays periodically)
    const melody = getMelodyForWorld(world.sound.type);
    let melodyIndex = 0;
    
    const playMelodyNote = () => {
      const note = melody[melodyIndex % melody.length];
      const duration = world.atmosphere.motion === 'calm' ? 2 : 1.5;
      playNote(note, duration, 0.08);
      melodyIndex++;
    };

    // Start melody
    playMelodyNote();
    const melodyInterval = setInterval(playMelodyNote, 
      world.atmosphere.motion === 'calm' ? 3000 : 2000
    );
    melodyIntervalRef.current = melodyInterval;

    return () => {
      oscillatorsRef.current.forEach(osc => osc.stop());
      noiseNodeRef.current?.stop();
      if (melodyIntervalRef.current) clearInterval(melodyIntervalRef.current);
    };
  }, [world, createNoiseBuffer, getMelodyForWorld, playNote]);

  // Typing sound effect
  useEffect(() => {
    if (!isTyping || !audioContextRef.current || !world || !mainGainRef.current) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const typingFreq = world.sound.baseFreq * (0.8 + Math.random() * 0.4);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(typingFreq, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(mainGainRef.current);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, [isTyping, world]);

  return null;
}
