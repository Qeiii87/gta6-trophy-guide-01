// Leonida Legends — GTA VI trophy guide & tracker (make.fun gta6-trophy-guide-01).
// Node 22, standard library only. This program hands the guide in: it copies
// the static app in app/ and the screenshots in screenshots/ from beside this
// file into the output directory, then writes /output/dossier.json with the
// kit's vendored make.fun library, so the judge reads the same dossier the
// scorer checks. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The guide itself is app/index.html: open it in a desktop browser with the
// network off and it works from its own files alone.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy the whole app first, then the screenshots beside it. Both are plain
// files; the app loads nothing from the network.
mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The caps match the scorer's gate (reference/gate.json): at most 4
// screenshots of 256 KiB each, at most 993 files and 48 MiB under app/,
// and a dossier of at most 1.5 MiB. buildDossier refuses anything past
// them, so a dossier that exists here passed those limits.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
console.log(`guide handed in: ${out}`);
