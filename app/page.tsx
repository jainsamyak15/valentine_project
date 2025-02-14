"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import RosePetals from "@/components/RosePetals";
import BackgroundMusic from "@/components/BackgroundMusic";
import { romanticShayaris } from "@/lib/constants";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { toast } = useToast();

  useEffect(() => {
    // Show initial shayari immediately
    const randomShayari = romanticShayaris[Math.floor(Math.random() * romanticShayaris.length)];
    toast({
      title: "💝 Love Note",
      description: randomShayari,
      className: "heart-toast",
      duration: 5000,
    });

    // Set up interval for subsequent shayaris
    const interval = setInterval(() => {
      const randomShayari = romanticShayaris[Math.floor(Math.random() * romanticShayaris.length)];
      toast({
        title: "💝 Love Note",
        description: randomShayari,
        className: "heart-toast",
        duration: 5000,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [toast]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 relative overflow-hidden">
      <RosePetals />
      <BackgroundMusic />
      <Navbar />
      
      <div className="container mx-auto px-4 py-20 relative z-10 mt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Heart className="w-20 h-20 text-red-500 mx-auto mb-8" />
          </motion.div>
          
          <h1 className="text-5xl font-bold text-red-600 mb-6">
            Valentine&apos;s Love Quiz
          </h1>
          
          <p className="text-xl text-gray-700 mb-12">
            Create a special quiz for your Valentine and see how well they know you! 💝
          </p>

          <div className="space-y-4">
            <Link href="/create-quiz">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Create Your Love Quiz
              </Button>
            </Link>
            
            <Link href="/take-quiz">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-red-500 text-red-500 hover:bg-red-50 px-8 py-6 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Take a Quiz
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}