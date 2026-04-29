import { withAuth } from "next-auth/middleware";

const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

export default withAuth({
  pages: {
    signIn: "/admin/sign-in",
  },
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname === "/admin/sign-in") {
        return true;
      }

      const email = token?.email?.toLowerCase();

      return Boolean(email && adminEmails.has(email));
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
