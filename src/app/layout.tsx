import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import "../styles/main.scss";
import { Toaster } from "~/components/ui/sonner";

const sans = Nunito({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} antialiased h-screen`}>
        {children}
        <Toaster closeButton />
      </body>
    </html>
  );
}
