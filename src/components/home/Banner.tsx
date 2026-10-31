"use client";

import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

import { BookOpen, Sparkles, LibraryBig, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    subtitle: "WELCOME TO BOOKNOOK",
    title: "Discover Stories That Stay With You.",
    description:
      "Explore a wonderful collection of books, discover new authors, and find your next favorite story.",
    badge: "Your next chapter starts here",
    icon: BookOpen,
    number: "01",
  },
  {
    subtitle: "EXPLORE YOUR NEXT READ",
    title: "Every Book Opens a New World.",
    description:
      "From timeless classics to modern masterpieces, find the perfect book for every mood.",
    badge: "Explore endless possibilities",
    icon: LibraryBig,
    number: "02",
  },
  {
    subtitle: "READ • LEARN • GROW",
    title: "A Little Reading Goes a Long Way.",
    description:
      "Build your reading habit, discover inspiring ideas, and make every page count.",
    badge: "Make reading a daily habit",
    icon: Sparkles,
    number: "03",
  },
];

const Banner = () => {
  return (
    <section className="w-full px-4 pt-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
        <Swiper
          modules={[Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          navigation={true}
          pagination={{ clickable: true }}
          className="booknook-swiper"
        >
          {slides.map((slide) => {
            const Icon = slide.icon;

            return (
              <SwiperSlide key={slide.number}>
                <div className="grid min-h-[390px] grid-cols-1 items-center gap-8 bg-[#f5f2ec] px-7 py-12 sm:px-12 lg:grid-cols-2 lg:px-16">
                  {/* Text Content */}
                  <div className="order-2 lg:order-1">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#a67c45]/30 bg-white px-4 py-2 text-xs font-bold tracking-widest text-[#a67c45]">
                      <Sparkles size={14} />
                      {slide.subtitle}
                    </span>

                    <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#191917] sm:text-5xl">
                      {slide.title}
                    </h1>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-[#555555] sm:text-base">
                      {slide.description}
                    </p>

                    <p className="mt-4 text-xs font-medium tracking-wide text-[#a67c45]">
                      ✦ {slide.badge}
                    </p>

                    <Link
                      href="/books"
                      className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#191917] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#a67c45]"
                    >
                      Browse Books
                      <ArrowRight size={17} />
                    </Link>
                  </div>

                  {/* Decorative Book Design */}
                  <div className="order-1 flex items-center justify-center lg:order-2">
                    <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-[#a67c45]/20 bg-white sm:h-80 sm:w-80">
                      <div className="absolute inset-5 rounded-full border border-dashed border-[#a67c45]/30" />

                      <div className="relative flex h-44 w-36 -rotate-6 flex-col items-center justify-center rounded-lg border border-[#ffffff]/30 bg-[#191917] p-5 text-center shadow-2xl transition-transform duration-500 hover:rotate-0 sm:h-52 sm:w-40">
                        <Icon size={42} className="text-[#d6b47c]" />

                        <div className="mt-5 h-px w-12 bg-[#d6b47c]/60" />

                        <p className="mt-4 text-lg font-bold tracking-wider text-white">
                          BOOK
                        </p>

                        <p className="mt-1 text-xs tracking-[0.25em] text-[#d6b47c]">
                          NOOK
                        </p>
                      </div>

                      <div className="absolute -right-2 top-10 rounded-xl bg-white p-3 shadow-lg">
                        <BookOpen className="text-[#a67c45]" size={24} />
                      </div>

                      <div className="absolute -bottom-1 left-2 rounded-full bg-[#a67c45] px-4 py-2 text-xs font-semibold text-white shadow-lg">
                        Read More ✦
                      </div>

                      <span className="absolute right-8 bottom-12 text-3xl text-[#a67c45]/40">
                        ✦
                      </span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

    
    </section>
  );
};

export default Banner;
