"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

const RosePetals = () => {
  const [hearts, setHearts] = useState<Array<{
    id: number;
    x: number;
    size: number;
    delay: number;
    rotation: number;
    duration: number;
    color: string;
  }>>([]);

  useEffect(() => {
    const createHeart = () => {
      const id = Date.now();
      const x = Math.random() * window.innerWidth;
      const size = Math.random() * 15 + 8; // Larger base size for better visibility
      const delay = Math.random() * 1;
      const rotation = Math.random() * 180 - 90; // Initial rotation between -90 and 90 degrees
      const duration = Math.random() * 3 + 8; // Longer duration for smoother fall
      
      // Array of red shades for variety
      const redShades = [
        "#FF0A54", // Bright red
        "#FF477E", // Pink red
        "#FF7096", // Light red
        "#DD2954", // Deep red
      ];
      const color = redShades[Math.floor(Math.random() * redShades.length)];

      setHearts(prev => [...prev, { id, x, size, delay, rotation, duration, color }]);

      // Remove heart after animation completes
      setTimeout(() => {
        setHearts(prev => prev.filter(heart => heart.id !== id));
      }, (duration + delay) * 1000);
    };

    // Create hearts more frequently for a denser effect
    const interval = setInterval(createHeart, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{
              x: heart.x,
              y: -50,
              rotate: heart.rotation,
              opacity: 0,
              scale: heart.size / 12, // Start small and grow to full size
            }}
            animate={{
              y: window.innerHeight + 50,
              x: heart.x + (Math.sin(heart.rotation) * 100), // Gentle sideways drift based on rotation
              rotate: heart.rotation + 180, // Smooth rotation as it falls
              opacity: [0, 0.8, 0.8, 0], // Fade in and out smoothly
              scale: [0, 1, 1, 0.8], // Smooth scaling effect
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: [0.4, 0, 0.2, 1], // Custom easing for ultra-smooth motion
              opacity: {
                duration: heart.duration,
                times: [0, 0.1, 0.8, 1] // Control fade timing
              },
              scale: {
                duration: heart.duration,
                times: [0, 0.1, 0.8, 1] // Control scale timing
              }
            }}
            className="absolute will-change-transform"
          >
            <Heart
              fill={heart.color}
              color={heart.color}
              size={heart.size*2}
              className="filter drop-shadow-lg"
              strokeWidth={1.5}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RosePetals;