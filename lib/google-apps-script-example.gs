// Google Apps Script para usar como webhook
// Instrucciones:
// 1. Ve a https://script.google.com/
// 2. Crea un nuevo proyecto
// 3. Pega este código
// 4. Despliega como Web App (Deploy > New deployment > Web app)
// 5. Configura: Execute as "Me", Access "Anyone"
// 6. Copia la URL del webhook y añádela a GOOGLE_SHEETS_WEBHOOK_URL

function doPost(e) {
  try {
    // Parse the JSON data
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
