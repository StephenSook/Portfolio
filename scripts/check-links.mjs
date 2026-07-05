// check-links.mjs: verify every URL in data/projects.ts responds.
// Node ESM, no dependencies. Reads projects.ts as text, regexes out the
// https URLs, and fetches each with a 12s timeout. Always exits 0.
//
// Run: npm run links

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const projectsPath = resolve(here, "..", "data", "projects.ts");
const TIMEOUT_MS = 12000;

async function fetchStatus(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { redirect: "follow", signal: controller.signal });
    // FastAPI / Render backends often 404 at root but serve /docs.
    if (res.status === 404 && url.includes("onrender.com")) {
      const docsUrl = url.replace(/\/+$/, "") + "/docs";
      const docsRes = await fetch(docsUrl, { redirect: "follow", signal: controller.signal });
      return `${docsRes.status} ${url} (root 404, checked /docs -> ${docsUrl})`;
    }
    return `${res.status} ${url}`;
  } catch (err) {
    const reason = err && err.name === "AbortError" ? "TIMEOUT" : "ERROR";
    return `${reason} ${url} (${err && err.message ? err.message : "unknown"})`;
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const source = await readFile(projectsPath, "utf8");
  const matched = source.match(/https?:\/\/[^\s"'`)]+/g) || [];
  const urls = [...new Set(matched)];

  if (urls.length === 0) {
    console.log("No URLs found in data/projects.ts");
    return;
  }

  console.log(`Checking ${urls.length} URLs from data/projects.ts\n`);
  const results = await Promise.all(urls.map(fetchStatus));
  for (const line of results.sort()) {
    console.log(line);
  }
}

main().catch((err) => {
  // Never fail the run; report and exit 0.
  console.error("check-links error:", err && err.message ? err.message : err);
});
