"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/sign-in" })}
      className="rounded-full border border-[#202024] px-4 py-2 text-sm font-medium text-white transition hover:border-blue-700"
    >
      Sign out
    </button>
  );
}
