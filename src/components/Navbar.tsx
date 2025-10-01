import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Code2, Sparkles } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
            <Code2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            TechTutor AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button variant="ghost">
            About
          </Button>
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Sign In
          </Button>
          <Button variant="hero" onClick={() => navigate("/auth")}>
            <Sparkles className="mr-2 h-4 w-4" />
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
