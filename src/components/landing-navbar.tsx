import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { LandingUsableButton } from "./landing-button";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between px-6 py-4">
      <div className="flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent">
            <Image src={"/logo.svg"} alt="logo" width={40} height={40} />
          </div>
          <span className="text-lg font-semibold text-white">
            Reel From Image
          </span>
        </Link>
      </div>

      <div className="hidden items-center space-x-8 md:flex">
        <div className="flex cursor-pointer items-center space-x-1 text-white hover:text-gray-200">
          <span>Use cases</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="flex cursor-pointer items-center space-x-1 text-white hover:text-gray-200">
          <span>Features</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <Link href="/pricing" className="text-white hover:text-gray-200">
          Pricing
        </Link>
        <Link href="/doctors" className="text-white hover:text-gray-200">
          Our doctors
        </Link>
      </div>

      <div className="flex items-center space-x-3">
        <LandingUsableButton variant="secondary" size="md">
          Get Started
        </LandingUsableButton>
      </div>
    </nav>
  );
}
