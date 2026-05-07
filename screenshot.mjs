import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const puppeteerEntry = pathToFileURL(
  'C:/Users/bjpar/AppData/Roaming/npm/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js',
).href;
const { default: puppeteer } = await import(puppeteerEntry);

const url = process.argv[2];
const label = process.argv[3] || 'untitled';
const widthArg = process.argv[4];

if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label] [viewportWidth]');
  process.exit(1);
}

const width = widthArg ? Number.parseInt(widthArg, 10) : 1440;
if (Number.isNaN(width) || width < 320 || width > 3840) {
  console.error(`Invalid viewport width: ${widthArg}`);
  process.exit(1);
}

const outDir = 'temporary screenshots';
fs.mkdirSync(outDir, { recursive: true });

const existing = fs
  .readdirSync(outDir)
  .filter((f) => f.startsWith('screenshot-') && f.endsWith('.png')).length;
const n = existing + 1;
const outPath = path.join(outDir, `screenshot-${n}-${label}.png`);

const browser = await puppeteer.launch({ headless: 'new' });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved ${outPath} at ${width}px viewport`);
} finally {
  await browser.close();
}
