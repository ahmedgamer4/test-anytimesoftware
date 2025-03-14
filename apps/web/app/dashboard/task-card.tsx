import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pen, Trash } from "lucide-react";
import { Task } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "@/lib/task";
import { Dispatch, SetStateAction } from "react";
import { Dialogs } from "./page";
import { DialogTrigger } from "@radix-ui/react-dialog";

export function TaskCard({
  task,
  setDialog,
  setTaskId,
}: {
  task: Task;
  setDialog: Dispatch<SetStateAction<keyof typeof Dialogs>>;
  setTaskId: Dispatch<SetStateAction<string>>;
}) {
  const queryClient = useQueryClient();
  const { mutateAsync: toggleStatus } = useMutation({
    mutationFn: async () => {
      updateTask(task._id, {
        status: task.status === "completed" ? "pending" : "completed",
      });
      task.status = task.status === "completed" ? "pending" : "completed";
    },
  });

  const { mutateAsync: deleteThis } = useMutation({
    mutationFn: async () => {
      deleteTask(task._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <Card
      className={`py-0 overflow-hidden ${task.status === "completed" ? "bg-gray-50" : "bg-white"}`}
    >
      <CardContent className="p-4 relative">
        <div className="mt-4 flex flex-col justify-between">
          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={() => {
                  toggleStatus();
                }}
                className="mt-1"
              />
              <h3
                className={`text-lg font-medium ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
              >
                {task.title}
              </h3>
            </div>

            <p
              className={`text-sm mt-1 mb-3 ${task.status === "completed" ? "text-gray-400" : "text-gray-600"}`}
            >
              {task.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <span
              className={`text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800`}
            >
              {(task.category && task.category.name) || "None"}
            </span>

            <div className="flex space-x-1">
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 cursor-pointer"
                  onClick={() => {
                    setTaskId(task._id);
                    setDialog("UPDATE_TASK");
                  }}
                >
                  <Pen size={16} />
                </Button>
              </DialogTrigger>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 cursor-pointer"
                onClick={() => deleteThis()}
              >
                <Trash size={16} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
