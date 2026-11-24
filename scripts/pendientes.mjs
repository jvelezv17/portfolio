// Lista lo que sigue marcado como [POR COMPLETAR] en los datos del sitio.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const carpeta = 'src/data';
let total = 0;
for (const archivo of readdirSync(carpeta)) {
  const lineas = readFileSync(join(carpeta, archivo), 'utf8').split('\n');
  lineas.forEach((linea, i) => {
    if (linea.includes('[POR COMPLETAR]')) {
      total++;
      console.log(`${carpeta}/${archivo}:${i + 1}  ${linea.trim()}`);
    }
  });
}
console.log(total ? `\n${total} pendiente(s).` : 'Nada pendiente. ¡Listo para publicar!');
