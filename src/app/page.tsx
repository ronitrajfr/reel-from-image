import React from "react";
import { Navbar } from "~/components/landing-navbar";
import { HeroSection } from "~/components/landing-hero-section";
import AutoText from "~/components/landing-auto-text";
import { HeroVideoDialogDemo } from "~/components/landing-demo";
import HeroVideoDialog from "~/components/magicui/hero-video-dialog";

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
        <h1 className="mx-auto my-20 flex items-center justify-center text-7xl font-bold">
          How it works?
        </h1>
        <div className="relative mx-auto w-[1300px]">
          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
            thumbnailAlt="Hero Video"
          />
          <HeroVideoDialog
            className="hidden dark:block"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Hero Video"
          />
        </div>
      </section>
    </div>
  );
};

export default page;
