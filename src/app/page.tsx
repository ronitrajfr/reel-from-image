import React from "react";
import { Navbar } from "~/components/landing-navbar";
import { HeroSection } from "~/components/landing-hero-section";
import AutoText from "~/components/landing-auto-text";
import { HeroVideoDialogDemo } from "~/components/landing-demo";
import HeroVideoDialog from "~/components/magicui/hero-video-dialog";
import FAQ from "~/components/faq-component";
import { WobbleCardDemo } from "~/components/wobbel-card-landing";

const page = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-2 mt-3 rounded-t-3xl bg-gradient-to-b from-[#6ca5d9] via-[#87bce7] to-[#b4d9f6]">
        <Navbar />
        <HeroSection />
      </main>

      <section className="min-h-screen bg-gray-50">
        <AutoText />
      </section>
      <section className="max-h-screen">
        <FAQ />
      </section>
      <section className="mb-10 flex items-center justify-center">
        <WobbleCardDemo />
      </section>

      <section className="mt-7 flex items-center justify-center">
        <div className="mt-10 mb-10 text-2xl">
          2025 @{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold"
            href="https://x.com/ronitrajfr"
          >
            ronitrajfr
          </a>{" "}
          - All Rights Reserved - Created by Ronit Raj
        </div>
      </section>
    </div>
  );
};

export default page;
