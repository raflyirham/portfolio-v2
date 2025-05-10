"use client";

import { useState, useEffect } from "react";

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 768
  );
  const [isTablet, setIsTablet] = useState<boolean>(
    () => window.innerWidth >= 768 && window.innerWidth < 1024
  );
  const [isDesktop, setIsDesktop] = useState<boolean>(
    () => window.innerWidth >= 1024
  );

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
    setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    setIsDesktop(window.innerWidth >= 1024);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    handleResize();
  }, []);

  return { isMobile, isTablet, isDesktop };
};

export default useResponsive;
