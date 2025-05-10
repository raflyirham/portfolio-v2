"use client";

import { useEffect, useState } from "react";

const useSection = () => {
  const [currentSection, setCurrentSection] = useState<string>("");

  const sections = [...document.querySelectorAll("section")];
  const options = {
    rootMargin: "0px",
    threshold: 0.25,
  };

  const callback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 0.25) {
        setCurrentSection(entry.target.id);
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return { currentSection };
};

export default useSection;
