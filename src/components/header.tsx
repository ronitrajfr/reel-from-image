import { Twitter } from "lucide-react";
export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-gray-900">
            Reel From Image
          </div>
          <a
            href="https://x.com/ronitrajfr"
            className="rounded-full px-3 py-1 text-sm font-medium"
          >
            <Twitter size={25}></Twitter>
          </a>
        </div>
      </div>
    </header>
  );
}
