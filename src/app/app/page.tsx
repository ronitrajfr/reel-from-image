"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { Textarea } from "~/components/ui/textarea";
import {
  Upload,
  Download,
  Play,
  Loader2,
  Video,
  Type,
  Settings,
  Eye,
  Square,
} from "lucide-react";

export default function VideoGeneratorApp() {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState(
    "Teacher: Ye janwaro jaisi handwriting kiski hai jaldi samne aye",
  );
  const [bottomText, setBottomText] = useState("*Me");
  const [topFontSize, setTopFontSize] = useState([42]);
  const [bottomFontSize, setBottomFontSize] = useState([48]);
  const [duration, setDuration] = useState([5]);
  const [fps] = useState(15); // Reduced from 30 to 15 FPS for better performance
  const [maxDuration] = useState(10); // Add maximum duration limit
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [videoFormat, setVideoFormat] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 15 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select an image file under 15MB");
    }
  };

  const drawFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement | null,
      frameTopText: string,
      frameBottomText: string,
      topSize: number,
      bottomSize: number,
    ) => {
      const canvas = ctx.canvas;

      // Clear with black background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate sections for 9:16 format
      const topBlackSpace = canvas.height * 0.15; // 15% top black space
      const textSectionHeight = canvas.height * 0.12; // 12% for top text
      const imageSectionHeight = canvas.height * 0.58; // 58% for image
      const bottomBlackSpace = canvas.height * 0.15; // 15% bottom black space

      // Draw top text section (white background)
      const textY = topBlackSpace;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, textY, canvas.width, textSectionHeight);

      // Draw top text
      if (frameTopText.trim()) {
        ctx.fillStyle = "#000000";
        ctx.font = `bold ${topSize}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Multi-line text support
        const maxWidth = canvas.width * 0.95;
        const words = frameTopText.split(" ");
        const lines: string[] = [];
        let currentLine = words[0] || "";

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const testLine = currentLine + " " + word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width < maxWidth) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            //@ts-ignore
            currentLine = word;
          }
        }
        lines.push(currentLine);

        const lineHeight = topSize * 1.1;
        const totalTextHeight = lines.length * lineHeight;
        const startY =
          textY + textSectionHeight / 2 - totalTextHeight / 2 + lineHeight / 2;

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight;
          ctx.fillText(line, canvas.width / 2, y);
        });
      }

      // Draw image section
      if (img) {
        const imageY = textY + textSectionHeight;

        // Scale image to fit full width while maintaining aspect ratio
        const imgAspect = img.width / img.height;
        const sectionAspect = canvas.width / imageSectionHeight;

        let drawWidth = canvas.width;
        let drawHeight = canvas.width / imgAspect;
        let drawX = 0;
        let drawY = imageY + (imageSectionHeight - drawHeight) / 2;

        // If image is too tall, fit to height instead
        if (drawHeight > imageSectionHeight) {
          drawHeight = imageSectionHeight;
          drawWidth = imageSectionHeight * imgAspect;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = imageY;
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

        // Draw bottom text overlay on image
        if (frameBottomText.trim()) {
          ctx.font = `bold ${bottomSize}px Arial, sans-serif`;
          ctx.textAlign = "left";
          ctx.textBaseline = "top";

          // Text with yellow color and black outline
          const textX = drawX + 20;
          const textY = drawY + 20;

          // Black outline
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 4;
          ctx.strokeText(frameBottomText, textX, textY);

          // Yellow fill
          ctx.fillStyle = "#FFFF00";
          ctx.fillText(frameBottomText, textX, textY);
        }
      } else {
        // Placeholder for image
        const imageY = textY + textSectionHeight;
        ctx.fillStyle = "#333333";
        ctx.fillRect(0, imageY, canvas.width, imageSectionHeight);

        ctx.fillStyle = "#666666";
        ctx.font = `${topSize * 0.8}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          "Upload Image",
          canvas.width / 2,
          imageY + imageSectionHeight / 2,
        );
      }
    },
    [],
  );

  // Update preview when inputs change
  useEffect(() => {
    const updatePreview = async () => {
      const previewCanvas = previewCanvasRef.current;
      if (!previewCanvas) return;

      const ctx = previewCanvas.getContext("2d")!;
      previewCanvas.width = 270; // Reduced from 360
      previewCanvas.height = 480; // Reduced from 640

      let img: HTMLImageElement | null = null;
      if (image) {
        img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((resolve) => {
          img!.onload = resolve;
          img!.src = image;
        });
        imageRef.current = img;
      }

      drawFrame(
        ctx,
        img,
        topText,
        bottomText,
        //@ts-ignore
        topFontSize[0] * 0.3,
        //@ts-ignore
        bottomFontSize[0] * 0.3,
      ); // Further reduced scaling
    };

    updatePreview();
  }, [image, topText, bottomText, topFontSize, bottomFontSize, drawFrame]);

  const getSupportedMimeType = (): string => {
    const types = [
      "video/mp4;codecs=h264",
      "video/mp4;codecs=avc1.42E01E",
      "video/mp4",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "video/webm";
  };

  const generateVideo = async () => {
    if (!image) {
      alert("Please upload an image first");
      return;
    }

    // Check for potential memory issues
    const estimatedFrames = duration[0]! * fps;
    if (estimatedFrames > 300) {
      // More than 300 frames could cause issues
      const confirmed = confirm(
        `This video will generate ${estimatedFrames} frames which may cause performance issues. Continue?`,
      );
      if (!confirmed) return;
    }

    setIsGenerating(true);
    setProgress(0);
    chunksRef.current = [];

    try {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      // Reduced resolution for better performance while maintaining 9:16 ratio
      canvas.width = 720; // Reduced from 1080
      canvas.height = 1280; // Reduced from 1920

      const img = imageRef.current;
      if (!img && image) {
        const newImg = new Image();
        newImg.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
          newImg.onload = resolve;
          newImg.onerror = reject;
          newImg.src = image;
        });
        imageRef.current = newImg;
      }

      const mimeType = getSupportedMimeType();
      setVideoFormat(mimeType.includes("mp4") ? "MP4" : "WebM");

      const stream = canvas.captureStream(fps);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 5000000, // Reduced from 10Mbps to 5Mbps
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        setProgress(100);
        setIsGenerating(false);
      };

      mediaRecorder.start(100);

      const totalFrames = duration[0]! * fps;
      let frameCount = 0;
      let lastProgressUpdate = 0;

      const animate = () => {
        if (frameCount >= totalFrames) {
          mediaRecorder.stop();
          return;
        }

        drawFrame(
          ctx,
          imageRef.current,
          topText,
          bottomText,
          topFontSize[0]!,
          bottomFontSize[0]!,
        );

        frameCount++;

        // Throttle progress updates to reduce re-renders (update every 10 frames or ~0.67 seconds)
        if (
          frameCount - lastProgressUpdate >= 10 ||
          frameCount === totalFrames
        ) {
          const newProgress = (frameCount / totalFrames) * 100;
          setProgress(newProgress);
          lastProgressUpdate = frameCount;
        }

        // Use setTimeout instead of requestAnimationFrame for more consistent timing
        setTimeout(() => animate(), 1000 / fps);
      };

      animate();
    } catch (error) {
      console.error("Error generating video:", error);
      alert("Error generating video. Please try again.");
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const extension = videoFormat.toLowerCase() === "mp4" ? "mp4" : "webm";
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = `reel-${Date.now()}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const stopGeneration = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsGenerating(false);
    setProgress(0);
  };

  const resetVideo = () => {
    setVideoUrl(null);
    setProgress(0);
    setVideoFormat("");
  };

  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="border-border mb-8 border-b pb-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="bg-card rounded-lg border p-2">
              <Video className="text-foreground h-6 w-6" />
            </div>
            <h1 className="text-foreground text-2xl font-semibold">
              reel-from-image
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Create memes in 9:16 format for social media
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Controls Section */}
          <div className="space-y-6">
            {/* Text Settings */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-card-foreground flex items-center gap-2 text-lg">
                  <Type className="h-4 w-4" />
                  Text Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-muted-foreground text-sm font-medium">
                    Top Text
                  </Label>
                  <Textarea
                    placeholder="Enter your main text..."
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    className="border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                    rows={3}
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-muted-foreground text-xs">
                        Font Size
                      </Label>
                      <span className="text-muted-foreground text-xs">
                        {topFontSize[0]}px
                      </span>
                    </div>
                    <Slider
                      value={topFontSize}
                      onValueChange={setTopFontSize}
                      max={80}
                      min={24}
                      step={2}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-muted-foreground text-sm font-medium">
                    Bottom Text (Overlay)
                  </Label>
                  <Input
                    placeholder="*Me"
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    className="border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-muted-foreground text-xs">
                        Font Size
                      </Label>
                      <span className="text-muted-foreground text-xs">
                        {bottomFontSize[0]}px
                      </span>
                    </div>
                    <Slider
                      value={bottomFontSize}
                      onValueChange={setBottomFontSize}
                      max={100}
                      min={24}
                      step={2}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Settings */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-card-foreground flex items-center gap-2 text-lg">
                  <Settings className="h-4 w-4" />
                  Media Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-muted-foreground text-sm font-medium">
                    Image Upload
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                    variant="outline"
                    className="border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-ring h-24 w-full border-2 border-dashed"
                  >
                    <div className="text-center">
                      <Upload className="mx-auto mb-2 h-6 w-6" />
                      <span className="text-sm font-medium">
                        {image ? "Change Image" : "Upload Image"}
                      </span>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Max 15MB • PNG, JPG, GIF
                      </p>
                    </div>
                  </Button>
                  {image && (
                    <div className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt="Uploaded"
                        className="border-border h-16 w-full rounded-md border object-cover"
                      />
                      <div className="bg-primary text-primary-foreground absolute top-1 right-1 rounded px-1.5 py-0.5 text-xs">
                        ✓
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-muted-foreground text-sm font-medium">
                      Duration
                    </Label>
                    <span className="text-muted-foreground text-sm">
                      {duration[0]}s
                    </span>
                  </div>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    max={maxDuration}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>1s</span>
                    <span>{maxDuration}s (max)</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Limited to {maxDuration}s for optimal performance • {fps}{" "}
                    FPS
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={generateVideo}
                    disabled={!image || isGenerating}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground h-11 w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating {Math.round(progress)}%
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Generate Video
                      </>
                    )}
                  </Button>

                  {isGenerating && (
                    <Button
                      onClick={stopGeneration}
                      variant="outline"
                      className="border-border text-muted-foreground hover:bg-muted w-full"
                    >
                      <Square className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview/Output Section */}
          <div className="lg:col-span-1">
            <Card className="border-border bg-card h-fit">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-card-foreground flex items-center gap-2 text-lg">
                    <Eye className="h-4 w-4" />
                    {videoUrl ? "Generated Video" : "Preview"}
                  </CardTitle>
                  {videoFormat && (
                    <span className="text-muted-foreground bg-muted rounded px-2 py-1 text-xs">
                      {videoFormat}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  9:16 aspect ratio
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videoUrl ? (
                    // Show generated video
                    <div className="space-y-4">
                      <div
                        className="relative mx-auto"
                        style={{ width: "300px" }}
                      >
                        <video
                          ref={videoRef}
                          src={videoUrl}
                          controls
                          className="border-border w-full rounded-lg border bg-black"
                          style={{ aspectRatio: "9/16" }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={downloadVideo}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Video
                        </Button>
                        <Button
                          onClick={resetVideo}
                          variant="outline"
                          className="border-border text-muted-foreground hover:bg-muted"
                        >
                          New Video
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Show live preview
                    <div className="space-y-4">
                      <div
                        className="relative mx-auto"
                        style={{ width: "300px" }}
                      >
                        <canvas
                          ref={previewCanvasRef}
                          className="border-border w-full rounded-lg border bg-black"
                          style={{ aspectRatio: "9/16" }}
                        />
                        {isGenerating && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                            <div className="text-center">
                              <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-white" />
                              <p className="text-xs text-white">
                                {Math.round(progress)}%
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      {!image && (
                        <p className="text-muted-foreground text-center text-xs">
                          Upload an image to see live preview
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
