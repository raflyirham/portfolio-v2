import { cn } from "@/libs/utils";

export default function SkillCard({
  skill,
  icon,
  size = "normal",
  className,
}: Readonly<{
  skill: string;
  icon: React.ReactNode;
  size?: "normal" | "small" | "large";
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "flex flex-row gap-x-2 items-center bg-[#0b0b0d] border border-[#202024] rounded-full py-1 px-3 w-fit",
        className
      )}
    >
      {icon}
      <p
        className={cn(
          "text-white text-sm md:text-base lg:text-base font-satoshi font-normal",
          size === "small" && "text-xs md:text-sm lg:text-sm",
          size === "large" && "text-lg md:text-xl lg:text-xl"
        )}
      >
        {skill}
      </p>
    </div>
  );
}
