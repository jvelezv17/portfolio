// Lista lo que sigue marcado como [POR COMPLETAR] en los datos del sitio (incluye src/data/en/).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const carpeta = 'src/data';
let total = 0;
for (const entrada of readdirSync(carpeta, { recursive: true, withFileTypes: true })) {
  if (!entrada.isFile()) continue;
  const ruta = join(entrada.parentPath ?? entrada.path, entrada.name);
  readFileSync(ruta, 'utf8')
    .split('\n')
    .forEach((linea, i) => {
      if (linea.includes('[POR COMPLETAR]')) {
        total++;
        console.log(`${ruta}:${i + 1}  ${linea.trim()}`);
      }
    });
}
console.log(total ? `\n${total} pendiente(s).` : 'Nada pendiente. ¡Listo para publicar!');
