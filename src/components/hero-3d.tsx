import soulLogo from "@/assets/soul-logo-official.png";
import { useState } from "react";

export function Hero3D({ bannerUrl }: { bannerUrl?: string }) {
 const [failedUrl,setFailedUrl]=useState("");
 // The original file was uploaded with spaces in its name.
 const defaultBanner="/the%20soul%20nation%20header.jpg";
 const src=bannerUrl || defaultBanner;
 const unavailable=src===failedUrl;
 return (
  <div className="soul-hero relative isolate overflow-hidden bg-[#01039E]">
   <h1 className="sr-only">The Soul Nation</h1>
   <div className="mx-auto w-full max-w-7xl px-3 pt-3 sm:px-6 sm:pt-5">
    {unavailable ? (
     <div className="flex min-h-40 items-center justify-center">
      <img src={soulLogo} alt="The Soul Nation" className="h-32 w-auto object-contain" />
     </div>
    ) : (
     <img key={src} src={src} alt="The Soul Nation" width={1920} height={600}
       className="block h-auto w-full object-contain rounded-xl"
       onError={()=>setFailedUrl(src)} />
    )}
   </div>
   <div className="relative flex flex-wrap justify-center gap-3 px-4 pb-5 pt-3 sm:pb-7">
     <a href="#roster" className="rounded-full bg-[#F05E07] px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#01039E]">► Conoce el Roster</a>
     <a href="#reclutamiento" className="rounded-full border border-white/35 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Únete a la Nación</a>
   </div>
   <div className="absolute inset-x-0 bottom-0 h-1 bg-[#F05E07]" />
  </div>
 );
}
