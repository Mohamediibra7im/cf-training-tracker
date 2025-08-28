import "./globals.css";
import { Nunito } from "next/font/google";
import type React from "react";
import type { Metadata } from "next";
import AuthGuard from "@/components/AuthGuard";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Training-Tracker - Codeforces Virtual Contest Practice Platform",
  description:
    "Practice Codeforces problems with virtual contests, track your progress, and improve your competitive programming skills. Create custom training sessions with problem ratings and tags.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  keywords: [
    "Codeforces",
    "competitive programming",
    "virtual contest",
    "practice problems",
    "algorithm practice",
    "programming contest",
    "CP practice",
    "coding practice",
    "algorithm problems",
    "competitive coding",
    "ThemeCP",
    "Theme-CP",
    "training tracker",
    "training-tracker",
    "Training-Tracker",
    "Training-Tracker-Codeforces",
    "Training-Tracker-Codeforces-Virtual-Contest",
    "Training-Tracker-Codeforces-Virtual-Contest-Practice",
    "Training-Tracker-Codeforces-Virtual-Contest-Practice-Platform",
    "Training-Tracker-Codeforces-Virtual-Contest-Practice-Platform-Codeforces",
    "Training-Tracker-Codeforces-Virtual-Contest-Practice-Platform-Codeforces-Virtual-Contest",
  ],
  authors: [{ name: "Training-Tracker Team" }],
  creator: "Training-Tracker",
  publisher: "Training-Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cp-training-tracker.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CP - Training Tracker - Codeforces Virtual Contest Practice Platform",
    description:
      "Practice Codeforces problems with virtual contests, track your progress, and improve your competitive programming skills.",
    url: "https://cp-training-tracker.vercel.app",
    siteName: "Training-Tracker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CP - Training-Tracker - Codeforces Practice Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Training-Tracker - Codeforces Virtual Contest Practice Platform",
    description:
      "Practice Codeforces problems with virtual contests, track your progress, and improve your competitive programming skills.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Training-Tracker",
    description:
      "A Codeforces virtual contest practice platform for competitive programming",
    url: "https://cp-training-tracker.vercel.app",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Training-Tracker Team",
    },
    keywords:
      "Codeforces, competitive programming, virtual contest, practice problems, algorithm practice",
    featureList: [
      "Custom virtual contests",
      "Problem rating selection",
      "Progress tracking",
      "Statistics and analytics",
      "Upsolving list",
      "Tag-based problem selection",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className={nunito.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background overflow-x-hidden">
            <NavBar />
            <main className="flex-1">
              <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 max-w-7xl">
                <AuthGuard>{children}</AuthGuard>
              </div>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
