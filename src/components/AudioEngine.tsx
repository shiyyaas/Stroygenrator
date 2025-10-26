import { useEffect, useRef } from 'react';

export type WorldType = 'void' | 'rain' | 'fire' | 'ice' | 'neon' | 'ocean' | 'forest' | 'thunder' | 'cosmic' | 'desert';

interface AudioEngineProps {
  world: WorldType;
  isTyping: boolean;
}

export function AudioEngine({ world, isTyping }: AudioEngineProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const mainOscillatorRef = useRef<OscillatorNode | null>(null);
  const subOscillatorRef = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Update ambient sound based on world
  useEffect(() => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;

    // Clean up previous nodes
    mainOscillatorRef.current?.stop();
    subOscillatorRef.current?.stop();
    noiseNodeRef.current?.stop();

    // Create nodes
    const mainOsc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    gainNodeRef.current = gainNode;
    filterNodeRef.current = filterNode;

    // Configure based on world
    switch (world) {
      case 'rain':
        // Rain: pink noise + low rumble
        mainOsc.type = 'sine';
        mainOsc.frequency.setValueAtTime(80, ctx.currentTime);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(120, ctx.currentTime);
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        break;

      case 'fire':
        // Fire: crackling (brown noise) + warm drone
        mainOsc.type = 'sawtooth';
        mainOsc.frequency.setValueAtTime(110, ctx.currentTime);
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(55, ctx.currentTime);
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(600, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        break;

      case 'ice':
        // Ice: crystalline high tones
        mainOsc.type = 'sine';
        mainOsc.frequency.setValueAtTime(880, ctx.currentTime);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(1320, ctx.currentTime);
        filterNode.type = 'highpass';
        filterNode.frequency.setValueAtTime(400, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
        break;

      case 'neon':
        // Neon: synth pads
        mainOsc.type = 'square';
        mainOsc.frequency.setValueAtTime(220, ctx.currentTime);
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(165, ctx.currentTime);
        filterNode.type = 'bandpass';
        filterNode.frequency.setValueAtTime(1000, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
        break;

      case 'ocean':
        // Ocean: deep waves
        mainOsc.type = 'sine';
        mainOsc.frequency.setValueAtTime(65, ctx.currentTime);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(98, ctx.currentTime);
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(400, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.09, ctx.currentTime);
        break;

      case 'forest':
        // Forest: gentle wind
        mainOsc.type = 'triangle';
        mainOsc.frequency.setValueAtTime(130, ctx.currentTime);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(195, ctx.currentTime);
        filterNode.type = 'bandpass';
        filterNode.frequency.setValueAtTime(600, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
        break;

      case 'thunder':
        // Thunder: rumbling bass
        mainOsc.type = 'sawtooth';
        mainOsc.frequency.setValueAtTime(45, ctx.currentTime);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(90, ctx.currentTime);
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(300, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        break;

      case 'cosmic':
        // Cosmic: ethereal space sounds
        mainOsc.type = 'sine';
        mainOsc.frequency.setValueAtTime(440, ctx.currentTime);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(330, ctx.currentTime);
        filterNode.type = 'bandpass';
        filterNode.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.07, ctx.currentTime);
        break;

      case 'desert':
        // Desert: warm, dry drone
        mainOsc.type = 'triangle';
        mainOsc.frequency.setValueAtTime(150, ctx.currentTime);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(100, ctx.currentTime);
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(500, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
        break;

      case 'void':
      default:
        // Void: soft piano-like tone
        mainOsc.type = 'sine';
        mainOsc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(2000, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
        break;
    }

    // Connect nodes
    mainOsc.connect(filterNode);
    subOsc.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start oscillators
    mainOsc.start();
    subOsc.start();

    mainOscillatorRef.current = mainOsc;
    subOscillatorRef.current = subOsc;

    return () => {
      mainOsc.stop();
      subOsc.stop();
    };
  }, [world]);

  // Typing sound effect
  useEffect(() => {
    if (!isTyping || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Different typing sounds per world
    let freq = 800;
    let type: OscillatorType = 'sine';

    switch (world) {
      case 'rain':
        freq = 600 + Math.random() * 200;
        type = 'sine';
        break;
      case 'fire':
        freq = 400 + Math.random() * 300;
        type = 'triangle';
        break;
      case 'ice':
        freq = 1200 + Math.random() * 400;
        type = 'sine';
        break;
      case 'neon':
        freq = 800 + Math.random() * 600;
        type = 'square';
        break;
      default:
        freq = 700 + Math.random() * 300;
        type = 'sine';
    }

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }, [isTyping, world]);

  return null;
}
