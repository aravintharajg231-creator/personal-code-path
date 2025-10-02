import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import LessonCard from "@/components/LessonCard";
import ProgressBar from "@/components/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import badgeIcon from "@/assets/badge-icon.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    xpToNextLevel: 500,
    streak: 0,
    lessonsCompleted: 0,
  });
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchUserData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch user stats
      const { data: stats } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (stats) {
        setUserStats({
          level: stats.current_level,
          xp: stats.total_xp,
          xpToNextLevel: stats.current_level * 500,
          streak: stats.streak_days,
          lessonsCompleted: stats.lessons_completed,
        });
      }

      // Fetch all lessons with user progress
      const { data: allLessons, error: lessonsError } = await supabase
        .from("lessons")
        .select(`
          *,
          programming_languages(name),
          user_progress(status, progress_percentage)
        `)
        .order("order_index");

      if (lessonsError) throw lessonsError;

      const formattedLessons = allLessons?.map((lesson: any) => {
        const userProgress = lesson.user_progress?.[0];
        const status = userProgress?.status || "locked";
        const progress = userProgress?.progress_percentage || 0;

        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          progress,
          status: status === "not-started" ? "locked" : status,
          xp: lesson.xp_reward,
        };
      }) || [];

      setLessons(formattedLessons);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load your data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="gradient-card border-2 border-primary/50 glow-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{userStats.level}</div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-2 border-warning/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{userStats.streak} days</div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-2 border-success/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Lessons Done
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{userStats.lessonsCompleted}</div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-2 border-accent/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{userStats.xp}</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="mb-8 gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Progress</span>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Level {userStats.level}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProgressBar value={userStats.xp} max={userStats.xpToNextLevel} />
            <div className="flex items-center gap-4">
              <img src={badgeIcon} alt="Badge" className="h-16 w-16" />
              <div>
                <h3 className="font-semibold">Python Explorer</h3>
                <p className="text-sm text-muted-foreground">
                  {userStats.xpToNextLevel - userStats.xp} XP until next level
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card
            className="gradient-card border-2 border-primary/50 hover:border-primary hover:shadow-2xl transition-all duration-300 cursor-pointer group"
            onClick={() => navigate("/courses")}
          >
            <CardContent className="p-8 text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary to-accent inline-block mb-4 group-hover:scale-110 transition-transform">
                <Target className="h-12 w-12 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Browse Courses</h3>
              <p className="text-muted-foreground mb-4">
                Explore all available programming courses with complete roadmaps
              </p>
              <Button variant="hero" className="w-full">
                View All Courses
              </Button>
            </CardContent>
          </Card>

          <Card className="gradient-card border-2 border-accent/50">
            <CardContent className="p-8 text-center">
              <div className="p-4 rounded-full bg-accent/20 inline-block mb-4">
                <TrendingUp className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Your Progress</h3>
              <p className="text-muted-foreground mb-4">
                {userStats.lessonsCompleted} lessons completed • Level {userStats.level}
              </p>
              <div className="text-3xl font-bold text-accent">{userStats.xp} XP</div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning */}
        {lessons.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Continue Learning</h2>
              <p className="text-muted-foreground">Pick up where you left off</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.slice(0, 6).map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  {...lesson}
                  onClick={() => navigate("/lesson/" + lesson.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
