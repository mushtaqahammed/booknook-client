"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  UserRound,
  CalendarDays,
  Mail,
  ArrowLeft,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getTokenFromserver } from "@/lib/getTokenFromClient";
import Link from "next/link";

export type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  image: string;
  createdAt?: string;
  availableCopies?: number;
  totalCopies?: number;
  addedBy?: {
    name: string;
    email: string;
  };
};





import { toast } from "react-toastify";



 

export default function BookDetailsCard({ book }: { book: Book }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableCopies, setAvailableCopies] = useState(
    book.availableCopies ?? 1,
  );

  const hasValidImage = Boolean(book.image && !imageFailed);


const { data: session } = authClient.useSession();







const handleBorrow = async () => {
  try {
    if (!session?.user) {
      toast.error("Please login first!");
      return;
    }

    if (availableCopies <= 0) {
      toast.error("No copies of this book are available right now!");
      return;
    }

    setLoading(true);

    // JWT token required by the backend for protected routes
    const token = await getTokenFromserver();

    const bookData = {
      bookId: book._id,
      bookTitle: book.title,
      bookImage: book.image || "",
      userName: session.user.name,
      userEmail: session.user.email,
      borrowDate: new Date().toISOString().split("T")[0],
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });

    const data = await res.json();

    if (res.status === 409) {
      if (data.message?.includes("already borrowed")) {
        setIsBorrowed(true);
      }

      toast.warning(data.message || "You have already borrowed this book!");
      return;
    }

    if (!res.ok) {
      toast.error(data.message || "Borrow failed!");
      return;
    }

    setIsBorrowed(true);
    // This book now has one fewer copy available (All Books page reflects it too)
    setAvailableCopies((current) => Math.max(0, current - 1));
    toast.success("Book borrowed successfully!");
  } catch (error) {
    console.error(error);

    toast.error(
      error instanceof Error ? error.message : "Something went wrong!",
    );
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/all-books"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#555555] transition hover:text-[#A67C45]"
      >
        <ArrowLeft size={17} />
        Back to Books
      </Link>

      <div className="overflow-hidden rounded-3xl border border-[#D6D1C8] bg-white shadow-sm">
        <div className="grid md:grid-cols-2">
          {/* Book Image */}
          <div className="relative min-h-[300px] bg-[#F5F2EC] md:min-h-[420px]">
            {hasValidImage ? (
              <Image
                src={book.image}
                alt={`Cover of ${book.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-6"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D6D1C8] bg-white">
                  <BookOpen size={28} className="text-[#D6D1C8]" />
                </div>
                <p className="text-sm font-medium text-[#777777]">
                  No cover image available
                </p>
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

            <span
              className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                availableCopies > 0
                  ? "bg-[#F5F2EC] text-[#A67C45]"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <BookOpen size={13} />
              {availableCopies > 0
                ? `${availableCopies} ${availableCopies === 1 ? "copy" : "copies"} available`
                : "Out of copies"}
            </span>

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

            <button
              type="button"
              onClick={handleBorrow}
              disabled={loading || isBorrowed || availableCopies <= 0}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#191917] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#A67C45] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <BookOpen size={19} />

              {loading
                ? "Processing..."
                : isBorrowed
                  ? "Already Borrowed"
                  : availableCopies <= 0
                    ? "No Copies Available"
                    : "Borrow This Book"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
