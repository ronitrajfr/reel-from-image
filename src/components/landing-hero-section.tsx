"use client";

import { LandingUsableButton } from "./landing-button";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center px-6 py-7">
      <div className="mx-auto max-w-4xl space-y-10 text-center">
        {/* Title */}
        <h1 className="-tracking-4 text-4xl leading-[1.1] font-semibold text-white sm:text-6xl">
          Turn crap, <br className="hidden sm:inline" />
          into content
        </h1>

        {/* Supporting Text */}
        <div className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl">
          <p>
            Create reels instantly that <strong>feel like you</strong>.
          </p>
          <p>Skip the editor. Clean, fast, and effortless.</p>
          <p>
            <strong>Just add media, write a caption</strong>, and you're done.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <LandingUsableButton
            variant="secondary"
            className="cursor-pointer"
            size="lg"
            onClick={() => {
              router.push("/app");
            }}
          >
            Get Started
          </LandingUsableButton>
        </div>
      </div>

      {/* Video */}
      <div className="mx-auto mt-20 w-full max-w-7xl px-4">
        <div className="relative">
          <video
            src="/v2.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="h-auto w-full rounded-lg shadow-2xl"
            style={{ aspectRatio: "800/400" }}
          >
            Your browser does not support the video tag.
          </video>
          <div className="inset-0 rounded-lg bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
