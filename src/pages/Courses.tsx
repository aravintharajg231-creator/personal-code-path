import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code2, BookOpen, Target, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Courses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndFetchLanguages();
  }, []);

  const checkAuthAndFetchLanguages = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: languagesData, error } = await supabase
        .from("programming_languages")
        .select(
          `
          *,
          lessons(id, title, order_index)
        `
        )
        .order("name");

      if (error) throw error;

      // Count lessons for each language
      const languagesWithCounts = languagesData?.map((lang) => ({
        ...lang,
        lessonCount: lang.lessons?.length || 0,
      }));

      setLanguages(languagesWithCounts || []);
    } catch (error) {
      console.error("Error fetching languages:", error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCourse = (languageId: string) => {
    navigate(`/roadmap/${languageId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
              Choose Your Course
            </h1>
            <p className="text-xl text-muted-foreground">
              Select a programming language and get a complete roadmap to mastery
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {languages.map((language) => (
              <Card
                key={language.id}
                className="gradient-card border-2 border-primary/30 hover:border-primary hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleSelectCourse(language.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent group-hover:scale-110 transition-transform">
                        <Code2 className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">{language.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{language.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-accent" />
                      <span className="text-muted-foreground">{language.lessonCount} Lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-success" />
                      <span className="text-muted-foreground">Structured Path</span>
                    </div>
                  </div>

                  <Badge variant="secondary" className="w-full justify-center py-2">
                    Difficulty: {language.difficulty || "All Levels"}
                  </Badge>

                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Trophy className="mr-2 h-4 w-4" />
                    View Roadmap & Start Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {languages.length === 0 && (
            <Card className="max-w-2xl mx-auto gradient-card border-2 border-warning/50">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-20 w-20 text-warning mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">No Courses Available</h2>
                <p className="text-muted-foreground text-lg">Check back soon for new courses!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
