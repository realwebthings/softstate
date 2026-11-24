// The package folder is what npm publishes, so its README and LICENSE must live there.
// GitHub shows the root README on the front page, so the root gets the same docs.
// `node scripts/sync-docs.mjs` rewrites the root copies; `--check` fails if they drifted.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const pkg = 'packages/softstate'
const footer = `
## Repository layout

- [${pkg}](${pkg}): the library source, tests and size/API scripts (what is published to npm).
- [examples/next-app](examples/next-app): Next.js demo with a per-request store, local state and persist.
- The README and LICENSE above are copied from \`${pkg}\` by \`npm run docs\`. Edit them there.
`

const files = [
  ['README.md', readFileSync(`${pkg}/README.md`, 'utf8').trimEnd() + '\n' + footer],
  ['LICENSE', readFileSync(`${pkg}/LICENSE`, 'utf8')],
]

const check = process.argv.includes('--check')
let stale = false
for (const [name, content] of files) {
  const current = existsSync(name) ? readFileSync(name, 'utf8') : null
  if (current === content) continue
  if (check) {
    console.error(`${name} is out of date: run \`npm run docs\``)
    stale = true
  } else {
    writeFileSync(name, content)
    console.log(`wrote ${name}`)
  }
}
process.exit(stale ? 1 : 0)
