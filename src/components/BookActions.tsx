"use client";

import * as React from "react";
import { Loader2, X } from "lucide-react";

import { toast } from "@/components/ui/toast";
import type { BookCardData } from "@/types/book";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

/** Shared centered modal shell styled with the BookNook palette. */
const Modal = ({ title, onClose, children }: ModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#191917]/60 p-4 animate-in fade-in duration-100"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-[#D6D1C8] animate-in zoom-in-95 fade-in duration-100"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-[#F5F2EC] px-6 py-4">
          <h3 className="text-lg font-bold text-[#191917]">{title}</h3>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#777777] transition-colors hover:bg-[#F5F2EC] hover:text-[#191917]"
          >
            <X size={17} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

const modalInputClass =
  "w-full rounded-xl border border-[#D6D1C8] bg-white px-4 py-2.5 text-sm text-[#191917] outline-none transition placeholder:text-[#999999] focus:border-[#A67C45] focus:ring-2 focus:ring-[#A67C45]/10";

type EditBookModalProps = {
  book: BookCardData;
  onClose: () => void;
  onSaved: (book: BookCardData) => void;
};

export const EditBookModal = ({ book, onClose, onSaved }: EditBookModalProps) => {
  const [form, setForm] = React.useState({
    title: book.title,
    author: book.author,
    category: book.category,
    description: book.description,
    image: book.image || "",
  });
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (saving) return;
    setSaving(true);

    try {
      const res = await fetch(`http://localhost:8000/books/${book._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(
          errorBody?.message || "Could not save your changes. Please try again.",
        );
      }

      const updated = await res.json();
      onSaved({ ...book, ...form, ...updated });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not save your changes. Please try again.",
      );
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Book" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="edit-title" className="block text-sm font-semibold text-[#191917]">
            Book Title
          </label>
          <input
            id="edit-title"
            type="text"
            required
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className={modalInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edit-author" className="block text-sm font-semibold text-[#191917]">
            Author Name
          </label>
          <input
            id="edit-author"
            type="text"
            required
            value={form.author}
            onChange={(event) => setForm({ ...form, author: event.target.value })}
            className={modalInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edit-category" className="block text-sm font-semibold text-[#191917]">
            Category
          </label>
          <input
            id="edit-category"
            type="text"
            required
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            className={modalInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edit-image" className="block text-sm font-semibold text-[#191917]">
            Book Image Link
          </label>
          <input
            id="edit-image"
            type="url"
            value={form.image}
            onChange={(event) => setForm({ ...form, image: event.target.value })}
            placeholder="https://example.com/cover.jpg"
            className={modalInputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edit-description" className="block text-sm font-semibold text-[#191917]">
            Short Description
          </label>
          <textarea
            id="edit-description"
            rows={4}
            required
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            className={`${modalInputClass} resize-none`}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-[#D6D1C8] px-4 py-2.5 text-sm font-semibold text-[#555555] transition-colors hover:bg-[#F5F2EC]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#191917] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#A67C45] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

type DeleteBookModalProps = {
  book: BookCardData;
  onClose: () => void;
  onDeleted: (book: BookCardData) => void;
};

export const DeleteBookModal = ({ book, onClose, onDeleted }: DeleteBookModalProps) => {
  const [deleting, setDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);

    try {
      const res = await fetch(`http://localhost:8000/books/${book._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(
          errorBody?.message || "Could not delete this book. Please try again.",
        );
      }

      onDeleted(book);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not delete this book. Please try again.",
      );
      setDeleting(false);
    }
  };

  return (
    <Modal title="Delete Book" onClose={onClose}>
      <p className="text-sm leading-6 text-[#555555]">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-[#191917]">“{book.title}”</span>?
        This action cannot be undone.
      </p>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-xl border border-[#D6D1C8] px-4 py-2.5 text-sm font-semibold text-[#555555] transition-colors hover:bg-[#F5F2EC]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting && <Loader2 size={15} className="animate-spin" />}
          {deleting ? "Deleting..." : "Delete Book"}
        </button>
      </div>
    </Modal>
  );
};
