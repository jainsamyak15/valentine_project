'use client';

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Question } from "@/lib/constants";
import RosePetals from "@/components/RosePetals";
import BackgroundMusic from "@/components/BackgroundMusic";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";

export default function TakeQuizClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [participantName, setParticipantName] = useState("");
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data: quizData, error: quizError } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", params.id)
        .single();

      if (quizError) {
        toast({
          title: "Error",
          description: "Quiz not found",
          variant: "destructive",
        });
        return;
      }

      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", params.id);

      if (questionsError) {
        toast({
          title: "Error",
          description: "Failed to load questions",
          variant: "destructive",
        });
        return;
      }

      setQuiz(quizData);
      setQuestions(questionsData);
    };

    fetchQuiz();
  }, [params.id, toast]);

  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setTimeLeft(currentQuestion.time_limit ?? 0);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quizStarted, quizCompleted, questions]);

  const startQuiz = () => {
    if (!participantName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }
    setQuizStarted(true);
    setTimeLeft(questions[0]?.time_limit || 30);
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === questions[currentQuestionIndex].correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex === questions.length - 1) {
      setQuizCompleted(true);

      // Save quiz attempt
      await supabase.from("quiz_attempts").insert({
        quiz_id: params.id,
        participant_name: participantName,
        score: score, // Use the already updated score
      });

      // Check if all answers are correct
      if (score === questions.length) {
        setShowEnvelope(true);
      }
      return;
    }

    setSelectedAnswer(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  if (!quiz || !questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Heart className="w-12 h-12 text-red-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-100 py-12 px-4 relative">
      <RosePetals />
      <BackgroundMusic />
      <Navbar />

      <div className="max-w-3xl mx-auto mt-20">
        <AnimatePresence mode="wait">
          {!quizStarted ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-8 bg-white/80 backdrop-blur-sm mt-20">
                <h1 className="text-3xl font-bold text-red-600 text-center mb-6">
                  {quiz.creator_name}&apos;s Valentine Quiz
                </h1>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter your name"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                  />
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600"
                    onClick={startQuiz}
                  >
                    Start Quiz
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : quizCompleted ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Card className="p-8 bg-white/80 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-red-600 mb-4">
                  Quiz Completed!
                </h2>
                <p className="text-xl mb-4">
                  Your Score: {score} out of {questions.length}
                </p>
                {showEnvelope && quiz.message && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="flex justify-center relative"
                  >
                    <div className="relative">
                      {/* Envelope Animation */}
                      <div className="bg-gradient-to-br from-pink-400 via-red-500 to-pink-400 shadow-xl rounded-lg p-6 relative overflow-hidden max-w-lg mx-auto">
                        {/* Glowing hearts */}
                        <div className="absolute top-0 left-0 w-full h-full">
                          <div className="absolute inset-0 flex justify-center items-center">
                            <motion.div
                              className="rounded-full bg-red-300 opacity-60 blur-lg"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.6, 0.8, 0.6],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 3,
                              }}
                            ></motion.div>
                          </div>
                          <div className="absolute top-1/3 flex justify-center space-x-4">
                            <motion.div
                              className="text-red-500"
                              animate={{ y: [0, -10, 0] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                            >
                              ❤️
                            </motion.div>
                            <motion.div
                              className="text-red-500"
                              animate={{ y: [10, 0, 10] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                            >
                              💖
                            </motion.div>
                          </div>
                        </div>

                        {/* Envelope Content */}
                        <div className="relative">
                          <div className="bg-white rounded-lg p-6 shadow-lg">
                            <h2 className="text-center text-2xl font-bold text-red-600 mb-4">
                              A Special Message From {quiz.creator_name}
                            </h2>
                            <p className="text-gray-700 text-center italic text-lg">
                              {quiz.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Button
                  className="bg-red-500 hover:bg-red-600 mt-6"
                  onClick={() => router.push("/")}
                >
                  Back to Home
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <Card className="p-8 bg-white/80 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium">
                    Question {currentQuestionIndex + 1}/{questions.length}
                  </span>
                  <span className="text-lg font-medium text-red-600">
                    Time: {timeLeft}s
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-6">
                  {questions[currentQuestionIndex].question}
                </h2>

                <div className="space-y-4">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <Button
                      key={index}
                      className={`w-full text-left justify-start ${
                        selectedAnswer === index
                          ? "bg-red-100 border-red-500"
                          : "bg-white hover:bg-red-50"
                      }`}
                      variant="outline"
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {selectedAnswer !== null && (
                  <Button
                    className="w-full mt-6 bg-red-500 hover:bg-red-600"
                    onClick={handleNextQuestion}
                  >
                    {currentQuestionIndex === questions.length - 1
                      ? "Finish Quiz"
                      : "Next Question"}
                  </Button>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
