import Link from "next/link";

import { BookOpen, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const contacts = [
  {
    icon: Mail,
    label: "support@booknook.com",
    href: "mailto:support@booknook.com",
  },
  {
    icon: Phone,
    label: "+880 1234-567890",
    href: "tel:+8801234567890",
  },
  {
    icon: MapPin,
    label: "Dhaka, Bangladesh",
    href: "#",
  },
];

const socials = [
  { icon: FaFacebookF, label: "Facebook", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaYoutube, label: "YouTube", href: "#" },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[#F5F2EC] px-4 pb-5 pt-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#D6D1C8] bg-white px-6 py-10 shadow-sm sm:px-10">
        {/* Top Brand Section */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#D6D1C8] pb-8 sm:flex-row sm:items-center">
          <div>
            <Link href="/" className="flex w-fit items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#191917]">
                <BookOpen className="h-6 w-6 text-[#D6B47C]" />
              </span>

              <span className="text-2xl font-bold tracking-tight">
                <span className="text-[#191917]">Book</span>
                <span className="text-[#A67C45]">Nook</span>
                <span className="text-[#191917]">.</span>
              </span>
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#555555]">
              Your cozy corner for discovering, exploring, and enjoying books.
              Find your next favorite read with BookNook.
            </p>
          </div>

          <Link
            href="/all-books"
            className="flex w-fit items-center gap-2 rounded-full bg-[#191917] px-5 py-3 text-sm font-medium text-white transition-all hover:bg-[#A67C45]"
          >
            Explore Books
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 border-b border-[#D6D1C8] py-9 sm:grid-cols-2 lg:grid-cols-3">
          {/* Contact Information */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-[#191917]">
              Get In Touch
            </h3>

            <ul className="space-y-4">
              {contacts.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group flex w-fit items-center gap-3 text-sm text-[#555555] transition-colors hover:text-[#A67C45]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F2EC] transition-colors group-hover:bg-[#191917]">
                      <Icon
                        size={16}
                        className="text-[#A67C45] transition-colors group-hover:text-[#D6B47C]"
                      />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-[#191917]">
              Follow Our Journey
            </h3>

            <p className="mb-5 max-w-xs text-sm leading-6 text-[#555555]">
              Stay connected with BookNook and discover more stories, books, and
              reading inspiration.
            </p>

            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F2EC] text-[#A67C45] transition-all hover:-translate-y-1 hover:bg-[#191917] hover:text-[#D6B47C]"
                >
                  <Icon size={17} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-center sm:flex-row">
          <p className="text-xs text-[#555555]">
            © 2026 BookNook. All rights reserved.
          </p>

          <p className="text-xs text-[#555555]">
            Made with <span className="text-[#A67C45]">♥</span> for book lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
