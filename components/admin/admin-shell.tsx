import Link from "next/link";

import SignOutButton from "@/components/admin/sign-out-button";

export default function AdminShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-[#0b0b0d] px-6 py-8 text-white md:px-10">
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-4 border-b border-[#202024] pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/admin"
            className="font-clashDisplay text-2xl font-medium text-white"
          >
            Project Admin
          </Link>
          <p className="mt-1 font-satoshi text-sm text-gray-400">
            Manage portfolio projects and images.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-[#202024] px-4 py-2 text-sm font-medium text-white transition hover:border-blue-700"
          >
            View site
          </Link>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto mt-8 w-full max-w-6xl">{children}</main>
    </div>
  );
}
