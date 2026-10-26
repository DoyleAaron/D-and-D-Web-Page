// Local preview only. Never serve the repository wholesale: it contains private notes.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.md': 'text/plain', '.json': 'application/json', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.mp4': 'video/mp4' };
export function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\//, '') || 'index.html';
      const allowed = /^(index|hq|guild-board|map|dm)\.html$/.test(name) || /^(map\.jpg|intro\.mp4|road-data\.js)$/.test(name) || /^(static\/|Lore\/DND\/|data\/hq-(data|catalogue)\.js$|scripts\/[^/]+\.js$|tests\/[^/]+\.(html|js)$|tools\/hq-map-editor\.html$)/.test(name);
      if (!allowed || name.includes('..') || name.includes('\\') || name.split('/').some(p => p.startsWith('.'))) { res.writeHead(404); return res.end('Not found'); }
      const file = path.join(root, name), data = await fs.readFile(file);
      res.writeHead(200, { 'Content-Type': (mime[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(data);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.HQ_PORT || 8080);
  createServer().listen(port, '127.0.0.1', () => console.log(`HQ preview: http://127.0.0.1:${port}/hq.html`));
}
