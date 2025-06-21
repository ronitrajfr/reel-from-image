"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useRef, useCallback, useState } from "react";

// Helper to parse 'rgb(r, g, b)' or 'rgba(r, g, b, a)' string to {r, g, b}
const parseRgbColor = (
  colorString: string,
): { r: number; g: number; b: number } | null => {
  if (!colorString) return null;
  const match = colorString.match(
    /rgba?$$(\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?$$/,
  );
  if (match) {
    return {
      r: Number.parseInt(match[1]!, 10),
      g: Number.parseInt(match[2]!, 10),
      b: Number.parseInt(match[3]!, 10),
    };
  }
  return null;
};

// A simple SVG Play Icon
const PlayIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5V19L19 12L8 5Z" />
  </svg>
);

interface NavItem {
  id: string;
  label: string;
  href?: string;
  target?: string;
  onClick?: () => void;
}

interface HeroSectionProps {
  heading?: string;
  tagline?: string;
  buttonText?: string;
  imageUrl?: string;
  videoUrl?: string;
  navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    onClick: () => console.info("Default Home clicked"),
  },
  { id: "about", label: "About", href: "#about-section" },
  {
    id: "get-started-nav",
    label: "Get Started",
    href: "/app",
  },
];

const HeroSection: React.FC<HeroSectionProps> = ({
  heading = "Something you really want",
  tagline = "You can't live without this product. I'm sure of it.",
  buttonText = "Get Started",
  imageUrl,
  videoUrl,
  navItems = defaultNavItems,
}) => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef<HTMLButtonElement>(null);
  const mousePosRef = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  const resolvedCanvasColorsRef = useRef({
    strokeStyle: { r: 128, g: 128, b: 128 }, // Default mid-gray
  });

  useEffect(() => {
    const tempElement = document.createElement("div");
    tempElement.style.display = "none";
    document.body.appendChild(tempElement);

    const updateResolvedColors = () => {
      tempElement.style.color = "var(--foreground)";
      const computedFgColor = getComputedStyle(tempElement).color;
      const parsedFgColor = parseRgbColor(computedFgColor);
      if (parsedFgColor) {
        resolvedCanvasColorsRef.current.strokeStyle = parsedFgColor;
      } else {
        console.warn(
          "HeroSection: Could not parse --foreground for canvas arrow. Using fallback.",
        );
        const isDarkMode = document.documentElement.classList.contains("dark");
        resolvedCanvasColorsRef.current.strokeStyle = isDarkMode
          ? { r: 250, g: 250, b: 250 }
          : { r: 10, g: 10, b: 10 }; // Brighter fallback
      }
    };
    updateResolvedColors();
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          updateResolvedColors();
          break;
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => {
      observer.disconnect();
      if (tempElement.parentNode) {
        tempElement.parentNode.removeChild(tempElement);
      }
    };
  }, []);

  const drawArrow = useCallback(() => {
    if (!canvasRef.current || !targetRef.current || !ctxRef.current) return;

    const targetEl = targetRef.current;
    const ctx = ctxRef.current;
    const mouse = mousePosRef.current;

    const x0 = mouse.x;
    const y0 = mouse.y;

    if (x0 === null || y0 === null) return;

    const rect = targetEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const a = Math.atan2(cy - y0, cx - x0);
    const x1 = cx - Math.cos(a) * (rect.width / 2 + 12);
    const y1 = cy - Math.sin(a) * (rect.height / 2 + 12);

    const midX = (x0 + x1) / 2;
    const midY = (y0 + y1) / 2;
    const offset = Math.min(200, Math.hypot(x1 - x0, y1 - y0) * 0.5);
    const t = Math.max(-1, Math.min(1, (y0 - y1) / 200));
    const controlX = midX;
    const controlY = midY + offset * t;

    const r = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
    // Increase max opacity to 1 (fully opaque) and adjust divisor for quicker ramp-up
    const opacity = Math.min(
      1.0,
      (r - Math.max(rect.width, rect.height) / 2) / 500,
    );

    const arrowColor = resolvedCanvasColorsRef.current.strokeStyle;
    ctx.strokeStyle = `rgba(${arrowColor.r}, ${arrowColor.g}, ${arrowColor.b}, ${opacity})`;
    // Increase line width for more visibility
    ctx.lineWidth = 2; // Changed from 1.5 to 2

    // Draw curve
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(controlX, controlY, x1, y1);
    // Adjust dash pattern for thicker line: longer dashes, similar gap
    ctx.setLineDash([10, 5]); // e.g., 10px dash, 5px gap
    ctx.stroke();
    ctx.restore();

    // Draw arrowhead
    const angle = Math.atan2(y1 - controlY, x1 - controlX);
    // Scale arrowhead with line width, base size 10 for lineWidth 1.5
    const headLength = 10 * (ctx.lineWidth / 1.5);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(
      x1 - headLength * Math.cos(angle - Math.PI / 6),
      y1 - headLength * Math.sin(angle - Math.PI / 6),
    );
    ctx.moveTo(x1, y1);
    ctx.lineTo(
      x1 - headLength * Math.cos(angle + Math.PI / 6),
      y1 - headLength * Math.sin(angle + Math.PI / 6),
    );
    ctx.stroke();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !targetRef.current) return;

    ctxRef.current = canvas.getContext("2d");
    const ctx = ctxRef.current;

    const updateCanvasSize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("resize", updateCanvasSize);
    window.addEventListener("mousemove", handleMouseMove);
    updateCanvasSize();

    const animateLoop = () => {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawArrow();
      }
      animationFrameIdRef.current = requestAnimationFrame(animateLoop);
    };

    animateLoop();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [drawArrow]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && videoUrl) {
      const handleVideoEnd = () => {
        setShowVideo(false);
        videoElement.currentTime = 0;
      };

      if (showVideo) {
        videoElement.play().catch((error) => {
          console.error("HeroSection: Error playing video:", error);
          setShowVideo(false);
        });
        videoElement.addEventListener("ended", handleVideoEnd);
      } else {
        videoElement.pause();
      }

      return () => {
        videoElement.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [showVideo, videoUrl]);

  const handlePlayButtonClick = () => {
    if (videoUrl) {
      setShowVideo(true);
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <nav className="mx-auto flex w-full max-w-screen-md flex-wrap items-center justify-center px-4 py-4 text-sm sm:justify-between sm:px-8">
        {navItems.map((item) => {
          const commonProps = {
            key: item.id,
            className:
              "py-2 px-3 sm:px-4 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/10 dark:hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-150 ease-in-out whitespace-nowrap",
            onClick: item.onClick,
          };
          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                target={item.target}
                rel={
                  item.target === "_blank" ? "noopener noreferrer" : undefined
                }
                {...commonProps}
              >
                {item.label}
              </Link>
            );
          }
          return (
            <button key={item.id} type="button" {...commonProps}>
              {item.label}
            </button>
          );
        })}
      </nav>

      <main className="flex flex-grow flex-col items-center justify-center">
        <div className="mt-12 flex flex-col items-center sm:mt-16 lg:mt-24">
          <h1 className="px-4 text-center text-3xl font-medium sm:text-4xl lg:text-5xl">
            {heading}
          </h1>
          <p className="text-muted-foreground mt-3 block max-w-xl px-4 text-center text-base sm:text-lg">
            {tagline}
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => {
              router.push("/app");
            }}
            ref={targetRef}
            className="border-foreground/50 hover:border-foreground/80 text-foreground focus:ring-ring rounded-xl border px-4 py-2 transition-colors focus:ring-2 focus:outline-none"
          >
            {buttonText}
          </button>
        </div>

        <div className="mx-auto mt-12 w-full max-w-screen-sm overflow-hidden px-4 sm:px-2 lg:mt-16">
          <div className="bg-border rounded-[2rem] p-[0.25rem]">
            <div className="bg-card relative flex h-64 items-center justify-center overflow-hidden rounded-[1.75rem] sm:h-72 md:h-80 lg:h-96">
              {imageUrl && (
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Preview"
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                    showVideo ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                />
              )}
              {videoUrl && (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  muted
                  playsInline
                  className={`h-full w-full object-cover transition-opacity duration-300 ${
                    showVideo ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                />
              )}
              {!showVideo && videoUrl && imageUrl && (
                <button
                  onClick={handlePlayButtonClick}
                  className="bg-accent/30 hover:bg-accent/50 text-accent-foreground focus:ring-ring absolute bottom-3 left-3 z-20 rounded-full p-2 backdrop-blur-sm transition-colors focus:ring-2 focus:outline-none sm:bottom-4 sm:left-4 sm:p-3"
                  aria-label="Play video"
                >
                  <PlayIcon className="h-4 w-4 sm:h-6 sm:w-5" />
                </button>
              )}
              {!imageUrl && !videoUrl && (
                <div className="text-muted-foreground italic">
                  Card Content Area
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <div className="h-12 sm:h-16 md:h-24"></div>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-10"
      ></canvas>
    </div>
  );
};

export { HeroSection };
