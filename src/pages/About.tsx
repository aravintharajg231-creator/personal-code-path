import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const About = () => {
  const teamMembers = [
    { name: "Aravinth", role: "Lead Developer" },
    { name: "Deena", role: "AI Specialist" },
    { name: "Annamalai", role: "Backend Engineer" },
    { name: "Eshwar", role: "UI/UX Designer" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
              About TechTutor AI
            </h1>
            <p className="text-xl text-muted-foreground">
              Democratizing tech education for everyone
            </p>
          </div>

          <Card className="gradient-card border-2 border-primary/50">
            <CardContent className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-primary">Welcome to TechTutor AI</h2>
                <p className="text-foreground leading-relaxed">
                  Where we believe that mastering the world's most in-demand programming languages should be free and
                  accessible to everyone.
                </p>
              </div>

              <div>
                <p className="text-foreground leading-relaxed">
                  TechTutor AI is a revolutionary AI-powered course builder designed to provide personalized,
                  interactive, and comprehensive learning experiences for aspiring and seasoned developers alike.
                  Whether you're starting your coding journey with Python and HTML or diving into the complexities of
                  Java and C++, our intelligent platform adapts to your learning style and pace.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-accent">Our Mission</h3>
                <p className="text-foreground leading-relaxed">
                  Our mission is simple: to democratize tech education. We are breaking down barriers by offering a
                  high-quality, structured learning path for crucial programming skills at no cost. We believe that
                  financial constraints should never be a hurdle to gaining the knowledge needed to thrive in the digital
                  economy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-accent">What We Offer</h3>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <div>
                      <strong>Free, Comprehensive Courses:</strong> Dive deep into structured curricula for Python, Java,
                      C++, HTML, and more. From basic syntax to advanced concepts, it's all here.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <div>
                      <strong>AI-Powered Personalization:</strong> Our intelligent system identifies your strengths and
                      weaknesses, offering tailored exercises, hints, and learning recommendations to help you improve
                      faster.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <div>
                      <strong>Interactive Learning Environment:</strong> Go beyond passive video watching. Write, test,
                      and debug code directly in your browser with our integrated coding platform.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <div>
                      <strong>Build Real-World Skills:</strong> Our courses are designed with project-based learning,
                      ensuring you can apply your new skills to build portfolios and solve practical problems.
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-accent">Our Vision for the Future</h3>
                <p className="text-foreground leading-relaxed">
                  We envision a world where anyone, anywhere, can unlock their potential and build the future with code.
                  TechTutor AI is our first step. We are constantly working to add new languages, advanced
                  specializations, and more powerful AI features to make your learning journey even more effective and
                  engaging.
                </p>
                <p className="text-foreground leading-relaxed mt-4 font-semibold text-accent">
                  Join us today and start building your future, for free.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-2 border-accent/50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-accent flex items-center gap-3">
                <Users className="h-7 w-7" />
                Team Innovators
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="bg-background/50 hover:bg-background/70 transition-colors">
                    <CardContent className="p-4">
                      <h4 className="text-lg font-semibold text-primary">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
