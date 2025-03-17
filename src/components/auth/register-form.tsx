"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    // Reset error state
    setError(null);
    setLoading(true);
    
    try {
      // Check if passwords match
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      
      // Send registration request to API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        // Handle error response
        setError(result.error || "Registration failed");
        toast.error(result.error || "Registration failed");
        return;
      }
      
      // Registration successful
      toast.success("Account created successfully!");
      
      // Redirect to login page
      router.push("/auth/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <Form form={form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            rules={{ required: "Email is required" }}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input id="email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            }}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input id="password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === form.watch("password") || "Passwords do not match",
            }}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input id="confirmPassword" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
