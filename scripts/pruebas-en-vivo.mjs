// Corre las mismas pruebas de Playwright contra el sitio PUBLICADO (no contra tu PC).
// Uso: npm run test:vivo            → usa la URL de astro.config.mjs
//      npm run test:vivo -- <url>   → otra URL (ej. la vista previa de un Pull Request)
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const argumento = process.argv.slice(2).find((a) => a.startsWith('http'));
const delConfig = readFileSync('astro.config.mjs', 'utf8').match(/site:\s*'([^']+)'/)?.[1];
const url = (argumento ?? delConfig ?? '').replace(/\/$/, '');
if (!url) {
  console.error('No encontré la URL del sitio (ni en el argumento ni en astro.config.mjs).');
  process.exit(1);
}
console.log(`Probando el sitio publicado: ${url}\n`);
const resultado = spawnSync('npx', ['playwright', 'test'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PRUEBAS_URL: url },
});
process.exit(resultado.status ?? 1);
