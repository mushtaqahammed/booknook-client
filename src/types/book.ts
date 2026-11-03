/** Shape of a book document as returned by the BookNook API. */
export type BookCardData = {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  image?: string;
  /** Number of copies of this book the library owns in total. */
  totalCopies?: number;
  /** Number of copies currently available for borrowing. */
  availableCopies?: number;
  /** Owner info attached by the add-book page. */
  userId?: string;
  addedBy?: {
    id?: string;
    name: string;
    email: string;
  };
};
