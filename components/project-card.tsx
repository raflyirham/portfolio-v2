import Image from "next/image";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { SiGithub } from "react-icons/si";

export default function ProjectCard({
  slug,
  shortDescription,
  image,
  title,
  skills,
  liveLink,
  repoLink,
  thumbnailHeightClass = "h-48",
}: Readonly<{
  slug: string;
  shortDescription?: string;
  image: string;
  title: string;
  skills: React.ReactNode[];
  liveLink?: string;
  repoLink: string;
  /** Tailwind height class for the image area (e.g. h-56). */
  thumbnailHeightClass?: string;
}>) {
  const detailHref = `/projects/${slug}`;

  return (
    <div className="rounded-lg border border-[#202024] bg-[#131316] transition-all duration-300 hover:border-blue-700">
      <Link href={detailHref} className="block">
        <div className={`relative w-full ${thumbnailHeightClass}`}>
          <Image
            src={image}
            alt={title}
            fill
            className="rounded-t-lg object-cover"
          />
        </div>
        <div className="flex flex-col gap-3 p-10 pb-4">
          <h3 className="font-clashDisplay text-lg font-medium text-white md:text-xl lg:text-2xl">
            {title}
          </h3>
          {shortDescription ? (
            <p className="line-clamp-3 font-satoshi text-sm leading-relaxed text-gray-400">
              {shortDescription}
            </p>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-row flex-wrap gap-2 px-10 pb-6">{skills}</div>

      <div className="flex flex-col items-center gap-2 px-4 pb-10 md:px-10 xl:flex-row xl:items-start">
        {liveLink && (
          <Link
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-full bg-blue-700 px-4 py-2 font-satoshi text-xs font-medium text-white transition-all duration-300 hover:bg-blue-600 active:scale-95 active:bg-blue-800 xl:w-fit xl:justify-start"
          >
            Preview
            <FiExternalLink size={16} />
          </Link>
        )}
        {repoLink && (
          <Link
            href={repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-full bg-black px-4 py-2 font-satoshi text-xs font-medium text-white transition-all duration-300 hover:bg-zinc-900 active:scale-95 active:bg-zinc-950 xl:w-fit xl:justify-start"
          >
            GitHub
            <SiGithub size={20} color="white" />
          </Link>
        )}
      </div>
    </div>
  );
}
