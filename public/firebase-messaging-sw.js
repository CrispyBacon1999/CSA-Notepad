importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js");

firebase.initializeApp({
    apiKey: "AIzaSyDNgytF56RMLN0q_g3ySe5LnzgBr8oMNOU",
    authDomain: "csa-notepad-1559706274069.firebaseapp.com",
    databaseURL: "https://csa-notepad-1559706274069.firebaseio.com",
    projectId: "csa-notepad-1559706274069",
    storageBucket: "csa-notepad-1559706274069.appspot.com",
    messagingSenderId: "167390266392",
    appId: "1:167390266392:web:8354d265ac893de997af6d",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
    );
    // Customize notification here
    const notificationTitle = `CSA Notepad - ${payload.data.team} New issue`;
    const notificationOptions = {
        body: payload.data.issue,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
