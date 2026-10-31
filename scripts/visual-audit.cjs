/* Read-only visual audit. Never submit forms or mutate site data. */
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const OUT = path.join(process.cwd(), process.env.SOUL_AUDIT_OUT || "visual-audit-artifacts");
const BASE = (process.env.SOUL_AUDIT_BASE_URL || "https://thesoulnation.org").replace(/\/$/, "");
const widths = [320, 390, 430, 768, 1440];
const pages = [
  { name:"inicio", url:`${BASE}/` },
  { name:"roster", url:`${BASE}/#roster` },
  { name:"videos", url:`${BASE}/#videos` },
  { name:"musica", url:`${BASE}/#music` },
  { name:"jersey", url:`${BASE}/#jersey` },
  { name:"xplicit-cup", url:`${BASE}/xplicit-cup` },
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
          const contentTabs=Array.from(document.querySelectorAll(".soul-content-tabs .soul-content-tab"))
            .filter(el=>getComputedStyle(el).display!=="none");
          const expectedTabs=["Videos","Wallpapers","Música","Jersey Oficial"];
          const tabsValid=contentTabs.length===4 && contentTabs.every((el,i)=>el.textContent.trim().includes(expectedTabs[i]));
          const activeTabs=contentTabs.filter(el=>el.getAttribute("aria-current")==="page");
          const hero=document.querySelector("#xplicit-cup .soul-xplicit-hero");
          const heroStyle=hero?getComputedStyle(hero):null;
          const xplicitHeroVisible=!!hero && heroStyle.display!=="none" && Number(heroStyle.opacity)>.95;
          return {documentWidth,clientWidth,overflowPx:Math.max(0,documentWidth-clientWidth),overflowElements:overflowing,visibleSections,shortcuts,shortcutRows,headerBounds,headerVisible,
            contentTabCount:contentTabs.length,tabsValid,activeTabCount:activeTabs.length,xplicitHeroVisible};
        });
        Object.assign(entry,check);
        entry.ok=(entry.http===200 && entry.overflowPx===0 && entry.headerVisible &&
          (target.name!=="inicio" || (entry.shortcuts===5 && entry.shortcutRows===1)) &&
          (!["videos","musica","jersey"].includes(target.name) || (entry.tabsValid && entry.activeTabCount===1)) &&
          (target.name!=="xplicit-cup" || entry.xplicitHeroVisible));
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
  // Read-only member navigation tests; never touch recruitment forms or admin endpoints.
  const interactions = [];
  const profileContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:"reduce",locale:"es-MX"});
  for(const scenario of [
    {query:"MAVERICK Z",param:"wave",slug:"soul-maverick-z",division:"waves",nextName:"Siguiente →"},
    {query:"MORTAL",param:"member",slug:"soul-mortal",division:"legends",nextName:"Ver integrante siguiente"},
    {query:"NEXUS Z",param:"member",slug:"soul-nexus-z",division:"crew",nextName:"Ver integrante siguiente"}
  ]) {
    const page=await profileContext.newPage();
    const check={scenario:scenario.division,ok:false};
    try {
      await page.goto(BASE+"/#roster",{waitUntil:"domcontentloaded",timeout:45000});
      await page.locator("#roster-search").fill(scenario.query);
      await page.locator('#roster-search-results a[href*="'+scenario.param+'='+scenario.slug+'"]').first().click({timeout:15000});
      await page.waitForURL(url=>url.searchParams.get(scenario.param)===scenario.slug,{timeout:15000});
      const dialog=page.getByRole("dialog");
      await dialog.waitFor({state:"visible",timeout:15000});
      const startingName=(await dialog.getByRole("heading").first().textContent().catch(()=>""))?.trim() || "";
      await dialog.getByRole("button",{name:scenario.nextName}).click();
      const followingName=(await dialog.getByRole("heading").first().textContent().catch(()=>""))?.trim() || "";
      await dialog.getByRole("button",{name:"Cerrar"}).click();
      await dialog.waitFor({state:"hidden",timeout:15000});
      const state=await page.evaluate(()=>({
        hash:location.hash,
        hasWave:new URLSearchParams(location.search).has("wave"),
        hasMember:new URLSearchParams(location.search).has("member"),
        rosterVisible:getComputedStyle(document.getElementById("roster")).display!=="none"
      }));
      check.openedProfile=Boolean(startingName);
      check.changedProfile=Boolean(followingName && followingName!==startingName);
      check.ok=state.hash==="#"+scenario.division && !state.hasWave && !state.hasMember &&
        state.rosterVisible && check.openedProfile && check.changedProfile;
      check.state=state;
    }catch(e){check.error=String(e).slice(0,380);}
    interactions.push(check);
    console.log("Interaction: "+JSON.stringify(check));
    await page.close();
  }
  await profileContext.close();
  fs.writeFileSync(path.join(OUT,"interaction-results.json"),JSON.stringify(interactions,null,2));
  await browser.close();
  fs.writeFileSync(path.join(OUT,"results.json"),JSON.stringify(results,null,2));
  const failures=results.filter(r=>!r.ok);
  const interactionFailures=interactions.filter(r=>!r.ok);
  console.log("Visual audit: "+results.length+" viewports, failures="+failures.length+", interaction failures="+interactionFailures.length);
  process.exitCode=(failures.length || interactionFailures.length) ? 1:0;
})().catch(e=>{console.error(e);process.exitCode=1;});
