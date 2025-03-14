import { z } from "zod";

export type BaseMongoDocument = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Task = BaseMongoDocument & {
  title: string;
  description: string;
  dueDate: Date;
  status: "pending" | "completed";
  category: null | Category;
  user: string;
};

export const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  dueDate: z.date(),
  category: z.string().min(24),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  dueDate: z.date().optional(),
  category: z.string().optional(),
  status: z.enum(["pending", "completed"]).optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const createCategorySchema = z.object({
  name: z.string().min(3),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type Category = BaseMongoDocument & {
  name: string;
  user: string;
};
