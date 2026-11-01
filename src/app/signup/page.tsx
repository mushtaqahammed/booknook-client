"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ImagePlus, Loader2, UserRoundPen } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlPattern = /^https?:\/\/\S+\.\S+/;

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!name.trim()) {
      errors.name = "Name is required.";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (
      imageUrl.trim() &&
      !urlPattern.test(imageUrl.trim()) &&
      !imageUrl.trim().startsWith("data:image/")
    ) {
      errors.image =
        "Please upload a photo or paste a valid image link (http:// or https://).";
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
      const { data, error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        ...(imageUrl.trim() ? { image: imageUrl.trim() } : {}),
      });

      if (error) {
        toast.error(
          error.message ||
            "Registration failed. Please try again with a different email.",
        );
        return;
      }

      if (data) {
        toast.success("Account created successfully. Welcome to BookNook!");

        // If Better Auth did not create a session automatically, sign in now.
        if (!data.token) {
          await authClient.signIn.email({
            email: email.trim(),
            password,
            callbackURL: "/",
          });
        }

        router.push("/");
      }
    } catch {
      toast.error("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validateImageFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Please choose an image file (JPG, PNG, or WebP).";
    }

    if (file.size > 300 * 1024) {
      return "Image is too large. Please choose one under 300 KB.";
    }

    return null;
  };

  const handleImageFile = (file: File) => {
    const validationError = validateImageFile(file);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Convert the picked photo to a data URI, the same format stored for
    // existing BookNook users, so the navbar avatar can display it directly.
    const reader = new FileReader();

    reader.onload = () => {
      setImageUrl(String(reader.result));
      setImagePreviewFailed(false);
      clearError("image");
    };

    reader.onerror = () => {
      toast.error("Could not read that file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

  return (
    <AuthLayout eyebrow="JOIN THE NOOK" title="Create your account">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <SocialAuthButtons disabled={loading} />

        <div className="relative my-1 text-center">
          <span className="absolute inset-x-0 top-1/2 h-px bg-[#D6D1C8]" />
          <span className="relative inline-block bg-white px-3 text-xs font-medium tracking-wide text-[#777777]">
            or continue with email
          </span>
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-name"
            className="block text-sm font-semibold text-[#191917]"
          >
            Name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearError("name");
            }}
            placeholder="Your full name"
            aria-invalid={Boolean(fieldErrors.name)}
            className="flex h-11 w-full rounded-xl border border-[#D6D1C8] bg-white px-4 py-2.5 text-sm text-[#191917] outline-none transition placeholder:text-[#999999] focus:border-[#A67C45] focus:ring-2 focus:ring-[#A67C45]/10 aria-invalid:border-red-400"
          />
          {fieldErrors.name && (
            <p className="text-xs text-red-600">{fieldErrors.name}</p>
          )}
        </div>

        {/* Profile Image (optional) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span
              id="signup-image-label"
              className="block text-sm font-semibold text-[#191917]"
            >
              Profile Image{" "}
              <span className="font-normal text-[#777777]">(optional)</span>
            </span>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#D6D1C8] px-3 py-1 text-xs font-semibold text-[#555555] transition-colors hover:border-[#A67C45]/60 hover:bg-[#F5F2EC] hover:text-[#A67C45]"
            >
              <ImagePlus size={13} />
              Upload photo
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload profile photo"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleImageFile(file);
                event.target.value = "";
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <Avatar size="lg" className="shrink-0">
              {imageUrl.trim() && !imagePreviewFailed ? (
                <AvatarImage
                  referrerPolicy="no-referrer"
                  src={imageUrl.trim()}
                  alt="Profile image preview"
                  onLoadingStatusChange={(status) =>
                    setImagePreviewFailed(status === "error")
                  }
                />
              ) : null}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>

            {imageUrl.trim() && !imagePreviewFailed && (
              <button
                type="button"
                onClick={() => {
                  setImageUrl("");
                  setImagePreviewFailed(false);
                }}
                className="shrink-0 cursor-pointer rounded-full border border-[#D6D1C8] px-3 py-1 text-xs font-medium text-[#777777] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
              >
                Remove
              </button>
            )}

            <div className="min-w-0 flex-1">
              <input
                id="signup-image"
                type="url"
                value={imageUrl}
                onChange={(event) => {
                  setImageUrl(event.target.value);
                  setImagePreviewFailed(false);
                  clearError("image");
                }}
                placeholder="https://example.com/photo.jpg"
                aria-invalid={Boolean(fieldErrors.image)}
                className="flex h-11 w-full rounded-xl border border-[#D6D1C8] bg-white px-4 py-2.5 text-sm text-[#191917] outline-none transition placeholder:text-[#999999] focus:border-[#A67C45] focus:ring-2 focus:ring-[#A67C45]/10 aria-invalid:border-red-400"
              />
              {fieldErrors.image ? (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.image}</p>
              ) : (
                <p className="mt-1 text-xs text-[#777777]">
                  Paste a link or upload a photo. It appears next to your books.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="signup-email"
            className="block text-sm font-semibold text-[#191917]"
          >
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError("email");
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
            htmlFor="signup-password"
            className="block text-sm font-semibold text-[#191917]"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearError("password");
              }}
              placeholder="At least 8 characters"
              aria-invalid={Boolean(fieldErrors.password)}
              className="flex h-11 w-full rounded-xl border border-[#D6D1C8] bg-white py-2.5 pl-4 pr-11 text-sm text-[#191917] outline-none transition placeholder:text-[#999999] focus:border-[#A67C45] focus:ring-2 focus:ring-[#A67C45]/10 aria-invalid:border-red-400"
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
          {fieldErrors.password ? (
            <p className="text-xs text-red-600">{fieldErrors.password}</p>
          ) : (
            <p className="text-xs text-[#777777]">
              Must be at least 8 characters long.
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#191917] text-sm font-bold text-white transition-colors hover:bg-[#A67C45] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserRoundPen size={17} />
              Create Account
            </>
          )}
        </button>

        <p className="text-center text-sm text-[#555555]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#A67C45] underline-offset-4 transition-colors hover:text-[#191917] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
