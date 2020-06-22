import React from "react";
import ReactDOM from "react-dom";

import Navigation from "./Navigation";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./firebase";
import { store } from "./data/store";
import { Provider } from "react-redux";
import "firebase/performance";
import "firebase/analytics";

firebase.initializeApp(firebaseConfig);
firebase.performance();
firebase.analytics();

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

ReactDOM.render(
  <Provider store={store}>
    <Navigation />
  </Provider>,
  document.getElementById("root")
);
