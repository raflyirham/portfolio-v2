"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import SignOutButton from "@/components/admin/sign-out-button";

export default function AdminShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const menu = [
    { href: "/admin", label: "Projects" },
    { href: "/admin/skills", label: "Skills" },
  ];

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
            Manage portfolio projects, skills, and images.
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
      <div className="mx-auto mt-8 grid w-full max-w-6xl gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-[#202024] bg-[#131316] p-3">
          <nav className="grid gap-1">
            {menu.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-700 text-white"
                      : "text-gray-300 hover:bg-[#1a1a1f] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
