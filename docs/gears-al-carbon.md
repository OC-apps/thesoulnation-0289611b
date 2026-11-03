# Gears al Carbón · reproducción sin renderizado

Soul News reproduce directamente los MP4 y el MP3 en el navegador. No hay FFmpeg, MediaRecorder, generación de MP4, archivos multimedia en el repositorio ni subtítulos.

## Publicación y redacción

- Público: `/soul-news`, sección Gears al Carbón.
- Administración: `/soul-news/editorial` → **Gears al Carbón**. Usa el acceso editorial existente.
- Los tres videos originales ya están en el bucket público `gears-media` del proyecto independiente `quscgfasziijdjyixsex`, y registrados en `gears_media`.
- El MP3 original está registrado como **Las noticias de Gears con Dizzy · Episodio 01**, publicado.
- Para otra entrega: título, descripción, MP3 → **Subir MP3 y crear borrador** → **Editar / Previsualizar** → revisar → elegir fecha y estado **Publicado** → **Guardar episodio**.
- Se puede editar, programar mediante fecha futura y archivar. No se duplican los videos al crear un episodio.
- Los videos base solo se reemplazan cuando cambia la identidad del programa. Las versiones anteriores se conservan para no interrumpir visitantes que ya las están reproduciendo; pueden retirarse después desde Storage. Los archivos de borradores y archivados conservan URL pública: archivar retira la ficha del sitio, no vuelve privado el archivo.

## Almacenamiento real

MB decimales (1 MB = 1.000.000 bytes):

| Archivo original | Bytes | MB |
| --- | ---: | ---: |
| intro gears al carbon.mp4 | 5.813.362 | 5,81 |
| videopodcast.mp4 · fondo nuevo optimizado | 38.007.569 | 38,01 |
| outro soul vertical.mp4 | 22.425.147 | 22,43 |
| **Tres videos compartidos** | **66.246.078** | **66,25** |
| 20261103-005415-0d5677ccd3fd.mp3 | 1.766.444 | 1,77 |
| **Almacenamiento actual con episodio 01** | **68.012.522** | **68,01** |

El crecimiento marginal es **el tamaño de cada MP3 + unos pocos datos de título, descripción, fecha y estado**, sin un MP4 adicional. Si todos los MP3 midieran lo mismo que el primero, 100 episodios ocuparían unos **242,89 MB** en total: 66,25 MB fijos + 176,64 MB de audio. El tamaño de futuros MP3 depende de duración y bitrate; no se garantiza 1–3 MB.

El fondo anterior de 45.240.325 bytes fue eliminado de Storage a petición del usuario y sustituido por el nuevo `C:/Users/SoulM/Videos/videopodcast.mp4`. El original nuevo mide 88.634.201 bytes y supera el límite de 50 MiB del plan actual. Se preparó **una sola versión compartida** H.264 CRF 17, preset slow, AAC 192 kb/s, `faststart`, 1080×1920 a 24 fps, duración 40,085 s. La comparación SSIM global con el original dio 0,993146. No se redimensionó ni se generaron videos por episodio. Ruta nueva: `background/a3262607-c228-448f-aa63-46e67d6a2db3.mp4`.

El almacenamiento se distingue del tráfico: cada visitante puede descargar los videos compartidos. Se usa `preload="none"` hasta reproducir y caché de un año en URLs inmutables; la caché del navegador/CDN reduce descargas repetidas, pero no elimina el tráfico ni su posible costo. Solo se optimizó el nuevo fondo compartido para cumplir el límite del alojamiento.

## Reproductor

Tres segmentos, con intro saltable, jingle original, fondo en bucle y outro automático al finalizar el MP3. Transición CSS de 1,1 s con el logo oficial de The Soul Nation, zoom, cortinas diagonales, estelas y destello naranja; respeta `prefers-reduced-motion` mostrando la marca sin desplazamientos ni destellos. El siguiente video comienza a revelar la transición cuando ya se está reproduciendo, conservando el último fotograma anterior mientras carga. La imagen del logo existente se precarga; no se genera un video de transición. El MP3 es el reloj: avanzar lo posiciona junto con el fondo (`tiempo % duración del fondo`), y pausas/esperas de carga detienen ambos. El bucle no dispara transiciones ni reinicia la voz. La barra indica el tiempo del episodio MP3, excluyendo intro y outro. Avanzar desde intro o cierre abre la narración.

Controles de reproducir/pausar, avance y volumen; formato 9:16 sin deformación, `playsInline`, objetivos táctiles de 44 px y etiquetas accesibles. El audio se desbloquea mediante gesto del usuario. Si el navegador bloquea un cambio de segmento, muestra un mensaje para continuar con el botón. Música del fondo al 8 % en escritorio; en iOS se silencia el fondo para no tapar al narrador, porque ese sistema ignora el volumen por elemento. En iOS el volumen general se regula también con los botones del dispositivo. Falta una prueba física en iPhone/iPad; la emulación de tamaños no verifica las restricciones de Safari.

## Backend y permisos

Las tablas `gears_media` y `gears_episodes` tienen RLS. Público: videos y episodios publicados cuya fecha ya llegó. No hay políticas públicas de escritura. El servidor verifica `ADMIN_LIVE_PASSWORD` antes de leer borradores, emitir cargas firmadas, registrar archivos o publicar. El MP3/MP4 viaja directamente a Storage, sin pasar por el cuerpo de las funciones del servidor ni como base64 en JavaScript.

El servidor reutiliza `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `ADMIN_LIVE_PASSWORD`, configurados en el entorno de despliegue. La clave de servicio nunca se entrega al navegador. Bucket limitado a MP4/MP3 y 50 MiB por archivo. El servidor confirma la existencia y tamaño del archivo antes de registrarlo. Una carga interrumpida o un registro fallido puede dejar un objeto sin ficha; se puede eliminar desde Storage después de comprobar que ninguna tabla lo referencia.

Esquema guardado en `supabase/gears-al-carbon.sql`, aplicado remotamente como migración `gears_al_carbon`. La transferencia inicial usó autorizaciones de carga temporales; su función quedó deshabilitada (410, con validación JWT activada). No es necesaria para futuras publicaciones.

## Comprobaciones

- Instalación con `bun install --frozen-lockfile` y compilación de cliente/servidor con `bun run build`.
- `scripts/gears-player-test.cjs`: navegador Chromium, archivos originales, anchos 320/390/1440; ausencia de descargas antes de reproducir, ausencia de desbordamiento, reproducción, pausa, salto/fin natural de intro, seek sincronizado, seek conservando pausa, outro automático y reinicio. Comprueba también acceso a redacción y rechazo de contraseña incorrecta.
- Ejecutar con servidor local activo: `SOUL_TEST_BASE=http://127.0.0.1:5173 node scripts/gears-player-test.cjs`. Requiere Playwright; admite `SOUL_PLAYWRIGHT_MODULE` y `SOUL_CHROME` si están instalados fuera del proyecto.
- ESLint de los componentes y funciones nuevos. El chequeo TypeScript global conserva errores anteriores en tablas/tipos de otras funciones y formularios; no hay diagnósticos en los archivos Gears.
- Consulta remota de Storage: exactamente 4 objetos con sus tamaños originales. RLS verificado y asesor de seguridad sin hallazgos nuevos; permanece el aviso informativo previo de `soul_news_ingest_auth` sin política, intencionalmente inaccesible al público.

No se probó una carga desde la redacción contra producción: requiere la contraseña editorial y las variables privadas del despliegue. La transferencia inicial real y la lectura/reproducción pública sí se comprobaron.
