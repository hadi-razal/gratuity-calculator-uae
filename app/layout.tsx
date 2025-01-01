import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Custom fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// SEO metadata
export const metadata: Metadata = {
  title: "UAE Gratuity Calculator - Calculate Your End-of-Service Benefits",
  description: "Calculate your UAE gratuity pay and end-of-service benefits accurately with our free online calculator. Follow UAE labor law to determine your entitlement.",
  keywords: "UAE gratuity calculator, gratuity calculation, UAE end-of-service benefits, gratuity pay UAE, UAE labor law, gratuity calculator UAE",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow", // Allow search engines to index and follow
  openGraph: {
    title: "UAE Gratuity Calculator - Calculate Your End-of-Service Benefits",
    description: "Find out how much you are entitled to by calculating your gratuity pay based on UAE labor laws.",
    type: "website",
    url: "https://your-site.com", // Replace with your actual website URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Calculate your UAE gratuity pay and end-of-service benefits accurately with our free online calculator. Follow UAE labor law to determine your entitlement." />
        {/* Add any other SEO tags as needed */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900`}
      >
        <main className="min-h-screen flex flex-col">
          <header className="bg-blue-600 text-white p-4">
            <h1 className="text-2xl font-semibold">UAE Gratuity Calculator</h1>
          </header>
          <section className="flex-1">{children}</section>
          <footer className="bg-gray-800 text-white p-4">
            <p className="text-center">© 2025 Your Company. All Rights Reserved.</p>
          </footer>
        </main>
      </body>
    </html>
  );
}
