import { useState } from "react";

export function Hero3D({ bannerUrl }: { bannerUrl?: string }) {
 const [failedUrl,setFailedUrl]=useState("");
 // The original file was uploaded with spaces in its name.
 const defaultBanner="/home-banner-2026.jpg";
 const src=bannerUrl || defaultBanner;
 const unavailable=src===failedUrl;
 const displaySrc=unavailable ? defaultBanner : src;
 return (
  <div className="soul-hero soul-hero-fullbleed relative isolate overflow-hidden bg-[#01039E]">
   <h1 className="sr-only">The Soul Nation</h1>
   <div className="soul-hero-fullbleed-image">
    <img key={displaySrc} src={displaySrc} alt="The Soul Nation" width={1920} height={600}
       className="block w-full h-full object-cover object-center"
       onError={()=>{if(displaySrc!==defaultBanner)setFailedUrl(src)}} />
   </div>
   <div className="absolute inset-x-0 bottom-0 h-1 bg-[#F05E07]" />
  </div>
 );
}
