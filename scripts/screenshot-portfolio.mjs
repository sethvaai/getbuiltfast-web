import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "..", "public", "portfolio");

const shots = [
  { slug: "luxstay",      url: "https://luxstay-demo-seven.vercel.app",       device: "desktop" },
  { slug: "urbanthreads", url: "https://urbanthreads-demo.vercel.app",        device: "desktop" },
  { slug: "flowmetrics",  url: "https://flowmetrics-demo-three.vercel.app",   device: "desktop" },
  { slug: "mindspace",    url: "https://mindspace-demo.vercel.app",           device: "mobile" },
  { slug: "aureveil",     url: "https://aureveil-demo.vercel.app",            device: "desktop" },
];

const viewports = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile:  { width: 375,  height: 812, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

for (const shot of shots) {
  const page = await browser.newPage();
  await page.setViewport(viewports[shot.device]);
  try {
    console.log(`→ ${shot.slug} @ ${shot.url}`);
    await page.goto(shot.url, { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));
    const path = resolve(outDir, `${shot.slug}.jpg`);
    await page.screenshot({ path, type: "jpeg", quality: 88, fullPage: false });
    console.log(`  ✓ ${path}`);
  } catch (err) {
    console.error(`  ✗ ${shot.slug}:`, err.message);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log("done.");
