import { useEffect, useRef } from 'react';
import { SemanticWorld } from '../utils/SemanticWorldGenerator';

interface SemanticAudioEngineProps {
  world: SemanticWorld | null;
  isTyping: boolean;
}

export function SemanticAudioEngine({ world, isTyping }: SemanticAudioEngineProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Create noise buffer for rain/wind/fire effects
  const createNoiseBuffer = (ctx: AudioContext, type: 'white' | 'pink' | 'brown'): AudioBuffer => {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
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
  };

  // Update ambient soundscape based on world
  useEffect(() => {
    if (!audioContextRef.current || !world) return;

    const ctx = audioContextRef.current;

    // Clean up previous nodes
    oscillatorsRef.current.forEach(osc => osc.stop());
    noiseNodeRef.current?.stop();
    oscillatorsRef.current = [];

    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();
    
    gainNodeRef.current = gainNode;
    filterNodeRef.current = filterNode;

    // Realistic sound design based on world type
    if (world.sound.type === 'rain') {
      // Rain: filtered pink noise
      const noise = ctx.createBufferSource();
      noise.buffer = createNoiseBuffer(ctx, 'pink');
      noise.loop = true;
      
      filterNode.type = 'bandpass';
      filterNode.frequency.setValueAtTime(800, ctx.currentTime);
      filterNode.Q.setValueAtTime(1, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1);
      
      noise.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noise.start();
      noiseNodeRef.current = noise;
      
    } else if (world.sound.type === 'fire') {
      // Fire: crackling noise + warm drone
      const noise = ctx.createBufferSource();
      noise.buffer = createNoiseBuffer(ctx, 'pink');
      noise.loop = true;
      
      const drone = ctx.createOscillator();
      drone.type = 'sawtooth';
      drone.frequency.setValueAtTime(110, ctx.currentTime);
      
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(600, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1);
      
      noise.connect(filterNode);
      drone.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noise.start();
      drone.start();
      
      oscillatorsRef.current.push(drone);
      noiseNodeRef.current = noise;
      
    } else if (world.sound.type === 'wind') {
      // Wind: modulated filtered noise
      const noise = ctx.createBufferSource();
      noise.buffer = createNoiseBuffer(ctx, 'white');
      noise.loop = true;
      
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
      lfoGain.gain.setValueAtTime(400, ctx.currentTime);
      
      filterNode.type = 'bandpass';
      filterNode.frequency.setValueAtTime(900, ctx.currentTime);
      filterNode.Q.setValueAtTime(2, ctx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(filterNode.frequency);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1);
      
      noise.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      noise.start();
      lfo.start();
      
      noiseNodeRef.current = noise;
      lfoRef.current = lfo;
      
    } else if (world.sound.type === 'water') {
      // Water: deep waves with gentle movement
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(80, ctx.currentTime);
      osc2.frequency.setValueAtTime(120, ctx.currentTime);
      
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      lfoGain.gain.setValueAtTime(10, ctx.currentTime);
      
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(500, ctx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 2);
      
      osc1.connect(filterNode);
      osc2.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      lfo.start();
      
      oscillatorsRef.current.push(osc1, osc2);
      lfoRef.current = lfo;
      
    } else {
      // Default: harmonic tones
      const mainOsc = ctx.createOscillator();
      const harmonicOsc = ctx.createOscillator();
      
      mainOsc.type = world.sound.waveform;
      mainOsc.frequency.setValueAtTime(world.sound.baseFreq, ctx.currentTime);
      
      harmonicOsc.type = 'sine';
      harmonicOsc.frequency.setValueAtTime(world.sound.baseFreq * world.sound.harmonic, ctx.currentTime);
      
      filterNode.type = world.sound.filter;
      filterNode.frequency.setValueAtTime(world.sound.filterFreq, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(world.sound.volume, ctx.currentTime + 2);
      
      mainOsc.connect(filterNode);
      harmonicOsc.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      mainOsc.start();
      harmonicOsc.start();
      
      oscillatorsRef.current.push(mainOsc, harmonicOsc);
    }

    return () => {
      oscillatorsRef.current.forEach(osc => osc.stop());
      noiseNodeRef.current?.stop();
      lfoRef.current?.stop();
    };
  }, [world]);

  // Typing sound effect
  useEffect(() => {
    if (!isTyping || !audioContextRef.current || !world) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Typing sound harmonizes with world
    const typingFreq = world.sound.baseFreq * (0.8 + Math.random() * 0.4);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(typingFreq, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, [isTyping, world]);

  return null;
}
