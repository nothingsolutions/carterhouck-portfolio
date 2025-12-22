"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BIO_TEXT = "Carter Houck is a New York City based Graphic Designer, Video Editor & Event Manager, specializing in nightlife. He currently works at The DnD Agency, a hospitality design agency. He also works on Nothing Radio, a media project documenting the New York music scene. He is available for freelance projects and collaboration.";

// Photowall images - add your image paths here
// Images should be placed in /public/photowall/
const PHOTOWALL_IMAGES = [
  "/photowall/carterhouck-01.png",
  "/photowall/carterhouck-02.png",
  "/photowall/carterhouck-03.jpg",
  "/photowall/carterhouck-04.png",
  "/photowall/carterhouck-05.gif",
  "/photowall/carterhouck-06.gif",
  "/photowall/carterhouck-07.jpg",
  "/photowall/carterhouck-08.gif",
  "/photowall/carterhouck-09.gif",
  "/photowall/carterhouck-10.jpg",
  "/photowall/carterhouck-11.png",
  "/photowall/carterhouck-12.png",
  "/photowall/carterhouck-13.jpg",
  "/photowall/carterhouck-14.jpg",
  "/photowall/carterhouck-15.jpg",
  "/photowall/carterhouck-16.jpg",
  "/photowall/carterhouck-17.jpg",
  "/photowall/carterhouck-18.jpg",
  "/photowall/carterhouck-19.jpg",
  "/photowall/carterhouck-20.gif",
  "/photowall/carterhouck-21.gif",
  "/photowall/carterhouck-22.png",
  "/photowall/carterhouck-23.jpg",
  "/photowall/carterhouck-24.gif",
  "/photowall/carterhouck-25.gif",
  "/photowall/carterhouck-26.gif",
  "/photowall/carterhouck-27.png",
  "/photowall/carterhouck-28.png",
  "/photowall/carterhouck-29.png",
  "/photowall/carterhouck-30.jpg",
  "/photowall/carterhouck-31.jpg",
  "/photowall/carterhouck-32.jpg",
  "/photowall/carterhouck-33.png",
  "/photowall/carterhouck-34.jpg",
  "/photowall/carterhouck-35.png",
  "/photowall/carterhouck-36.jpg",
  "/photowall/carterhouck-37.jpg",
  "/photowall/carterhouck-38.png",
  "/photowall/carterhouck-39.jpg",
  "/photowall/carterhouck-40.jpg",
  "/photowall/carterhouck-41.png",
  "/photowall/carterhouck-42.png",
  "/photowall/carterhouck-43.jpg",
  "/photowall/carterhouck-44.png",
  "/photowall/carterhouck-45.jpg",
  "/photowall/carterhouck-46.jpg",
  "/photowall/carterhouck-47.png",
  "/photowall/carterhouck-48.png",
  "/photowall/carterhouck-49.png",
  "/photowall/carterhouck-50.jpg",
  "/photowall/carterhouck-51.gif",
  "/photowall/carterhouck-52.png",
  "/photowall/carterhouck-53.png",
  "/photowall/carterhouck-54.png",
  "/photowall/carterhouck-55.png",
  "/photowall/carterhouck-56.jpg",
  "/photowall/carterhouck-57.jpg",
  "/photowall/carterhouck-58.jpg",
  "/photowall/carterhouck-59.jpg",
  "/photowall/carterhouck-60.jpg",
  "/photowall/carterhouck-61.jpg",
  "/photowall/carterhouck-62.png",
];

export default function TypedBio() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPhotowallOpen, setIsPhotowallOpen] = useState(false);

  return (
    <>
      {/* Tagline */}
      <p className="text-sm text-[#888] font-mono">
        NYC Graphic Designer & Event Manager.
      </p>

      {/* Links row - About, Images, Contact, IG, YouTube */}
      <div className="flex items-center gap-4 text-xs font-mono mt-2">
        <button
          onClick={() => setIsAboutOpen(true)}
          className="text-[#C1121E] hover:text-[#6bb3ff] transition-colors"
        >
          About
        </button>
        <button
          onClick={() => setIsPhotowallOpen(true)}
          className="text-[#C1121E] hover:text-[#6bb3ff] transition-colors"
        >
          Images
        </button>
        <a
          href="mailto:carter@nothingradio.com"
          className="text-[#C1121E] hover:text-[#6bb3ff] transition-colors"
        >
          Contact
        </a>
        <a
          href="https://instagram.com/carterhouck"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C1121E] hover:text-[#6bb3ff] transition-colors"
          aria-label="Instagram"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </a>
        <a
          href="https://www.youtube.com/@carter_houck"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C1121E] hover:text-[#6bb3ff] transition-colors"
          aria-label="YouTube"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </a>
      </div>

      {/* About Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsAboutOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg p-6 max-w-2xl w-full shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">About</h3>
                <button
                  onClick={() => setIsAboutOpen(false)}
                  className="text-[#666] hover:text-white transition-colors text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-[#a0a0a0] text-sm font-mono leading-relaxed">
                {BIO_TEXT}
              </p>

              {/* CV Section */}
              <div className="mt-6 pt-4 border-t border-[#3a3a3a]">
                <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">CV</h4>
                <div className="space-y-1.5 text-sm font-mono">
                  <div className="flex justify-between text-[#a0a0a0]">
                    <span>DND Agency</span>
                    <span className="text-[#666]">2025 - Present</span>
                  </div>
                  <div className="flex justify-between text-[#a0a0a0]">
                    <span>The Standard, High Line</span>
                    <span className="text-[#666]">2024 - 2025</span>
                  </div>
                  <div className="flex justify-between text-[#a0a0a0]">
                    <span>Stillman Meyer Design</span>
                    <span className="text-[#666]">2023 - 2024</span>
                  </div>
                  <div className="flex justify-between text-[#a0a0a0]">
                    <span>Lindsey Media PR</span>
                    <span className="text-[#666]">NYFW SS23 + FW24</span>
                  </div>
                  <div className="flex justify-between text-[#a0a0a0]">
                    <span>Triarchy Denim</span>
                    <span className="text-[#666]">2018 - 2020</span>
                  </div>
                  <div className="flex justify-between text-[#a0a0a0]">
                    <span>InPlay Showroom</span>
                    <span className="text-[#666]">2018 - 2019</span>
                  </div>
                  <div className="flex justify-between text-[#a0a0a0]">
                    <span>Julie Smith Showroom</span>
                    <span className="text-[#666]">2018</span>
                  </div>
                </div>
              </div>

              {/* Select Clients Section */}
              <div className="mt-6 pt-4 border-t border-[#3a3a3a]">
                <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Select Clients</h4>
                <p className="text-[#a0a0a0] text-sm font-mono leading-relaxed">
                  Triarchy, Farnsworth Fine Cannabis, Flower Shop Design Agency, Harvard Lampoon, Fanatics x Tom Brady, Sotheby&apos;s Reality Aspen
                </p>
              </div>

              {/* Education Section */}
              <div className="mt-6 pt-4 border-t border-[#3a3a3a]">
                <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Education</h4>
                <div className="space-y-1.5 text-sm font-mono">
                  <div className="flex justify-between text-[#a0a0a0]">
                    <span>Fashion Institute of Technology</span>
                    <span className="text-[#666] text-xs">Intl. Trade + Marketing</span>
                  </div>
                  <div className="flex justify-between text-[#a0a0a0]">
                    <span>Imperial College London</span>
                    <span className="text-[#666] text-xs">Intl. Business + Economics</span>
                  </div>
                  <div className="flex justify-between text-[#a0a0a0]">
                    <span>Fullerton College</span>
                    <span className="text-[#666] text-xs">Business Management</span>
                  </div>
                </div>
              </div>

              {/* Contact Links */}
              <div className="flex items-center gap-4 text-xs font-mono mt-6 pt-4 border-t border-[#3a3a3a]">
                <a
                  href="mailto:carter@nothingradio.com"
                  className="text-[#C1121E] hover:text-[#6bb3ff] transition-colors"
                >
                  carter@nothingradio.com
                </a>
                <a
                  href="https://instagram.com/carterhouck"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C1121E] hover:text-[#6bb3ff] transition-colors"
                >
                  @carterhouck
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photowall Modal */}
      <AnimatePresence>
        {isPhotowallOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0a0a0a] z-50 overflow-hidden"
          >
            {/* Close button - fixed top right */}
            <button
              onClick={() => setIsPhotowallOpen(false)}
              className="fixed top-4 right-4 z-[60] w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 border border-[#3a3a3a] rounded-full text-white text-2xl transition-colors"
            >
              ×
            </button>

            {/* Scrollable photo grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="h-full overflow-y-auto p-4 pt-16"
            >
              {PHOTOWALL_IMAGES.length > 0 ? (
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-2">
                  {PHOTOWALL_IMAGES.map((src, index) => (
                    <div key={index} className="break-inside-avoid mb-2">
                      <img
                        src={src}
                        alt={`Photo ${index + 1}`}
                        className="w-full rounded-sm hover:opacity-90 transition-opacity"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#666] font-mono text-sm">
                  <p>No photos yet.</p>
                  <p className="text-xs mt-2 text-[#444]">
                    Add images to /public/photowall/ and update PHOTOWALL_IMAGES array
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
