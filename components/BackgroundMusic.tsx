"use client";

import { useState, useEffect } from 'react';
import { Music, Music2 as Music2Off } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSound from 'use-sound';
import { usePathname } from 'next/navigation';

const BackgroundMusic = ({ autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const pathname = usePathname();
  
  const [play, { stop }] = useSound('/Terre Pyaar Mein - Himesh Reshammiya 320 Kbps.mp3', { 
    volume: 0.5,
    loop: true 
  });

  useEffect(() => {
    if (autoPlay) {
      setIsPlaying(true);
    }
  }, [autoPlay]);

  // Stop music on route change
  useEffect(() => {
    return () => {
      stop();
      setIsPlaying(false);
    };
  }, [pathname, stop]);

  useEffect(() => {
    if (isPlaying) {
      play();
    } else {
      stop();
    }
    
    // Cleanup on component unmount
    return () => {
      stop();
    };
  }, [isPlaying, play, stop]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="fixed bottom-4 right-4 z-50"
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {isPlaying ? (
        <Music className="h-9 w-9 text-red-500" />
      ) : (
        <Music2Off className="h-9 w-9 text-red-500" />
      )}
    </Button>
  );
};

export default BackgroundMusic;