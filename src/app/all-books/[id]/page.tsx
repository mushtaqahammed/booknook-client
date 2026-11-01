import BookDetailsCard from "@/components/BookDetailsCard";

const BookDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const res = await fetch(`http://localhost:8000/books/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-[#F5F2EC] px-4 text-center">
        <h1 className="text-2xl font-bold text-[#191917]">Book not found</h1>
        <p className="max-w-sm text-sm text-[#555555]">
          The book you are looking for may have been removed or does not exist.
        </p>
      </main>
    );
  }

  const data = await res.json();

  return (
    <main className="min-h-screen bg-[#F5F2EC] px-4 py-10 sm:py-14">
      <BookDetailsCard book={data} />
    </main>
  );
};

export default BookDetailPage;
