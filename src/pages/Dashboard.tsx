import { useState } from "react";
import Navbar from "@/components/Navbar";
import LessonCard from "@/components/LessonCard";
import ProgressBar from "@/components/ProgressBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import badgeIcon from "@/assets/badge-icon.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userStats] = useState({
    level: 5,
    xp: 1250,
    xpToNextLevel: 1500,
    streak: 7,
    lessonsCompleted: 12,
  });

  const lessons = [
    {
      id: 1,
      title: "Python Basics",
      description: "Learn variables, data types, and basic operations",
      progress: 100,
      status: "completed" as const,
      xp: 100,
    },
    {
      id: 2,
      title: "Control Flow",
      description: "Master if statements, loops, and logic",
      progress: 60,
      status: "in-progress" as const,
      xp: 150,
    },
    {
      id: 3,
      title: "Functions & Modules",
      description: "Create reusable code with functions",
      progress: 0,
      status: "locked" as const,
      xp: 200,
    },
    {
      id: 4,
      title: "Data Structures",
      description: "Work with lists, dictionaries, and sets",
      progress: 0,
      status: "locked" as const,
      xp: 250,
    },
  ];

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

        {/* Learning Path */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Your Learning Path</h2>
          <p className="text-muted-foreground">Continue where you left off</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              {...lesson}
              onClick={() => navigate("/lesson/" + lesson.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
