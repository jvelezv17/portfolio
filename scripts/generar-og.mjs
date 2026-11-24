// Genera las imágenes que aparecen al compartir el link en LinkedIn, WhatsApp, X…
//   public/og.png     → versión en español
//   public/og-en.png  → versión en inglés
// Tamaño estándar 1200×630. Se arma en HTML (mismas fuentes y colores del sitio) y se le toma
// una captura con Playwright.
//
// Uso: npm run og   (vuelve a correrlo si cambias tu nombre, rol, frase o avatar)
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Datos del perfil (leídos de los mismos archivos que usa el sitio, sin compilar TypeScript)
const leer = (archivo) => {
  const fuente = readFileSync(archivo, 'utf8');
  return (clave) => fuente.match(new RegExp(`${clave}:\\s*'([^']+)'`))?.[1] ?? '';
};
const es = leer('src/data/perfil.ts');
const en = leer('src/data/en/perfil.ts');
const nombre = es('nombre'); // el nombre solo está en el archivo en español
const avatar = readFileSync('public/avatar/perfil-quieto.webp').toString('base64');

const versiones = [
  { archivo: 'public/og.png', rol: es('rol'), frase: es('frase'), remoto: 'COL · Remoto', ok: 'todas las pruebas pasan' },
  { archivo: 'public/og-en.png', rol: en('rol'), frase: en('frase'), remoto: 'COL · Remote', ok: 'all tests passed' },
];

const plantilla = ({ rol, frase, remoto, ok }) => /* html */ `<!doctype html>
<html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@600;700&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    background:
      radial-gradient(700px 420px at 88% -5%, rgba(59,31,184,.45), transparent 65%),
      radial-gradient(600px 400px at -10% 110%, rgba(109,74,255,.22), transparent 60%),
      #03020a;
    color: #eeeaff; font-family: Inter, sans-serif;
  }
  svg.cintas { position: absolute; inset: 0; }
  .contenido { position: absolute; inset: 0; display: flex; align-items: center; gap: 64px; padding: 0 80px; }
  .texto { flex: 1; }
  .fila { display: flex; align-items: center; gap: 18px; margin-bottom: 22px; }
  .eyebrow { display: flex; align-items: center; gap: 12px; color: #b9a6ff; font-weight: 600; font-size: 22px; letter-spacing: .16em; text-transform: uppercase; }
  .eyebrow::before { content: ''; width: 36px; height: 3px; border-radius: 2px; background: linear-gradient(90deg, transparent, #8f74ff); }
  .pais { display: flex; align-items: center; gap: 10px; padding: 6px 16px 6px 10px; border-radius: 999px; border: 1.5px solid rgba(170,140,255,.45); background: rgba(18,12,48,.7); font-weight: 600; font-size: 19px; letter-spacing: .05em; }
  .bandera { width: 30px; height: 20px; border-radius: 4px; overflow: hidden; display: grid; grid-template-rows: 2fr 1fr 1fr; box-shadow: 0 0 0 1px rgba(255,255,255,.2); }
  h1 { font-family: 'Space Grotesk', sans-serif; font-size: 84px; line-height: 1.02; letter-spacing: -.03em; margin-bottom: 26px;
       background: linear-gradient(100deg, #fff 0%, #b9a6ff 50%, #d8b4fe 75%, #8f74ff 100%); -webkit-background-clip: text; color: transparent; }
  .frase { font-size: 29px; line-height: 1.4; font-weight: 500; max-width: 660px; color: #eeeaff; }
  .pie { position: absolute; left: 80px; bottom: 44px; display: flex; gap: 12px; }
  .chip { padding: 6px 16px; border-radius: 999px; background: rgba(109,74,255,.18); border: 1px solid rgba(150,120,255,.25); color: #b9a6ff; font-weight: 600; font-size: 18px; }
  .avatar { position: relative; width: 360px; height: 360px; flex: none; margin-top: -30px; }
  .anillo { width: 100%; height: 100%; border-radius: 50%; padding: 8px;
            background: conic-gradient(from 200deg, #3b1fb8, #b9a6ff, #d8b4fe, #6d4aff, #3b1fb8);
            box-shadow: 0 0 80px rgba(124,92,255,.6), 0 0 180px rgba(124,92,255,.28); }
  .anillo img { width: 100%; height: 100%; border-radius: 50%; display: block;
                background: radial-gradient(circle at 50% 35%, #3b1fb8, #1a0d5c 55%, #0d0926); }
  .terminal { position: absolute; left: -70px; bottom: -58px; padding: 12px 20px; border-radius: 14px;
              background: rgba(13,9,38,.92); border: 1px solid rgba(150,120,255,.25);
              font: 500 19px/1.5 'Cascadia Code', Consolas, monospace; }
  .terminal .p { color: #b9a6ff; } .terminal .ok { color: #7ee2b8; }
</style></head>
<body>
  <svg class="cintas" viewBox="0 0 1200 630" preserveAspectRatio="none">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1b0a6b" stop-opacity="0"/><stop offset=".4" stop-color="#5b3cf0"/>
        <stop offset=".65" stop-color="#d4a8ff"/><stop offset="1" stop-color="#3b1fb8" stop-opacity=".2"/>
      </linearGradient>
      <filter id="b"><feGaussianBlur stdDeviation="12"/></filter>
    </defs>
    <path d="M-60 560 C 240 500, 520 470, 760 520 C 920 555, 1060 620, 1260 700" stroke="url(#g)" stroke-width="36" fill="none" filter="url(#b)" opacity=".75"/>
    <path d="M-60 560 C 240 500, 520 470, 760 520 C 920 555, 1060 620, 1260 700" stroke="url(#g)" stroke-width="3.5" fill="none"/>
    <path d="M900 -30 C 760 100, 690 260, 740 400 C 780 510, 900 580, 1260 660" stroke="url(#g)" stroke-width="28" fill="none" filter="url(#b)" opacity=".6"/>
    <path d="M900 -30 C 760 100, 690 260, 740 400 C 780 510, 900 580, 1260 660" stroke="url(#g)" stroke-width="3" fill="none"/>
  </svg>
  <div class="contenido">
    <div class="texto">
      <div class="fila">
        <span class="eyebrow">${rol}</span>
        <span class="pais"><span class="bandera"><i style="background:#FCD116"></i><i style="background:#003893"></i><i style="background:#CE1126"></i></span>${remoto}</span>
      </div>
      <h1>${nombre}</h1>
      <p class="frase">${frase}</p>
    </div>
    <div class="avatar">
      <div class="anillo"><img src="data:image/webp;base64,${avatar}"></div>
      <div class="terminal"><div><span class="p">$</span> npx playwright test</div><div class="ok">✓ ${ok}</div></div>
    </div>
  </div>
  <div class="pie"><span class="chip">Playwright</span><span class="chip">TypeScript</span><span class="chip">Cypress</span><span class="chip">Selenium</span></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const v of versiones) {
  await page.setContent(plantilla(v), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: v.archivo });
  console.log(`Listo: ${v.archivo} (1200×630)`);
}
await browser.close();
