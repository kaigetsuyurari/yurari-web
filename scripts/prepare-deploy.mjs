/**
 * Assembles the deploy directory by merging:
 * - .open-next/assets/*  (static files at root, so /_next/... resolves correctly)
 * - .open-next/worker.js as _worker.js (Pages entry point)
 * - .open-next/cloudflare/, middleware/, server-functions/, .build/, cache/ (worker dependencies)
 * - _routes.json (tells Pages which requests go to the worker vs static files)
 */

import { cpSync, rmSync, mkdirSync, writeFileSync } from "fs"

const DEPLOY_DIR = ".deploy"
const OPEN_NEXT = ".open-next"

// Clean
rmSync(DEPLOY_DIR, { recursive: true, force: true })
mkdirSync(DEPLOY_DIR)

// Copy static assets to root
cpSync(`${OPEN_NEXT}/assets`, DEPLOY_DIR, { recursive: true })

// Copy worker as _worker.js
cpSync(`${OPEN_NEXT}/worker.js`, `${DEPLOY_DIR}/_worker.js`)

// Copy worker dependencies
for (const dir of ["cloudflare", "middleware", "server-functions", ".build", "cache"]) {
  cpSync(`${OPEN_NEXT}/${dir}`, `${DEPLOY_DIR}/${dir}`, { recursive: true, force: true })
}

// Copy app-level icons (Next.js metadata convention files)
cpSync("app/icon.png", `${DEPLOY_DIR}/icon.png`)
cpSync("app/apple-icon.png", `${DEPLOY_DIR}/apple-icon.png`)

// Generate _routes.json
// "exclude" patterns are served as static files (not routed to the worker)
const routes = {
  version: 1,
  include: ["/*"],
  exclude: [
    "/_next/static/*",
    "/favicon.ico",
    "/icon.png",
    "/apple-icon.png",
    "/og-image.jpg",
    "/*.svg",
    "/*.jpg",
    "/BUILD_ID",
  ],
}
writeFileSync(`${DEPLOY_DIR}/_routes.json`, JSON.stringify(routes, null, 2))
