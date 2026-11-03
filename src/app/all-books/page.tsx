import React from "react";
import { BookOpen, LibraryBig } from "lucide-react";

import BookCard, { type BookCardData } from "@/components/BookCard";

const AllBooksPage = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
    cache: "no-store",
  });
  const data: BookCardData[] = await res.json();

  return (
    <main className="min-h-screen bg-[#F5F2EC] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
            <LibraryBig size={28} className="text-[#A67C45]" />
          </div>

          <p className="text-xs font-bold tracking-[0.2em] text-[#A67C45]">
            EXPLORE THE SHELVES
          </p>

          <h2 className="mt-1 text-3xl font-bold text-[#191917] sm:text-4xl">
            All Books
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#555555]">
            Browse every book in the BookNook collection and find your next
            favorite story.
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>

        {/* Empty state */}
        {data.length === 0 && (
          <div className="rounded-3xl bg-white p-14 text-center shadow-sm ring-1 ring-[#D6D1C8]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F2EC]">
              <BookOpen size={28} className="text-[#A67C45]" />
            </div>

            <h3 className="text-xl font-bold text-[#191917]">No books yet</h3>

            <p className="mt-2 text-sm text-[#555555]">
              Be the first to share a book with the community.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default AllBooksPage;
