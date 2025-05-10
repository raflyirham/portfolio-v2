import Image from "next/image";
import { motion } from "motion/react";

import { IoBriefcaseSharp, IoPersonSharp } from "react-icons/io5";
import { FaCode, FaEnvelope } from "react-icons/fa";

import { cn, scrollToSection } from "@/libs/utils";
import useSection from "@/composables/useSection";
import useResponsive from "@/composables/useResponsive";

export default function NavBar() {
  const { currentSection } = useSection();
  const { isMobile, isDesktop } = useResponsive();

  const isActive = (section: string) => {
    return currentSection === section;
  };

  const appendActiveClass = (section: string) => {
    return isActive(section) ? "bg-blue-700" : "bg-transparent";
  };

  const appendNavbarMobileClass = () => {
    if (isMobile) {
      return "bottom-0";
    }
    return "top-5 px-10 md:px-20 xl:px-40";
  };

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
        <button
          className="relative h-8 w-8 cursor-pointer"
          onClick={() => scrollToSection("hero")}
        >
          <Image
            src="/assets/logo/rafly.png"
            alt="Rafly"
            fill
            className="object-cover"
          />
        </button>

        <div className="flex flex-row items-center gap-x-6">
          <button
            className={cn(
              "flex flex-row items-center gap-x-2 text-white text-sm font-clashDisplay font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 cursor-pointer",
              appendActiveClass("about")
            )}
            onClick={() => scrollToSection("about")}
          >
            <IoPersonSharp className="text-white" size={isDesktop ? 12 : 16} />
            {isDesktop && "About"}
          </button>

          <button
            className={cn(
              "flex flex-row items-center gap-x-2 text-white text-sm font-clashDisplay font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 cursor-pointer",
              appendActiveClass("experiences")
            )}
            onClick={() => scrollToSection("experiences")}
          >
            <IoBriefcaseSharp
              className="text-white"
              size={isDesktop ? 12 : 16}
            />
            {isDesktop && "Experiences"}
          </button>

          <button
            className={cn(
              "flex flex-row items-center gap-x-2 text-white text-sm font-clashDisplay font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 cursor-pointer",
              appendActiveClass("projects")
            )}
            onClick={() => scrollToSection("projects")}
          >
            <FaCode className="text-white" size={isDesktop ? 12 : 16} />
            {isDesktop && "Projects"}
          </button>
        </div>

        <button
          className="flex items-center justify-center lg:justify-start gap-x-2 bg-gray-50 font-satoshi font-medium text-blue-700 text-sm px-4 py-2 rounded-full w-fit hover:bg-gray-100 active:bg-gray-20 active:scale-95 transition-all duration-300 cursor-pointer"
          onClick={() => scrollToSection("contact")}
        >
          <FaEnvelope className="text-blue-700" size={isDesktop ? 12 : 16} />
          {isDesktop && "Contact"}
        </button>
      </div>
    </motion.div>
  );
}
