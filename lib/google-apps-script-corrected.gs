function doPost(e) {
  try {
    // Log para debugging
    Logger.log('POST recibido');
    Logger.log('postData: ' + JSON.stringify(e.postData));
    
    var params;
    
    // Parsear el JSON del body
    if (e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
      Logger.log('Parsed params: ' + JSON.stringify(params));
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: 'No se recibieron datos'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validar que tenemos todos los campos
    if (!params.timestamp || !params.name || !params.company || !params.email) {
      return ContentService.createTextOutput(JSON.stringify({
        ok: false,
        error: 'Faltan campos requeridos',
        received: params
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Abrir la hoja de cálculo
    var spreadsheetId = params.spreadsheetId || '1SOtbBta4o9VmuqG-nOKgdxwaJAZxOjqdtKu6xIMGo6w';
    var sheetName = params.sheetName || 'UsuariosVaireo';
    
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName(sheetName);
    
    // Si la hoja no existe, crearla con headers
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      sheet.appendRow(['Fecha', 'Nombre', 'Empresa', 'Email']);
    }
    
    // Añadir la fila con TODOS los campos en el orden correcto
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
