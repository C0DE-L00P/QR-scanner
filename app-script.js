function doGet(e) {
  // Get the search parameter from URL query
  const searchValue = e.parameter.search || '';
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('presence');
  const data = sheet.getDataRange().getValues();
  let result = {};
  let found = false;
  
  // Search for row with the search value in first column
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === searchValue) {
      // Get all values from the row
      result = {
        status: "success",
        data: data[i],
        rowNumber: i + 1
      };
      found = true;
      break;
    }
  }

  // Return JSON response with 404 if not found
  if (!found) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      error: "No match found",
      code: 404
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
    // Get the string from post body
    const postData = JSON.parse(e.postData.contents);
    const searchValue = postData.search || '';
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('presence');
    const data = sheet.getDataRange().getValues();
    let result = {};
    let found = false;
    
    // Search for row with the search value in first column
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === searchValue) {
        // Check if already marked as present
        if (data[i][2] === true) {
          return ContentService.createTextOutput(JSON.stringify({
            status: "error",
            error: "Already checked",
            code: 401
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        // Update third column to TRUE
        sheet.getRange(i + 1, 3).setValue(true);
        
        result = {
          status: "success",
          message: "Updated successfully",
          data: data[i],
          rowNumber: i + 1
        };
        found = true;
        break;
      }
    }
  
    // Return JSON response with 404 if not found
    if (!found) {
      return ContentService.createTextOutput(JSON.stringify({
        error: "Fake QR Code",
        status: "error",
        code: 404
      })).setMimeType(ContentService.MimeType.JSON);
    }
  
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }