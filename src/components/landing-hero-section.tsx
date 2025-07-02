import Image from "next/image";
import { LandingUsableButton } from "./landing-button";

export function HeroSection() {
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
            Write letters instantly that <strong>sound like you</strong>.
          </p>
          <p>Enjoy unlimited, gold-standard transcriptions.</p>
          <p>
            <strong>Save 5+ hours weekly</strong> on paperwork.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <LandingUsableButton variant="secondary" size="lg">
            Get Started
          </LandingUsableButton>
        </div>
      </div>

      {/* Image */}
      <div className="mx-auto mt-20 w-full max-w-5xl px-4">
        <div className="relative">
          <Image
            src="/placeholder.svg?height=400&width=800"
            alt="Before and after document comparison showing handwritten notes transforming into professional letters"
            width={800}
            height={400}
            className="h-auto w-full rounded-lg shadow-2xl"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
