"use client";

import { Button } from "~/components/ui/button";

interface ExportControlsProps {
  duration: number;
  onExport: () => void;
  isGenerating: boolean;
  hasVideo: boolean;
}

export function ExportControls({
  duration,
  onExport,
  isGenerating,
  hasVideo,
}: ExportControlsProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-900">
            {formatDuration(duration)} s
          </div>
          <div className="h-2 w-64 rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-orange-500 transition-all duration-300"
              style={{ width: hasVideo ? "100%" : "0%" }}
            />
          </div>
        </div>

        <Button
          onClick={onExport}
          disabled={!hasVideo || isGenerating}
          className="bg-orange-500 px-6 text-white hover:bg-orange-600"
        >
          Export Video
        </Button>
      </div>
    </div>
  );
}
