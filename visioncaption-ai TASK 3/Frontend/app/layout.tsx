import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = "https://visioncaption.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VisionCaption AI — Turn Images Into Perfect Captions Instantly",
    template: "%s | VisionCaption AI",
  },
  description:
    "VisionCaption AI uses state-of-the-art vision-language models to generate accurate, natural-language captions for any image in seconds. Free to start, built for creators, marketers, and developers.",
  keywords: [
    "AI image captioning",
    "image to text AI",
    "BLIP captioning",
    "alt text generator",
    "AI caption generator",
    "image description AI",
    "accessibility AI tool",
  ],
  authors: [{ name: "VisionCaption AI" }],
  creator: "VisionCaption AI",
  publisher: "VisionCaption AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "VisionCaption AI",
    title: "VisionCaption AI — Turn Images Into Perfect Captions Instantly",
    description:
      "Generate accurate, natural-language captions for any image in seconds using state-of-the-art AI.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "VisionCaption AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VisionCaption AI — Turn Images Into Perfect Captions Instantly",
    description:
      "Generate accurate, natural-language captions for any image in seconds using state-of-the-art AI.",
    images: ["/images/og-image.png"],
    creator: "@visioncaptionai",
  },
  icons: {
    icon: "/icons/favicon.svg",
    shortcut: "/icons/favicon.svg",
    apple: "/icons/favicon.svg",
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
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            theme="system"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}