"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { FaCode } from "react-icons/fa";
import { IoHomeSharp } from "react-icons/io5";

import useResponsive from "@/composables/useResponsive";
import { cn } from "@/libs/utils";

export default function ProjectPageNav() {
  const { isMobile, isDesktop } = useResponsive();

  const appendNavbarMobileClass = () => {
    if (isMobile) {
      return "bottom-0";
    }
    return "top-5 px-10 md:px-20 xl:px-40";
  };

  const linkClass =
    "flex flex-row items-center gap-x-2 text-white text-sm font-clashDisplay font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 0 : -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "flex flex-row items-center justify-center fixed z-50 w-full",
        appendNavbarMobileClass()
      )}
    >
      <div className="flex flex-row items-center justify-between bg-black border border-[#202024] transition-all duration-300 rounded-xl px-5 py-4 w-full">
        <Link href="/" className="relative h-8 w-8 shrink-0">
          <Image
            src="/assets/logo/rafly.png"
            alt="Rafly"
            fill
            className="object-cover"
          />
        </Link>

        <div className="flex flex-1 justify-center items-center gap-x-4 sm:gap-x-6">
          <Link href="/" className={linkClass}>
            <IoHomeSharp className="text-white" size={isDesktop ? 12 : 16} />
            {isDesktop && "Home"}
          </Link>

          <Link href="/#projects" className={linkClass}>
            <FaCode className="text-white" size={isDesktop ? 12 : 16} />
            {isDesktop && "Projects"}
          </Link>
        </div>

        <div
          className="h-10 w-10 shrink-0 sm:w-[7.5rem]"
          aria-hidden
        />
      </div>
    </motion.div>
  );
}
