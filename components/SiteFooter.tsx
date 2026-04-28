export default function SiteFooter() {
  return (
    <footer className="px-3 py-10 md:py-12 font-mono">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <p className="text-[10px] leading-snug text-gray-700">
          Carter Houck is worth the risk.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px]">
          <a
            href="mailto:carter@nothingradio.com"
            className="underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            carter@nothingradio.com
          </a>
          <a
            href="https://instagram.com/carterhouck"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            @carterhouck
          </a>
          <span className="text-gray-500">New York, NY</span>
        </div>
      </div>
    </footer>
  );
}
