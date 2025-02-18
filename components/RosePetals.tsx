"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const RosePetals = () => {
  const [petals, setPetals] = useState<Array<{ id: number; x: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const createPetal = () => {
      const id = Date.now();
      const x = Math.random() * window.innerWidth; 
      const size = Math.random() * 10 + 6; 
      const delay = Math.random() * 1.5; 
      setPetals(prev => [...prev, { id, x, size, delay }]);

      setTimeout(() => {
        setPetals(prev => prev.filter(petal => petal.id !== id));
      }, 6000); 
    };

    const interval = setInterval(createPetal, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {petals.map(petal => (
        <motion.div
          key={petal.id}
          initial={{ 
            x: petal.x, 
            y: -20, 
            rotate: Math.random() * 360, 
            opacity: 0.8,
            scale: petal.size / 12 
          }}
          animate={{
            y: window.innerHeight + 20,
            x: petal.x + Math.random() * 40 - 25, 
            rotate: petal.size * 10, 
            opacity: 0
          }}
          transition={{
            duration: 8,
            delay: petal.delay,
            ease: "easeInOut"
          }}
          className="absolute"
        >
          {/* Heart-shaped petal with less pink, more red */}
          <div className="w-5 h-5 bg-gradient-to-br from-red-600 to-red-400 rounded-full transform rotate-45 shadow-md relative opacity-90">
            <div className="absolute bg-gradient-to-br from-red-600 to-red-400 w-5 h-5 rounded-full -top-2 left-0"></div>
            <div className="absolute bg-gradient-to-br from-red-600 to-red-400 w-5 h-5 rounded-full -left-2 top-0"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default RosePetals;
