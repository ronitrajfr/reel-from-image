"use client";

import { useState } from "react";
import { FileText, Plus, X } from "lucide-react";

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  const faqs = [
    {
      id: "item-1",
      question: "Is ReelFromImage free?",
      answer:
        "Yes. ReelFromImage is 100% free to use. No subscriptions, no hidden fees, no watermark nonsense.",
    },
    {
      id: "item-2",
      question: "What can I make with it?",
      answer:
        "You can instantly create memes, Instagram reels, YouTube Shorts, or TikToks — just by uploading an image or video and writing a caption.",
    },
    {
      id: "item-3",
      question: "Do I need to install anything?",
      answer:
        "Nope. ReelFromImage works right in your browser. No downloads, no complex software. Just open, create, and export.",
    },
    {
      id: "item-5",
      question: "Does it support video?",
      answer:
        "Yes. You can upload short videos and add captions over them — perfect for reels, shorts, and TikToks.",
    },
    {
      id: "item-6",
      question: "Will I need an account?",
      answer:
        "No. We don’t force you to sign up. Just visit the site, create, and export your content.",
    },
  ];

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="flex min-h-screen w-full items-center">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left side - Header */}
          <div className="space-y-6">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              <span>FAQ's</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl leading-tight font-bold text-gray-900 lg:text-5xl">
                Got questions?
              </h2>
              <h2 className="text-4xl leading-tight font-bold text-gray-900 lg:text-5xl">
                We got answers
              </h2>
            </div>
          </div>

          {/* Right side - FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = openItem === faq.id;

              return (
                <div key={faq.id} className="border-b border-gray-200 pb-4">
                  <button
                    className="group flex w-full items-center justify-between py-4 text-left"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`content-${faq.id}`}
                  >
                    <span className="pr-4 text-lg font-medium text-gray-900">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <X className="h-5 w-5 flex-shrink-0 text-gray-400 transition-colors group-hover:text-gray-600" />
                    ) : (
                      <Plus className="h-5 w-5 flex-shrink-0 text-gray-400 transition-colors group-hover:text-gray-600" />
                    )}
                  </button>

                  {isOpen && (
                    <div
                      id={`content-${faq.id}`}
                      className="px-1 pt-2 pb-4 text-gray-600"
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
