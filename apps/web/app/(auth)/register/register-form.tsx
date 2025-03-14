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
import { RegisterInput, registerSchema, registerUser } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      linkedInUrl: "",
    },
  });

  async function onSubmit(data: RegisterInput) {
    const res = await registerUser(data);
    if (res?.status !== 201)
      form.setError("root", { message: res?.data.message });
    else {
      router.push("/login");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border p-6 rounded-xl space-y-3 w-full mb-3"
      >
        <h1 className="text-xl font-bold">Create a New Account</h1>
        <p className="text-sm text-gray-700">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Facilis,
          sed.
        </p>
        <div className="text-red-500 text-sm">
          {form.formState.errors.root?.message}
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="linkedInUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn URL</FormLabel>
              <FormControl>
                <Input placeholder="Your LinkedIn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full">Sign Up</Button>
        <p className="text-gray-700 text-sm">
          Already have an account?{" "}
          <a className="text-blue-500" href={"/login"}>
          Login
          </a>
        </p>
      </form>
    </Form>
  );
}
