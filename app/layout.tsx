import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import "./globals.css";

export const metadata: Metadata = {
  title: "Rafly Irham Safatulloh | Portfolio",
  description: "View my portfolio, skills, projects, and more about me.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <Toaster position="bottom-right" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
