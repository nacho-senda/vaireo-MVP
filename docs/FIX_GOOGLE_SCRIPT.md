# Solución para el Registro de Usuarios

## Problema Actual
El script de Google Apps Script solo está guardando el email, no el nombre ni la empresa.

## Solución

El script actual en Google Apps Script necesita ser reemplazado con el código correcto.

### Pasos para Actualizar el Script:

1. **Ve a Google Apps Script**
   - Abre: https://script.google.com
   - Busca tu proyecto (el que tiene el deployment actual)

2. **Reemplaza el código completo con este:**

\`\`\`javascript
function doPost(e) {
  try {
    Logger.log('POST recibido');
    Logger.log('postData: ' + JSON.stringify(e.postData));
    
    var params;
    
    if (e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
      Logger.log('Parsed params: ' + JSON.stringify(params));
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: 'No se recibieron datos'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!params.timestamp || !params.name || !params.company || !params.email) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: 'Faltan campos requeridos',
        received: params
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var spreadsheetId = params.spreadsheetId || '1SOtbBta4o9VmuqG-nOKgdxwaJAZxOjqdtKu6xIMGo6w';
    var sheetName = params.sheetName || 'UsuariosVaireo';
    
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      sheet.appendRow(['Fecha', 'Nombre', 'Empresa', 'Email']);
    }
    
    // IMPORTANTE: Añadir todos los campos en orden
    sheet.appendRow([
      params.timestamp,  // Fecha
      params.name,       // Nombre  
      params.company,    // Empresa
      params.email       // Email
    ]);
    
    Logger.log('Fila añadida exitosamente');
    
    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      message: 'Usuario registrado correctamente',
      data: {
        timestamp: params.timestamp,
        name: params.name,
        company: params.company,
        email: params.email
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    ok: false,
    hint: 'Usa POST para registrar usuarios'
  })).setMimeType(ContentService.MimeType.JSON);
}
\`\`\`

3. **Guarda el script** (Ctrl+S o Cmd+S)

4. **Crea un NUEVO Deployment:**
   - Click en "Deploy" → "New deployment"
   - Type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
   - **IMPORTANTE**: Copia la nueva URL del deployment y actualiza la variable de entorno `GOOGLE_SHEETS_WEBHOOK_URL` con esta nueva URL

5. **Prueba el registro**
   - Intenta registrar un nuevo usuario
   - Verifica que TODOS los campos (fecha, nombre, empresa, email) se guarden correctamente

## Por qué esto funciona

El script anterior probablemente solo estaba guardando `e.parameter.email` o similar, ignorando los otros campos. Este script corregido:

1. Parsea correctamente el JSON del POST body
2. Valida que todos los campos estén presentes
3. Los guarda en el orden correcto: [timestamp, name, company, email]
4. Retorna una respuesta JSON clara con todos los datos guardados
