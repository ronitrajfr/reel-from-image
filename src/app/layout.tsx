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
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="1cca7c37-508e-45ea-a047-192e15fa277a"
        ></script>
      </Providers>
    </html>
  );
}
