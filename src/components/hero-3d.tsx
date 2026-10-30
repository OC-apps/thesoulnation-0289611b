import soulLogo from "@/assets/soul-logo-official.png";

export function Hero3D() {
  return (
    <div className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-[#01039E]">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-20 pt-28 text-center sm:px-10 sm:pb-24 sm:pt-32">
        <h1 className="sr-only">The Soul Nation</h1>
        <span className="mb-10 text-xs font-semibold tracking-[0.16em] text-white/75">THE SOUL NATION · DESDE 2012</span>
        <img src={soulLogo} alt="The Soul Nation" width={1344} height={1785} className="h-[min(43vh,360px)] w-auto max-w-full object-contain" />
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <a href="#roster" className="rounded-full bg-[#F05E07] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#01039E]">► Conoce el Roster</a>
          <a href="#reclutamiento" className="rounded-full border border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Únete a la Nación</a>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-[#F05E07]" />
    </div>
  );
}
