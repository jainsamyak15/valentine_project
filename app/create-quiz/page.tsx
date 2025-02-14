"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Copy, Share2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Question } from "@/lib/constants";
import RosePetals from "@/components/RosePetals";
import BackgroundMusic from "@/components/BackgroundMusic";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CreateQuiz() {
  const { toast } = useToast();
  const [creatorName, setCreatorName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [timeLimit, setTimeLimit] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");

  const addQuestion = () => {
    if (!currentQuestion || options.some(opt => !opt)) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newQuestion: Question = {
      id: uuidv4(),
      question: currentQuestion,
      options: [...options],
      correctAnswer,
      timeLimit
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    setTimeLimit(30);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const generateQuizLink = async () => {
    if (!creatorName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Create quiz
      const { data: quiz, error: quizError } = await supabase
        .from("quizzes")
        .insert({
          creator_name: creatorName,
        })
        .select()
        .single();

      if (quizError) throw quizError;

      // Add questions
      const { error: questionsError } = await supabase
        .from("questions")
        .insert(
          questions.map(q => ({
            quiz_id: quiz.id,
            question: q.question,
            options: q.options,
            correct_answer: q.correctAnswer,
            time_limit: q.timeLimit,
          }))
        );

      if (questionsError) throw questionsError;

      const quizUrl = `${window.location.origin}/take-quiz/${quiz.id}`;
      setGeneratedUrl(quizUrl);
      setShowShareDialog(true);

    } catch (error) {
      console.error("Error creating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl);
      toast({
        title: "Link Copied!",
        description: "The quiz link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareQuiz = async () => {
    try {
      await navigator.share({
        title: "Valentine's Quiz",
        text: "Take my Valentine's Quiz!",
        url: generatedUrl,
      });
    } catch (err) {
      copyToClipboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 py-12 px-4 relative">
      <Navbar />
      <RosePetals />
      <BackgroundMusic />
      
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-8 mt-20 "
      >
        <h1 className="text-4xl font-bold text-red-600 text-center mb-8">
          Create Your Valentine Quiz
        </h1>

        <Card className="p-6 bg-white/80 backdrop-blur-sm">
          <div className="space-y-4">
            <Input
              placeholder="Your Name"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              className="text-lg"
            />

            <div className="space-y-4">
              <Input
                placeholder="Your Question"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
              />

              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                  />
                  <Button
                    variant="ghost"
                    className={`w-32 ${
                      correctAnswer === index ? "bg-green-100" : ""
                    }`}
                    onClick={() => setCorrectAnswer(index)}
                  >
                    {correctAnswer === index ? "Correct ✓" : "Set Correct"}
                  </Button>
                </div>
              ))}

              <div className="flex gap-4">
                <Input
                  type="number"
                  placeholder="Time Limit (seconds)"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  min={10}
                  max={120}
                />
                <Button onClick={addQuestion} className="bg-red-500 hover:bg-red-600">
                  <Plus className="mr-2" /> Add Question
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {questions.length > 0 && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-4">Your Questions</h2>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                >
                  <div>
                    <p className="font-medium">
                      {index + 1}. {q.question}
                    </p>
                    <p className="text-sm text-gray-500">
                      Time limit: {q.timeLimit} seconds
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => removeQuestion(q.id)}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {questions.length > 0 && (
          <div className="text-center">
            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600"
              onClick={generateQuizLink}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Quiz Link"}
            </Button>
          </div>
        )}
      </motion.div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Valentine Quiz</DialogTitle>
            <DialogDescription>
              Send this link to your Valentine to let them take the quiz!
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={generatedUrl}
                readOnly
                className="w-full"
              />
            </div>
            <Button size="sm" className="px-3" onClick={copyToClipboard}>
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" className="px-3" onClick={shareQuiz}>
              <span className="sr-only">Share</span>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}