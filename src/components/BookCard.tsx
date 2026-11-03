"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import type { BookCardData } from "@/types/book";

export type { BookCardData };

const BookCard = ({ book }: { book: BookCardData }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const hasValidImage = Boolean(book.image && !imageFailed);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#D6D1C8] transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-[#A67C45]/40">
      {/* Cover */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-[#F5F2EC]">
        {hasValidImage ? (
          <Image
            src={book.image as string}
            alt={`Cover of ${book.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          // Fallback cover when no image is available or it fails to load
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
            aria-hidden="true"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D6D1C8] bg-white">
              <BookOpen size={28} className="text-[#D6D1C8]" />
            </div>
            <p className="max-w-[18ch] truncate text-sm font-semibold text-[#777777]">
              {book.title}
            </p>
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-[#A67C45] px-3 py-1 text-xs font-bold text-white shadow">
          {book.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-[#191917]">{book.title}</h3>

        <p className="mt-1 text-sm font-medium text-[#A67C45]">
          by {book.author}
        </p>

        {(() => {
          const copies = book.availableCopies ?? 1;

          return (
            <p
              className={`mt-3 flex items-center gap-1.5 text-xs font-semibold ${
                copies > 0 ? "text-[#A67C45]" : "text-red-600"
              }`}
            >
              <BookOpen size={14} />
              {copies > 0
                ? `${copies} ${copies === 1 ? "copy" : "copies"} available`
                : "Currently unavailable"}
            </p>
          );
        })()}

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#555555]">
          {book.description}
        </p>

        <div className="mt-5 border-t border-[#F5F2EC] pt-4">
          <Link
            href={`/all-books/${book._id}`}
            className="block w-full rounded-xl bg-[#191917] px-6 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-[#A67C45]"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
