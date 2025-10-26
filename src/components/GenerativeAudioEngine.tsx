import { useEffect, useRef } from 'react';
import { GeneratedWorld } from '../utils/WorldGenerator';

interface GenerativeAudioEngineProps {
  world: GeneratedWorld | null;
  isTyping: boolean;
}

export function GenerativeAudioEngine({ world, isTyping }: GenerativeAudioEngineProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Update ambient soundscape based on world
  useEffect(() => {
    if (!audioContextRef.current || !world) return;

    const ctx = audioContextRef.current;

    // Clean up previous nodes
    oscillatorsRef.current.forEach(osc => osc.stop());
    lfoRef.current?.stop();
    oscillatorsRef.current = [];

    // Create audio graph
    const mainOsc = ctx.createOscillator();
    const harmonicOsc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    gainNodeRef.current = gainNode;
    filterNodeRef.current = filterNode;
    lfoRef.current = lfo;
    lfoGainRef.current = lfoGain;

    // Configure oscillators from world parameters
    mainOsc.type = world.sound.waveform;
    mainOsc.frequency.setValueAtTime(world.sound.baseFreq, ctx.currentTime);

    harmonicOsc.type = world.sound.waveform === 'sine' ? 'triangle' : 'sine';
    harmonicOsc.frequency.setValueAtTime(world.sound.baseFreq * world.sound.harmonic, ctx.currentTime);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(world.sound.baseFreq * 0.5, ctx.currentTime);

    // Configure filter
    filterNode.type = world.sound.filter;
    filterNode.frequency.setValueAtTime(world.sound.filterFreq, ctx.currentTime);
    filterNode.Q.setValueAtTime(2, ctx.currentTime);

    // Configure LFO for modulation
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(world.sound.modulation, ctx.currentTime);
    lfoGain.gain.setValueAtTime(world.sound.filterFreq * 0.3, ctx.currentTime);

    // Connect LFO to filter frequency
    lfo.connect(lfoGain);
    lfoGain.connect(filterNode.frequency);

    // Configure gain based on intensity
    const volume = world.sound.volume * (0.5 + world.atmosphere.intensity * 0.5);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2);

    // Add subtle motion based on atmosphere
    if (world.atmosphere.motion === 'pulsing') {
      gainNode.gain.setValueAtTime(volume * 0.7, ctx.currentTime + 2);
      const pulseSpeed = 3;
      setInterval(() => {
        if (gainNode.gain.value) {
          gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + pulseSpeed / 2);
          gainNode.gain.linearRampToValueAtTime(volume * 0.7, ctx.currentTime + pulseSpeed);
        }
      }, pulseSpeed * 1000);
    }

    // Connect nodes
    mainOsc.connect(filterNode);
    harmonicOsc.connect(filterNode);
    subOsc.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start oscillators and LFO
    mainOsc.start();
    harmonicOsc.start();
    subOsc.start();
    lfo.start();

    oscillatorsRef.current = [mainOsc, harmonicOsc, subOsc];

    return () => {
      mainOsc.stop();
      harmonicOsc.stop();
      subOsc.stop();
      lfo.stop();
    };
  }, [world]);

  // Typing sound effect - compositional, tied to world
  useEffect(() => {
    if (!isTyping || !audioContextRef.current || !world) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Typing sound is harmonic to the world's base frequency
    const typingFreq = world.sound.baseFreq * (1 + Math.random() * 0.5);
    
    osc.type = world.sound.waveform === 'square' ? 'square' : 'sine';
    osc.frequency.setValueAtTime(typingFreq, ctx.currentTime);

    // Envelope
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }, [isTyping, world]);

  return null;
}
