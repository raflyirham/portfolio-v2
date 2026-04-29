"use client";

import { signIn } from "next-auth/react";

export default function SignInButton({
  providerId,
  label,
}: Readonly<{
  providerId: "google" | "github";
  label: string;
}>) {
  return (
    <button
      type="button"
      onClick={() => signIn(providerId, { callbackUrl: "/admin" })}
      className="rounded-full bg-blue-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-600 active:scale-95"
    >
      {label}
    </button>
  );
}
