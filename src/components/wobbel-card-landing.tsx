"use client";

import React from "react";
import { WobbleCard } from "./ui/wobble-card";

export function WobbleCardDemo() {
  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-3">
      <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]">
        <a href="https://google.com" className="relative block h-full w-full">
          <div className="max-w-xs">
            <h2 className="text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:text-xl lg:text-3xl">
              Reel from Image is Open Source
            </h2>
            <p className="mt-4 text-left text-base/6 text-neutral-200">
              100% of the code of the app is public on Github - check it out &
              contribute!
            </p>
          </div>
          <img
            src="/oss.png"
            width={600}
            height={600}
            alt="linear demo image"
            className="absolute -right-4 -bottom-10 rounded-2xl object-contain grayscale filter lg:-right-[40%]"
          />
        </a>
      </WobbleCard>

      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <a
          href="https://your-link-here.com"
          className="relative block h-full w-full"
        >
          <h2 className="max-w-80 text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:text-xl lg:text-3xl">
            Share your memes
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
            Created a sick reel from image? Share it! Click on this box{" "}
          </p>
        </a>
      </WobbleCard>
    </div>
  );
}
