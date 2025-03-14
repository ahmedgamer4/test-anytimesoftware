"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createTask, getTask, updateTask } from "@/lib/task";
import {
  CreateTaskInput,
  createTaskSchema,
  UpdateTaskInput,
  updateTaskSchema,
} from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/lib/category";

export const EditTaskForm = ({ taskId }: { taskId: string }) => {
  const queryClient = useQueryClient();
  const { data: taskData, isLoading: isLoadingTask } = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      return getTask(taskId);
    },
  });
  const form = useForm<UpdateTaskInput>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: taskData?.data.title,
      description: taskData?.data.description || "",
      dueDate: taskData?.data.dueDate || new Date(),
      category: taskData?.data.category?._id || "",
    },
  });

  const { data, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      return res;
    },
  });
  if (isLoadingCategory || isLoadingTask) return <div>Loading</div>;

  async function onSubmit(data: UpdateTaskInput) {
    await updateTask(taskId, data);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 w-full mb-3"
      >
        <div className="text-red-500 text-sm">
          {form.formState.errors.root?.message}
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.data.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <div />
          <Button>Submit</Button>
        </div>
      </form>
    </Form>
  );
};
