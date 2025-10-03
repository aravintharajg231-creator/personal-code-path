import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onRun?: (code: string) => void;
  onAIHelp?: (code: string) => void;
}

const CodeEditor = ({ initialCode = "", language = "python", onRun, onAIHelp }: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running code...");

    try {
      const { data, error } = await supabase.functions.invoke("execute-code", {
        body: { code, language },
      });

      if (error) throw error;

      if (data.run) {
        const output = data.run.output || data.run.stdout || "";
        const error = data.run.stderr || "";
        setOutput(error ? `Error:\n${error}` : output || "Code executed successfully! ✓");
      } else if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput("Code executed successfully! ✓");
      }

      if (onRun) {
        onRun(code);
      }
    } catch (error: any) {
      const errorMessage = error?.message?.includes("JWT") || error?.message?.includes("authorization")
        ? "Please sign in to run code"
        : "Unable to execute code. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setOutput(`Error: ${errorMessage}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput("");
  };

  const handleAIHelp = () => {
    if (onAIHelp) {
      onAIHelp(code);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 gradient-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Code Editor</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleAIHelp}>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Help
            </Button>
            <Button size="sm" variant="success" onClick={handleRun} disabled={isRunning}>
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "Running..." : "Run"}
            </Button>
          </div>
        </div>

        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
          className="font-mono text-sm min-h-[300px] bg-background/50 border-border"
        />
      </Card>

      {output && (
        <Card className={`p-4 ${output.includes("Error") ? "border-destructive/50 bg-destructive/5" : "border-success/50 bg-success/5"}`}>
          <div className="flex items-start gap-2">
            <div className={`text-sm font-semibold ${output.includes("Error") ? "text-destructive" : "text-success"}`}>
              {output.includes("Error") ? "Error:" : "Output:"}
            </div>
            <pre className="text-sm text-foreground flex-1 whitespace-pre-wrap">{output}</pre>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CodeEditor;
