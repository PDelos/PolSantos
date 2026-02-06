import { Glob } from "bun";
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import chokidar from "chokidar";
import { IMAGE_SIZES } from "../src/lib/config";

// --- CONFIG ---
const RAW_DIR = "static/uploads/raw";
const OPT_DIR = "static/uploads/optimized";
const QUALITY = 80;

// --- IMAGE LOGIC ---

async function processImage(relPath: string): Promise<void> {
  const input = path.join(RAW_DIR, relPath);
  const info = path.parse(relPath);
  const outputFolder = path.join(OPT_DIR, info.dir);

  try {
    // Ensure input still exists (race condition check)
    if (!(await fs.exists(input))) return;

    await fs.mkdir(outputFolder, { recursive: true });
    const img = sharp(input);
    const meta = await img.metadata();
    const width = meta.width ?? 0;

    const tasks = Object.entries(IMAGE_SIZES).map(([name, w]) => {
      // Always generate mobile variant, skip larger ones if original is smaller
      if (width < w && name !== "mobile") return;
      
      const outPath = path.join(outputFolder, `${info.name}-w${w}`);
      const task = img.clone().resize(w, null, { withoutEnlargement: true });
      
      return Promise.all([
        task.clone().webp({ quality: QUALITY }).toFile(`${outPath}.webp`),
        task.clone().avif({ quality: QUALITY }).toFile(`${outPath}.avif`)
      ]);
    });

    await Promise.all(tasks);
    console.log(`✅ ${relPath}`);
  } catch (e) {
    console.error(`❌ Failed ${relPath}:`, e);
  }
}

async function removeImage(relPath: string): Promise<void> {
  const info = path.parse(relPath);
  const targetDir = path.join(OPT_DIR, info.dir);

  if (!(await fs.exists(targetDir))) return;

  try {
    const files = await fs.readdir(targetDir);
    // Be very specific about what we delete to avoid collateral damage
    // Matches: filename-w[NUMBER].ext
    const prefix = `${info.name}-w`;
    const matches = files.filter(f => f.startsWith(prefix));
    
    if (matches.length > 0) {
      await Promise.all(matches.map(f => fs.unlink(path.join(targetDir, f))));
      console.log(`🗑️  Removed variants for ${relPath}`);
    }
  } catch (e) {
    console.error(`Failed to remove variants for ${relPath}:`, e);
  }
}

// --- RUNNERS ---

const processingLocks = new Map<string, Promise<void>>();

function schedule(relPath: string, action: () => Promise<void>) {
  const previous = processingLocks.get(relPath) || Promise.resolve();
  const next = previous.then(() => action()).catch((e) => console.error(e));
  processingLocks.set(relPath, next);
  return next;
}

async function sync(): Promise<void> {
  const time = performance.now();
  console.log("🧹 Resetting optimized folder...");
  await fs.rm(OPT_DIR, { recursive: true, force: true });
  await fs.mkdir(OPT_DIR, { recursive: true });

  const glob = new Glob("**/*.{jpg,jpeg,png,webp}");
  const files: string[] = [];
  
  for await (const file of glob.scan(RAW_DIR)) {
    files.push(file);
  }
  
  // Sequential processing to avoid resource exhaustion
  for (const file of files) {
    await processImage(file);
  }
  console.log(`✨ Sync completed in ${((performance.now() - time) / 1000).toFixed(2)}s`);
}

function startWatcher(): void {
  console.log(`👀 Watching ${RAW_DIR}...`);
  
  const watcher = chokidar.watch(RAW_DIR, {
    ignoreInitial: true,
    usePolling: true,
    interval: 100,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    }
  });

  watcher
    .on("add", (filePath) => {
        const relPath = path.relative(RAW_DIR, filePath);
        schedule(relPath, () => processImage(relPath));
    })
    .on("change", (filePath) => {
        const relPath = path.relative(RAW_DIR, filePath);
        schedule(relPath, () => processImage(relPath));
    })
    .on("unlink", (filePath) => {
        const relPath = path.relative(RAW_DIR, filePath);
        schedule(relPath, () => removeImage(relPath));
    })
    .on("error", (error) => console.log(`Watcher error: ${error}`));
}

// --- MAIN ---
(async () => {
    await sync();
    if (Bun.argv.includes("--watch")) {
        startWatcher();
    } else {
        process.exit(0);
    }
})();
