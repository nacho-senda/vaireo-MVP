# Configuración de Google Sheets para Registro de Usuarios

Para habilitar el registro de usuarios en Google Sheets, necesitas configurar un webhook usando Google Apps Script.

## Paso 1: Crear el Google Apps Script

1. Ve a [Google Apps Script](https://script.google.com/)
2. Haz clic en "Nuevo proyecto"
3. Copia y pega el siguiente código (también disponible en `lib/google-apps-script-example.gs`):

\`\`\`javascript
function doGet(e) {
  try {
    // Get parameters from URL
    const params = e.parameter;
    const spreadsheetId = params.spreadsheetId;
    const sheetName = params.sheetName || 'UsuariosVaireo';
    const timestamp = params.timestamp;
    const name = params.name;
    const company = params.company;
    const email = params.email;
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Get or create the sheet
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      // Add headers
      sheet.appendRow(['Fecha', 'Nombre', 'Empresa', 'Email']);
    }
    
    // Append the data
    sheet.appendRow([timestamp, name, company, email]);
    
    // Return success
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Usuario registrado correctamente' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    // Parse the JSON data (soporte para POST también)
    const data = JSON.parse(e.postData.contents);
    const spreadsheetId = data.spreadsheetId;
    const sheetName = data.sheetName || 'UsuariosVaireo';
    const timestamp = data.timestamp;
    const name = data.name;
    const company = data.company;
    const email = data.email;
    
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // Get or create the sheet
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      // Add headers
      sheet.appendRow(['Fecha', 'Nombre', 'Empresa', 'Email']);
    }
    
    // Append the data
    sheet.appendRow([timestamp, name, company, email]);
    
    // Return success
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Usuario registrado correctamente' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
\`\`\`

4. Guarda el proyecto con un nombre descriptivo (ej: "Vaireo User Registration")

## Paso 2: Desplegar como Web App

**IMPORTANTE**: El sistema usa peticiones GET con parámetros de URL. Asegúrate de que el deployment esté configurado correctamente.

### Primera vez:

1. Haz clic en "Desplegar" > "Nueva implementación"
2. Selecciona tipo: "Aplicación web"
3. Configuración:
   - **Descripción**: "Vaireo User Registration Webhook v1"
   - **Ejecutar como**: "Yo" (tu cuenta)
   - **Quién tiene acceso**: "Cualquier usuario" (CRÍTICO: debe ser "Cualquier usuario" para que funcione)
4. Haz clic en "Implementar"
5. Autoriza el script cuando se te solicite (revisa los permisos y acepta)
6. **Copia la URL del webhook** que aparece (será algo como: `https://script.google.com/macros/s/AKfycby.../exec`)

### Si ya existe un deployment y necesitas actualizarlo:

1. Ve a "Desplegar" > "Administrar implementaciones"
2. Haz clic en el icono de lápiz del deployment activo
3. Cambia la versión a "Nueva versión"
4. Agrega una descripción: "Updated to support GET requests"
5. Verifica que "Quién tiene acceso" siga siendo "Cualquier usuario"
6. Haz clic en "Implementar"

## Paso 3: Configurar Variables de Entorno en Vercel

Añade las siguientes variables de entorno en tu proyecto:

- `GOOGLE_SHEETS_USERS_SPREADSHEET_ID`: El ID de tu Google Sheet (desde la URL del sheet)
- `GOOGLE_SHEETS_WEBHOOK_URL`: La URL del webhook que copiaste en el paso anterior

## Paso 4: Crear la Hoja de Usuarios

1. Abre tu Google Sheet
2. Crea una nueva hoja llamada "UsuariosVaireo" (o el script la creará automáticamente)
3. El script añadirá automáticamente los encabezados: Fecha, Nombre, Empresa, Email

## Verificación

1. Intenta registrar un usuario en la plataforma
2. Verifica que los datos aparezcan en la hoja "UsuariosVaireo"
3. Si recibes error 302, verifica que el deployment tenga acceso "Cualquier usuario"

## Solución de Problemas

### Error 302 (Moved Temporarily)
- Verifica que el deployment esté configurado como "Cualquier usuario"
- Asegúrate de haber creado una nueva versión después de actualizar el código
- Prueba accediendo directamente a la URL del webhook en tu navegador

### Los datos no aparecen
- Verifica que el ID del spreadsheet sea correcto
- Asegura que tu cuenta de Google tenga permisos de edición en el sheet
- Revisa los logs del Apps Script para ver errores

## Notas de Seguridad

- El webhook acepta peticiones GET con parámetros de URL
- Solo comparte la URL del webhook en variables de entorno seguras
- No expongas la URL del webhook públicamente
- Los datos se guardan directamente en tu Google Sheet
