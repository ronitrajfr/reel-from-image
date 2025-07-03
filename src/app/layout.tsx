import "~/styles/globals.css";
import Providers from "~/components/Provider";
import { type Metadata } from "next";
import Script from "next/script";
import { Geist, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "reel-from-image",
  description: "reel from image",
  icons: [{ rel: "icon", url: "/logo.svg" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // optional, improves performance
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <Providers>
        <body>
          {children}
          <Analytics />
        </body>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="e7cb419a-5fb3-411c-a0d1-a32b08ae502f"
        />
      </Providers>
    </html>
  );
}
