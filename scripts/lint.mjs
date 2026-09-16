import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : /\.(jsx?|tsx?|mjs)$/.test(entry.name) ? [path.join(dir, entry.name)] : []);
const files = [...walk('src'), ...walk('tests')];
const result = spawnSync(process.execPath, ['node_modules/oxlint/bin/oxlint', '--no-ignore', '--deny-warnings', ...files], { stdio: 'inherit' });
console.log(`Lint: ${files.length} arquivos enviados explicitamente (pasta outputs ignorada pelo repositório pai).`);
process.exit(result.status ?? 1);
