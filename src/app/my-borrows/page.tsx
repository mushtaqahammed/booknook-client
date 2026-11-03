"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { BookOpen, CalendarDays, Loader2, RotateCcw } from "lucide-react";

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

const MyBorrrowsBookPage = () => {
  const { data: session } = authClient.useSession();

  const [borrowBooks, setBorrowBooks] = useState<BorrowBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);

  // Get Borrowed Books
  useEffect(() => {
    const fetchBorrows = async () => {
      if (!session?.user?.email) return;
      

      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/borrows?email=${encodeURIComponent(
            session.user.email,
          )}`,
          {
            cache: "no-store",
          },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch borrowed books");
        }

        const data = await res.json();

        setBorrowBooks(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load borrowed books!");
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [session?.user?.email]);

  // Return Book
  const handleReturn = async (id: string) => {
    try {
      setReturningId(id);

   const res = await fetch(
     `${process.env.NEXT_PUBLIC_API_URL}/borrows/${id}?email=${encodeURIComponent(
       session?.user?.email || "",
     )}`,
     {
       method: "DELETE",
       cache: "no-store",
     },
   );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to return book!");
        return;
      }

      setBorrowBooks((current) => current.filter((book) => book._id !== id));

      toast.success("Book returned successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setReturningId(null);
    }
  };

  if (!session) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="animate-spin text-[#A67C45]" size={30} />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#A67C45]">
          Your Reading Journey
        </p>

        <h1 className="text-3xl font-bold text-[#191917] sm:text-4xl">
          My Borrowed Books
        </h1>

        <p className="mt-3 text-sm text-[#777777]">
          Manage your borrowed books and keep track of return dates.
        </p>
      </div>

      {/* Borrow Summary */}
      <div className="mb-7 rounded-2xl border border-[#D6D1C8] bg-[#F5F2EC] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
            <BookOpen className="text-[#A67C45]" size={24} />
          </div>

          <div>
            <p className="text-sm text-[#777777]">Total Borrowed Books</p>
            <h2 className="text-2xl font-bold text-[#191917]">
              {borrowBooks.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[250px] items-center justify-center">
          <Loader2 className="animate-spin text-[#A67C45]" size={32} />
        </div>
      ) : borrowBooks.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-[#D6D1C8] bg-white py-16 text-center">
          <BookOpen size={45} className="mx-auto mb-4 text-[#A67C45]" />

          <h2 className="text-xl font-bold text-[#191917]">
            No Borrowed Books Yet!
          </h2>

          <p className="mt-2 text-sm text-[#777777]">
            You haven&apos;t borrowed any books yet.
          </p>
        </div>
      ) : (
        /* Borrowed Books Table */
        <div className="overflow-x-auto rounded-2xl border border-[#D6D1C8] bg-white shadow-sm">
          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-[#F5F2EC]">
              <tr className="text-sm text-[#555555]">
                <th className="px-6 py-5 font-semibold">Book</th>
                <th className="px-6 py-5 font-semibold">Borrow Date</th>
                <th className="px-6 py-5 font-semibold">Return Date</th>
                <th className="px-6 py-5 text-center font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#D6D1C8]">
              {borrowBooks.map((book) => (
                <tr key={book._id} className="transition hover:bg-[#F5F2EC]/50">
                  {/* Book Image and Title */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F5F2EC]">
                        {book.bookImage ? (
                          <Image
                            src={book.bookImage}
                            alt={book.bookTitle}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <BookOpen className="m-auto text-[#A67C45]" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-[#191917]">
                          {book.bookTitle}
                        </h3>

                        <p className="mt-1 text-xs text-[#777777]">
                          Borrowed by you
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Borrow Date */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-[#555555]">
                      <CalendarDays size={16} className="text-[#A67C45]" />
                      {book.borrowDate}
                    </div>
                  </td>

                  {/* Return Date */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-[#555555]">
                      <CalendarDays size={16} className="text-[#A67C45]" />
                      {book.returnDate}
                    </div>
                  </td>

                  {/* Return Button */}
                  <td className="px-6 py-5 text-center">
                    <button
                      onClick={() => handleReturn(book._id)}
                      disabled={returningId === book._id}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#191917] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#A67C45] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {returningId === book._id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <RotateCcw size={15} />
                      )}
                      Return Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBorrrowsBookPage;
