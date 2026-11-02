# Soul News — estado de integración

La portada editorial está en `src/routes/soul-news.tsx` y consulta `public.soul_news_articles` con RLS (solo artículos publicados).

## Ingesta

La Edge Function `soul-news-ingest` está desplegada en el proyecto Supabase independiente `quscgfasziijdjyixsex`.

- Entrada: POST `/functions/v1/soul-news-ingest`.
- Requiere `Authorization: Bearer <SOUL_NEWS_INGEST_SECRET>`.
- Solo lee las fuentes activas con `platform='rss'` y host `news.google.com`.
- Procesa artículos de las últimas 72 horas, deduplica por hash de URL y guarda como `draft`.
- No publica automáticamente ni inventa resúmenes con IA.
- Las fuentes X están registradas pero aún no tienen adaptador autorizado.

## Pendiente para producción

1. Configurar el secreto `SOUL_NEWS_INGEST_SECRET` en Supabase y un disparador programado que lo envíe de manera segura.
2. Ejecutar una prueba real de ingesta y revisar resultados.
3. Construir el panel editorial con autenticación y permisos de publicación.
4. Integrar traducción/resumen IA con atribución, revisión de calidad y control de costos.
5. Conectar X mediante un proveedor/API autorizado.
6. Verificar el despliegue de Cloudflare y navegación a `/soul-news`.

No colocar claves de servicio en el navegador ni en el repositorio.

## Actualización de ejecución — 2026-11-02

- Cron `soul-news-rss-daily` configurado a `0 19 * * *` UTC.
- Token de ingesta generado aleatoriamente y almacenado en Supabase Vault; la función valida el SHA-256 frente a una tabla con RLS y sin acceso de anon/authenticated.
- Función `soul-news-ingest` versión 2 desplegada y probada con respuesta HTTP 200 (`processed:17, failed:0`).
- Consulta posterior: 9 borradores únicos en `soul_news_articles` (las URLs duplicadas entre feeds se consolidan).
- El sitio público sigue mostrando exclusivamente `status='published'`.
- Pendiente: panel editorial, aprobación, redacción IA y conector X autorizado.
