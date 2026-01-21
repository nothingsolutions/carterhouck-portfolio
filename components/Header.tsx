import Link from "next/link";
import TypedBio from "./TypedBio";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[#1a1a1a] border-b border-[#3a3a3a]">
      <div className="max-w-[1800px] mx-auto px-4 py-4">
        <div className="flex items-start justify-between">
          <div>
            <Link href="/">
              <h1 className="text-xl font-semibold text-white tracking-tight hover:text-[#4a9eff] transition-colors">
                Carter Houck
              </h1>
            </Link>
            <TypedBio />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live" />
          </div>
        </div>
      </div>
      {/* Accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#4a9eff] to-transparent header-shimmer" />
    </header>
  );
}

