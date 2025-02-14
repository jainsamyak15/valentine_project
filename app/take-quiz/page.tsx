"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import RosePetals from "@/components/RosePetals";
import BackgroundMusic from "@/components/BackgroundMusic";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function TakeQuiz() {
  const router = useRouter();
  const { toast } = useToast();
  const [quizId, setQuizId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz ID",
        variant: "destructive",
      });
      return;
    }
    router.push(`/take-quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 py-12 px-4 relative">
      <RosePetals />
      <BackgroundMusic />
      <Navbar />

      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 bg-white/80 backdrop-blur-sm mt-20">
            <h1 className="text-3xl font-bold text-red-600 text-center mb-6">
              Take a Valentine Quiz
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Enter Quiz ID"
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
              />
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Start Quiz
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )};