"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  CalendarDays,
  RotateCcw,
  Loader2,
  UserRound,
  Mail,
} from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import { getTokenFromserver } from "@/lib/getTokenFromClient";

type BorrowBook = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
};

export default function MyBorrrowsBookPage() {
  const { data: session, isPending } = authClient.useSession();

  const [borrowBooks, setBorrowBooks] = useState<BorrowBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  // Fetch borrowed books
  useEffect(() => {
    if (isPending) return;

  

    const fetchBorrowBooks = async () => {
      try {
        const token = await getTokenFromserver();

        if (!token) {
          toast.error("Authentication token not found!");
          setLoading(false);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrows`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load borrowed books");
        }

        setBorrowBooks(Array.isArray(data) ? data : data.borrows || []);
      } catch (error) {
        console.error("Fetch borrow error:", error);
        toast.error("Failed to load borrowed books!");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowBooks();
  }, [session, isPending]);

  // Return book
  const handleReturnBook = async (id: string) => {
    try {
      setReturningId(id);

      const token = await getTokenFromserver();

      if (!token) {
        toast.error("Authentication token not found!");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/borrows/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to return book");
      }

      setBorrowBooks((previousBooks) =>
        previousBooks.filter((book) => book._id !== id),
      );

      toast.success("Book returned successfully!");
    } catch (error) {
      console.error("Return book error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to return book!",
      );
    } finally {
      setReturningId(null);
    }
  };

  // Date formatting
  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-green-600" />
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <BookOpen className="mb-4 h-14 w-14 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-800">Please Login First</h2>
        <p className="mt-2 text-gray-500">Login to see your borrowed books.</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3">
              <BookOpen className="h-7 w-7 text-green-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Borrows</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your borrowed books and return them easily.
              </p>
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-sm">
            <BookOpen className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-700">Total Borrowed:</span>
            <span className="font-bold text-green-600">
              {borrowBooks.length}
            </span>
          </div>
        </div>

        {/* Empty State */}
        {borrowBooks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-300" />

            <h2 className="text-xl font-bold text-gray-800">
              No Borrowed Books
            </h2>

            <p className="mt-2 text-gray-500">
              You haven&apos;t borrowed any books yet.
            </p>
          </div>
        ) : (
          /* Borrowed Books Table */
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Book
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Borrower
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Borrow Date
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Return Date
                    </th>

                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {borrowBooks.map((book) => (
                    <tr key={book._id} className="transition hover:bg-gray-50">
                      {/* Book Info */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                            {book.bookImage ? (
                              <Image
                                src={book.bookImage}
                                alt={book.bookTitle}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <BookOpen className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {book.bookTitle}
                            </h3>
                            <p className="mt-1 text-xs text-gray-400">
                              Book ID: {book.bookId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Borrower */}
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <p className="flex items-center gap-2 text-sm text-gray-700">
                            <UserRound className="h-4 w-4 text-green-600" />
                            {book.userName || "User"}
                          </p>

                          <p className="flex items-center gap-2 text-xs text-gray-500">
                            <Mail className="h-4 w-4" />
                            {book.userEmail}
                          </p>
                        </div>
                      </td>

                      {/* Borrow Date */}
                      <td className="px-6 py-5">
                        <p className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="h-4 w-4 text-green-600" />
                          {formatDate(book.borrowDate)}
                        </p>
                      </td>

                      {/* Return Date */}
                      <td className="px-6 py-5">
                        <p className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="h-4 w-4 text-orange-500" />
                          {formatDate(book.returnDate)}
                        </p>
                      </td>

                      {/* Return Button */}
                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => handleReturnBook(book._id)}
                          disabled={returningId === book._id}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {returningId === book._id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Returning...
                            </>
                          ) : (
                            <>
                              <RotateCcw className="h-4 w-4" />
                              Return Book
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
