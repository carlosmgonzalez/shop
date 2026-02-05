"use client";

// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarCart } from "@/components/layout/sidebar-cart";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { Whatsapp } from "@/components/layout/whatsapp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <div className="min-h-screen flex flex-col">
              <Toaster position="top-right" />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Whatsapp className="fixed bottom-4 right-4 z-50" />
            </div>
            <SidebarCart />
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
