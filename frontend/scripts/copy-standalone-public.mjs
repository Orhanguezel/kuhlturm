import { cpSync, existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const staticDir = path.join(root, '.next', 'static');
const standaloneDir = path.join(root, '.next', 'standalone');

function findStandaloneServers(dir, results = []) {
  if (!existsSync(dir)) {
    return results;
  }

  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules') {
      continue;
    }

    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      findStandaloneServers(fullPath, results);
      continue;
    }

    if (entry === 'server.js') {
      results.push(fullPath);
    }
  }

  return results;
}

if (!existsSync(publicDir) || !existsSync(standaloneDir)) {
  process.exit(0);
}

for (const serverFile of findStandaloneServers(standaloneDir)) {
  const targetPublicDir = path.join(path.dirname(serverFile), 'public');
  cpSync(publicDir, targetPublicDir, { recursive: true, force: true });
  console.log(`Copied public assets to ${path.relative(root, targetPublicDir)}`);

  if (existsSync(staticDir)) {
    const targetStaticDir = path.join(path.dirname(serverFile), '.next', 'static');
    cpSync(staticDir, targetStaticDir, { recursive: true, force: true });
    console.log(`Copied Next static assets to ${path.relative(root, targetStaticDir)}`);
  }
}
