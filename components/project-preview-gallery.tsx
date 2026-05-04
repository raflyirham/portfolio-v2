"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export default function ProjectPreviewGallery({
  urls,
}: Readonly<{ urls: string[] }>) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const goPrev = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null || urls.length < 2) return i;
      return i === 0 ? urls.length - 1 : i - 1;
    });
  }, [urls.length]);

  const goNext = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null || urls.length < 2) return i;
      return i === urls.length - 1 ? 0 : i + 1;
    });
  }, [urls.length]);

  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, goPrev, goNext]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {urls.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-xl border border-[#202024] bg-[#131316] text-left transition hover:border-blue-700/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            <Image
              src={url}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 36rem"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/90"
            onClick={close}
            aria-label="Close preview"
          />

          <div className="relative z-10 flex h-full max-h-[min(100dvh,56rem)] w-full max-w-[min(100vw-2rem,72rem)] items-center justify-center">
            <div className="relative h-full w-full">
              <Image
                src={urls[openIndex]}
                alt={`Preview ${openIndex + 1} full size`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Close"
          >
            <IoClose size={28} />
          </button>

          {urls.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 px-3 py-6 text-sm font-medium text-white transition hover:bg-black/80 sm:left-4"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 px-3 py-6 text-sm font-medium text-white transition hover:bg-black/80 sm:right-4"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
