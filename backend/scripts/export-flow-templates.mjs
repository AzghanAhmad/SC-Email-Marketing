/**
 * Exports flow template arrays from frontend TypeScript data files to JSON for DB seeding.
 * Run: node backend/scripts/export-flow-templates.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendServices = path.resolve(__dirname, '../../frontend/src/app/core/services');
const outPath = path.resolve(__dirname, '../SeedData/flow-templates.json');

const files = [
  'flow-templates-onboarding.data.ts',
  'flow-templates-transaction.data.ts',
  'flow-templates-launch.data.ts',
  'flow-templates-retention.data.ts',
];

const all = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(frontendServices, file), 'utf8');
  const match = content.match(/=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) {
    console.error(`Could not parse ${file}`);
    process.exit(1);
  }
  // eslint-disable-next-line no-eval
  const arr = eval(match[1]);
  all.push(...arr);
  console.log(`Loaded ${arr.length} templates from ${file}`);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(all, null, 2), 'utf8');
console.log(`Wrote ${all.length} templates to ${outPath}`);
