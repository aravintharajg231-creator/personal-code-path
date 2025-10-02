import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Circle, Lock, PlayCircle, Code2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProgressBar from "@/components/ProgressBar";

const Roadmap = () => {
  const { languageId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmap();
  }, [languageId]);

  const fetchRoadmap = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch language details
      const { data: langData, error: langError } = await supabase
        .from("programming_languages")
        .select("*")
        .eq("id", languageId)
        .single();

      if (langError) throw langError;

      // Fetch lessons for this language
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .eq("language_id", languageId)
        .order("order_index");

      if (lessonsError) throw lessonsError;

      // Fetch user progress
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .in(
          "lesson_id",
          lessonsData?.map((l) => l.id) || []
        );

      setLanguage(langData);
      setLessons(lessonsData || []);
      setUserProgress(progressData || []);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      toast({
        title: "Error",
        description: "Failed to load roadmap",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getLessonStatus = (lessonIndex: number, lessonId: string) => {
    const progress = userProgress.find((p) => p.lesson_id === lessonId);

    if (progress?.status === "completed") {
      return "completed";
    }

    if (lessonIndex === 0) {
      return progress ? "in-progress" : "available";
    }

    const previousLesson = lessons[lessonIndex - 1];
    const previousProgress = userProgress.find((p) => p.lesson_id === previousLesson.id);

    if (previousProgress?.status === "completed") {
      return progress ? "in-progress" : "available";
    }

    return "locked";
  };

  const handleStartLesson = async (lessonId: string, status: string) => {
    if (status === "locked") {
      toast({
        title: "Lesson Locked",
        description: "Complete the previous lesson first!",
        variant: "destructive",
      });
      return;
    }

    navigate(`/lesson/${lessonId}`);
  };

  const calculateProgress = () => {
    if (lessons.length === 0) return 0;
    const completed = userProgress.filter((p) => p.status === "completed").length;
    return Math.round((completed / lessons.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (!language) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Course not found</h2>
              <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
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
        <Button variant="ghost" onClick={() => navigate("/courses")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Course Header */}
          <Card className="gradient-card border-2 border-primary/50 glow-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-primary to-accent">
                    <Code2 className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl mb-2">{language.name} Roadmap</CardTitle>
                    <p className="text-muted-foreground">{language.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {language.difficulty || "All Levels"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Your Progress</span>
                  <span className="text-sm font-semibold text-primary">{calculateProgress()}% Complete</span>
                </div>
                <ProgressBar value={calculateProgress()} max={100} />
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-muted-foreground">
                      {userProgress.filter((p) => p.status === "completed").length} Completed
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">{lessons.length} Total Lessons</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lessons Roadmap */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Learning Path</h2>
            <div className="space-y-4">
              {lessons.map((lesson, index) => {
                const status = getLessonStatus(index, lesson.id);
                const isLocked = status === "locked";
                const isCompleted = status === "completed";
                const isInProgress = status === "in-progress";

                return (
                  <Card
                    key={lesson.id}
                    className={`gradient-card border-2 transition-all duration-300 ${
                      isLocked
                        ? "border-muted/30 opacity-60"
                        : isCompleted
                        ? "border-success/50 hover:border-success"
                        : isInProgress
                        ? "border-accent/50 hover:border-accent"
                        : "border-primary/30 hover:border-primary hover:shadow-xl"
                    } ${!isLocked && "cursor-pointer"}`}
                    onClick={() => handleStartLesson(lesson.id, status)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {isLocked ? (
                            <div className="p-3 rounded-full bg-muted">
                              <Lock className="h-6 w-6 text-muted-foreground" />
                            </div>
                          ) : isCompleted ? (
                            <div className="p-3 rounded-full bg-success/20">
                              <CheckCircle2 className="h-6 w-6 text-success" />
                            </div>
                          ) : (
                            <div className="p-3 rounded-full bg-primary/20">
                              <PlayCircle className="h-6 w-6 text-primary" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-xs">
                              Lesson {index + 1}
                            </Badge>
                            <h3 className="text-lg font-semibold">{lesson.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{lesson.description}</p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="secondary">+{lesson.xp_reward} XP</Badge>
                          {isCompleted && (
                            <Badge variant="outline" className="text-success border-success">
                              Completed
                            </Badge>
                          )}
                          {isInProgress && (
                            <Badge variant="outline" className="text-accent border-accent">
                              In Progress
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {lessons.length === 0 && (
              <Card className="gradient-card border-2 border-warning/50">
                <CardContent className="p-12 text-center">
                  <h3 className="text-2xl font-bold mb-4">No Lessons Available Yet</h3>
                  <p className="text-muted-foreground">
                    This course is being prepared. Check back soon for lessons!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
