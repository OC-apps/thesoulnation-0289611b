// Integration test against a running dev server and the published original media.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.SOUL_PLAYWRIGHT_MODULE || "playwright");
const base = process.env.SOUL_TEST_BASE || "http://127.0.0.1:5173";
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.SOUL_CHROME ? { executablePath: process.env.SOUL_CHROME } : {}),
  });
  try {
    for (const width of [320, 390, 1440]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      let mediaRequests = 0;
      page.on("request", (r) => {
        if (r.url().includes("/storage/v1/object/public/gears-media/")) mediaRequests++;
      });
      await page.goto(base + "/soul-news", { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "▶ Reproducir episodio" }).waitFor({ timeout: 30000 });
      assert.equal(mediaRequests, 0, "No media download before user playback");
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
        false,
        "No horizontal overflow",
      );
      await page.getByRole("button", { name: "▶ Reproducir episodio" }).click();
      await page.waitForFunction(
        () => {
          const v = document.querySelector(".gears-video.is-active");
          return v && !v.paused && v.currentTime > 0;
        },
        {},
        { timeout: 30000 },
      );
      await page.getByRole("button", { name: "Pausar", exact: true }).click();
      assert.equal(
        await page
          .locator(".gears-player")
          .evaluate((el) => Array.from(el.querySelectorAll("video,audio")).every((v) => v.paused)),
        true,
      );
      await page.getByRole("button", { name: "Reproducir", exact: true }).click();
      if (width === 1440) {
        await page.locator(".gears-video.is-active").evaluate((v) => {
          v.currentTime = v.duration - 0.2;
        });
      } else await page.getByRole("button", { name: "Saltar intro" }).click();
      await page.waitForFunction(
        () => {
          const a = document.querySelector(".gears-player audio");
          return a && !a.paused && a.currentTime > 0;
        },
        {},
        { timeout: 45000 },
      );
      await page.getByRole("slider", { name: "Posición del MP3 del episodio" }).fill("30");
      await page.waitForFunction(
        () => {
          const a = document.querySelector(".gears-player audio"),
            v = document.querySelectorAll(".gears-player video")[1];
          return (
            a.readyState >= 3 && v.readyState >= 3 && Math.abs(a.currentTime - v.currentTime) < 1
          );
        },
        {},
        { timeout: 30000 },
      );
      const sync = await page.locator(".gears-player").evaluate((el) => ({
        audio: el.querySelector("audio").currentTime,
        video: el.querySelectorAll("video")[1].currentTime,
      }));
      assert.ok(Math.abs(sync.audio - sync.video) < 1, "Audio is the seek clock");
      const loopDuration = await page
        .locator(".gears-player video")
        .nth(1)
        .evaluate((v) => v.duration);
      const voiceDuration = await page.locator(".gears-player audio").evaluate((a) => a.duration);
      if (loopDuration + 2 < voiceDuration) {
        await page
          .getByRole("slider", { name: "Posición del MP3 del episodio" })
          .fill((loopDuration - 0.6).toFixed(1));
        await page.waitForFunction(
          () => {
            const a = document.querySelector(".gears-player audio"),
              v = document.querySelectorAll(".gears-player video")[1];
            return (
              a.currentTime > v.duration + 0.2 &&
              !a.paused &&
              !v.paused &&
              v.currentTime < 3 &&
              document.querySelector(".gears-stage").dataset.segment === "background"
            );
          },
          {},
          { timeout: 30000 },
        );
        console.log(`PASS ${width}px: real background loop without restarting the MP3`);
      }
      await page.getByRole("button", { name: "Pausar", exact: true }).click();
      await page.getByRole("slider", { name: "Posición del MP3 del episodio" }).fill("40");
      assert.equal(
        await page.locator(".gears-player audio").evaluate((a) => a.paused),
        true,
        "Seeking retains pause",
      );
      await page.getByRole("button", { name: "Reproducir", exact: true }).click();
      await page.locator(".gears-player audio").evaluate((a) => {
        a.currentTime = a.duration - 0.2;
      });
      await page.waitForFunction(
        () => document.querySelector(".gears-stage").dataset.segment === "outro",
      );
      await page.waitForFunction(
        () => {
          const v = document.querySelector(".gears-video.is-active");
          return v.readyState >= 2 && !v.paused;
        },
        {},
        { timeout: 30000 },
      );
      await page.locator(".gears-video.is-active").evaluate((v) => {
        v.currentTime = v.duration - 0.2;
      });
      await page.getByRole("status").filter({ hasText: "Episodio terminado" }).waitFor();
      await page.getByRole("button", { name: "Reproducir", exact: true }).click();
      await page.waitForFunction(
        () => document.querySelector(".gears-stage").dataset.segment === "intro",
      );
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: lazy media, playback, pause, skip, seek sync, outro, replay`);
      await page.goto(base + "/soul-news/editorial", { waitUntil: "networkidle" });
      await page.getByRole("heading", { name: "Iniciar sesión" }).waitFor();
      await page.getByPlaceholder("Contraseña").fill("invalid-gears-test-password");
      await page.getByRole("button", { name: "Entrar", exact: true }).click();
      await page.getByRole("alert").filter({ hasText: "Contraseña incorrecta" }).waitFor();
      await page.close();
    }
    const branded = await browser.newPage({
      viewport: { width: 390, height: 900 },
      reducedMotion: "no-preference",
    });
    await branded.goto(base + "/soul-news", { waitUntil: "networkidle" });
    await branded.getByRole("button", { name: "▶ Reproducir episodio" }).click();
    await branded.waitForFunction(
      () => document.querySelector(".gears-video.is-active")?.currentTime > 0,
    );
    await branded.getByRole("button", { name: "Saltar intro" }).click();
    await branded.waitForSelector(".gears-brand");
    assert.ok(
      await branded
        .locator(".gears-brand img")
        .evaluate((img) => img.complete && img.naturalWidth > 0),
      "Official logo preloaded",
    );
    assert.ok(
      (await branded
        .locator(".gears-stage")
        .evaluate((el) => el.getAnimations({ subtree: true }).length)) >= 5,
      "Code-driven transition layers",
    );
    await branded.waitForFunction(
      () => document.querySelector(".gears-stage").dataset.transitioning === "false",
    );
    assert.equal(
      await branded.locator(".gears-transition,.gears-video.is-previous").count(),
      0,
      "Transition cleanup",
    );
    await branded.close();
    console.log("PASS branded transition: logo loaded, animation layers and cleanup");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
