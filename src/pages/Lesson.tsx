import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CodeEditor from "@/components/CodeEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Lesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAIFeedback, setShowAIFeedback] = useState(false);

  // Mock lesson data
  const lesson = {
    id: id || "1",
    title: "Control Flow: If Statements",
    description: "Learn how to make decisions in your code using if statements",
    xp: 150,
    content: `
# Understanding If Statements

If statements allow your program to make decisions based on conditions.

## Basic Syntax

\`\`\`python
if condition:
    # code to execute if condition is True
\`\`\`

## Example

\`\`\`python
age = 18
if age >= 18:
    print("You are an adult")
\`\`\`

## Your Task

Create a program that checks if a number is positive, negative, or zero.
    `,
    initialCode: `# Write your code here
number = 10

# Add your if statements below
`,
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

  const handleComplete = () => {
    toast({
      title: "Lesson Complete! 🎉",
      description: `You earned ${lesson.xp} XP!`,
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

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
                    +{lesson.xp} XP
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
            <CodeEditor initialCode={lesson.initialCode} onRun={handleRunCode} onAIHelp={handleAIHelp} />

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
