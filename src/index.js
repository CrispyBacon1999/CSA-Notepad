import React from "react";
import ReactDOM from "react-dom";

import Navigation from "./Navigation";

import * as firebase from "firebase/app";
import { firebaseConfig } from "./firebase";

firebase.initializeApp(firebaseConfig);

ReactDOM.render(<Navigation />, document.getElementById("root"));
