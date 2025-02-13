"use client";

import { useState, useEffect } from 'react';
import { Music, Music2 as Music2Off } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSound from 'use-sound';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, { stop }] = useSound('/romantic-background.mp3', { 
    volume: 0.5,
    loop: true 
  });

  useEffect(() => {
    if (isPlaying) {
      play();
    } else {
      stop();
    }
  }, [isPlaying, play, stop]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed bottom-4 right-4 z-50"
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {isPlaying ? (
        <Music className="h-6 w-6 text-red-500" />
      ) : (
        <Music2Off className="h-6 w-6 text-red-500" />
      )}
    </Button>
  );
};

export default BackgroundMusic;