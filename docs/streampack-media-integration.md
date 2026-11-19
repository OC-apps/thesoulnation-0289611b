# StreamPack Studio — integración de medios y administración

Base de referencia: rama `recuperacion-independiente`, commit local e6168c6. La ruta /streampack coincide con el archivo remoto comprobado.

- 27 WebM originales VP9 con alfa, distribuidos en seis categorías; 30 recursos de video contando las dos intros y el stinger existentes.
- Vista previa bajo demanda, descarga individual WebM con tipo MIME correcto y ZIP con carpetas por categoría.
- Panel /admin/live → StreamPack: mostrar, ocultar, retirar de la biblioteca y restaurar. La eliminación es del catálogo, no del disco ni del archivo público. Las plantillas PNG existentes no quedan afectadas.
- Las decisiones se conservan en la base de datos, y las operaciones de modificación comprueban la contraseña administrativa en el servidor. Los visitantes no pueden modificar la tabla directamente.
- WebM: 14.5 MB decimales en total. Los MOV con canal alfa se mantienen en el pack original y no se duplican en el sitio.

## Publicación

1. La migración `20261119033553_streampack_media_status.sql` fue aplicada al proyecto The Soul Nation. Se verificó RLS, ausencia de permisos de cliente y lectura/escritura del servidor en una transacción revertida.
2. Incorporar esta actualización al código de la rama de publicación confirmada.
3. Ejecutar la compilación completa y probar el catálogo público, descarga y ZIP; verificar en el admin que la visibilidad se conserva tras recargar y que la contraseña incorrecta no permite modificar estados.
4. Desplegar únicamente al destino autorizado.

Los archivos permanecen públicos por URL directa: este control administra la visibilidad del catálogo, no es un sistema de acceso privado.
