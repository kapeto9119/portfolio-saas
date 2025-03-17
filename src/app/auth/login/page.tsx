import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Portfolio Builder",
  description: "Login to your Portfolio Builder account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-background/50">
      <div className="w-full sm:mx-auto sm:max-w-md">
        {/* Logo / Home Link */}
        <Link 
          href="/" 
          className="inline-flex items-center justify-center w-full gap-2 mb-8"
        >
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground text-xl font-bold">PB</span>
          </div>
        </Link>

        {/* Heading */}
        <h1 className="text-center text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          Welcome back
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-8 w-full sm:mx-auto sm:max-w-md">
        <div className="bg-card/50 backdrop-blur-xl px-4 py-8 shadow-xl shadow-black/5 ring-1 ring-black/5 dark:ring-white/10 sm:rounded-xl sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
