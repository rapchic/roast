import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { version: current } = JSON.parse(
  await readFile(join(__dirname, '../../package.json'), 'utf8'),
);

export async function checkForUpdate() {
  try {
    const res = await fetch('https://registry.npmjs.org/roast/latest', {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { current, latest: null, updateAvailable: false, releaseUrl: null };
    const data = await res.json();
    const latest = data.version;
    const updateAvailable = compareSemver(current, latest) < 0;
    const releaseUrl = data.repository?.url?.replace(/^git\+/, '').replace(/\.git$/, '')
      ?? 'https://www.npmjs.com/package/roast';
    return { current, latest, updateAvailable, releaseUrl };
  } catch {
    return { current, latest: null, updateAvailable: false, releaseUrl: null };
  }
}

export function compareSemver(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
