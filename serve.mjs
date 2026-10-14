#!/usr/bin/env node
/**
 * Zero-dependency static server for the SQL Practice IDE.
 *
 *   node serve.mjs            # serve on http://localhost:8080
 *   node serve.mjs --port=9000
 *   node serve.mjs --open     # also open the default browser (once)
 *   node serve.mjs --host=0.0.0.0   # expose on the LAN (loopback by default)
 *
 * If this app is already being served on the requested port, this exits with
 * code 3 without starting a second server or opening another browser tab, so
 * repeated launches never stack up duplicate instances/tabs.
 *
 * Everything the app needs is in this folder (vendor/ holds CodeMirror, the
 * Kumbh Sans webfont and the PGlite Postgres engine), so no install, build step
 * or internet connection is required.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'SQL Practice IDE';
const MAX_PORT_ATTEMPTS = 10;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2',
  '.data': 'application/octet-stream',
  '.tar.gz': 'application/gzip',
};

const args = process.argv.slice(2);
const portArg = args.find((arg) => arg.startsWith('--port='));
const preferredPort = Number(portArg ? portArg.split('=')[1] : (process.env.PORT ?? 8080));
const hostArg = args.find((arg) => arg.startsWith('--host='));
const host = hostArg ? hostArg.split('=')[1] : '127.0.0.1';
const shouldOpen = args.includes('--open');

let browserOpened = false;

function openBrowserOnce(url) {
  if (browserOpened) return;
  browserOpened = true;
  const [command, commandArgs] = process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : process.platform === 'darwin' ? ['open', [url]]
      : ['xdg-open', [url]];
  try {
    spawn(command, commandArgs, { stdio: 'ignore', detached: true }).unref();
  } catch {
    // opening a browser is a convenience; never a failure
  }
}

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

async function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const target = path.resolve(ROOT, `.${path.posix.normalize(decoded)}`);
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) return null;
  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      const index = path.join(target, 'index.html');
      await stat(index);
      return index;
    }
    return target;
  } catch {
    return null;
  }
}

async function handle(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
  const urlPath = (req.url || '/').split('?')[0];
  if (urlPath !== '/' && urlPath.endsWith('/')) {
    res.writeHead(301, { Location: urlPath.slice(0, -1) + (req.url.includes('?') ? `?${req.url.split('?')[1]}` : '') });
    return res.end();
  }
  const file = await resolveFile(urlPath);
  if (!file) return send(res, 404, `Not found: ${urlPath}\n`);
  const ext = file.endsWith('.tar.gz') ? '.tar.gz' : path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
  if (req.method === 'HEAD') return res.end();
  const stream = createReadStream(file);
  stream.on('error', () => send(res, 500, 'Read error\n'));
  stream.pipe(res);
}

/** True when our own app already answers on that port. */
async function isThisAppRunning(port) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 800);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/index.html`, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) return false;
    return (await response.text()).includes(MARKER);
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function startServer(port, attempt = 0) {
  const server = createServer(handle);
  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempt < MAX_PORT_ATTEMPTS) {
      startServer(port + 1, attempt + 1);
      return;
    }
    console.error(`could not start the server: ${error.message}`);
    process.exit(1);
  });
  server.listen(port, host, () => {
    const url = `http://localhost:${port}/`;
    console.log(`SQL Practice IDE → ${url}   (keep this window open; Ctrl+C to stop)`);
    if (shouldOpen) openBrowserOnce(url);
  });
}

if (await isThisAppRunning(preferredPort)) {
  console.log(`SQL Practice IDE is already running → http://localhost:${preferredPort}/`);
  console.log('Reusing that instance: no second server was started and no new tab was opened.');
  process.exit(3);
}

startServer(preferredPort);
