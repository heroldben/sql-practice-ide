#!/usr/bin/env node
/**
 * Zero-dependency static server for the SQL Practice IDE.
 *
 *   node serve.mjs            # serve on http://localhost:8080
 *   node serve.mjs --port=9000
 *   node serve.mjs --open     # also open the default browser (once)
 *   node serve.mjs --host=0.0.0.0   # expose on the LAN (loopback by default)
 *   node serve.mjs --data-dir=D:\\elsewhere   # where the saved progress lives (progress/ by default)
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
import { createReadStream, existsSync, mkdirSync, renameSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createProgressStore, sanitizeEntries } from './progress-store.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MARKER = 'SQL Practice IDE';
const MAX_PORT_ATTEMPTS = 10;
const MAX_BODY_BYTES = 4 * 1024 * 1024;

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
const dataDirArg = args.find((arg) => arg.startsWith('--data-dir='));
const dataDir = dataDirArg ? path.resolve(dataDirArg.slice('--data-dir='.length)) : path.join(ROOT, 'progress');
const shouldOpen = args.includes('--open');

/** Folder that holds the saved progress, e.g. `progress/progress.db`. */
const STORE_FILES = ['progress.db', 'progress.db-wal', 'progress.db-shm', 'progress.json'];

/** One-time move of a store written by an older version (it used `.local/`). */
function migrateLegacyStore(dir) {
  const legacy = path.join(ROOT, '.local');
  if (path.resolve(legacy) === path.resolve(dir)) return;
  for (const name of STORE_FILES) {
    const from = path.join(legacy, name);
    const to = path.join(dir, name);
    if (!existsSync(from) || existsSync(to)) continue;
    try {
      mkdirSync(dir, { recursive: true });
      renameSync(from, to);
      console.log(`progress: moved ${path.relative(ROOT, from).replaceAll('\\', '/')} → ${path.relative(ROOT, to).replaceAll('\\', '/')}`);
    } catch (error) {
      // Another server instance may still be using the old file; keep starting and try again next run.
      console.warn(`progress: could not move ${path.relative(ROOT, from).replaceAll('\\', '/')} (${error.code ?? error.message}) — it stays where it is; stop the other server instance and restart to migrate it.`);
    }
  }
}

migrateLegacyStore(dataDir);

/** Shared progress for every browser on this machine (`/api/progress`). */
const progressStore = createProgressStore({ dir: dataDir });

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

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error('request body too large');
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  return text ? JSON.parse(text) : {};
}

/** Set once the server is listening, so /api/shutdown can close it. */
let activeServer = null;
let shuttingDown = false;

function isLoopbackRequest(req) {
  const address = req.socket?.remoteAddress ?? '';
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

/**
 * POST /api/shutdown — stop the server (used by the app's "Stop server" button and
 * `npm run stop`). Only accepted from this machine, so exposing the app on the LAN
 * does not let others stop it.
 */
function handleShutdown(req, res) {
  if ((req.method || 'GET') !== 'POST') return sendJson(res, 405, { ok: false, error: 'POST required' });
  if (!isLoopbackRequest(req)) return sendJson(res, 403, { ok: false, error: 'stopping the server is only allowed from this machine' });
  if (shuttingDown) return sendJson(res, 200, { ok: true, message: 'already stopping' });
  shuttingDown = true;
  sendJson(res, 200, { ok: true, message: 'stopping' });
  console.log('shutdown requested — stopping the server');
  setTimeout(() => {
    const done = () => process.exit(0);
    if (activeServer) {
      activeServer.close(done);
      setTimeout(done, 750).unref();
    } else {
      done();
    }
  }, 150);
}

/** GET/PUT/DELETE /api/progress — the shared store behind cross-browser progress. */
async function handleProgressApi(req, res) {
  const method = req.method || 'GET';
  if (method === 'GET' || method === 'HEAD') {
    return sendJson(res, 200, { ok: true, backend: progressStore.backend, progress: progressStore.read() });
  }
  if (method === 'PUT' || method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const entries = sanitizeEntries(body.entries ?? body.progress ?? body);
      const merged = progressStore.write(entries);
      return sendJson(res, 200, { ok: true, backend: progressStore.backend, accepted: Object.keys(entries).length, progress: merged });
    } catch (error) {
      return sendJson(res, 400, { ok: false, error: error.message });
    }
  }
  if (method === 'DELETE') {
    progressStore.reset();
    return sendJson(res, 200, { ok: true, backend: progressStore.backend, progress: {} });
  }
  return sendJson(res, 405, { ok: false, error: `${method} not allowed` });
}

async function handle(req, res) {
  const urlPath = (req.url || '/').split('?')[0];
  if (urlPath === '/api/progress') return handleProgressApi(req, res);
  if (urlPath === '/api/shutdown') return handleShutdown(req, res);
  if (urlPath.startsWith('/api/')) return sendJson(res, 404, { ok: false, error: `unknown endpoint: ${urlPath}` });
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
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
  activeServer = server;
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
    console.log(`progress store: ${progressStore.backend} · ${path.relative(ROOT, progressStore.file).replaceAll('\\', '/')} (shared by every browser on this machine)`);
    if (shouldOpen) openBrowserOnce(url);
  });
}

if (await isThisAppRunning(preferredPort)) {
  console.log(`SQL Practice IDE is already running → http://localhost:${preferredPort}/`);
  console.log('Reusing that instance: no second server was started and no new tab was opened.');
  process.exit(3);
}

startServer(preferredPort);
