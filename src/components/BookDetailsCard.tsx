"use client";

import Image from "next/image";
import {
  BookOpen,
  UserRound,
  CalendarDays,
  Mail,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  image: string;
  createdAt?: string;
  addedBy?: {
    name: string;
    email: string;
  };
};

export default function BookDetailsCard({ book }: { book: Book }) {
  
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/books"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#555555] transition hover:text-[#A67C45]"
      >
        <ArrowLeft size={17} />
        Back to Books
      </Link>

      <div className="overflow-hidden rounded-3xl border border-[#D6D1C8] bg-white shadow-sm">
        <div className="grid md:grid-cols-2">
          {/* Book Image */}
          <div className="relative min-h-[350px] bg-[#F5F2EC]">
            {book.image ? (
              <Image
                src={book.image}
                alt={book.title}
                fill
                unoptimized
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-sm text-[#555555]">No Image Available</p>
              </div>
            )}
          </div>

          {/* Book Information */}
          <div className="flex flex-col p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <span className="rounded-full bg-[#F5F2EC] px-4 py-2 text-xs font-bold text-[#A67C45]">
                {book.category}
              </span>

              <span className="text-xs text-[#777777]">Book Details</span>
            </div>

            <h1 className="text-3xl font-bold text-[#191917]">{book.title}</h1>

            <p className="mt-2 text-sm font-medium text-[#A67C45]">
              By {book.author}
            </p>

            <div className="my-6 h-px bg-[#D6D1C8]" />

            <h2 className="mb-3 text-lg font-bold text-[#191917]">
              About This Book
            </h2>

            <p className="text-sm leading-7 text-[#555555]">
              {book.description}
            </p>

            {book.createdAt && (
              <div className="mt-5 flex items-center gap-2 text-xs text-[#777777]">
                <CalendarDays size={16} />
                Added on{" "}
                {new Date(book.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            )}

            {/* Added By */}
            <div className="mt-7 rounded-2xl border border-[#D6D1C8] bg-[#F5F2EC]/60 p-4">
              <h3 className="mb-4 text-sm font-bold text-[#191917]">
                Added By
              </h3>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white">
                  <UserRound className="text-[#A67C45]" size={21} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#191917]">
                    {book.addedBy?.name || "Unknown User"}
                  </p>

                  <p className="flex items-center gap-1 break-all text-xs text-[#777777]">
                    <Mail size={13} />
                    {book.addedBy?.email || "Email unavailable"}
                  </p>
                </div>
              </div>
            </div>

            {/* Borrow Button */}
            <button
              type="button"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#191917] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#A67C45]"
            >
              <BookOpen size={19} />
              Borrow This Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
