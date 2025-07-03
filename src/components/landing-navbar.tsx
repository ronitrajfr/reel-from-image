"use client";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { LandingUsableButton } from "./landing-button";
import Image from "next/image";
import { useRouter } from "next/navigation";
export function Navbar() {
  const router = useRouter();
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

      <div className="flex items-center space-x-3">
        <LandingUsableButton
          className="cursor-pointer"
          variant="secondary"
          size="md"
          onClick={() => {
            router.push("/app");
          }}
        >
          Get Started
        </LandingUsableButton>
      </div>
    </nav>
  );
}
