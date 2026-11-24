# Portfolio · Juan Esteban Vélez

[![Pruebas](https://github.com/jvelezv17/portfolio/actions/workflows/pruebas.yml/badge.svg)](https://github.com/jvelezv17/portfolio/actions/workflows/pruebas.yml)

Portfolio personal de QA Automation hecho con [Astro](https://astro.build) y probado con [Playwright](https://playwright.dev).
Cada cambio corre las pruebas en GitHub Actions (escritorio y móvil).

## Correrlo en tu PC

```bash
npm install
npm run dev        # abre http://localhost:4321 y se recarga solo al guardar
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Sitio en modo desarrollo |
| `npm run build` | Compila el sitio final en `dist/` |
| `npm run preview` | Sirve lo compilado, igual a como queda publicado |
| `npm test` | Compila y corre las pruebas Playwright |
| `npm run test:ui` | Las mismas pruebas, en la interfaz visual de Playwright |
| `npm run pendientes` | Lista lo que sigue marcado como `[POR COMPLETAR]` |
| `npm run og` | Regenera `public/og.png`, la imagen que sale al compartir el link (córrelo si cambias nombre, rol, frase o avatar) |

La primera vez que corras las pruebas: `npx playwright install chromium`.

## Dónde se edita el contenido

Todo el texto vive en `src/data/` — no hace falta tocar el diseño:

- `perfil.ts` — nombre, rol, frase, contacto, formación, idiomas, proyectos propios
- `proyectos.ts` — casos de estudio (problema → qué hice → resultado)
- `experiencia.ts` — línea de tiempo de trabajos
- `stack.ts` — herramientas

Un caso de estudio nuevo = agregar un objeto a `proyectos.ts`. La página de detalle y su prueba se crean solas.

## Qué prueban las pruebas (`tests/portfolio.spec.ts`)

- **Carga:** el inicio muestra nombre, rol y frase; no hay errores en consola ni recursos rotos.
- **Navegación:** el menú lleva a cada sección; cada tarjeta abre su caso y se puede volver; la 404 funciona.
- **Enlaces:** recorre todo el sitio buscando enlaces internos rotos; las anclas apuntan a ids que existen; los externos son https y abren en otra pestaña con `rel="noopener"`.
- **Calidad:** sin scroll horizontal en móvil y sin problemas de accesibilidad graves (axe-core, WCAG 2 AA).

## Avatar animado

Los videos del editor de avatar no traen transparencia, así que se exportan con **fondo azul** (no verde: las antenas son verdes)
y se convierten a WebP animado transparente con ffmpeg (`npx ffmpeg-static` o cualquier ffmpeg con libwebp):

```bash
ffmpeg -i entrada.webm -vf "fps=30,crop=352:512:46:0,colorkey=0x0000ff:0.32:0.10,despill=type=blue:mix=0.6:expand=0" \
  -c:v libwebp_anim -lossless 0 -quality 85 -compression_level 6 -loop 0 -an public/avatar/nombre.webp
```

`crop` recorta los lados vacíos (ajústalo si la animación se mueve más). Para la versión fija (quien tiene
"reducir movimiento" activado) se guarda un cuadro del WebP como `nombre-quieto.webp`.

## Publicarlo gratis

Ver [PUBLICAR.md](PUBLICAR.md).

## Confidencialidad

Los casos de estudio de mi trabajo actual se cuentan de forma anónima: sin nombre de la empresa ni de sus clientes,
sin código y sin datos reales.
