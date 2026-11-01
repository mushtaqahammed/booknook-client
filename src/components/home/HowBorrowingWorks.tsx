import Link from "next/link";
import {
  Search,
  BookOpen,
  Handshake,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Books",
    description: "Browse our collection and discover the books you love.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose Your Book",
    description: "Select your favorite book and check its availability.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Borrow & Enjoy",
    description: "Complete the borrowing process and enjoy your reading time.",
    icon: Handshake,
  },
  {
    number: "04",
    title: "Return on Time",
    description:
      "Return your book by its due date and make room for your next adventure.",
    icon: CalendarCheck,
  },
];

const HowBorrowingWorks = () => {
  return (
    <section className="w-full bg-[#F5F2EC] px-4 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-block rounded-full border border-[#A67C45]/30 bg-white px-4 py-2 text-xs font-bold tracking-[0.2em] text-[#A67C45]">
            SIMPLE & EASY PROCESS
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#191917] sm:text-4xl">
            How Borrowing Works
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#555555] sm:text-base">
            Borrow your favorite books in just a few simple steps. Explore,
            borrow, read, and return — enjoy your reading journey with BookNook.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-[#D6D1C8] bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#A67C45]/50 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F5F2EC] transition-colors duration-300 group-hover:bg-[#191917]">
                    <Icon
                      size={27}
                      className="text-[#A67C45] transition-colors duration-300 group-hover:text-[#D6B47C]"
                    />
                  </div>

                  <span className="text-3xl font-bold text-[#D6D1C8]">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-bold text-[#191917]">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#555555]">
                  {step.description}
                </p>

                <div className="mt-6 h-1 w-12 rounded-full bg-[#A67C45] transition-all duration-300 group-hover:w-20" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#191917] px-7 py-9 text-center sm:flex-row sm:px-12 sm:text-left">
          <div>
            <h3 className="text-2xl font-bold text-white">
              Ready to Find Your Next Read?
            </h3>
            <p className="mt-2 text-sm text-[#D6D1C8]">
              Discover amazing stories and start your reading journey today.
            </p>
          </div>

          <Link
            href="/all-books"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#A67C45] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#D6B47C] hover:text-[#191917]"
          >
            Explore All Books
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowBorrowingWorks;
