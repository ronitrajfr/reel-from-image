"use client";

import { Button } from "~/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { RefObject } from "react";

interface VideoPreviewProps {
  videoUrl: string | null;
  videoFormat: string;
  previewCanvasRef: RefObject<HTMLCanvasElement>;
  videoRef: RefObject<HTMLVideoElement>;
  isGenerating: boolean;
  progress: number;
  image: string | null;
  onDownload: () => void;
  onReset: () => void;
}

export function VideoPreview({
  videoUrl,
  videoFormat,
  previewCanvasRef,
  videoRef,
  isGenerating,
  progress,
  image,
  onDownload,
  onReset,
}: VideoPreviewProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {videoUrl ? "Generated Video" : "Preview"}
        </h3>
        {videoFormat && (
          <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
            {videoFormat}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {videoUrl ? (
          <div className="space-y-4">
            <div className="relative mx-auto" style={{ width: "300px" }}>
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                className="w-full rounded-lg border border-gray-200 bg-black"
                style={{ aspectRatio: "9/16" }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onDownload}
                className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Video
              </Button>
              <Button
                onClick={onReset}
                variant="outline"
                className="border-gray-300 bg-transparent text-gray-600"
              >
                New Video
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative mx-auto" style={{ width: "300px" }}>
              <canvas
                ref={previewCanvasRef}
                className="w-full rounded-lg border border-gray-200 bg-black"
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
              <p className="text-center text-xs text-gray-500">
                Upload an image to see live preview
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4">
        <p className="text-center text-xs text-gray-500">9:16 aspect ratio</p>
      </div>
    </div>
  );
}
