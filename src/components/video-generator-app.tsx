"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";
import { Header } from "./header";
import { TabNavigation } from "./tab-navigation";
import { ContentEditor } from "./content-editor";
import { VideoPreview } from "./video-preview";
import { ExportControls } from "./export-controls";

export function VideoGeneratorApp() {
  const [activeTab, setActiveTab] = useState("content");
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState(
    "Teacher: Ye janwaro jaisi handwriting kiski hai jaldi samne aye",
  );
  const [bottomText, setBottomText] = useState("*Me");
  const [subText, setSubText] = useState("");
  const [subFontSize, setSubFontSize] = useState([24]);
  const [topFontSize, setTopFontSize] = useState([42]);
  const [bottomFontSize, setBottomFontSize] = useState([48]);
  const [duration, setDuration] = useState([5]);
  const [fps] = useState(15);
  const [maxDuration] = useState(10);
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
      frameSubText: string,
      topSize: number,
      bottomSize: number,
      subSize: number,
    ) => {
      const canvas = ctx.canvas;
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const topBlackSpace = canvas.height * 0.15;
      const textSectionHeight = canvas.height * 0.12;
      const imageSectionHeight = canvas.height * 0.58;

      // Draw top text section (white background)
      const textY = topBlackSpace;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, textY, canvas.width, textSectionHeight);

      // Draw main text
      if (frameTopText.trim()) {
        ctx.fillStyle = "#000000";
        ctx.font = `bold ${topSize}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

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
            currentLine = word;
          }
        }
        lines.push(currentLine);

        const lineHeight = topSize * 1.1;
        const totalTextHeight = lines.length * lineHeight;
        const hasSubText = frameSubText && frameSubText.trim();
        const subTextHeight = hasSubText ? subSize * 1.2 : 0;
        const totalContentHeight =
          totalTextHeight + subTextHeight + (hasSubText ? 10 : 0);

        const startY =
          textY +
          textSectionHeight / 2 -
          totalContentHeight / 2 +
          lineHeight / 2;

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight;
          ctx.fillText(line, canvas.width / 2, y);
        });

        // Draw sub text
        if (hasSubText) {
          ctx.font = `${subSize}px Arial, sans-serif`;
          ctx.fillStyle = "#666666";
          const subY = startY + totalTextHeight + 10;
          ctx.fillText(frameSubText, canvas.width / 2, subY);
        }
      }

      if (img) {
        const imageY = textY + textSectionHeight;
        const imgAspect = img.width / img.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.width / imgAspect;
        let drawX = 0;
        let drawY = imageY + (imageSectionHeight - drawHeight) / 2;

        if (drawHeight > imageSectionHeight) {
          drawHeight = imageSectionHeight;
          drawWidth = imageSectionHeight * imgAspect;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = imageY;
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

        if (frameBottomText.trim()) {
          ctx.font = `bold ${bottomSize}px Arial, sans-serif`;
          ctx.textAlign = "left";
          ctx.textBaseline = "top";

          const textX = drawX + 20;
          const textY = drawY + 20;

          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 4;
          ctx.strokeText(frameBottomText, textX, textY);

          ctx.fillStyle = "#FFFF00";
          ctx.fillText(frameBottomText, textX, textY);
        }
      } else {
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

  useEffect(() => {
    const updatePreview = async () => {
      const previewCanvas = previewCanvasRef.current;
      if (!previewCanvas) return;

      const ctx = previewCanvas.getContext("2d")!;
      previewCanvas.width = 270;
      previewCanvas.height = 480;

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
        subText,
        topFontSize[0]! * 0.3,
        bottomFontSize[0]! * 0.3,
        subFontSize[0]! * 0.3,
      );
    };

    updatePreview();
  }, [
    image,
    topText,
    bottomText,
    subText,
    topFontSize,
    bottomFontSize,
    subFontSize,
    drawFrame,
  ]);

  const getSupportedMimeType = (): string => {
    const types = [
      "video/mp4;codecs=h264,aac",
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      "video/mp4;codecs=h264",
      "video/mp4;codecs=avc1.42E01E",
      "video/mp4",
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,vorbis",
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8",
      "video/webm",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log(`Using codec: ${type}`);
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

    const estimatedFrames = duration[0]! * fps;
    if (estimatedFrames > 300) {
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
      canvas.width = 720;
      canvas.height = 1280;

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
        videoBitsPerSecond: 5000000,
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
          subText,
          topFontSize[0]!,
          bottomFontSize[0]!,
          subFontSize[0]!,
        );

        frameCount++;

        if (
          frameCount - lastProgressUpdate >= 10 ||
          frameCount === totalFrames
        ) {
          const newProgress = (frameCount / totalFrames) * 100;
          setProgress(newProgress);
          lastProgressUpdate = frameCount;
        }

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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-gray-900">
            customise your video
          </h1>
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === "music" && (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
              <div className="mb-4 text-gray-400">
                <svg
                  className="mx-auto h-16 w-16"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.076-1.343-4.243a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.983 5.983 0 01-.757 2.829 1 1 0 11-1.415-1.414A3.987 3.987 0 0013 12a3.987 3.987 0 00-.172-1.415 1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Music & Sound Effects
              </h3>
              <p className="mb-4 text-gray-600">
                Add background music and sound effects to your videos
              </p>
              <div className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600">
                Coming Soon
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {activeTab === "content" && (
              <ContentEditor
                topText={topText}
                setTopText={setTopText}
                bottomText={bottomText}
                setBottomText={setBottomText}
                subText={subText}
                setSubText={setSubText}
                topFontSize={topFontSize}
                setTopFontSize={setTopFontSize}
                bottomFontSize={bottomFontSize}
                setBottomFontSize={setBottomFontSize}
                subFontSize={subFontSize}
                setSubFontSize={setSubFontSize}
                duration={duration}
                setDuration={setDuration}
                maxDuration={maxDuration}
                fps={fps}
                image={image}
                onImageUpload={handleImageUpload}
                onGenerateVideo={generateVideo}
                onStopGeneration={stopGeneration}
                isGenerating={isGenerating}
                progress={progress}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <VideoPreview
              videoUrl={videoUrl}
              videoFormat={videoFormat}
              previewCanvasRef={previewCanvasRef}
              videoRef={videoRef}
              isGenerating={isGenerating}
              progress={progress}
              image={image}
              onDownload={downloadVideo}
              onReset={resetVideo}
            />
          </div>
        </div>

        <ExportControls
          duration={duration[0]!}
          onExport={downloadVideo}
          isGenerating={isGenerating}
          hasVideo={!!videoUrl}
        />
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
