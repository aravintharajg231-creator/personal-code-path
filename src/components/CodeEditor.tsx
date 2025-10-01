import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CodeEditorProps {
  initialCode?: string;
  onRun?: (code: string) => void;
  onAIHelp?: (code: string) => void;
}

const CodeEditor = ({ initialCode = "", onRun, onAIHelp }: CodeEditorProps) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");

  const handleRun = () => {
    if (onRun) {
      onRun(code);
      setOutput("Code executed successfully! ✓");
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
            <Button size="sm" variant="success" onClick={handleRun}>
              <Play className="h-4 w-4 mr-2" />
              Run
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
        <Card className="p-4 border-success/50 bg-success/5">
          <div className="flex items-start gap-2">
            <div className="text-sm font-semibold text-success">Output:</div>
            <pre className="text-sm text-foreground flex-1 whitespace-pre-wrap">{output}</pre>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CodeEditor;
