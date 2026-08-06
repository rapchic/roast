import { install } from './install.js';

/**
 * Alias for `install` (global + project). Kept so old docs/scripts keep working.
 */
export async function bootstrap(opts = {}) {
  console.log('(bootstrap is an alias for install — prefer: npx roastit install)\n');
  return install(opts);
}
