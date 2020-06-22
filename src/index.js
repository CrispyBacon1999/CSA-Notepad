import React from "react";
import ReactDOM from "react-dom";

import Navigation from "./Navigation";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./firebase";
import { store } from "./data/store";
import { Provider } from "react-redux";
import "firebase/performance";

firebase.initializeApp(firebaseConfig);
firebase.performance();

ReactDOM.render(
  <Provider store={store}>
    <Navigation />
  </Provider>,
  document.getElementById("root")
);
