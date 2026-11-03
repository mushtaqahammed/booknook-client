"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message ||
            "Sign in failed. Please check your email and password.",
        );
        return;
      }

      if (data) {
        toast.success("Welcome back! You're signed in to BookNook.");
        router.push("/");
      }
    } catch {
      toast.error("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    `flex h-11 w-full rounded-xl border bg-white px-4 py-2.5 pr-11 text-sm text-[#191917] outline-none transition placeholder:text-[#999999] focus:ring-2 focus:ring-[#A67C45]/10 ${
      hasError
        ? "border-red-400 focus-visible:border-red-400"
        : "border-[#D6D1C8] focus:border-[#A67C45]"
    }`;

  return (
    <AuthLayout eyebrow="WELCOME BACK" title="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>


        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="block text-sm font-semibold text-[#191917]"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldErrors.email) {
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }
            }}
            placeholder="m@example.com"
            aria-invalid={Boolean(fieldErrors.email)}
            className="flex h-11 w-full rounded-xl border border-[#D6D1C8] bg-white px-4 py-2.5 text-sm text-[#191917] outline-none transition placeholder:text-[#999999] focus:border-[#A67C45] focus:ring-2 focus:ring-[#A67C45]/10 aria-invalid:border-red-400"
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-password"
            className="block text-sm font-semibold text-[#191917]"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((current) => ({
                    ...current,
                    password: undefined,
                  }));
                }
              }}
              placeholder="Enter your password"
              aria-invalid={Boolean(fieldErrors.password)}
              className={inputClass(Boolean(fieldErrors.password))}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1 top-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#777777] transition-colors hover:bg-[#F5F2EC] hover:text-[#A67C45]"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-xs text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        {/* Remember me */}
        <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-[#555555] select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-[#D6D1C8] text-[#A67C45] accent-[#A67C45]"
          />
          Remember me on this device
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#191917] text-sm font-bold text-white transition-colors hover:bg-[#A67C45] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight size={17} />
            </>
          )}
        </button>

        <p className="text-center text-sm text-[#555555]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#A67C45] underline-offset-4 transition-colors hover:text-[#191917] hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
