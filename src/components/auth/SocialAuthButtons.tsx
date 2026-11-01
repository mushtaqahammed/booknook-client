"use client";

import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const providers = [
  {
    id: "google" as const,
    label: "Continue with Google",
    icon: <FaGoogle size={16} />,
  },
  {
    id: "github" as const,
    label: "Continue with GitHub",
    icon: <FaGithub size={16} />,
  },
];

type SocialAuthButtonsProps = {
  disabled?: boolean;
};

const SocialAuthButtons = ({ disabled }: SocialAuthButtonsProps) => {
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: "google" | "github") => {
    if (pendingProvider) return;

    setPendingProvider(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      // On success Better Auth redirects to the provider; if instead we get an
      // error (for example, the provider is not configured yet), inform the
      // user so they are never left waiting.
      if (error) {
        toast.error(
          `${provider === "google" ? "Google" : "GitHub"} sign-in isn't available right now. Please use your email and password instead.`,
        );
      }
    } finally {
      setPendingProvider(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {providers.map((provider) => (
        <button
          key={provider.id}
          type="button"
          disabled={disabled || pendingProvider === provider.id}
          onClick={() => handleSocialSignIn(provider.id)}
          className="flex h-11 cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-[#D6D1C8] bg-white px-4 text-sm font-semibold text-[#191917] transition-colors hover:border-[#A67C45]/60 hover:bg-[#F5F2EC] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pendingProvider === provider.id ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#D6D1C8] border-t-[#A67C45]" />
          ) : (
            provider.icon
          )}
          {provider.id === "google" ? "Google" : "GitHub"}
        </button>
      ))}
    </div>
  );
};

export default SocialAuthButtons;
