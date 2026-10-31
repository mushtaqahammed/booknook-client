import React from "react";
import { BookOpen, LibraryBig } from "lucide-react";
import Link from "next/link";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  image?: string;
};

const AllBooksPage = async () => {
  const res = await fetch("http://localhost:8000/books", {
    cache: "no-store",
  });
  const data: Book[] = await res.json();

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
            <article
              key={book._id}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#D6D1C8] transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-[#A67C45]/40"
            >
              {/* Cover Image */}
              <div className="relative h-56 w-full overflow-hidden bg-[#F5F2EC]">
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <BookOpen size={36} className="text-[#D6D1C8]" />
                </div>

                {book.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.image}
                    alt=""
                    aria-hidden="true"
                    className="relative h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : null}

                <span className="absolute left-4 top-4 rounded-full bg-[#A67C45] px-3 py-1 text-xs font-bold text-white shadow">
                  {book.category}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-[#191917]">
                  {book.title}
                </h3>

                <p className="mt-1 text-sm font-medium text-[#A67C45]">
                  by {book.author}
                </p>

                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#555555]">
                  {book.description}
                </p>

                <div className="mt-5 border-t border-[#F5F2EC] pt-4">
                  <Link
                  href={`/all-books/${book._id}`}>
                    <button className="w-full rounded-xl bg-[#191917] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#A67C45]">
                      Read More
                    </button>
                  </Link>
                </div>
              </div>
            </article>
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
