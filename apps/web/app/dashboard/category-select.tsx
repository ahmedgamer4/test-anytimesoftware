"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCategory, getCategories } from "@/lib/category";
import { CreateCategoryInput, createCategorySchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { Dialogs } from "./page";

type CategorySelectProps = {
  setDialog: Dispatch<SetStateAction<keyof typeof Dialogs>>;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
};

export const CategorySelect = ({
  setDialog,
  filter,
  setFilter,
}: CategorySelectProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await getCategories();
      return res;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <Select value={filter} onValueChange={setFilter}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="All" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key={"all"} value={"all"}>
          All
        </SelectItem>
        {data?.data.map((category) => (
          <SelectItem key={category._id} value={category.name}>
            {category.name}
          </SelectItem>
        ))}
        <DialogTrigger asChild>
          <Button onClick={() => setDialog("CREATE_CATEGORY")} variant={"ghost"} className="w-full">
            <Plus />
          </Button>
        </DialogTrigger>
      </SelectContent>
    </Select>
  );
};

export const CreateCategoryForm = () => {
  const queryClient = useQueryClient();
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: CreateCategoryInput) {
    await createCategory(data.name);
    queryClient.invalidateQueries({ queryKey: ["categories"] });
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full">Create</Button>
      </form>
    </Form>
  );
};
