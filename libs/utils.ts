import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const scrollToSection = (section: string) => {
  const sectionElement = document.getElementById(section);
  if (sectionElement) {
    sectionElement.scrollIntoView({ behavior: "smooth" });
  }
};

export const valueOrDefault = (
  value: string | undefined,
  defaultValue: string
) => {
  return value || defaultValue;
};

export const valueOrDefaultNullish = (
  value: string | null,
  defaultValue: string
) => {
  return value ?? defaultValue;
};
