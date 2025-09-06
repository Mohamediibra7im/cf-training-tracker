import "./globals.css";
import { Nunito } from "next/font/google";
import type React from "react";
import type { Metadata } from "next";
import AuthGuard from "@/components/AuthGuard";
import ConditionalNavBar from "@/components/ConditionalNavBar";
import ThemeProvider from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/Toast";
import { Analytics } from "@vercel/analytics/next";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CF-Training Tracker - Codeforces Virtual Contest Practice Platform",
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
    "CP training",
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
    "CF-Training-Tracker-Codeforces",
    "CF-Training-Tracker-Codeforces-Virtual-Contest",
    "CF-Training-Tracker-Codeforces-Virtual-Contest-Practice",
    "CF-Training-Tracker-Codeforces-Virtual-Contest-Practice-Platform",
    "CF-Training-Tracker-Codeforces-Virtual-Contest-Practice-Platform-Codeforces",
    "CF-Training-Tracker-Codeforces-Virtual-Contest-Practice-Platform-Codeforces-Virtual-Contest",
  ],
  authors: [{ name: "Mohammed Ibrahim" }],
  creator: "CF-Training Tracker",
  publisher: "CF-Training Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cf-training-tracker.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CF-Training Tracker - Codeforces Virtual Contest Practice Platform",
    description:
      "Practice Codeforces problems with virtual contests, track your progress, and improve your competitive programming skills.",
    url: "https://cf-training-tracker.vercel.app",
    siteName: "CF-Training Tracker",
    images: [
      {
        url: "https://d3moma7wl9.ufs.sh/f/xRZhVxWEJbFMus29DenxT5WwkRzQNM4V8v2dhSnslabDi1c0",
        width: 1200,
        height: 630,
        alt: "CF-Training Tracker - Codeforces Practice Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CF-Training Tracker - Codeforces Virtual Contest Practice Platform",
    description:
      "Practice Codeforces problems with virtual contests, track your progress, and improve your competitive programming skills.",
    images: ["https://d3moma7wl9.ufs.sh/f/xRZhVxWEJbFMus29DenxT5WwkRzQNM4V8v2dhSnslabDi1c0"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "CF-Training Tracker",
    description:
      "A Codeforces virtual contest practice platform for competitive programming",
    url: "https://cf-training-tracker.vercel.app",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Mohammed Ibrahim",
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
          <ToastProvider>
            <div className="relative flex min-h-screen flex-col bg-background overflow-x-hidden">
              <AuthGuard>
                <ConditionalNavBar>
                  {children}
                </ConditionalNavBar>
              </AuthGuard>
            </div>
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
