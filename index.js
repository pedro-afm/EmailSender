let currentDay = new Date();
let marginDays = new Date(currentDay);
marginDays.setDate(marginDays.getDate() + 7); // Period of days to resend the email
closeDeadLines = [];

// Getting all deadlines data from the sheet
function getColumnValues() {
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    let column = 2;
    let lastRow = sheet.getLastRow();
    let range = sheet.getRange(2, column, lastRow - 1);

    let deadlineValues = range.getValues(); //Taking all data from second column

    // For each deadline value, compare the data to see if it is close
    deadlineValues.forEach((deadlineValue, row) => {
      compareDataValue(deadlineValue[0], row, sheet, lastRow - 1);
    });
  } catch (e) {
    throw new Error("Error getting sheet data. " + e);
  }
}

// Function to see if the deadline is inside the current day and a week after
function compareDataValue(deadlineValue, row, sheet, lastRow) {
  try {
    // Deadline is inside the interval?
    if (currentDay < deadlineValue && deadlineValue <= marginDays) {
      let range = sheet.getRange(row + 2, 1); // row + 2 because the array starts from 0 and there is the header of the table
      let url = range.getValues();
      let jobInformation = {
        url: url[0][0],
        date: deadlineValue,
      };

      closeDeadLines.push(jobInformation);
    }

    // When there is not more deadlines, call the function to send the emails
    // And the array with the deadlines has even 1 deadline
    if (row === lastRow - 1 && closeDeadLines.length > 0) {
      sendEmail();
    }
  } catch (e) {
    throw new Error("Error comparing data: " + e);
  }
}

// Function to send the email
function sendEmail() {
  try {
    const recipient = "maldonado.pe@hotmail.com";
    const subject = "Deadlines";
    let body = `You have deadlines finishing:\n\n`;

    // Adding more lines for each deadline to improve the visualization
    closeDeadLines.forEach((deadline, index) => {
      body += `Deadline ${index + 1}:\n`;
      body += `URL: ${deadline.url}\n`;
      body += `Date: ${deadline.date}\n\n`;
    });

    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: body,
    });
  } catch (e) {
    throw new Error("Error sending email: " + e);
  }
}
