"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookMarked,
  Eye,
  LibraryBig,
  NotebookTabs,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { EditBookModal, DeleteBookModal } from "@/components/BookActions";
import { authClient } from "@/lib/auth-client";
import { getTokenFromserver } from "@/lib/getTokenFromClient";
import { toast } from "@/components/ui/toast";
import type { BookCardData } from "@/types/book";

const MyBooksPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [books, setBooks] = useState<BookCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingBook, setEditingBook] = useState<BookCardData | null>(null);
  const [deletingBook, setDeletingBook] = useState<BookCardData | null>(null);

  useEffect(() => {
    if (isPending || !user?.id) return;

    let cancelled = false;

    const fetchMyBooks = async () => {
      try {
        setLoading(true);

        // Backend routes need the Better Auth JWT, not the session token
        const token = await getTokenFromserver();

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-books/${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Failed to load your books.");
        }

        const data = (await res.json()) as BookCardData[];

        if (!cancelled) {
          setBooks(data);
          setFailed(false);
        }
      } catch {
        if (!cancelled) {
          setFailed(true);
          toast.error("Could not load your books. Please retry.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMyBooks();

    return () => {
      cancelled = true;
    };
  }, [isPending, user?.id, refreshKey]);

  const handleRetry = () => {
    setFailed(false);
    setLoading(true);
    setRefreshKey((key) => key + 1);
  };

  const handleSaved = (updated: BookCardData) => {
    setBooks((current) =>
      current.map((book) => (book._id === updated._id ? updated : book)),
    );
    setEditingBook(null);
    toast.success(`"${updated.title}" updated successfully.`);
  };

  const handleDeleted = (removed: BookCardData) => {
    setBooks((current) => current.filter((book) => book._id !== removed._id));
    setDeletingBook(null);
    toast.success(`"${removed.title}" was deleted.`);
  };

  /* ---------------------------------- States --------------------------------- */

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#F5F2EC] px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-2xl bg-white" />
            <div className="mx-auto h-4 w-40 animate-pulse rounded-full bg-white" />
            <div className="mx-auto mt-3 h-8 w-64 animate-pulse rounded-xl bg-white" />
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#D6D1C8]">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-5 border-b border-[#F5F2EC] px-6 py-5 last:border-b-0"
              >
                <div className="h-16 w-12 animate-pulse rounded-lg bg-[#F5F2EC]" />
                <div className="h-4 flex-1 animate-pulse rounded-full bg-[#F5F2EC]" />
                <div className="hidden h-4 w-32 animate-pulse rounded-full bg-[#F5F2EC] md:block" />
                <div className="hidden h-4 w-20 animate-pulse rounded-full bg-[#F5F2EC] lg:block" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#F5F2EC] px-4 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#D6D1C8]">
          <BookMarked size={30} className="text-[#A67C45]" />
        </div>

        <h1 className="text-2xl font-bold text-[#191917] sm:text-3xl">
          Sign in to see your books
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#555555]">
          Your shelf is personal. Log in to view, edit, and manage every book
          you have added to BookNook.
        </p>

        <div className="mt-7 flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-[#D6D1C8] bg-white px-6 py-3 text-sm font-semibold text-[#555555] transition-colors hover:border-[#A67C45]/60 hover:text-[#A67C45]"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-full bg-[#191917] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#A67C45]"
          >
            Create Account
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F2EC] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[#D6D1C8]">
            <NotebookTabs size={28} className="text-[#A67C45]" />
          </div>

          <p className="text-xs font-bold tracking-[0.2em] text-[#A67C45]">
            YOUR PERSONAL SHELF
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#191917] sm:text-4xl">
            My Books
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#555555]">
            {books.length} {books.length === 1 ? "book" : "books"} added by you —
            view, edit, or remove any of them at any time.
          </p>
        </div>

        {failed ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-[#D6D1C8]">
            <h2 className="text-lg font-bold text-[#191917]">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-[#555555]">
              We could not reach the library. Please try again.
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-6 cursor-pointer rounded-full border border-[#D6D1C8] bg-white px-6 py-2.5 text-sm font-semibold text-[#555555] transition-colors hover:border-[#A67C45]/60 hover:text-[#A67C45]"
            >
              Retry
            </button>
          </div>
        ) : books.length === 0 ? (
          /* Empty state */
          <div className="rounded-3xl bg-white p-14 text-center shadow-sm ring-1 ring-[#D6D1C8]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F2EC]">
              <LibraryBig size={28} className="text-[#A67C45]" />
            </div>

            <h2 className="text-xl font-bold text-[#191917]">No books yet</h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#555555]">
              Your shelf is empty. Add your first book and it will show up here
              with edit and delete controls.
            </p>

            <Link
              href="/add-book"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#A67C45] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#D6B47C] hover:text-[#191917]"
            >
              <Plus size={16} />
              Add Your First Book
            </Link>
          </div>
        ) : (
          /* Books table */
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#D6D1C8]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#F5F2EC] bg-[#F5F2EC]/60">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#555555]">
                      Title
                    </th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-[#555555]">
                      Author
                    </th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-[#555555]">
                      Genre
                    </th>
                    <th className="hidden px-4 py-4 text-xs font-bold uppercase tracking-wider text-[#555555] lg:table-cell">
                      Description
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#555555]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((book, index) => (
                    <tr
                      key={book._id}
                      className={`border-b border-[#F5F2EC] transition-colors last:border-b-0 hover:bg-[#F5F2EC]/50 ${
                        index % 2 === 1 ? "bg-[#F5F2EC]/30" : ""
                      }`}
                    >
                      {/* Title with cover thumbnail */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-md bg-[#F5F2EC] ring-1 ring-[#D6D1C8]">
                            {book.image ? (
                              <Image
                                src={book.image}
                                alt={`Cover of ${book.title}`}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <LibraryBig
                                  size={16}
                                  className="text-[#A67C45]"
                                />
                              </div>
                            )}
                          </div>

                          <Link
                            href={`/all-books/${book._id}`}
                            className="max-w-[220px] truncate text-sm font-bold text-[#191917] transition-colors hover:text-[#A67C45]"
                          >
                            {book.title}
                          </Link>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="px-4 py-4 text-sm text-[#555555]">
                        <span className="line-clamp-2 max-w-[160px]">
                          {book.author}
                        </span>
                      </td>

                      {/* Genre */}
                      <td className="px-4 py-4">
                        <span className="inline-block rounded-full bg-[#F5F2EC] px-3 py-1 text-xs font-semibold text-[#A67C45] ring-1 ring-[#D6D1C8]">
                          {book.category}
                        </span>
                      </td>

                      {/* Description (the API has no publish year field) */}
                      <td className="hidden px-4 py-4 lg:table-cell">
                        <p className="line-clamp-2 max-w-[260px] text-sm leading-5 text-[#777777]">
                          {book.description}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/all-books/${book._id}`}
                            aria-label={`View ${book.title}`}
                            title="View"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D6D1C8] text-[#555555] transition-colors hover:border-[#A67C45]/60 hover:bg-[#F5F2EC] hover:text-[#A67C45]"
                          >
                            <Eye size={15} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setEditingBook(book)}
                            aria-label={`Edit ${book.title}`}
                            title="Edit"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D6D1C8] text-[#555555] transition-colors hover:border-[#A67C45]/60 hover:bg-[#F5F2EC] hover:text-[#A67C45]"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingBook(book)}
                            aria-label={`Delete ${book.title}`}
                            title="Delete"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#D6D1C8] text-[#555555] transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSaved={handleSaved}
        />
      )}

      {deletingBook && (
        <DeleteBookModal
          book={deletingBook}
          onClose={() => setDeletingBook(null)}
          onDeleted={handleDeleted}
        />
      )}
    </main>
  );
};

export default MyBooksPage;
