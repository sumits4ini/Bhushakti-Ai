import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { APP_CONFIG } from "@/lib/config/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#060b13",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/25 selection:text-primary`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
