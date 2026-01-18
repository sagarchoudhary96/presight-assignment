import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, LayoutGrid, RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TaskService } from "@/services/task.service";

interface TaskState {
  id: string;
  status: "pending" | "completed";
  result?: string;
}

export function TaskTracker() {
  const taskService = new TaskService();
  const [tasks, setTasks] = useState<TaskState[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);

  const startTasks = async () => {
    setIsInitializing(true);
    setTasks([]);

    // Create 20 tasks in parallel
    const taskPromises = Array.from({ length: 20 }, (_, i) =>
      taskService
        .createTask(`Task ${i + 1}`)
        .then(({ taskId }) => ({ id: taskId, status: "pending" as const }))
        .catch((error) => {
          console.error(`Failed to create task ${i + 1}`, error);
          return null;
        })
    );

    const results = await Promise.all(taskPromises);
    const validTasks = results.filter(
      (t): t is { id: string; status: "pending" } => t !== null
    );

    setTasks(validTasks);
    setIsInitializing(false);
  };

  useEffect(() => {
    startTasks();

    // Listen for completion
    taskService.onTaskCompleted(({ taskId, result }) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "completed", result } : t
        )
      );
    });
  }, []);

  return (
    <Card className="w-full h-full flex flex-col border-primary/20 bg-muted/30">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
              <LayoutGrid className="h-6 w-6 text-primary" />
              Task Processor
            </CardTitle>
            <CardDescription className="font-medium">
              Requests queued on server, processed in workers, and notified via
              WebSockets.
            </CardDescription>
          </div>
          <Button
            onClick={startTasks}
            disabled={isInitializing}
            variant="outline"
            className="gap-2 font-bold"
          >
            <RotateCcw
              className={`h-4 w-4 ${isInitializing ? "animate-spin" : ""}`}
            />
            Restart 20 Tasks
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all duration-500 flex flex-col gap-3 ${
                task.status === "completed"
                  ? "bg-primary/5 border-primary/20 shadow-sm"
                  : "bg-background border-dashed border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                  Task {index + 1}
                </span>
                {task.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-primary animate-in zoom-in duration-300" />
                ) : (
                  <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                )}
              </div>

              <div className="space-y-1">
                <p
                  className={`text-xs font-bold ${
                    task.status === "completed"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {task.status === "completed" ? "Success" : "Pending"}
                </p>
                <p className="text-[11px] font-mono text-muted-foreground/80 line-clamp-2 leading-relaxed">
                  {task.status === "completed"
                    ? task.result
                    : "Waiting for worker..."}
                </p>
              </div>

              <div className="mt-auto pt-2 border-t border-muted/50">
                <p className="text-[9px] font-mono text-muted-foreground/40 truncate">
                  {task.id}
                </p>
              </div>
            </div>
          ))}

          {tasks.length === 0 && !isInitializing && (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="font-medium">Initializing background tasks...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
