# Quick Start - Poblar Base de Datos

## Objetivo: Cargar 100+ Startups en Supabase

### Opción 1: Interfaz Web (Más Fácil)

1. **Abre tu navegador** y ve a:
   ```
   http://localhost:3000/admin/import-startups
   ```

2. **Haz clic en el botón grande "Importar Todo"**

3. **Espera 2-3 minutos** mientras se importan los datos

4. **Verifica el resultado**:
   - El contador mostrará 100+ startups
   - La barra de progreso estará al 100%
   - El registro mostrará "✅ Importación completa finalizada"

5. **Visita `/startups`** para ver todas las startups cargadas

### Opción 2: Comando Directo

Si prefieres ejecutar un comando:

```bash
node scripts/populate-db.mjs
```

Verás la salida:

```
🚀 Iniciando población de base de datos...

📊 Obteniendo conteo actual...
✅ Startups actuales en DB: 0

📥 Importando desde CSV oficial...
✅ CSV importado: 67 startups
📊 Total en DB: 67

🎨 Generando startups adicionales...
✅ Startups generadas: 50
📊 Total final en DB: 117

🎉 POBLACIÓN COMPLETA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Total de startups: 117
✅ Objetivo alcanzado: SÍ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Opción 3: API REST

**Importar CSV + Datos Generados:**

```bash
# Importar CSV
curl -X POST http://localhost:3000/api/admin/bulk-insert-startups \
  -H "Content-Type: application/json" \
  -d '{"source":"csv"}'

# Generar startups adicionales
curl -X POST http://localhost:3000/api/admin/bulk-insert-startups \
  -H "Content-Type: application/json" \
  -d '{"source":"generated"}'
```

**Verificar conteo:**

```bash
curl http://localhost:3000/api/admin/bulk-insert-startups
```

## Verificación

Después de importar, verifica que todo funciona:

1. **Página de Startups**: `/startups`
   - Deberías ver 100+ tarjetas de startups
   - Los filtros deberían funcionar
   - La búsqueda debería encontrar resultados

2. **Página de Analytics**: `/analytics`
   - Gráficos poblados con datos reales
   - Estadísticas de financiación
   - Distribución por región

3. **Supabase Dashboard**:
   - Abre tu proyecto en Supabase
   - Ve a Table Editor > `startups`
   - Verifica que hay 100+ filas

## Próximos Pasos

Una vez que tienes las startups cargadas:

1. **Crea un proyecto**: `/projects`
2. **Añade startups al proyecto**: Click en "+" en una tarjeta de startup
3. **Explora analytics**: `/analytics`
4. **Usa el chat asistente**: Click en el botón flotante

## Automatización

El sistema está configurado para ejecutar scraping automáticamente cada domingo a las 3 AM. No necesitas hacer nada más.

## Troubleshooting

**"No veo startups después de importar"**
- Refresca la página con Ctrl+R o Cmd+R
- Verifica los logs del navegador (F12)
- Comprueba que Supabase está conectado en `/admin/import-startups`

**"Error al importar"**
- Asegúrate de que las variables de entorno están configuradas
- Verifica que el CSV existe en `user_read_only_context/project_sources/`
- Revisa los logs en la consola

**"Solo se importaron X startups"**
- Ejecuta el proceso de nuevo, los duplicados se ignorarán
- Usa "Generar Startups" para añadir más datos sintéticos

## Documentación Completa

Para más detalles técnicos, consulta:
- `docs/SCRAPING_SYSTEM.md` - Arquitectura completa del sistema
- `docs/CLEANUP_SUMMARY.md` - Cambios recientes en el código
