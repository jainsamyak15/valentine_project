"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const RosePetals = () => {
  const [petals, setPetals] = useState<Array<{ id: number; x: number }>>([]);

  useEffect(() => {
    const createPetal = () => {
      const id = Date.now();
      const x = Math.random() * window.innerWidth;
      setPetals(prev => [...prev, { id, x }]);

      setTimeout(() => {
        setPetals(prev => prev.filter(petal => petal.id !== id));
      }, 10000);
    };

    const interval = setInterval(createPetal, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {petals.map(petal => (
        <motion.div
          key={petal.id}
          initial={{ 
            x: petal.x,
            y: -20,
            rotate: 0,
            opacity: 0.8
          }}
          animate={{
            y: window.innerHeight + 20,
            rotate: 360,
            opacity: 0
          }}
          transition={{
            duration: 10,
            ease: "linear"
          }}
          className="absolute"
        >
          <div className="w-4 h-4 bg-red-200 rounded-full transform rotate-45" />
        </motion.div>
      ))}
    </div>
  );
};

export default RosePetals;