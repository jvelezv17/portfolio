# Cómo publicar el portfolio gratis

Recomendado: **Netlify** (o Vercel, es casi igual). Los dos son gratis para un sitio personal, detectan Astro solos
y vuelven a publicar cada vez que subes un cambio a GitHub.

## 1. Subir el proyecto a GitHub (una sola vez)

1. Entra a https://github.com/new
2. Nombre del repositorio: `portfolio`. Déjalo **público** (así se ve el badge de pruebas y el código del sitio).
   **No** marques "Add a README" (ya existe).
3. Clic en **Create repository**.
4. En PowerShell, dentro de la carpeta del portfolio:

```powershell
git remote add origin https://github.com/jvelezv17/portfolio.git
git push -u origin main
```

5. En GitHub, pestaña **Actions**: verás correr "Pruebas". Cuando termine en verde, el badge del README se pone verde.

> Si el repo no se llama `portfolio` o tu usuario no es `jvelezv17`, cambia la URL en `README.md` (badge)
> y en `src/data/perfil.ts` (`repoSitio`).

## 2a. Publicar en Netlify

1. Entra a https://app.netlify.com y regístrate con **GitHub**.
2. **Add new site → Import an existing project → GitHub** y elige `portfolio`.
3. Netlify detecta Astro y llena solo:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Clic en **Deploy**. En un minuto tienes una URL tipo `algo-raro-123.netlify.app`.
5. Para un nombre más bonito: **Site configuration → Change site name** → por ejemplo `juanvelez`
   → queda `https://juanvelez.netlify.app`.
6. Pon esa URL en `astro.config.mjs` (`site: ...`) y sube el cambio.

## 2b. O publicar en Vercel

1. Entra a https://vercel.com y regístrate con **GitHub**.
2. **Add New → Project** → **Import** el repo `portfolio`.
3. Framework Preset: **Astro** (lo detecta solo). Clic en **Deploy**.
4. Te queda una URL tipo `portfolio-jvelezv17.vercel.app`. En **Settings → Domains** la puedes cambiar.
5. Pon esa URL en `astro.config.mjs` (`site: ...`) y sube el cambio.

## Desde ahí, para actualizar el sitio

```powershell
git add .
git commit -m "Actualizo experiencia"
git push
```

GitHub corre las pruebas y Netlify/Vercel publica la versión nueva sola.

## (Opcional) Dominio propio, ej. `juanvelez.dev`

El dominio es lo único que cuesta (unos 10–15 USD al año). Se compra en Namecheap, Porkbun o Cloudflare.

- **Netlify:** Domain management → **Add a domain** → escribe tu dominio y sigue las instrucciones
  (lo más simple: cambiar los "nameservers" del dominio a los que Netlify te muestra). El certificado https es gratis y automático.
- **Vercel:** Settings → Domains → **Add** → copia los registros DNS que te muestra en la página donde compraste el dominio.

Puede tardar desde minutos hasta unas horas en funcionar. Luego actualiza `site:` en `astro.config.mjs`.
