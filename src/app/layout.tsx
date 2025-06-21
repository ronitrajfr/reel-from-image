import "~/styles/globals.css";
import Providers from "~/components/Provider";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "meme-from-image",
  description: "meme-from-image",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
