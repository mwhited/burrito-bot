
const googleAuth = require('./auth');
const {google} = require('googleapis');

class WorkoutSheet {

    static updateSheet(name,date,workout, auth)
    {
        let values = [[name,date,workout]];
        let resource = {
            values,
        };
        googleAuth.authorize()
                    .then((auth) => {
                        let sheetsApi = google.sheets({version: 'v4', auth});
                        sheetsApi.spreadsheets.values.append({
                            auth: auth,
                            spreadsheetId: process.env.SPREADSHEET_ID,
                            valueInputOption: "USER_ENTERED",
                            resource: resource,
                            range: "'Workouts'!A1:A65000",
                        }, (err, result) => {
                            if (err) {
                              // Handle error.
                              console.log(err);
                            } else {
                              console.log(`${result.updates.updatedCells} cells appended.`);
                            }
                          });
                    })
                    .catch((err) => {
                        console.log('auth error', err);
                    });
    }
}

module.exports = WorkoutSheet;