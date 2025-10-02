import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Sparkles, Code2, Brain, Trophy, Zap, Users, Target } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import pythonIcon from "@/assets/python-icon.png";
import badgeIcon from "@/assets/badge-icon.png";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Get personalized guidance and instant feedback from our advanced AI tutor",
    },
    {
      icon: Code2,
      title: "Interactive Coding",
      description: "Write and run code directly in your browser with real-time feedback",
    },
    {
      icon: Target,
      title: "Personalized Path",
      description: "Learning adapts to your level and pace for optimal progress",
    },
    {
      icon: Trophy,
      title: "Gamified Experience",
      description: "Earn XP, unlock badges, and level up as you master new skills",
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get immediate explanations and corrections on your code",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Learn together with a community of fellow coding enthusiasts",
    },
  ];

  const languages = [
    { name: "Python", desc: "Perfect for beginners", icon: pythonIcon },
    { name: "HTML/CSS", desc: "Build stunning websites" },
    { name: "JavaScript", desc: "Make sites interactive" },
    { name: "Java", desc: "Create powerful apps" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powered by Advanced AI</span>
          </div>

          <h1 className="mb-6 text-5xl md:text-7xl font-bold leading-tight">
            Learn to Code with
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent animate-pulse">
              Your AI Tutor
            </span>
          </h1>

          <p className="mb-8 text-xl text-muted-foreground max-w-2xl mx-auto">
            Master programming languages at your own pace with personalized AI guidance, interactive lessons, and
            instant feedback. Start your coding journey today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="hero" onClick={() => navigate("/auth")} className="text-lg px-8">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Learning Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/dashboard")} className="text-lg px-8">
              View Demo
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
              <span>50+ Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose TechTutor AI?</h2>
            <p className="text-xl text-muted-foreground">Everything you need to become a confident developer</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 hover:border-primary gradient-card"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="py-20 gradient-hero relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-primary-foreground">Learn Popular Languages</h2>
            <p className="text-xl text-primary-foreground/80">Start with Python, then expand your skills</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {languages.map((lang, index) => (
              <Card key={index} className="hover:shadow-xl hover:scale-105 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  {lang.icon && (
                    <img src={lang.icon} alt={lang.name} className="h-16 w-16 mx-auto mb-4 object-contain" />
                  )}
                  {!lang.icon && (
                    <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Code2 className="h-8 w-8 text-primary-foreground" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{lang.name}</h3>
                  <p className="text-sm text-muted-foreground">{lang.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden border-2 border-primary glow-primary">
            <div className="absolute inset-0 gradient-hero opacity-10" />
            <CardContent className="relative p-12 text-center">
              <img src={badgeIcon} alt="Badge" className="h-20 w-20 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Ready to Start Your Coding Journey?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start learning to code with AI-powered personalized guidance
              </p>
              <Button size="lg" variant="hero" onClick={() => navigate("/auth")} className="text-lg px-8">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started Now - It's Free!
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 TechTutor AI. Empowering the next generation of developers.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
