import BookDetailsCard from "@/components/BookDetailsCard";


const BookDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  console.log("Book ID:", id);

  const res = await fetch(`http://localhost:8000/books/${id}`, {
    cache: "no-store",
  });

  console.log("Status:", res.status);
  console.log("Content-Type:", res.headers.get("content-type"));

  if (!res.ok) {
    const text = await res.text();
    console.log("Server response:", text);

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F2EC]">
        <p className="text-lg font-semibold text-[#555555]">Book not found</p>
      </div>
    );
  }

  const data = await res.json();

  console.log("Book:", data);

  return (
    <main className="min-h-screen bg-[#F5F2EC] px-4 py-10 sm:py-14">
      <BookDetailsCard book={data} />
    </main>
  );
};

export default BookDetailPage;
