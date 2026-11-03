"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTokenFromserver } from "@/lib/getTokenFromClient";



const categories = ["Fiction", "Science", "History", "Kids", "Others"];

const initialForm = {
  title: "",
  author: "",
  category: "",
  description: "",
};

export default function AddBookPage() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
  const [imageName, setImageName] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  setLoading(true);
  setMessage("");

  try {
    // Check logged-in user
    if (!session?.user) {
      throw new Error("Please sign in first!");
    }
    const token = await getTokenFromserver();

    // Book information
    const bookData = {
      ...form,
      image: imageName,
      userId: session.user.id,
      addedBy: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    };

    // Send request to backend
    const res = await fetch("http://localhost:8000/add-book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to add book");
    }

    console.log("Book added:", result);

    setMessage("Book added successfully!");
    toast.success("Book added successfully!");

    setForm(initialForm);
    setImageName("");

    setTimeout(() => {
      router.push("/all-books");
    }, 500);
  } catch (error) {
    console.error("Add Book Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";

    setMessage(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="min-h-screen bg-[#F5F2EC] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#555555] transition hover:text-[#A67C45]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Form Card */}
        <Card className="rounded-3xl bg-white shadow-sm ring-[#D6D1C8] [--card-spacing:2rem]">
          {/* Heading */}
          <CardHeader className="items-center justify-items-center gap-2 text-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F2EC]">
              <BookOpen size={28} className="text-[#A67C45]" />
            </div>

            <p className="text-xs font-bold tracking-[0.2em] text-[#A67C45]">
              SHARE YOUR COLLECTION
            </p>

            <CardTitle className="text-3xl font-bold text-[#191917] sm:text-4xl">
              Add a New Book
            </CardTitle>

            <CardDescription className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#555555]">
              Add a book to BookNook and help readers discover their next
              favorite story.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Book Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191917]">
                  Book Title <span className="text-[#A67C45]">*</span>
                </label>

                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Enter book title"
                  className="w-full rounded-xl border border-[#D6D1C8] bg-white px-4 py-3 text-sm text-[#191917] outline-none transition placeholder:text-[#999999] focus:border-[#A67C45] focus:ring-2 focus:ring-[#A67C45]/10"
                />
              </div>

              {/* Author Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191917]">
                  Author Name <span className="text-[#A67C45]">*</span>
                </label>

                <input
                  type="text"
                  required
                  value={form.author}
                  onChange={(e) => update("author", e.target.value)}
                  placeholder="Enter author's name"
                  className="w-full rounded-xl border border-[#D6D1C8] bg-white px-4 py-3 text-sm text-[#191917] outline-none transition placeholder:text-[#999999] focus:border-[#A67C45] focus:ring-2 focus:ring-[#A67C45]/10"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191917]">
                  Category <span className="text-[#A67C45]">*</span>
                </label>

                <select
                  required
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="w-full rounded-xl border border-[#D6D1C8] bg-white px-4 py-3 text-sm text-[#555555] outline-none transition focus:border-[#A67C45] focus:ring-2 focus:ring-[#A67C45]/10"
                >
                  <option value="" disabled>
                    Select a book category
                  </option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Book Image Link */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191917]">
                  Book Image <span className="text-[#A67C45]">*</span>
                </label>

                <div className="rounded-2xl border-2 border-dashed border-[#D6D1C8] bg-[#F5F2EC]/50 p-5">
                  <input
                    type="url"
                    required
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    placeholder="Enter book image link"
                    className="w-full rounded-xl border border-[#D6D1C8] bg-white px-4 py-3 text-sm text-[#191917] outline-none transition placeholder:text-[#999999] focus:border-[#A67C45] focus:ring-2 focus:ring-[#A67C45]/10"
                  />

                  {imageName.startsWith("http") && (
                    <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#D6D1C8] bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageName}
                        alt="Book cover preview"
                        onError={(event) =>
                          event.currentTarget.classList.add("hidden")
                        }
                        onLoad={(event) =>
                          event.currentTarget.classList.remove("hidden")
                        }
                        className="h-full w-full object-contain p-3"
                      />
                      <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-[#191917]/80 px-3 py-1 text-[11px] font-medium text-white">
                        Preview
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#191917]">
                  Short Description <span className="text-[#A67C45]">*</span>
                </label>

                <textarea
                  rows={5}
                  required
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Write a short description about this book..."
                  className="w-full resize-none rounded-xl border border-[#D6D1C8] bg-white px-4 py-3 text-sm text-[#191917] outline-none transition placeholder:text-[#999999] focus:border-[#A67C45] focus:ring-2 focus:ring-[#A67C45]/10"
                />
              </div>

              {/* User Information */}
              <div className="rounded-2xl border border-[#D6D1C8] bg-[#F5F2EC]/60 p-5">
                <h3 className="mb-4 text-sm font-bold text-[#191917]">
                  Added By
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#777777]">
                      User Name
                    </label>

                    <input
                      type="text"
                      value={session?.user?.name || "Not signed in"}
                      readOnly
                      className="w-full rounded-xl border border-[#D6D1C8] bg-white px-4 py-3 text-sm text-[#777777] outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#777777]">
                      User Email
                    </label>

                    <input
                      type="email"
                      value={session?.user?.email || "Sign in to add books"}
                      readOnly
                      className="w-full rounded-xl border border-[#D6D1C8] bg-white px-4 py-3 text-sm text-[#777777] outline-none"
                    />
                  </div>
                </div>

                <p className="mt-3 text-xs text-[#888888]">
                  Your account information will be attached to this book.
                </p>
              </div>

              {/* Message */}
              {message && (
                <p
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    message.includes("successfully")
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#191917] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#A67C45] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={19} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus size={19} />
                    Add Book
                  </>
                )}
              </button>
            </form>
          </CardContent>

          <CardFooter className="justify-center rounded-b-3xl border-t-0 bg-transparent text-center">
            <p className="text-xs text-[#777777]">
              Every book has a story. Share yours with BookNook.
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
