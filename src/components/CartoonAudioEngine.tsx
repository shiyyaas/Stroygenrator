import { useEffect, useRef, useState } from 'react';
import { CartoonWorld } from '../utils/CartoonWorldGenerator';

interface CartoonAudioEngineProps {
  world: CartoonWorld | null;
  isTyping: boolean;
  masterVolume: number;
  onVolumeChange?: (volume: number) => void;
}

export function CartoonAudioEngine({ world, isTyping, masterVolume, onVolumeChange }: CartoonAudioEngineProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Initialize Web Audio API
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!world || !audioContextRef.current) return;

    const ctx = audioContextRef.current;

    // Stop previous sound
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
    }

    // Create new sound based on world
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;

    // Configure based on world sound type
    const baseFreq = getFrequencyForCategory(world.category);
    oscillator.type = getWaveformForCategory(world.category);
    oscillator.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    // Add subtle frequency modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
    lfoGain.gain.setValueAtTime(10, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    lfo.start();

    // Filter configuration
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(800, ctx.currentTime);
    filterNode.Q.setValueAtTime(1, ctx.currentTime);

    // Volume
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(masterVolume * 0.15, ctx.currentTime + 0.5);

    // Connect nodes
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start
    oscillator.start();
    setIsPlaying(true);

    return () => {
      if (oscillator) {
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        setTimeout(() => {
          oscillator.stop();
          oscillator.disconnect();
          filterNode.disconnect();
          gainNode.disconnect();
        }, 300);
      }
      setIsPlaying(false);
    };
  }, [world, masterVolume]);

  // Update volume in real-time
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      gainNodeRef.current.gain.linearRampToValueAtTime(
        masterVolume * 0.15,
        ctx.currentTime + 0.1
      );
    }
  }, [masterVolume]);

  return null;
}

function getFrequencyForCategory(category: string): number {
  const frequencies: Record<string, number> = {
    forest: 220, // A3
    fire: 130,   // C3
    water: 165,  // E3
    rain: 185,   // F#3
    ice: 440,    // A4
    dragon: 294, // D4
    night: 196,  // G3
    flower: 330, // E4
    magic: 392,  // G4
    space: 246,  // B3
    cloud: 262,  // C4
    desert: 247, // B3
    mountain: 147, // D3
  };
  return frequencies[category] || 220;
}

function getWaveformForCategory(category: string): OscillatorType {
  const waveforms: Record<string, OscillatorType> = {
    forest: 'triangle',
    fire: 'sawtooth',
    water: 'sine',
    rain: 'sine',
    ice: 'sine',
    dragon: 'square',
    night: 'sine',
    flower: 'sine',
    magic: 'triangle',
    space: 'sine',
    cloud: 'triangle',
    desert: 'triangle',
    mountain: 'square',
  };
  return waveforms[category] || 'sine';
}
