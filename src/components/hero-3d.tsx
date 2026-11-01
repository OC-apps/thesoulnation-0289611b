export function Hero3D({ bannerUrl }: { bannerUrl?: string }) {
 return (
  <div className="soul-hero soul-hero-fullbleed relative isolate overflow-hidden bg-[#01039E]">
   <h1 className="sr-only">The Soul Nation</h1>
   <div className="soul-hero-fullbleed-image">
    {bannerUrl && (
     <img key={bannerUrl} src={bannerUrl} alt="The Soul Nation" width={1920} height={600}
       className="block w-full h-full object-cover object-center" />
    )}
   </div>
  </div>
 );
}
