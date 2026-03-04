import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const TOOLS_DIR = './tools';

const FIXES = [
  {
    desc: 'Fix fetch path for tools.json',
    find: `fetch('tools.json')`,
    replace: `fetch('../tools.json')`,
  },
  {
    desc: 'Fix tool match logic to compare by filename only',
    find: `const tool = data.tools.find(t => (t.src || t.file) === file);`,
    replace: `const tool = data.tools.find(t => { const s = t.src || t.file || ''; return s === file || s.split('/').pop() === file; });`,
  },
];

const files = readdirSync(TOOLS_DIR).filter(f => f.endsWith('.html'));

console.log(`Found ${files.length} HTML file(s) in ${TOOLS_DIR}/\n`);

let totalFixed = 0;

for (const filename of files) {
  const filepath = join(TOOLS_DIR, filename);
  let content = readFileSync(filepath, 'utf8');
  let changed = false;

  for (const { desc, find, replace } of FIXES) {
    if (content.includes(find)) {
      content = content.replaceAll(find, replace);
      console.log(`  ✓ [${filename}] ${desc}`);
      changed = true;
    }
  }

  if (changed) {
    writeFileSync(filepath, content, 'utf8');
    totalFixed++;
  } else {
    console.log(`  – [${filename}] no changes needed`);
  }
}

console.log(`\nDone. ${totalFixed}/${files.length} file(s) updated.`);
