# Auditoría visual de The Soul Nation

Sitio: https://thesoulnation.org/
Rama: `recuperacion-independiente`
Base revisada: `6f596491e48430770a8130e6775ac7e958b31a6c`

## Alcance y evidencia

Se inspeccionó el sitio público en el navegador de escritorio con capturas de pantalla y árbol de accesibilidad de esta sesión. Las capturas se visualizaron en la conversación; no se exportaron como archivos del repositorio. Los cambios se verificaron por compilación y revisión de código, sin afirmar una comparación visual posterior del código modificado.

La herramienta de navegador de esta sesión no ofrece ajuste de viewport móvil. No fue posible conectar la vista previa local al navegador remoto. La auditoría visual en celular y la verificación visual posterior quedan pendientes. Las mejoras móviles de este commit se basan en inspección de CSS/JSX; no son evidencia de pruebas en un teléfono real ni de conformidad WCAG.

## Recorrido de escritorio

| Paso | Superficie revisada | Estado observado y acción |
| --- | --- | --- |
| 1 | Inicio, quiénes somos y cabecera | Identidad y foto conservadas. El enlace para saltar al contenido no transfería el foco; ahora lo hace. Únete identifica su estado actual. |
| 2 | Visión, Objetivo y accesos rápidos | Pestañas funcionales y cinco accesos conservados. Se añade estado pulsado accesible a Visión/Objetivo. |
| 3 | Roster Waves y perfil | Buscador ausente pese a existir el componente. Se recupera un solo buscador global. Cierre del perfil demasiado pequeño; se amplía a 44 px. |
| 4 | Legends y Crew | Banner de «imagen pendiente» con poco valor informativo. Ahora muestra el nombre y descripción de la división hasta que haya arte oficial administrado. |
| 5 | Videos | Navegación y archivo visibles; no se sustituyen miniaturas ni enlaces. Se mejora el foco común. |
| 6 | Wallpapers | Colecciones y selector visibles; se conserva su arte y funcionamiento. |
| 7 | Música | Estado «Now Playing» aun pausado, dos barras con reproducción y medidor de volumen decorativo. Se conserva un único transporte completo, con estado real y controles táctiles mayores. Spotify permanece. |
| 8 | Jersey | Botones Frente/Espalda dentro de otro botón. Se elimina el contenedor interactivo y se conserva el botón explícito de especificaciones, sin activar ambas acciones a la vez. |
| 9 | Reclutamiento | Campos y estados iniciales inspeccionados; no se enviaron postulaciones. Se mejora foco y tamaño de texto móvil. |
| 10 | Redes y pie | Enlaces visibles. Se recupera acceso al archivo Xplicit Cup desde el pie y se permite ajuste de enlaces en pantallas estrechas. |
| 11 | Xplicit Cup | Hero, historia, broadcast, Legends, campeones y legado inspeccionados. Se reserva espacio final para la barra flotante. |
| 12 | Paneles auxiliares ocultos | Los paneles invisibles seguían en el árbol accesible. Ahora usan inert y aria-hidden mientras están cerrados. |

## Hallazgo de geometría

La medición DOM de escritorio del roster arrojó una columna de 748 px, pero su bloque de banner ocupaba aproximadamente 803 px. La combinación de relación de aspecto y estiramiento vertical invadía el espacio del selector. Se cambia la alineación del grid a `start` para que la altura del selector no determine el ancho del banner.

## Ajustes responsive preparados

- Menú móvil con altura máxima y desplazamiento vertical en pantallas bajas.
- Etiquetas de Contenido con tamaño mínimo de 11 px en anchos de hasta 420 px.
- Entradas de formulario a 16 px y controles de música de al menos 44 px.
- Resultados de búsqueda con ajuste de línea y nombres de división sin nowrap obligatorio.
- Especificaciones del jersey cerradas excluidas del árbol accesible.

## Validación

- Instalación con `bun install --frozen-lockfile`: correcta; no se cambió el lockfile.
- `npm run build`: cliente y servidor compilados correctamente.
- `git diff --check`: correcto.
- `tsc --noEmit`: conserva exactamente los dos errores de la base, comprobado en un worktree limpio de la misma revisión: `recruitment-form.tsx` (campos requeridos del tipo generado) y `use-waves-socials.ts` (tipo de extra_links). No se alteraron tipos ni base de datos como parte de la auditoría visual.
- No se modificaron archivos de logotipos, fotografías, banners ni otros recursos oficiales.

## Pendiente de aceptación visual

Revisar el commit desplegado en escritorio, en anchos móviles de 320/390/430 px y en orientación horizontal. Comprobar búsqueda con y sin SOUL, casos vacíos, apertura/cierre de perfiles, Frente/Espalda, foco del teclado y movimiento reducido. No se afirma publicación de este commit en el dominio público.

## Segunda ronda: correcciones comprobadas en el sitio público

### Evidencia inicial y hallazgos reales

El informe original conservó capturas visibles en la conversación, pero no exportó archivos. Esta segunda ronda sí generó archivos de pantalla verificables para las cinco anchuras solicitadas y seis superficies: Inicio, Roster, Videos, Música, Jersey y Xplicit Cup.

- Capturas públicas anteriores a las dos correcciones críticas: [ejecución 41165411560](https://github.com/OC-apps/thesoulnation-0289611b/actions/runs/41165411560).
- **Error confirmado por imagen**: con `prefers-reduced-motion: reduce` el header flotante se desplazaba media pantalla porque una regla anulaba `translateX(-50%)`.
- **Error confirmado por imagen**: una regla de relleno vertical aplicada a todos los hijos del hero agrandaba una línea de acento hasta convertirla en una franja naranja que cubría el banner móvil.

### Cambios correctivos

- Se restableció la transformación de centrado del header incluso con movimiento reducido; las animaciones siguen desactivadas.
- Se eliminó exclusivamente el elemento decorativo que producía la franja naranja. No se alteró el archivo ni la geometría de la imagen oficial del hero.
- Se mantuvieron los cinco accesos rápidos en una única fila.
- Se compactó y unificó la escala de títulos, espaciados, tarjetas y navegación de las secciones; también se actualizó el header y el estilo de Xplicit Cup.
- Los nombres largos del roster admiten ajuste de línea sin eliminar su identidad de tarjetas inclinadas.
- El buscador de SOUL enlaza al perfil exacto y el prefijo fijo no se duplica.
- El hero de Xplicit Cup es visible aunque falle IntersectionObserver o la animación.
- El roster ofrece avisos de actualización y error sin bloquear la lista de integrantes por defecto.
- El trofeo de Xplicit Cup se carga de forma diferida. Ya estaban implementados la carga diferida del reproductor Spotify y de varias imágenes; se conservaron.
- Los scripts de auditoría son de solo lectura: no acceden a las funciones de escritura ni envían postulaciones.

### Validación posterior del dominio

Comprobación verificada mediante Chromium en [ejecución 41166123496](https://github.com/OC-apps/thesoulnation-0289611b/actions/runs/41166123496), con `prefers-reduced-motion: reduce`, viewport de altura 900 px y anchuras de **320, 390, 430, 768 y 1440 px**.

| Verificación | Resultado |
| --- | --- |
| Capturas de las seis superficies en cinco anchos | 30 de 30, HTTP 200 |
| Desbordamiento horizontal de documento | 0 de 30 |
| Excepciones JavaScript en los recorridos | 0 |
| Header flotante dentro del viewport | 30 de 30 |
| Accesos rápidos en una fila en Inicio | Cinco en una fila, en los cinco anchos |
| Búsqueda Waves, siguiente perfil y cierre | Aprobado, conserva `#waves` |
| Búsqueda Legends, siguiente perfil y cierre | Aprobado, conserva `#legends` |
| Formularios de reclutamiento | No enviados, por indicación expresa |

Los límites horizontales del header en Inicio fueron: 320 px → [12,308], 390 → [12,378], 430 → [12,418], 768 → [12,756] y 1440 → [150,1290], todos contenidos en su viewport.

### Estado de publicación, capturas y límites

Las capturas **antes y después** fueron tomadas contra el dominio público en dos momentos distintos y muestran la corrección real del header y del banner. Los archivos están asociados a los artefactos de GitHub Actions de las ejecuciones enlazadas y se han exportado para entrega en la conversación. Esta evidencia confirma la apariencia pública de las superficies probadas, pero no equivale a un certificado WCAG ni a una auditoría completa de rendimiento.

La comprobación local con `vite preview` en GitHub Actions no pudo iniciar el entorno de Cloudflare y se retiró del flujo, pues la prueba del dominio público ya funcionó. La compilación de GitHub se ejecutó correctamente para los cambios de interfaz. No se verificó el número de despliegue `Ready` en el panel privado de Cloudflare ni se realizaron pruebas en teléfonos físicos.

**Pendientes manuales**: revisión exhaustiva de navegación por teclado, contraste con herramientas WCAG, Lighthouse/Core Web Vitals en equipos reales, comprobación de todos los formularios con datos controlados en un entorno de pruebas y verificación de Cloudflare `Ready`.
