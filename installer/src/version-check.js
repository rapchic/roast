import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  await readFile(join(__dirname, '../../package.json'), 'utf8'),
);
const current = pkg.version;
const packageName = pkg.name;

export async function checkForUpdate() {
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}/latest`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { current, latest: null, updateAvailable: false, releaseUrl: null };
    const data = await res.json();
    const latest = data.version;
    const updateAvailable = compareSemver(current, latest) < 0;
    const releaseUrl = data.repository?.url?.replace(/^git\+/, '').replace(/\.git$/, '')
      ?? `https://www.npmjs.com/package/${packageName}`;
    return { current, latest, updateAvailable, releaseUrl };
  } catch {
    return { current, latest: null, updateAvailable: false, releaseUrl: null };
  }
}

/** Compare core semver (strips leading `v` and prerelease/build metadata). */
export function compareSemver(a, b) {
  const parse = (v) => {
    const core = String(v).replace(/^v/i, '').split(/[-+]/)[0];
    return core.split('.').map((part) => {
      const n = parseInt(part, 10);
      return Number.isFinite(n) ? n : 0;
    });
  };
  const pa = parse(a);
  const pb = parse(b);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
