import soulLogo from "@/assets/soul-logo.png";
import soulTextLogo from "@/assets/soul-nation-textlogo.png";

export function Hero3D() {
  return (
    <div className="relative isolate flex min-h-[70vh] items-center overflow-hidden bg-[#01039E]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(255,255,255,0.11),transparent_55%)]" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-20 pt-32 sm:px-10 lg:grid-cols-[1.35fr_0.65fr] lg:py-32">
        <div className="flex flex-col items-start">
          <span className="mb-9 rounded-full border border-white/25 px-4 py-2 text-xs font-semibold tracking-[0.12em] text-white/80">THE SOUL NATION · DESDE 2012</span>
          <img src={soulTextLogo} alt="The Soul Nation" className="w-full max-w-[620px] object-contain" />
          
          
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#roster" className="rounded-full bg-[#F05E07] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#01039E]">► Conoce el Roster</a>
            <a href="#reclutamiento" className="rounded-full border border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Únete a la Nación</a>
          </div>
        </div>
        <div className="hidden items-center justify-center lg:flex">
          <img src={soulLogo} alt="Emblema oficial de The Soul Nation" className="w-full max-w-[320px] object-contain" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-[#F05E07]" />
    </div>
  );
}
