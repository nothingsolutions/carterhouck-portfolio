"use client";

import { useState } from "react";

export default function SiteHeader() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-start justify-between gap-3 p-3 mb-6 md:mb-10">
      {/* Bordered bio box — full width on mobile, constrained on desktop */}
      <div className="border border-black bg-white p-2 w-full md:w-auto md:max-w-[360px]">
        <p className="text-[11px] font-mono font-medium leading-tight mb-1.5">
          Carter Houck
        </p>
        <p className="text-[11px] font-mono leading-snug">
          NYC Graphic Designer, Video Editor, and Event Manager specializing in
          nightlife and hospitality.
        </p>
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 text-[11px] font-mono underline underline-offset-2 hover:opacity-70 transition-opacity"
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-black/30 space-y-3">
            <p className="text-[11px] font-mono leading-snug">
              Carter Houck is a New York City based Graphic Designer, Video
              Editor and Event Manager, specializing in nightlife. He currently
              works at The DnD Agency, a hospitality design agency. He also
              works on Nothing Radio, a media project documenting the New York
              music scene. He is available for freelance projects and
              collaboration.
            </p>

            <div>
              <p className="text-[10px] font-mono font-medium mb-1">CV</p>
              <div className="space-y-1 text-[10px] font-mono">
                <div className="flex justify-between gap-3">
                  <a
                    href="https://www.thednd.agency"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    DND Agency
                  </a>
                  <span>2025 - Present</span>
                </div>
                <div className="flex justify-between gap-3">
                  <a
                    href="https://www.standardhotels.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    The Standard Hotel, High Line
                  </a>
                  <span>2024 - 2025</span>
                </div>
                <div className="flex justify-between gap-3">
                  <a
                    href="https://stillmanmeyer.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    Stillman Meyer Design
                  </a>
                  <span>2023 - 2024</span>
                </div>
                <div className="flex justify-between gap-3">
                  <a
                    href="https://www.lindsey.media"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    Lindsey Media PR
                  </a>
                  <span>NYFW SS23 + FW24</span>
                </div>
                <div className="flex justify-between gap-3">
                  <a
                    href="https://triarchy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    Triarchy Denim
                  </a>
                  <span>2018 - 2020</span>
                </div>
                <div className="flex justify-between gap-3">
                  <a
                    href="https://www.inplayshowroom.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    InPlay Showroom
                  </a>
                  <span>2018 - 2019</span>
                </div>
                <div className="flex justify-between gap-3">
                  <a
                    href="https://www.juliesmithkids.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-70 transition-opacity"
                  >
                    Julie Smith Showroom
                  </a>
                  <span>2018</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono font-medium mb-1">Education</p>
              <div className="space-y-1 text-[10px] font-mono">
                <div className="flex justify-between gap-3">
                  <span>Fashion Institute of Technology</span>
                  <span>Intl. Trade + Marketing</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Imperial College London</span>
                  <span>Intl. Business + Economics</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Fullerton College</span>
                  <span>Business Management</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons inside box on mobile — gap is transparent (no wrapper fill) */}
        <div className="ml-auto mt-2 flex w-fit gap-1 md:hidden">
          <a
            href="https://instagram.com/carterhouck"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black bg-white px-2 py-0.5 text-[11px] font-mono hover:bg-black hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href="mailto:carter@nothingradio.com"
            className="border border-black bg-white px-2 py-0.5 text-[11px] font-mono hover:bg-black hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>
      </div>

      {/* Buttons top-right on desktop — gap is transparent (no wrapper fill) */}
      <div className="hidden md:flex flex-shrink-0 gap-1">
        <a
          href="https://instagram.com/carterhouck"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-black bg-white px-2 py-0.5 text-[11px] font-mono hover:bg-black hover:text-white transition-colors"
        >
          Instagram
        </a>
        <a
          href="mailto:carter@nothingradio.com"
          className="border border-black bg-white px-2 py-0.5 text-[11px] font-mono hover:bg-black hover:text-white transition-colors"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
