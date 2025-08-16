import { cp, mkdir } from 'node:fs/promises'

const src = 'src/assets/audios'
const dest = 'dist/assets/audios'

await mkdir('dist/assets', { recursive: true })
await cp(src, dest, { recursive: true })
