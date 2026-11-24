import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { proyectos } from '../src/data/proyectos';
import { perfil } from '../src/data/perfil';
import { perfil as perfilEn } from '../src/data/en/perfil';
import { proyectos as proyectosEn } from '../src/data/en/proyectos';

/** Falla la prueba si la página escribe errores en consola o algún recurso propio responde 4xx/5xx. */
function vigilarErrores(page: Page) {
  const errores: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errores.push(`consola: ${msg.text()}`);
  });
  page.on('pageerror', (err) => errores.push(`js: ${err.message}`));
  page.on('response', (res) => {
    const propio = res.url().startsWith(process.env.PRUEBAS_URL ?? 'http://localhost');
    if (propio && res.status() >= 400 && !res.url().includes('/no-existe')) {
      errores.push(`${res.status()} ${res.url()}`);
    }
  });
  return errores;
}

// El Chromium de las pruebas dibuja por software, así que el sitio entraría solo en "modo liviano".
// Las pruebas normales fuerzan el modo completo; el liviano tiene sus propias pruebas al final.
test.beforeEach(async ({ page }, info) => {
  if (!info.titlePath.some((t) => t.startsWith('Modo liviano'))) {
    await page.addInitScript(() => ((window as Window & { __forzarLiviano?: boolean }).__forzarLiviano = false));
  }
});

test.describe('Carga', () => {
  test('el inicio carga con nombre, rol y frase de valor', async ({ page }) => {
    const errores = vigilarErrores(page);
    await page.goto('/');

    await expect(page).toHaveTitle(new RegExp(perfil.nombre));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(perfil.nombre);
    await expect(page.getByText(perfil.rol).first()).toBeVisible();
    await expect(page.getByText(perfil.frase)).toBeVisible();
    // el país, con la bandera
    await expect(page.getByTestId('pais')).toContainText('COL');
    await expect(page.getByRole('img', { name: 'Bandera de Colombia' })).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('cada sección principal existe', async ({ page }) => {
    await page.goto('/');
    for (const nombre of ['Casos de estudio' /* eyebrow */]) {
      await expect(page.getByText(nombre, { exact: true })).toBeVisible();
    }
    for (const titulo of ['Experiencia', 'Stack', 'Contacto']) {
      await expect(page.getByRole('heading', { level: 2, name: titulo })).toBeVisible();
    }
    await expect(page.getByTestId('tarjeta-proyecto')).toHaveCount(proyectos.length);
    await expect(page.getByTestId('trabajo').first()).toBeVisible();
  });

  test('el avatar carga y cada tecnología del stack tiene icono', async ({ page }) => {
    await page.goto('/');
    const avatar = page.getByRole('img', { name: `Avatar de ${perfil.nombre}`, exact: true });
    await expect(avatar).toBeVisible();
    // naturalWidth > 0 = la imagen realmente descargó (no un ícono roto)
    expect(await avatar.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

    const tecnologias = page.getByTestId('tecnologia');
    expect(await tecnologias.count()).toBeGreaterThan(10);
    for (const t of await tecnologias.all()) {
      await expect(t.locator('svg.icono, img.icono, .icono.monograma')).toHaveCount(1);
    }

    // Los logos propios (public/logos) deben descargar de verdad
    const logos = page.locator('img.icono');
    expect(await logos.count()).toBeGreaterThan(0);
    for (const logo of await logos.all()) {
      await logo.scrollIntoViewIfNeeded();
      await expect
        .poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
        .toBe(true);
    }
  });
});

test.describe('Avatar animado', () => {
  test('la foto de perfil empieza fija y, ya cargada la página, se anima con un video MP4', async ({ page, request }) => {
    // el HTML trae la imagen fija (no frena la carga del inicio); el video va aparte en data-animado
    const html = await (await request.get('/')).text();
    expect(html).toMatch(/<img[^>]*src="\/avatar\/perfil-quieto\.webp"[^>]*data-animado="\/avatar\/perfil\.mp4"/);
    expect(html, 'el video no debe venir en el HTML (se agrega después de cargar)').not.toContain('<video');

    // el video es liviano (antes el WebP animado pesaba 1,4 MB)
    const mp4 = await request.get('/avatar/perfil.mp4');
    expect(mp4.status()).toBe(200);
    expect((await mp4.body()).length).toBeLessThan(400 * 1024);

    await page.goto('/');
    const puedeMp4 = await page.evaluate(() => document.createElement('video').canPlayType('video/mp4; codecs="avc1.640028"'));
    if (puedeMp4) {
      const video = page.getByTestId('foto-perfil-video');
      await expect(video).toHaveClass(/lista/, { timeout: 10_000 }); // ya está reproduciendo
      expect(await video.evaluate((v: HTMLVideoElement) => [v.muted, v.loop, v.paused])).toEqual([true, true, false]);
    } else {
      // navegador sin H.264: se queda la imagen fija, sin errores
      await page.waitForTimeout(2500);
      await expect(page.getByTestId('foto-perfil-video')).toHaveCount(0);
      await expect(page.getByTestId('foto-perfil')).toBeVisible();
    }
  });

  test('con "reducir movimiento" la foto de perfil se queda fija (no se carga el video)', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(2500);
    await expect(page.getByTestId('foto-perfil-video')).toHaveCount(0);
    expect(await page.getByTestId('foto-perfil').evaluate((img: HTMLImageElement) => img.currentSrc)).toContain(
      '/avatar/perfil-quieto.webp',
    );
  });

  test('en Contacto carga el avatar animado y pesa poco', async ({ page, request }) => {
    await page.goto('/');
    const mascota = page.getByTestId('mascota-contacto');
    await mascota.scrollIntoViewIfNeeded(); // es lazy: solo carga al llegar a Contacto
    await expect
      .poll(() => mascota.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);

    // WebP animado: el archivo trae el bloque ANIM y no se pasa de 1,5 MB
    const res = await request.get('/avatar/contacto.webp');
    const bytes = await res.body();
    expect(bytes.includes(Buffer.from('ANIM')), 'el WebP no es animado').toBe(true);
    expect(bytes.length).toBeLessThan(1.5 * 1024 * 1024);
  });

  test('con "reducir movimiento" muestra la imagen fija', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const mascota = page.getByTestId('mascota-contacto');
    await mascota.scrollIntoViewIfNeeded();
    await expect
      .poll(() => mascota.evaluate((img: HTMLImageElement) => img.currentSrc))
      .toContain('/avatar/contacto-quieto.webp');
    // sin animaciones: el globo ya trae el texto completo, sin torbellino ni tecleo
    await expect(page.getByTestId('globo-contacto').locator('.globo-texto')).toHaveText('¡Hablemos!');
    await expect(page.getByTestId('globo-contacto')).not.toHaveClass(/oculto/);
  });

  test('el globo sale del torbellino y escribe "¡Hablemos!" letra por letra', async ({ page }) => {
    await page.goto('/');
    const globo = page.getByTestId('globo-contacto');
    const texto = globo.locator('.globo-texto');
    // antes de llegar a Contacto, el globo está escondido y vacío
    await expect(globo).toHaveClass(/oculto/);
    await expect(texto).toHaveText('');

    await page.getByTestId('mascota-contacto').scrollIntoViewIfNeeded();
    // primero el torbellino (durante la primera voltereta)…
    await expect(globo).toHaveClass(/torbellino-activo/, { timeout: 5_000 });
    // …luego el texto va apareciendo por partes, hasta quedar completo
    await expect(texto).toHaveText(/^¡Hab?/, { timeout: 5_000 });
    await expect(texto).toHaveText('¡Hablemos!', { timeout: 5_000 });
    await expect(globo).not.toHaveClass(/oculto|torbellino-activo/);

    // y en la siguiente voltereta se repite: el globo vuelve al torbellino y se escribe de nuevo
    await expect(globo).toHaveClass(/torbellino-activo/, { timeout: 5_000 });
    await expect(texto).toHaveText('', { timeout: 1_000 });
    await expect(texto).toHaveText('¡Hablemos!', { timeout: 5_000 });
  });
});

test.describe('Easter egg: el bug que camina', () => {
  test('el bicho aparece, camina y al atraparlo lleva a "¡Cazaste un bug!"', async ({ page }) => {
    await page.goto('/?bicho'); // ?bicho lo hace salir enseguida
    const bicho = page.getByTestId('bicho');
    await expect(bicho).toBeVisible({ timeout: 5_000 });

    // camina: su posición cambia con el tiempo
    const antes = await bicho.boundingBox();
    await expect.poll(async () => {
      const ahora = await bicho.boundingBox();
      return Math.hypot(ahora!.x - antes!.x, ahora!.y - antes!.y);
    }).toBeGreaterThan(10);

    // atraparlo (se mueve, así que el click se envía directo al botón)
    await bicho.dispatchEvent('click');
    await expect(bicho).toHaveClass(/cazado/);
    await expect(page).toHaveURL(/\/bug-encontrado\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('¡Cazaste un bug!');
    await expect(page.getByTestId('ticket-bug')).toContainText('BUG-404');
    await expect(page.getByTestId('mascota-404')).toBeVisible();
  });

  test('el bicho pasa POR ENCIMA de la foto de perfil (no se esconde detrás)', async ({ page }) => {
    await page.goto('/?bicho');
    await expect(page.getByTestId('bicho')).toBeVisible({ timeout: 5_000 });
    const f = (await page.getByTestId('foto-perfil').boundingBox())!;
    const [x, y] = [f.x + f.width / 2, f.y + f.height / 2];
    // se fija el bicho justo en el centro de la foto
    await page.addStyleTag({ content: `.bicho{transform:translate(${x - 17}px,${y - 22}px)!important}` });
    const arriba = await page.evaluate(([px, py]) => !!document.elementFromPoint(px, py)?.closest('.bicho'), [x, y]);
    expect(arriba, 'en el centro de la foto de perfil, lo que queda arriba debe ser el bicho').toBe(true);
  });

  test('al volver con "atrás" después de atraparlo, el bicho no queda congelado en pantalla', async ({ page }) => {
    await page.goto('/?bicho');
    const bicho = page.getByTestId('bicho');
    await expect(bicho).toBeVisible({ timeout: 5_000 });
    // se simula el atrapado sin navegar, y luego lo que hace el navegador al restaurar la página
    // desde su memoria (bfcache) al volver con "atrás": dispara pageshow con persisted = true
    await page.evaluate(() => {
      const b = document.querySelector('.bicho')!;
      b.classList.add('cazado');
      window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
    });
    await expect(bicho).toBeHidden();
    await expect(bicho).not.toHaveClass(/cazado/);
  });

  test('la página del easter egg no se indexa y no tiene su propio bicho', async ({ page }) => {
    await page.goto('/bug-encontrado/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.getByTestId('bicho')).toHaveCount(0);
  });

  test('con "reducir movimiento" el bicho no sale', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?bicho');
    await page.waitForTimeout(800);
    await expect(page.getByTestId('bicho')).toBeHidden();
  });
});

test.describe('Navegación', () => {
  test('el menú lleva a cada sección', async ({ page }) => {
    await page.goto('/');
    const menu = page.getByRole('navigation', { name: 'Principal' });
    for (const [enlace, id] of [
      ['Proyectos', 'proyectos'],
      ['Experiencia', 'experiencia'],
      ['Stack', 'stack'],
      ['Contacto', 'contacto'],
    ]) {
      await menu.getByRole('link', { name: enlace }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  for (const p of proyectos) {
    test(`caso "${p.slug}": tarjeta → detalle → volver`, async ({ page }) => {
      const errores = vigilarErrores(page);
      await page.goto('/');
      await page.getByRole('link', { name: p.titulo }).click();

      await expect(page).toHaveURL(new RegExp(`/proyectos/${p.slug}/$`));
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(p.titulo);
      for (const bloque of ['El problema', 'Qué hice', 'Resultado']) {
        await expect(page.getByRole('heading', { level: 2, name: bloque })).toBeVisible();
      }

      await page.getByRole('link', { name: '← Todos los casos' }).click();
      await expect(page).toHaveURL(/\/#proyectos$/);
      expect(errores).toEqual([]);
    });
  }

  test('una URL que no existe muestra la página 404', async ({ page }) => {
    const res = await page.goto('/no-existe');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Esta página no existe' })).toBeVisible();
    // el avatar cayéndose carga y es un WebP animado
    const mascota = page.getByTestId('mascota-404');
    await expect
      .poll(() => mascota.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    const webp = await page.request.get('/avatar/404.webp');
    expect((await webp.body()).includes(Buffer.from('ANIM')), 'el WebP de la 404 no es animado').toBe(true);
    await page.getByRole('link', { name: 'Volver al inicio' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(perfil.nombre);
  });
});

test.describe('Enlaces', () => {
  test('ningún enlace interno está roto', async ({ page, request }) => {
    const pendientes = ['/'];
    const visitadas = new Set<string>();

    while (pendientes.length) {
      const ruta = pendientes.shift()!;
      if (visitadas.has(ruta)) continue;
      visitadas.add(ruta);

      const res = await request.get(ruta);
      expect(res.status(), `enlace roto: ${ruta}`).toBe(200);
      // solo se exploran páginas HTML; los archivos (PDF del CV, imágenes) basta con que respondan 200
      if (!(res.headers()['content-type'] ?? '').includes('text/html')) continue;

      await page.goto(ruta);
      const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
      for (const href of hrefs) {
        if (!href.startsWith('/')) continue; // externos, mailto y anclas se revisan aparte
        const sinAncla = href.split('#')[0] || '/';
        if (!visitadas.has(sinAncla)) pendientes.push(sinAncla);
      }
    }
    // inicio + todos los casos de estudio
    expect(visitadas.size).toBeGreaterThanOrEqual(1 + proyectos.length);
  });

  test('las anclas internas apuntan a un id que existe', async ({ page }) => {
    await page.goto('/');
    const anclas = await page.locator('a[href^="#"], a[href^="/#"]').evaluateAll((as) =>
      as.map((a) => a.getAttribute('href')!.split('#')[1]),
    );
    for (const id of new Set(anclas)) {
      if (!id) continue;
      await expect(page.locator(`#${id}`), `falta el id #${id}`).toHaveCount(1);
    }
  });

  test('los enlaces externos son https y abren en otra pestaña de forma segura', async ({ page }) => {
    await page.goto('/');
    const externos = page.locator('a[href^="http"]');
    const total = await externos.count();
    expect(total).toBeGreaterThan(0);
    for (let i = 0; i < total; i++) {
      const enlace = externos.nth(i);
      await expect(enlace).toHaveAttribute('href', /^https:\/\//);
      await expect(enlace).toHaveAttribute('target', '_blank');
      await expect(enlace).toHaveAttribute('rel', /noopener/);
    }
  });

  test('el correo de contacto es un mailto válido', async ({ page }) => {
    test.skip(!perfil.email, 'sin correo configurado');
    await page.goto('/');
    await expect(page.locator('#contacto a[href^="mailto:"]')).toHaveAttribute('href', `mailto:${perfil.email}`);
  });
});

test.describe('Calidad', () => {
  test('no hay scroll horizontal (la página cabe en el ancho de la pantalla)', async ({ page }) => {
    for (const ruta of ['/', `/proyectos/${proyectos[0].slug}/`]) {
      await page.goto(ruta);
      const desborde = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(desborde, `scroll horizontal en ${ruta}`).toBeLessThanOrEqual(0);
    }
  });

  test('sin problemas de accesibilidad graves (axe)', async ({ page }) => {
    for (const ruta of ['/', `/proyectos/${proyectos[0].slug}/`]) {
      await page.goto(ruta);
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(graves.map((v) => `${v.id}: ${v.help}`), `en ${ruta}`).toEqual([]);
    }
  });
});

test.describe('Modo liviano (sin aceleración por hardware)', () => {
  test('se activa solo al detectar dibujo por software', async ({ page }) => {
    // el Chromium de las pruebas dibuja con SwiftShader (software): debe detectarlo
    await page.goto('/');
    const motor = await page.evaluate(() => {
      const gl = document.createElement('canvas').getContext('webgl');
      const info = gl?.getExtension('WEBGL_debug_renderer_info');
      return gl ? String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER)) : 'sin WebGL';
    });
    test.skip(!/swiftshader|llvmpipe|software|basic render|sin webgl/i.test(motor), `este navegador tiene GPU (${motor})`);
    await expect(page.locator('html')).toHaveClass(/liviano/);
  });

  test('apaga los efectos caros y deja lo importante', async ({ page }) => {
    await page.goto('/?liviano=1');
    await expect(page.locator('html')).toHaveClass(/liviano/);

    // sin desenfoque de vidrio ni cintas animadas
    const vidrio = await page.locator('.vidrio').first().evaluate((el) => getComputedStyle(el).backdropFilter);
    expect(vidrio).toBe('none');
    const animCintas = await page.locator('.cintas .capa').first().evaluate((el) => getComputedStyle(el).animationName);
    expect(animCintas).toBe('none');

    // la foto de perfil se queda fija (no se carga el video)…
    await page.waitForLoadState('load');
    await page.waitForTimeout(2500);
    await expect(page.getByTestId('foto-perfil-video')).toHaveCount(0);

    // …pero el avatar de Contacto sigue animado y el globo sigue escribiendo
    await page.getByTestId('mascota-contacto').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('globo-contacto').locator('.globo-texto')).toHaveText('¡Hablemos!', {
      timeout: 8_000,
    });
  });

  test('con ?liviano=0 se fuerza el modo completo', async ({ page }) => {
    await page.goto('/?liviano=0');
    await expect(page.locator('html')).not.toHaveClass(/liviano/);
  });
});

test.describe('Al compartir el link', () => {
  test('cada página trae la imagen para LinkedIn/WhatsApp/X y mide 1200×630', async ({ page, request }) => {
    for (const ruta of ['/', `/proyectos/${proyectos[0].slug}/`]) {
      await page.goto(ruta);
      const og = await page.locator('meta[property="og:image"]').getAttribute('content');
      expect(og, `falta og:image en ${ruta}`).toMatch(/^https:\/\/.+\/og\.png$/); // debe ser URL absoluta
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /.+/);
    }
    // el archivo existe y es un PNG de 1200×630 (ancho y alto vienen en la cabecera IHDR)
    const res = await request.get('/og.png');
    expect(res.status()).toBe(200);
    const png = await res.body();
    expect(png.readUInt32BE(16), 'ancho').toBe(1200);
    expect(png.readUInt32BE(20), 'alto').toBe(630);
    expect(png.length, 'pesa demasiado para compartir').toBeLessThan(1024 * 1024);
  });
});

test.describe('Versión en inglés', () => {
  test('/en/ carga en inglés, con el contenido traducido', async ({ page }) => {
    const errores = vigilarErrores(page);
    await page.goto('/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(perfil.nombre);
    await expect(page.getByText(perfilEn.frase)).toBeVisible();
    for (const titulo of ['Experience', 'Stack', 'Contact']) {
      await expect(page.getByRole('heading', { level: 2, name: titulo })).toBeVisible();
    }
    await expect(page.getByTestId('pais')).toContainText('COL · Remote');
    await expect(page.getByTestId('tarjeta-proyecto')).toHaveCount(proyectosEn.length);
    expect(errores).toEqual([]);
  });

  test('no quedan textos de la interfaz en español en /en/', async ({ page }) => {
    await page.goto('/en/');
    const texto = await page.locator('body').innerText();
    for (const frase of ['Casos de estudio', 'Experiencia', 'Contacto', 'Formación', 'Idiomas', 'Leer caso', 'Hablemos', 'Proyectos propios']) {
      expect(texto, `quedó "${frase}" sin traducir`).not.toContain(frase);
    }
  });

  test('el selector ES / EN lleva a la misma página en el otro idioma', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('cambiar-idioma').click();
    await expect(page).toHaveURL(/\/en\/$/);
    await page.getByTestId('cambiar-idioma').click();
    await expect(page).toHaveURL(/\/$/);

    // en un caso de estudio, cambia al MISMO caso traducido
    await page.goto(`/proyectos/${proyectos[2].slug}/`);
    await page.getByTestId('cambiar-idioma').click();
    await expect(page).toHaveURL(new RegExp(`/en/projects/${proyectosEn[2].slug}/$`));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(proyectosEn[2].titulo);
    for (const bloque of ['The problem', 'What I did', 'Outcome']) {
      await expect(page.getByRole('heading', { level: 2, name: bloque })).toBeVisible();
    }
  });

  test('Google sabe que son la misma página en dos idiomas (hreflang) y cada una tiene su imagen', async ({ page, request }) => {
    await page.goto('/en/');
    await expect(page.locator('link[hreflang="es"]')).toHaveAttribute('href', /\/$/);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', /\/en\/$/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og-en\.png$/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
    const png = await (await request.get('/og-en.png')).body();
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  });

  test('el globo de Contacto escribe en inglés', async ({ page }) => {
    await page.goto('/en/');
    await page.getByTestId('mascota-contacto').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('globo-contacto').locator('.globo-texto')).toHaveText("Let's talk!", { timeout: 8_000 });
  });

  test('el bicho atrapado en inglés lleva a "You caught a bug!"', async ({ page }) => {
    await page.goto('/en/?bicho');
    const bicho = page.getByTestId('bicho');
    await expect(bicho).toBeVisible({ timeout: 5_000 });
    await bicho.dispatchEvent('click');
    await expect(page).toHaveURL(/\/en\/bug-found\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('You caught a bug!');
    await expect(page.getByTestId('ticket-bug')).toContainText('Steps to reproduce');
  });

  test('accesibilidad en inglés (axe)', async ({ page }) => {
    for (const ruta of ['/en/', `/en/projects/${proyectosEn[0].slug}/`]) {
      await page.goto(ruta);
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const graves = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(graves.map((v) => `${v.id}: ${v.help}`), `en ${ruta}`).toEqual([]);
    }
  });
});

test.describe('Descargar CV', () => {
  for (const [ruta, boton, pdf] of [
    ['/', 'Descargar CV', '/cv-juan-velez-es.pdf'],
    ['/en/', 'Download CV', '/cv-juan-velez-en.pdf'],
  ] as const) {
    test(`en ${ruta} el botón "${boton}" baja el CV del idioma correcto`, async ({ page, request }) => {
      await page.goto(ruta);
      const enlace = page.getByRole('link', { name: boton });
      await expect(enlace).toBeVisible();
      await expect(enlace).toHaveAttribute('href', pdf);
      await expect(enlace).toHaveAttribute('download', /.*/);

      const res = await request.get(pdf);
      expect(res.status()).toBe(200);
      const archivo = await res.body();
      expect(archivo.subarray(0, 5).toString(), 'no es un PDF').toBe('%PDF-');
      // confidencialidad: el CV público no puede llevar nada del trabajo ni el teléfono
      const texto = archivo.toString('latin1');
      expect(texto).not.toMatch(/t3rsc|tri ia digital|adel ia|300 605/i);
    });
  }
});

test.describe('iPhone / iPad', () => {
  test('en iOS las cintas quedan quietas pero el avatar sigue animado', async ({ page }) => {
    await page.goto('/?ios=1');
    await expect(page.locator('html')).toHaveClass(/\bios\b/);
    const anim = await page.locator('.cintas .capa').first().evaluate((el) => getComputedStyle(el).animationName);
    expect(anim).toBe('none');
    // la foto de perfil se sigue animando con el video (no es modo liviano)
    const puedeMp4 = await page.evaluate(() => document.createElement('video').canPlayType('video/mp4; codecs="avc1.640028"'));
    test.skip(!puedeMp4, 'este navegador no reproduce H.264');
    await expect(page.getByTestId('foto-perfil-video')).toHaveClass(/lista/, { timeout: 10_000 });
  });

  test('fuera de iOS las cintas sí se mueven', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/\bios\b/);
    const anim = await page.locator('.cintas .capa-a').evaluate((el) => getComputedStyle(el).animationName);
    expect(anim).not.toBe('none');
  });
});
