import React from "react";
import { Navbar } from "~/components/landing-navbar";
import { HeroSection } from "~/components/landing-hero-section";
const page = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-2 mt-3 rounded-t-3xl bg-gradient-to-b from-[#6ca5d9] via-[#87bce7] to-[#b4d9f6]">
        <Navbar />
        <HeroSection />
      </main>
    </div>
  );
};

export default page;
