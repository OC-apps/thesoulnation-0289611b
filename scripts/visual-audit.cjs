/* Read-only visual audit. Never submit forms or mutate site data. */
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const OUT = path.join(process.cwd(), "visual-audit-artifacts");
const widths = [320, 390, 430, 768, 1440];
const pages = [
  { name:"inicio", url:"https://thesoulnation.org/" },
  { name:"roster", url:"https://thesoulnation.org/#roster" },
  { name:"videos", url:"https://thesoulnation.org/#videos" },
  { name:"musica", url:"https://thesoulnation.org/#music" },
  { name:"jersey", url:"https://thesoulnation.org/#jersey" },
  { name:"xplicit-cup", url:"https://thesoulnation.org/xplicit-cup" },
];
const results = [];
fs.mkdirSync(OUT, {recursive:true});

(async()=>{
  const browser = await chromium.launch({headless:true});
  for (const width of widths) {
    const context = await browser.newContext({
      viewport:{width,height:900},
      deviceScaleFactor:1,
      reducedMotion:"reduce",
      colorScheme:"dark",
      locale:"es-MX"
    });
    for(const target of pages) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", err=>errors.push(err.message.slice(0,240)));
      const entry = {width,page:target.name,url:target.url,ok:false,overflowPx:null,overflowElements:[],errors,screenshot:null};
      try {
        const response=await page.goto(target.url,{waitUntil:"domcontentloaded",timeout:45000});
        await page.waitForTimeout(1700);
        entry.http=response?.status()??null;
        const check=await page.evaluate(()=>{
          const documentWidth=document.documentElement.scrollWidth;
          const clientWidth=document.documentElement.clientWidth;
          const overflowing=Array.from(document.body.querySelectorAll("*")).filter(el=>{
            const style=getComputedStyle(el);
            if(style.position==="fixed" || style.visibility==="hidden" || style.display==="none")return false;
            const rect=el.getBoundingClientRect();
            return rect.width>0 && (rect.right>innerWidth+2 || rect.left< -2);
          }).slice(0,7).map(el=>({tag:el.tagName.toLowerCase(),className:String(el.className).slice(0,90)}));
          const visibleSections=Array.from(document.querySelectorAll(".soul-hub > section"))
            .filter(el=>getComputedStyle(el).display!=="none").map(el=>el.id);
          const shortcutElements=Array.from(document.querySelectorAll(".soul-refined-access-grid .soul-home-tile"));
          const shortcuts=shortcutElements.length;
          const shortcutRows=new Set(shortcutElements.map(el=>Math.round(el.getBoundingClientRect().top / 3)*3)).size;
          const header=document.querySelector(".soul-refined-header, .soul-xplicit-header");
          const hr=header?.getBoundingClientRect();
          const headerBounds=hr?{left:Math.round(hr.left),right:Math.round(hr.right),top:Math.round(hr.top)}:null;
          const headerVisible=hr?hr.left>=-2&&hr.right<=innerWidth+2:false;
          return {documentWidth,clientWidth,overflowPx:Math.max(0,documentWidth-clientWidth),overflowElements:overflowing,visibleSections,shortcuts,shortcutRows,headerBounds,headerVisible};
        });
        Object.assign(entry,check);
        entry.ok=(entry.http===200 && entry.overflowPx===0 && entry.headerVisible && (target.name!=="inicio" || (entry.shortcuts===5 && entry.shortcutRows===1)));
        const name=target.name+"-"+width+".png";
        await page.screenshot({path:path.join(OUT,name),fullPage:true,animations:"disabled",timeout:30000});
        entry.screenshot=name;
      }catch(e){
        entry.error=String(e).slice(0,400);
      }
      results.push(entry);
      console.log(JSON.stringify(entry));
      await page.close();
    }
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT,"results.json"),JSON.stringify(results,null,2));
  const failures=results.filter(r=>!r.ok);
  console.log("Visual audit: "+results.length+" viewports, failures="+failures.length);
  process.exitCode=failures.length ? 1:0;
})().catch(e=>{console.error(e);process.exitCode=1;});
