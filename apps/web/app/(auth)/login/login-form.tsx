"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoginInput, loginSchema, loginUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    const res = await loginUser(data);
    if (res?.status !== 200)
      form.setError("root", { message: res?.data.message });
    else {
      router.push("/");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border p-6 rounded-xl space-y-5 w-full mb-3"
      >
        <h1 className="text-xl font-bold">Login</h1>
        <p className="text-sm text-gray-700">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis,
          sed.
        </p>
        <div className="text-red-500 text-sm">
          {form.formState.errors.root?.message}
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full">Login</Button>
        <p className="text-gray-700 text-sm">
          Do not have an account?{" "}
          <a className="text-blue-500" href={"/register"}>
            Create an account
          </a>
        </p>
      </form>
    </Form>
  );
}
