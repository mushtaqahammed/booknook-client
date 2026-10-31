import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo2.png";

const links = [
  { label: "All Books", href: "/all-books", active: true },
  { label: "Add Book", href: "/add-book", active: false },
  { label: "My Books", href: "/my-books", active: false },
  { label: "My Borrows", href: "/my-borrows", active: false },
];

const Navbar = () => {
  return (
    <div className="w-full bg-[#F5F2EC] px-4 pt-5">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-[#D6D1C8] bg-white py-2 pl-5 pr-2 shadow-sm">
        {/* Brand + Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={Logo}
              alt="BookNook Logo"
              width={160}
              height={10}
              className="object-contain"
            />

            <span className="text-[15px] font-bold tracking-tight text-[#191917]">
              Home
            </span>
          </Link>

          {/* Navigation Links */}
          <ul className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    link.active
                      ? "bg-[#F5F2EC] text-[#A67C45]"
                      : "text-[#555555] hover:bg-[#F5F2EC] hover:text-[#A67C45]"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-[#555555] transition-colors hover:text-[#A67C45] sm:block"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-[#191917] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#A67C45]"
          >
            Register
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
