import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { SiGithub } from "react-icons/si";

export default function ProjectCard({
  image,
  title,
  skills,
  liveLink,
  repoLink,
}: Readonly<{
  image: string;
  title: string;
  skills: React.ReactNode[];
  liveLink?: string;
  repoLink: string;
}>) {
  return (
    <div className="bg-[#131316] rounded-lg border border-[#202024] hover:border-blue-700 transition-all duration-300">
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <div className="flex flex-col gap-4 p-10">
        <h3 className="text-white text-lg md:text-xl lg:text-2xl font-clashDisplay font-medium">
          {title}
        </h3>

        <div className="flex flex-row flex-wrap gap-2">{skills}</div>
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        transition={{
          duration: 1,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        whileInView={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        viewport={{
          once: true,
        }}
        className="flex flex-col xl:flex-row items-center xl:items-start gap-2 px-4 md:px-10 pb-10"
      >
        {liveLink && (
          <Link
            href={liveLink}
            target="_blank"
            className="flex flex-row items-center justify-center xl:justify-start gap-2 bg-blue-700 text-white text-xs md:text-sm lg:text-sm font-satoshi font-medium py-2 px-4 rounded-full hover:bg-blue-600 active:bg-blue-800 active:scale-95 transition-all duration-300 cursor-pointer w-full xl:w-fit"
          >
            Preview
            <FiExternalLink size={16} />
          </Link>
        )}
        {repoLink && (
          <Link
            href={repoLink}
            target="_blank"
            className="flex flex-row items-center justify-center xl:justify-start gap-2 bg-black text-white text-xs md:text-sm lg:text-sm font-satoshi font-medium py-2 px-4 rounded-full hover:bg-zinc-900 active:bg-zinc-950 active:scale-95 transition-all duration-300 cursor-pointer w-full xl:w-fit"
          >
            GitHub
            <SiGithub size={20} color="white" />
          </Link>
        )}
      </motion.div>
    </div>
  );
}
