import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

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

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running code...");

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/execute-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ code, language }),
      });

      const result = await response.json();

      if (result.run) {
        const output = result.run.output || result.run.stdout || "";
        const error = result.run.stderr || "";
        setOutput(error ? `Error:\n${error}` : output || "Code executed successfully! ✓");
      } else if (result.error) {
        setOutput(`Error: ${result.error}`);
      } else {
        setOutput("Code executed successfully! ✓");
      }

      if (onRun) {
        onRun(code);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
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
