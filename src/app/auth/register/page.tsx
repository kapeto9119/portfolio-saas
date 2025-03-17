import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Portfolio Builder",
  description: "Create your Portfolio Builder account",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo / Home Link */}
        <div className="flex justify-center">
          <Link href="/" className="inline-flex items-center">
            <span className="sr-only">Portfolio Builder</span>
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-lg font-bold">PB</span>
            </div>
          </Link>
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
          <div className="mt-6">
            <p className="text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link href="/terms" className="font-medium text-primary hover:text-primary/90">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium text-primary hover:text-primary/90">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
