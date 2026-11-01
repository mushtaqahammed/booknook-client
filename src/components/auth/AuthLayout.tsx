"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";

import logo2 from "@/assets/logo2.png";

type AuthLayoutProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

/** Shared layout shell for the Login and Register pages. */
const AuthLayout = ({ eyebrow, title, children }: AuthLayoutProps) => {
  return (
    <main className="w-full bg-[#F5F2EC] px-4 py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#D6D1C8] bg-white shadow-sm lg:grid-cols-2">
        {/* Brand Panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#191917] p-10 text-white lg:flex">
          {/* Decorative book spines */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex w-40 items-end gap-3 pr-6 opacity-90"
            aria-hidden="true"
          >
            <span className="h-4/5 w-9 rounded-t-md bg-[#A67C45]/40" />
            <span className="h-3/5 w-7 rounded-t-md bg-[#D6B47C]/30" />
            <span className="h-2/3 w-5 rounded-t-md bg-[#F5F2EC]/15" />
            <span className="h-1/2 w-8 rounded-t-md bg-[#A67C45]/25" />
          </div>

          <div className="relative">
            <Image
              src={logo2}
              alt="BookNook"
              height={52}
              width={144}
              priority
              className="w-36 object-contain object-left brightness-0 invert"
            />
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#A67C45]/40 px-4 py-2 text-xs font-bold tracking-[0.25em] text-[#D6B47C]">
              <BookOpen size={14} />
              WELCOME TO BOOKNOOK
            </span>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[#D6D1C8]">
              A cozy corner for book lovers. Discover new stories, borrow
              freely, and share the reads you love with a growing community.
            </p>

            <div className="mt-8 flex items-center gap-2 text-xs tracking-widest text-[#A67C45]">
              <span>READ</span>
              <span className="text-[#D6B47C]">✦</span>
              <span>GROW</span>
              <span className="text-[#D6B47C]">✦</span>
              <span>REPEAT</span>
            </div>
          </div>

          <p className="relative text-xs text-[#D6D1C8]/70">
            © 2026 BookNook. All rights reserved.
          </p>
        </aside>

        {/* Form Panel */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="lg:hidden">
            {/* Compact brand mark on small screens */}
            <div className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#191917]">
              <BookOpen size={24} className="text-[#D6B47C]" />
            </div>
          </div>

          <p className="text-xs font-bold tracking-[0.3em] text-[#A67C45]">
            {eyebrow}
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#191917] sm:text-3xl">
            {title}
          </h1>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
