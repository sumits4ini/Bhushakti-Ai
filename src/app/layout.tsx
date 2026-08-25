import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { APP_CONFIG } from "@/lib/config/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} | ${APP_CONFIG.shortTitle}`,
  description: `${APP_CONFIG.fullTitle} for the North Eastern Region of India (MDoNER / SIH26001).`,
  keywords: [
    "Landslide Early Warning",
    "North Eastern Region",
    "MDoNER",
    "Disaster Management",
    "AI Risk Intelligence",
    "SIH26001",
    "Mizoram Landslides",
    "Sikkim Landslides",
  ],
  authors: [{ name: "BHUSHAKTI AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
