# Soul Refined — guía de operación

## Navegación y branding
- Página: https://thesoulnation.org
- Administración: https://thesoulnation.org/admin/live
- GitHub rama de producción: `recuperacion-independiente`.
- Colores oficiales: #01039E, #F05E07 y blanco.
- No alterar el SVG/PNG del logotipo oficial.
- El banner original ahora es un recurso JPG externo: `/home-banner-2026.jpg`.
- Los cinco accesos rápidos permanecen en una fila, también en móviles.

## Perfiles individuales
- Waves: `https://thesoulnation.org/?wave=soul-maverick-z#waves` (ejemplo).
- Legends/Crew: `https://thesoulnation.org/?member=<nickname-slug>#legends` y `#crew`.
- El botón **Compartir perfil** genera la URL correspondiente, sin necesitar publicar otra página.
- Los perfiles Waves heredan biografías, fotos y redes del roster y de `waves_socials`.
- Los perfiles Legends/Crew muestran nombre, división y fotografía cuando exista; no inventan información.

## Soul Live
- La tabla `public.live_status` tiene RLS y lectura pública.
- En la pestaña **Soul Live** del administrador, marcar manualmente el integrante, plataforma y enlace del directo; pulsar **Guardar**.
- Desactivar el estado al terminar. El sitio consulta la tabla al abrir y luego periódicamente.
- **No hay detección automática** de directos de TikTok, Twitch ni YouTube: para automatizar se requieren integraciones y permisos de sus plataformas.
- No establecer estados falsos para probar la web pública.

## Soul Feed y calendario editorial
- La pestaña **Contenido** permite crear noticias, eventos y videos; cambiar a borrador o publicar; editar y eliminar.
- La vista previa muestra el diseño antes de publicar.
- Solo las publicaciones marcadas como publicadas son visibles para visitantes.
- Los eventos incluyen fecha y hora. El feed aparece en la sección Contenido cuando existan entradas publicadas.
- No se usan noticias ni enlaces inventados; el canal oficial de YouTube está disponible para ver actualizaciones.

## Reclutamiento
- El formulario tiene un envío operativo, campo trampa y consentimiento antes de enviarse.
- La tabla `public.recruitment_submissions` permite insertar una solicitud, pero prohíbe lectura y actualización anónimas.
- El administrador incluye pestaña **Solicitudes** para filtrar, revisar, editar estado y notas privadas.
- Estados: pendiente, en revisión, aceptado, no seleccionado.
- Los datos personales no se exponen en la web pública.
- Es necesario completar un aviso de privacidad formal antes de una campaña amplia de captación.

## Validación y pendientes
- Repositorio: `.github/workflows/build-recovery.yml` ejecuta `bun install --frozen-lockfile` y `bun run build` por cada push.
- Supabase Security Advisor sin hallazgos al realizar la migración.
- Pendiente: prueba visual real en navegador móvil/desktop y comprobación de despliegue Cloudflare.
- Pendiente: integración autorizada con APIs externas para detección automática de directos y sincronización automática de videos.
- Pendiente: mediciones reales con Lighthouse/PageSpeed y revisión de rendimiento con tráfico representativo.
- Pendiente: política/aviso de privacidad completa y pruebas reales de entrega de notificaciones por Discord/correo.
