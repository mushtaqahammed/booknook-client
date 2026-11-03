import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F2EC]">
      <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-[#191917]">
        <BookOpen size={38} className="text-[#A67C45]" />
      </div>

      <h2 className="mt-5 text-2xl font-bold text-[#191917]">BookNook</h2>

      <p className="mt-2 text-sm text-[#777777]">
        Your next favorite book is waiting...
      </p>

      <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-[#D6D1C8]">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-[#A67C45]" />
      </div>
    </div>
  );
}
