"use client";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type UserAvatarProps = {
  /** The authenticated user from the Better Auth session. */
  user: SessionUser | null | undefined;
  size?: "default" | "sm" | "lg";
};

const getInitials = (user: SessionUser | null | undefined) => {
  const name = user?.name || user?.email || "";
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  // Initials derived from the user's own data; the empty-string case falls
  // back to an empty box instead of any hardcoded or default image.
  return initials || "·";
};

/**
 * Displays the authenticated user's profile image sourced from the Better
 * Auth session (`user.image`). Falls back to the user's initials whenever no
 * image is available or the image fails to load. No default image is used.
 */
const UserAvatar = ({ user, size = "default" }: UserAvatarProps) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Only ever renders the session-provided image; undefined when absent so
  // Base UI swaps in the initials fallback.
  const src = user?.image || undefined;

  return (
    // Remount when the image URL changes so a freshly updated profile
    // picture is loaded immediately instead of reusing stale load state.
    <Avatar key={src || "initials"} size={size}>
      {src && !imageFailed ? (
        <AvatarImage
          referrerPolicy="no-referrer"
          src={src}
          alt={user?.name || user?.email || "User avatar"}
          onLoadingStatusChange={(status) => {
            setImageFailed(status === "error");
          }}
        />
      ) : null}
      <AvatarFallback>{getInitials(user)}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
