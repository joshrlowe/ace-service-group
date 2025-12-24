"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordReadOnly, setPasswordReadOnly] = useState(true);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Clear any autofilled values on mount
  useEffect(() => {
    // Small delay to ensure browser has attempted autofill
    const timer = setTimeout(() => {
      if (passwordInputRef.current) {
        passwordInputRef.current.value = "";
        setPasswordValue("");
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Basic validation
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back!");
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md bg-[#121212] border-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
          <CardDescription className="text-[#CFCFCF]">
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            autoComplete="off"
            noValidate
          >
            {/* Hidden fake fields to trick password managers */}
            <input
              type="text"
              name="username"
              autoComplete="username"
              style={{ display: "none" }}
              tabIndex={-1}
            />
            <input
              type="password"
              name="password_fake"
              autoComplete="new-password"
              style={{ display: "none" }}
              tabIndex={-1}
            />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                error={errors.email}
                disabled={isLoading}
                autoComplete="off"
                data-form-type="other"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                ref={passwordInputRef}
                id="password"
                name="password"
                type="password"
                placeholder=""
                required
                error={errors.password}
                disabled={isLoading}
                autoComplete="new-password"
                value={passwordValue}
                onChange={(e) => {
                  setPasswordValue(e.target.value);
                  setPasswordReadOnly(false);
                }}
                onFocus={() => {
                  setPasswordReadOnly(false);
                  // Clear any autofilled value on focus
                  if (
                    passwordInputRef.current &&
                    passwordInputRef.current.value &&
                    !passwordValue
                  ) {
                    passwordInputRef.current.value = "";
                    setPasswordValue("");
                  }
                }}
                readOnly={passwordReadOnly}
                data-form-type="other"
                data-1p-ignore
                data-lpignore="true"
                data-bwignore="true"
              />
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
