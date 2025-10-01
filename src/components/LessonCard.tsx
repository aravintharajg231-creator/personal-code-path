import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, Circle, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import ProgressBar from "./ProgressBar";

interface LessonCardProps {
  title: string;
  description: string;
  progress: number;
  status: "locked" | "in-progress" | "completed";
  xp: number;
  onClick?: () => void;
}

const LessonCard = ({ title, description, progress, status, xp, onClick }: LessonCardProps) => {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";

  return (
    <Card
      className={cn(
        "group hover:shadow-xl transition-all duration-300 cursor-pointer border-2",
        isLocked && "opacity-60 cursor-not-allowed",
        isCompleted && "border-success",
        !isCompleted && !isLocked && "border-primary/50 hover:border-primary hover:scale-105"
      )}
      onClick={!isLocked ? onClick : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
            {isCompleted && <CheckCircle2 className="h-5 w-5 text-success" />}
            {!isLocked && !isCompleted && <Circle className="h-5 w-5 text-primary" />}
            {title}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full bg-warning/20 text-warning">
            <span>+{xp}</span>
            <span className="text-xs">XP</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>

        {!isLocked && !isCompleted && (
          <>
            <ProgressBar value={progress} showLabel={false} />
            <Button variant="accent" className="w-full" onClick={onClick}>
              <Play className="mr-2 h-4 w-4" />
              {progress > 0 ? "Continue" : "Start Lesson"}
            </Button>
          </>
        )}

        {isCompleted && (
          <Button variant="success" className="w-full" onClick={onClick}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Review Lesson
          </Button>
        )}

        {isLocked && (
          <Button variant="secondary" className="w-full" disabled>
            <Lock className="mr-2 h-4 w-4" />
            Complete previous lessons
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LessonCard;
