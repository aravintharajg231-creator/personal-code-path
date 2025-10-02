import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CodeEditor from "@/components/CodeEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Sparkles, BookOpen, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Lesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const [lesson, setLesson] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    checkAuthAndFetchLesson();
  }, [id]);

  const checkAuthAndFetchLesson = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch the lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from("lessons")
        .select(
          `
          *,
          programming_languages(name)
        `
        )
        .eq("id", id)
        .single();

      if (lessonError) throw lessonError;

      // Fetch user progress for this lesson
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("lesson_id", id)
        .single();

      // Fetch all lessons to check order
      const { data: allLessonsData } = await supabase
        .from("lessons")
        .select(
          `
          id,
          order_index,
          user_progress(status)
        `
        )
        .order("order_index");

      setAllLessons(allLessonsData || []);

      // Check if lesson is locked (previous lesson not completed)
      const currentLessonIndex = allLessonsData?.findIndex((l) => l.id === id);
      if (currentLessonIndex && currentLessonIndex > 0) {
        const previousLesson = allLessonsData[currentLessonIndex - 1];
        const prevProgress = previousLesson.user_progress?.[0];
        if (!prevProgress || prevProgress.status !== "completed") {
          setIsLocked(true);
        }
      }

      setLesson(lessonData);
      setUserProgress(progressData);

      // Create progress entry if it doesn't exist
      if (!progressData) {
        await supabase.from("user_progress").insert({
          user_id: user.id,
          lesson_id: id,
          status: "in-progress",
          progress_percentage: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      toast({
        title: "Error",
        description: "Failed to load lesson",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRunCode = (code: string) => {
    toast({
      title: "Code executed!",
      description: "Great job! Your code is working.",
    });
  };

  const handleAIHelp = (code: string) => {
    setShowAIFeedback(true);
    toast({
      title: "AI Analyzing...",
      description: "Getting personalized feedback on your code",
    });

    // Simulate AI feedback
    setTimeout(() => {
      toast({
        title: "AI Feedback Ready!",
        description: "Check the feedback panel below",
      });
    }, 1500);
  };

  const handleComplete = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Update lesson progress to completed
      await supabase
        .from("user_progress")
        .update({
          status: "completed",
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("lesson_id", id);

      // Update user stats
      const { data: stats } = await supabase.from("user_stats").select("*").eq("user_id", user.id).single();

      if (stats) {
        await supabase
          .from("user_stats")
          .update({
            total_xp: stats.total_xp + (lesson?.xp_reward || 0),
            lessons_completed: stats.lessons_completed + 1,
            current_level: Math.floor((stats.total_xp + (lesson?.xp_reward || 0)) / 500) + 1,
          })
          .eq("user_id", user.id);
      }

      toast({
        title: "Lesson Complete! 🎉",
        description: `You earned ${lesson?.xp_reward || 0} XP!`,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast({
        title: "Error",
        description: "Failed to complete lesson",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Card className="max-w-2xl mx-auto gradient-card border-2 border-warning/50">
            <CardContent className="p-12 text-center">
              <Lock className="h-20 w-20 text-warning mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Lesson Locked</h2>
              <p className="text-muted-foreground text-lg">
                Complete the previous lesson to unlock this one. Keep learning step by step!
              </p>
              <Button size="lg" onClick={() => navigate("/dashboard")} className="mt-8">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Lesson not found</h2>
              <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Lesson Content */}
          <div className="space-y-6">
            <Card className="gradient-card border-2 border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{lesson.title}</CardTitle>
                    <p className="text-muted-foreground">{lesson.description}</p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    +{lesson.xp_reward} XP
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-2 text-accent font-semibold">
                      <BookOpen className="h-5 w-5" />
                      <span>Lesson Content</span>
                    </div>
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                      {lesson.content}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Feedback */}
            {showAIFeedback && (
              <Card className="border-2 border-accent/50 bg-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent">
                    <Sparkles className="h-5 w-5" />
                    AI Tutor Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-success">✓ Great start!</p>
                    <p className="text-muted-foreground">
                      You've correctly defined the variable. Now try adding if-elif-else statements to check if the
                      number is positive, negative, or zero.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-accent">💡 Hint:</p>
                    <p className="text-muted-foreground">
                      Use <code className="bg-secondary px-2 py-1 rounded">if number {">"} 0:</code> to check for
                      positive numbers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            <CodeEditor
              initialCode={lesson.content?.split("```")[1]?.replace(/^\w+\n/, "") || "# Start coding here"}
              onRun={handleRunCode}
              onAIHelp={handleAIHelp}
              language={lesson.programming_languages?.name.toLowerCase()}
            />

            <Button variant="success" size="lg" className="w-full" onClick={handleComplete}>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Complete Lesson
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
