"use client";

import type React from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import { Textarea } from "~/components/ui/textarea";
import { Upload, Play, Square, Loader2 } from "lucide-react";

interface ContentEditorProps {
  topText: string;
  setTopText: (text: string) => void;
  bottomText: string;
  setBottomText: (text: string) => void;
  topFontSize: number[];
  setTopFontSize: (size: number[]) => void;
  bottomFontSize: number[];
  setBottomFontSize: (size: number[]) => void;
  duration: number[];
  setDuration: (duration: number[]) => void;
  maxDuration: number;
  fps: number;
  image: string | null;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateVideo: () => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
  progress: number;
  subText: string;
  setSubText: (text: string) => void;
  subFontSize: number[];
  setSubFontSize: (size: number[]) => void;
}

export function ContentEditor({
  topText,
  setTopText,
  bottomText,
  setBottomText,
  topFontSize,
  setTopFontSize,
  bottomFontSize,
  setBottomFontSize,
  duration,
  setDuration,
  maxDuration,
  fps,
  image,
  onImageUpload,
  onGenerateVideo,
  onStopGeneration,
  isGenerating,
  progress,
  subText,
  setSubText,
  subFontSize,
  setSubFontSize,
}: ContentEditorProps) {
  return (
    <div className="space-y-6">
      {/* Content Area */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-6">
          {/* Text Content */}
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Main Text
              </Label>
              <Textarea
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="Enter your main text..."
                className="min-h-[100px] border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block text-xs text-gray-500">
                  Font Size: {topFontSize[0]}px
                </Label>
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
          </div>

          {/* Sub Text */}
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Sub Text
              </Label>
              <Input
                value={subText}
                onChange={(e) => setSubText(e.target.value)}
                placeholder="Enter sub text (optional)..."
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block text-xs text-gray-500">
                  Font Size: {subFontSize[0]}px
                </Label>
                <Slider
                  value={subFontSize}
                  onValueChange={setSubFontSize}
                  max={60}
                  min={16}
                  step={2}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Overlay Text
              </Label>
              <Input
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="*Me"
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block text-xs text-gray-500">
                  Font Size: {bottomFontSize[0]}px
                </Label>
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
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Background Image
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById("image-upload")?.click()}
              variant="outline"
              className="h-24 w-full border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50"
            >
              <div className="text-center">
                <Upload className="mx-auto mb-2 h-6 w-6 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  {image ? "Change Image" : "Upload Image"}
                </span>
                <p className="mt-1 text-xs text-gray-500">
                  Max 15MB • PNG, JPG, GIF
                </p>
              </div>
            </Button>
            {image && (
              <div className="relative">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Uploaded"
                  className="h-16 w-full rounded-md border border-gray-200 object-cover"
                />
                <div className="absolute top-1 right-1 rounded bg-green-500 px-1.5 py-0.5 text-xs text-white">
                  ✓
                </div>
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Duration
              </Label>
              <span className="text-sm text-gray-500">{duration[0]}s</span>
            </div>
            <Slider
              value={duration}
              onValueChange={setDuration}
              max={maxDuration}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1s</span>
              <span>{maxDuration}s (max)</span>
            </div>
            <p className="text-xs text-gray-500">
              Limited to {maxDuration}s for optimal performance • {fps} FPS
            </p>
          </div>

          {/* Generate Button */}
          <div className="border-t border-gray-200 pt-4">
            <Button
              onClick={onGenerateVideo}
              disabled={!image || isGenerating}
              className="h-11 w-full bg-orange-500 text-white hover:bg-orange-600"
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
                onClick={onStopGeneration}
                variant="outline"
                className="mt-2 w-full border-gray-300 bg-transparent text-gray-600"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Segments Section */}
    </div>
  );
}
