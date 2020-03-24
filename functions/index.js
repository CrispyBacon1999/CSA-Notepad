const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

function initializeApp() {}

process.env.GCLOUD_PROJECT = "csa-notepad-1559706274069";
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

exports.addEvent = functions.https.onRequest(addEvent);
exports.refreshEventTeams = functions.https.onRequest(refreshEventTeams);

function addEvent(request, response) {
  var key = request.query.key;
  if (key.match(/\d{4}[A-z]{4,7}/)) {
    var tbakey = functions.config().tba.secret;

    var dbEventRef = db.collection("events").doc(key);
    var getDoc = dbEventRef
      .get()
      .then(doc => {
        if (!doc.exists) {
          fetch(`https://www.thebluealliance.com/api/v3/event/${key}/simple`, {
            headers: {
              "X-TBA-Auth-Key": tbakey
            },
            method: "GET"
          })
            .then(res => res.json())
            .then(event => {
              console.log(event);
              dbEventRef
                .set({
                  name: event.name,
                  start_date: new Date(event.start_date),
                  end_date: new Date(event.end_date)
                })
                .then(value => {
                  response.send(`Successfully added event with key: ${key}`);
                })
                .catch(err => {
                  response.send(JSON.stringify(err));
                });
            })
            .catch(err => {
              response.send(JSON.stringify(err));
            });
        } else {
          response.send("Event already exists");
        }
      })
      .catch(err => {
        response.send("Error getting document");
      });
  } else {
    response.send("Invalid event key");
  }
}

function refreshEventTeams(request, response) {
  var key = request.query.key;
  var dbEventRef = db.collection("events").doc(key);
  fetch(`https://www.thebluealliance.com/api/v3/event/${key}/teams/keys`, {
    headers: {
      "X-TBA-Auth-Key": tbakey
    },
    method: "GET"
  })
    .then(res => res.json())
    .then(teams => {
      let teamNums = teams.map(teamKey => parseInt(teamKey.substring(3, 8)));
      dbEventRef
        .set({
          teams: teamNums
        })
        .then(res => {
          response.send("Successfully updated event teams");
        });
    });
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
