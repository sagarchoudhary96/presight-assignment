import { useState, useEffect, useRef } from "react";
import { streamService } from "@/services/stream.service";
import { Button } from "@/components/ui/button";
import { Loader2, Play, RotateCcw, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function StreamingDisplay() {
  const [displayText, setDisplayText] = useState("");
  const [fullText, setFullText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textQueueRef = useRef<string[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Auto-scroll to bottom of the content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayText]);

  // Handle character-by-character printing from the queue
  useEffect(() => {
    const processQueue = () => {
      if (textQueueRef.current.length > 0) {
        const nextChar = textQueueRef.current.shift();
        setDisplayText((prev) => prev + nextChar);
      }
      animationFrameRef.current = requestAnimationFrame(processQueue);
    };

    animationFrameRef.current = requestAnimationFrame(processQueue);
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const startStream = async () => {
    setDisplayText("");
    setFullText("");
    setIsStreaming(true);
    setIsDone(false);
    setError(null);
    textQueueRef.current = [];

    try {
      const stream = await streamService.streamText();
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Push characters into the queue for progressive rendering
        textQueueRef.current.push(...chunk.split(""));
      }

      setFullText(accumulatedText);
      setIsDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsStreaming(false);
    }
  };

  const reset = () => {
    setDisplayText("");
    setFullText("");
    setIsDone(false);
    setError(null);
    textQueueRef.current = [];
  };

  return (
    <Card className="w-full flex-1 max-w-4xl mx-auto overflow-hidden border-primary/20 bg-muted/30">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Response Streamer
            </CardTitle>
            <CardDescription className="font-medium">
              Real-time HTTP body streaming with progressive rendering.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!isStreaming && !isDone ? (
              <Button
                onClick={startStream}
                className="gap-2 px-6 font-bold shadow-lg shadow-primary/20"
              >
                <Play className="h-4 w-4" /> Start Stream
              </Button>
            ) : isStreaming ? (
              <Button disabled className="gap-2 px-6 bg-primary/80 font-bold">
                <Loader2 className="h-4 w-4 animate-spin" /> Streaming...
              </Button>
            ) : (
              <Button
                onClick={reset}
                variant="outline"
                className="gap-2 px-6 font-bold"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
        {error && (
          <div className="m-4 p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg font-medium text-sm">
            {error}
          </div>
        )}

        {isDone && (
          <div className="px-6 py-2 bg-primary/5 border-b border-primary/10 flex items-center justify-between animate-in fade-in slide-in-from-top duration-500">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">
              Stream Closed • Final Response Received
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {fullText.length} characters
            </p>
          </div>
        )}

        <div
          ref={scrollRef}
          className="flex-1 p-8 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap selection:bg-primary/20 scrollbar-thin scrollbar-thumb-primary/20"
        >
          {displayText ? (
            <div className="animate-in fade-in duration-300">
              {displayText}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          ) : !isStreaming && !isDone ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 opacity-50">
              <div className="p-4 rounded-full bg-muted border border-dashed border-muted-foreground/50">
                <Play className="h-12 w-12" />
              </div>
              <p className="font-medium">
                Press 'Start Stream' to begin receiving data.
              </p>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
