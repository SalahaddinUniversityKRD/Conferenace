function doPost(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({"status":"error","message":"no_data"})).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
    }

    var data = JSON.parse(e.postData.contents);
    var name = data.name;
    var university = data.university;
    var email = data.email;
    var certOption = data.certOption;
    var verificationCode = data.verificationCode ? data.verificationCode.trim() : "";

    var ss = SpreadsheetApp.openById("13YcPQyr1igVRn-fOVMHtujFRgRlixVMcqyQHRoFxoMg");
    
    // ڕێکخستنی ناوی لاپەڕەکان بە دەقیقی وەک خۆی
    var mainSheet = ss.getSheetByName("Confrance");
    var codeSheet = ss.getSheetByName("Codes");

    if (certOption === "certificate") {
      if (verificationCode === "") {
        return ContentService.createTextOutput(JSON.stringify({"status":"error","message":"empty_code"})).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
      }

      var codeData = codeSheet.getDataRange().getValues();
      var codeFound = false;
      var codeRowIndex = -1;

      for (var i = 1; i < codeData.length; i++) {
        if (codeData[i][0].toString().trim() === verificationCode) {
          codeFound = true;
          if (codeData[i][1] && codeData[i][1].toString().indexOf("USED") !== -1) {
            return ContentService.createTextOutput(JSON.stringify({"status":"error","message":"code_used"})).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
          }
          codeRowIndex = i + 1;
          break;
        }
      }

      if (!codeFound) {
        return ContentService.createTextOutput(JSON.stringify({"status":"error","message":"invalid_code"})).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
      }

      codeSheet.getRange(codeRowIndex, 2).setValue("USED by: " + email);

      var copyFile = DriveApp.getFileById("1Vk75DKkVXzyapC6yaMN-oFpM9LTYyTqcW1dNOT0a0No").makeCopy(name + " - Certificate", DriveApp.getFolderById("1onZ9NMDhA3wvTghp3c_Qe6QSYULcejqs"));
      var presentation = SlidesApp.openById(copyFile.getId());
      presentation.getSlides()[0].replaceAllText("{{ناوی سیانی}}", name);
      presentation.saveAndClose();

      var pdfBlob = copyFile.getAs(MimeType.PDF);

      MailApp.sendEmail({
        to: email,
        subject: "بڕوانامەی بەشداربوون لە کۆنفرانس",
        body: "سڵاو " + name + "،\n\nسوپاس بۆ بەشداربوونت لە کۆنفرانسەکەمان. هاوپێچ بڕوانامەی فەرمی بەشداربوونت بۆ دەنێرین.\n\nلەگەڵ ڕێزدا،\nلیژنەی ڕێکخەری کۆنفرانس",
        attachments: [pdfBlob]
      });
    }

    mainSheet.appendRow([name, university, email, certOption === "certificate" ? "بڕوانامە" : "بێ بڕوانامە", verificationCode]);
    return ContentService.createTextOutput(JSON.stringify({"status":"success"})).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status":"error","message":error.toString()})).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
  }
}

function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
}
