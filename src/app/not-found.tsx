import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F5F2EC] px-6 text-center">
      {/* Book Icon */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#191917]">
        <BookOpen size={48} className="text-[#A67C45]" />
      </div>

      {/* Error Code */}
      <h1 className="text-8xl font-extrabold text-[#A67C45]">404</h1>

      {/* Error Message */}
      <h2 className="mt-4 text-3xl font-bold text-[#191917]">
        Page Not Found!
      </h2>

      <p className="mt-3 max-w-md text-base leading-7 text-[#777777]">
        Oops! The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      {/* Back to Home Button */}
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#191917] px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-[#A67C45] hover:shadow-lg"
      >
        <Home size={18} />
        Back to Home
      </Link>
    </main>
  );
}
