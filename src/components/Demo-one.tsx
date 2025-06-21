"use client";
import { HeroSection } from "~/components/ui/dynamic-hero";

const DemoOne = () => {
  const navItems = [
    {
      id: "home",
      label: "Home",
      href: "/",
    },

    {
      id: "get-started-nav",
      label: "Get Started",
      href: "/app",
    },
  ];

  return (
    <div>
      <HeroSection
        heading="Convert short meme-style videos!"
        buttonText="Open the App"
        imageUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFuZHNjYXBlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
        videoUrl=""
        navItems={navItems}
      />
    </div>
  );
};

export { DemoOne };
