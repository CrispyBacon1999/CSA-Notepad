import React from "react";
import ReactDOM from "react-dom";

import Navigation from "./Navigation";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./firebase";

firebase.initializeApp(firebaseConfig);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("service-worker.js")
      .then(
        function (registration) {
          console.log("Registered service worker");
        },
        function (err) {
          console.error("ServiceWorker registration failed: ", err);
        }
      )
      .catch(function (err) {
        console.log(err);
      });
  });
} else {
  console.warn("Service workers not supported in this browser.");
}
var deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("beforeinstallprompt Event fired");
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  return false;
});
if (deferredPrompt) {
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choice) => {
    console.log(choice);
  });
  deferredPrompt = null;
}

ReactDOM.render(<Navigation />, document.getElementById("root"));
