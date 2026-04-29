import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import SignInButton from "@/components/admin/sign-in-button";
import { authOptions } from "@/libs/auth";

export default async function AdminSignInPage() {
  const session = await getServerSession(authOptions);
  const hasGoogle =
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET);
  const hasGithub =
    Boolean(process.env.GITHUB_ID) && Boolean(process.env.GITHUB_SECRET);

  if (session?.user.isAdmin) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0b0b0d] px-6">
      <section className="w-full max-w-md rounded-2xl border border-[#202024] bg-[#131316] p-8 text-center">
        <p className="font-satoshi text-sm font-medium text-blue-400">
          Admin Dashboard
        </p>
        <h1 className="mt-3 font-clashDisplay text-3xl font-medium text-white">
          Secure sign in
        </h1>
        <p className="mt-4 font-satoshi text-sm leading-6 text-gray-300">
          Continue with an OAuth account that is listed in the admin allowlist.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {hasGoogle && (
            <SignInButton providerId="google" label="Sign in with Google" />
          )}

          {hasGithub && (
            <SignInButton providerId="github" label="Sign in with GitHub" />
          )}

          {!hasGoogle && !hasGithub && (
            <p className="text-xs text-gray-400">
              No OAuth providers are configured. Set `GOOGLE_CLIENT_ID` /
              `GOOGLE_CLIENT_SECRET` and/or `GITHUB_ID` / `GITHUB_SECRET` in
              `.env`.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
