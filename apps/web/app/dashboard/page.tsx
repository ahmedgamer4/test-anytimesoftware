"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateTaskForm } from "./create-task-form";
import { TaskCard } from "./task-card";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/lib/task";
import { CategorySelect, CreateCategoryForm } from "./category-select";
import { EditTaskForm } from "./edit-task-form";

export enum Dialogs {
  CREATE_TASK = "create-task",
  UPDATE_TASK = "update-task",
  CREATE_CATEGORY = "create-category",
  NONE = "none",
}
export default function TaskDashboard() {
  const [taskId, setTaskId] = useState("");
  const [currentDialog, setDialog] = useState<keyof typeof Dialogs>("NONE");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],

    queryFn: async () => {
      const res = await getTasks();
      return res;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  const filteredTasks = data?.data
    .filter((task) => {
      if (filter === "all") return true;
      return (task.category?.name || "").toLowerCase() === filter.toLowerCase();
    })
    .filter((task) => {
      if (!searchQuery) return true;
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <Dialog>
      <div className="lg:w-10/12 xl:8/12 m-auto p-6 space-y-6">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="md:flex gap-4">
              <Input
                placeholder="Search tasks..."
                className="mb-2 flex-1 md:mb-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div className="flex gap-4">
                <CategorySelect
                  setDialog={setDialog}
                  filter={filter}
                  setFilter={setFilter}
                />

                <DialogTrigger asChild>
                  <Button onClick={() => setDialog("CREATE_TASK")}>
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  {currentDialog === "CREATE_TASK" && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Create a New Task</DialogTitle>
                      </DialogHeader>
                      <CreateTaskForm />
                    </>
                  )}
                  {currentDialog === "CREATE_CATEGORY" && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Create Category</DialogTitle>
                      </DialogHeader>
                      <CreateCategoryForm />
                    </>
                  )}
                  {currentDialog === "UPDATE_TASK" && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Create Category</DialogTitle>
                      </DialogHeader>
                      <EditTaskForm taskId={taskId} />
                    </>
                  )}
                </DialogContent>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
              {filteredTasks?.map((task) => (
                <TaskCard key={task._id} task={task} setDialog={setDialog} setTaskId={setTaskId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
