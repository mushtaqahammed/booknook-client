"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import BookCard from "@/components/BookCard";
import type { BookCardData } from "@/types/book";

export default function NewArrivals() {
  const [books, setBooks] = useState<BookCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/new-arrivals")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch books");
        return res.json();
      })
      .then((data) => setBooks(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-[#191917] md:text-4xl">
          New Arrivals
        </h2>
        <p className="mt-3 text-[#777777]">
          Explore our latest collection of books.
        </p>
      </div>

      {loading ? (
        <p className="py-10 text-center">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="py-10 text-center">No books available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/all-books"
          className="inline-block rounded-xl bg-[#191917] px-8 py-3 font-bold text-white transition hover:bg-[#A67C45]"
        >
          See All Books
        </Link>
      </div>
    </section>
  );
}
