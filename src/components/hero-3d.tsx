import { homeBannerEmbedded } from "@/lib/home-banner-embedded";
import { useState } from "react";

export function Hero3D({ bannerUrl }: { bannerUrl?: string }) {
 const [failedUrl,setFailedUrl]=useState("");
 // The original file was uploaded with spaces in its name.
 const defaultBanner=homeBannerEmbedded;
 const src=bannerUrl || defaultBanner;
 const unavailable=src===failedUrl;
 const displaySrc=unavailable ? homeBannerEmbedded : src;
 return (
  <div className="soul-hero soul-hero-fullbleed relative isolate overflow-hidden bg-[#01039E]">
   <h1 className="sr-only">The Soul Nation</h1>
   <div className="soul-hero-fullbleed-image">
    <img key={displaySrc} src={displaySrc} alt="The Soul Nation" width={1920} height={600}
       className="block w-full h-full object-cover object-center"
       onError={()=>{if(displaySrc!==homeBannerEmbedded)setFailedUrl(src)}} />
   </div>
   <div className="soul-hero-fullbleed-actions relative flex flex-wrap justify-center gap-3 px-4 pb-5 pt-3 sm:pb-7">
     <a href="#roster" className="rounded-full bg-[#F05E07] px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#01039E]">► Conoce el Roster</a>
     <a href="#reclutamiento" className="rounded-full border border-white/35 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Únete a la Nación</a>
   </div>
   <div className="absolute inset-x-0 bottom-0 h-1 bg-[#F05E07]" />
  </div>
 );
}
