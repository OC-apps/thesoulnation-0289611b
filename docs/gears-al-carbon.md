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
| Videopodcast.mp4 | 45.240.325 | 45,24 |
| outro soul vertical.mp4 | 22.425.147 | 22,43 |
| **Tres videos compartidos** | **73.478.834** | **73,48** |
| 20261103-005415-0d5677ccd3fd.mp3 | 1.766.444 | 1,77 |
| **Instalación inicial con episodio 01** | **75.245.278** | **75,25** |

El crecimiento marginal es **el tamaño de cada MP3 + unos pocos datos de título, descripción, fecha y estado**, sin un MP4 adicional. Si todos los MP3 midieran lo mismo que el primero, 100 episodios ocuparían unos **250,12 MB** en total: 73,48 MB fijos + 176,64 MB de audio. El tamaño de futuros MP3 depende de duración y bitrate; no se garantiza 1–3 MB.

El almacenamiento se distingue del tráfico: cada visitante puede descargar los videos compartidos. Se usa `preload="none"` hasta reproducir y caché de un año en URLs inmutables; la caché del navegador/CDN reduce descargas repetidas, pero no elimina el tráfico ni su posible costo. No hay conversión ni compresión de los originales.

## Reproductor

Tres segmentos, con intro saltable, jingle original, fondo en bucle y outro automático al finalizar el MP3. Transición CSS de 750 ms con barrido, opacidad y desenfoque; respeta `prefers-reduced-motion`. El MP3 es el reloj: avanzar lo posiciona junto con el fondo (`tiempo % duración del fondo`), y pausas/esperas de carga detienen ambos. La barra indica el tiempo del episodio MP3, excluyendo intro y outro. Avanzar desde intro o cierre abre la narración.

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
