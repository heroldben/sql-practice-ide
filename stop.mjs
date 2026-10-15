#!/usr/bin/env node
/**
 * Stop the SQL Practice IDE server from anywhere.
 *
 *   node stop.mjs              # stop the server on http://localhost:8080
 *   node stop.mjs --port=9000
 *   npm run stop
 *
 * Asks the running server to shut down through POST /api/shutdown (accepted from
 * this machine only) and waits until the port stops answering. If nothing is
 * listening it says so instead of failing.
 */
const args = process.argv.slice(2);
const portArg = args.find((arg) => arg.startsWith('--port='));
const port = Number(portArg ? portArg.split('=')[1] : (process.env.PORT ?? 8080));
const base = `http://127.0.0.1:${port}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function responds() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 700);
  try {
    const response = await fetch(`${base}/index.html`, { signal: controller.signal, cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  if (!(await responds())) {
    console.log(`Nothing is listening on port ${port} — the SQL Practice IDE server is already stopped.`);
    return;
  }
  try {
    const response = await fetch(`${base}/api/shutdown`, { method: 'POST' });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.log(`The server on port ${port} refused to stop (HTTP ${response.status}${body.error ? `: ${body.error}` : ''}).`);
      if (response.status === 404) {
        console.log('It looks like an older version of serve.mjs is running. Stop it with Ctrl+C in its window,');
        console.log(`or force it: netstat -ano | findstr :${port}  then  taskkill /PID <pid> /F`);
      }
      process.exitCode = 1;
      return;
    }
  } catch (error) {
    console.log(`Could not reach the server on port ${port}: ${error.message}`);
    process.exitCode = 1;
    return;
  }
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await sleep(200);
    if (!(await responds())) {
      console.log(`SQL Practice IDE server stopped (port ${port} is free). Start it again with start.cmd or npm run dev.`);
      return;
    }
  }
  console.log(`The server on port ${port} did not stop within a few seconds — close its console window or use taskkill.`);
  process.exitCode = 1;
}

await main();
