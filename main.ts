// Hand-in program for the Australia by the Numbers entry (Node 22, standard library only).
//
// The entry is a static site: app/ holds the pages, styles and scripts, and screenshots/ holds
// the browser renders of it. This program copies both folders from beside this file into the
// output directory and writes dossier.json there, using the vendored make.fun library to build
// the dossier the judge reads. Keep vendor/makefun-frontend.ts untouched: the scorer rebuilds
// the dossier with its own copy of that library and the two must match byte for byte.
//
// When the grader runs this, /output is the destination. Anywhere else, set MAKEFUN_OUTPUT_DIR
// to choose the destination instead:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Serve the site while building it with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps the scorer enforces (from the kit's gate): text_max_bytes shapes the dossier text;
// the screenshot and app caps refuse an entry the scorer would refuse (more than 4 screenshots
// or one over 256 KiB; more than 993 files and directories in app/, or app/ over 16 MiB).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
