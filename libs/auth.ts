import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: "/admin/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn({ user }) {
      const email = user.email?.toLowerCase();

      return Boolean(email && adminEmails.has(email));
    },
    jwt({ token }) {
      const email = token.email?.toLowerCase();

      token.isAdmin = Boolean(email && adminEmails.has(email));

      return token;
    },
    session({ session, token }) {
      session.user.isAdmin = Boolean(token.isAdmin);

      return session;
    },
  },
};
