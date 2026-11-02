"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import {
  BookMarked,
  ChevronDown,
  LogOut,
  Menu,
  NotebookTabs,
  X,
} from "lucide-react";


import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import UserAvatar from "@/components/UserAvatar";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

const links = [
  { label: "All Books", href: "/all-books" },
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;



  const [menuOpen, setMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  const accountLinks = [links[2], links[3]];

  const handleSignOut = async () => {
    if (signingOut) return;

    setSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(
          error.message ||
            "Something went wrong while signing out. Please try again.",
        );
        return;
      }

      setPopoverOpen(false);
      toast.success("Signed out successfully. See you soon!");
      router.push("/");
    } finally {
      setSigningOut(false);
    }
  };

  const navLinkClass = (href: string) =>
    `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
      isActive(href)
        ? "bg-[#F5F2EC] text-[#A67C45]"
        : "text-[#555555] hover:bg-[#F5F2EC] hover:text-[#A67C45]"
    }`;

  return (
    <div className="sticky top-0 z-50 w-full bg-[#F5F2EC]/90 px-4 py-3 backdrop-blur-xl transition-all duration-300">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[#D6D1C8]/80 bg-white/95 py-2 pl-5 pr-2 shadow-md shadow-[#191917]/5 transition-all duration-300">
        {/* Brand */}
        <Link href="/" className="flex w-fit items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#191917]">
            <BookOpen className="h-6 w-6 text-[#D6B47C]" />
          </span>

          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#191917]">Book</span>
            <span className="text-[#A67C45]">Nook</span>
            <span className="text-[#191917]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-1 sm:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className={navLinkClass(link.href)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              {/* Base UI renders its own native button for the trigger, so no
                  nested <button> is used here. */}
              <PopoverTrigger
                aria-label="Open account menu"
                className="group flex cursor-pointer items-center gap-1.5 rounded-full border border-transparent p-0.5 pr-1.5 transition-colors hover:border-[#D6D1C8] hover:bg-[#F5F2EC] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
              >
                {/* Shows the session's latest user.image; initials when
                    absent or when the image fails to load. */}
                <UserAvatar user={user} size="lg" />

                <ChevronDown
                  size={15}
                  className={`text-[#777777] transition-transform duration-200 ${
                    popoverOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </PopoverTrigger>

              <PopoverContent
                className="w-72 rounded-2xl border-[#D6D1C8] p-2.5"
                align="end"
                side="bottom"
                sideOffset={8}
              >
                {/* User identity */}
                <PopoverHeader className="flex items-center gap-3 rounded-xl bg-[#F5F2EC] p-3">
                  <UserAvatar user={user} size="lg" />

                  <div className="min-w-0">
                    <PopoverTitle className="truncate text-sm font-semibold text-[#191917]">
                      {user.name}
                    </PopoverTitle>
                    <PopoverDescription className="break-all text-xs text-[#555555]">
                      {user.email}
                    </PopoverDescription>
                  </div>
                </PopoverHeader>

                {/* Menu items */}
                <div className="flex flex-col gap-0.5 p-1">
                  {accountLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setPopoverOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#555555] transition-colors hover:bg-[#F5F2EC] hover:text-[#A67C45]"
                    >
                      {link.href === "/my-books" ? (
                        <BookMarked size={16} />
                      ) : (
                        <NotebookTabs size={16} />
                      )}
                      {link.label}
                    </Link>
                  ))}

                  <div className="my-1.5 h-px bg-[#F5F2EC]" />

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LogOut size={16} />
                    {signingOut ? (
                      <span className="flex items-center gap-2">
                        Signing out
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                      </span>
                    ) : (
                      "Sign Out"
                    )}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-[#555555] transition-colors hover:bg-[#F5F2EC] hover:text-[#A67C45] sm:block"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-[#191917] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A67C45]"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#555555] transition-colors hover:bg-[#F5F2EC] hover:text-[#A67C45] sm:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-[#D6D1C8] bg-white p-3 shadow-sm sm:hidden">
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-xs font-bold tracking-[0.2em] text-[#A67C45]">
              MENU
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#555555] transition-colors hover:bg-[#F5F2EC]"
            >
              <X size={18} />
            </button>
          </div>

          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-[#F5F2EC] text-[#A67C45]"
                      : "text-[#555555] hover:bg-[#F5F2EC] hover:text-[#A67C45]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {!user && (
            <div className="mt-2 flex items-center gap-2 border-t border-[#F5F2EC] px-2 pt-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-full border border-[#D6D1C8] px-4 py-2.5 text-center text-sm font-semibold text-[#555555] transition-colors hover:bg-[#F5F2EC] hover:text-[#A67C45]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-full bg-[#191917] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#A67C45]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
