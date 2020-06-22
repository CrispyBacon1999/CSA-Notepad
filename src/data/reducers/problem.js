import firebase from "firebase/app";
import "firebase/firestore";

import { loadUser } from "./user";

const EDIT_REPLY = "EDIT_REPLY";
const LOAD_PROBLEM = "LOAD_PROBLEM";
const LOAD_COMMENTS = "LOAD_COMMENTS";
const CLEAR_PROBLEM = "CLEAR_PROBLEM";
const SEND_REPLY = "SEND_REPLY";
const OPEN_PROBLEM = "OPEN_PROBLEM";
const CLOSE_PROBLEM = "CLOSE_PROBLEM";

const defaultState = {
  problemID: "",
  comments: [],
  open: true,
  type: "",
  replyText: "",
  team: "",
  title: "",
  createdBy: "",
};

export function editReply(text) {
  return {
    type: EDIT_REPLY,
    payload: {
      text: text,
    },
  };
}

export function openProblem() {
  return (dispatch, getState) => {
    // Set status to be open
    firebase
      .firestore()
      .collection("problems")
      .doc(getState().problem.problemID)
      .update({
        open: true,
      })
      .then(() => {
        dispatch({
          type: OPEN_PROBLEM,
        });
      })
      .then(() => {
        // Send the closed message to display in comment list
        firebase
          .firestore()
          .collection("problems")
          .doc(getState().problem.problemID)
          .update({
            comments: firebase.firestore.FieldValue.arrayUnion({
              type: "open",
              createdBy: getState().general.signedInUser,
              time: firebase.firestore.Timestamp.now(),
            }),
          });
      });
  };
}
export function closeProblem() {
  return (dispatch, getState) => {
    // Set the status to be closed
    firebase
      .firestore()
      .collection("problems")
      .doc(getState().problem.problemID)
      .update({
        open: false,
      })
      .then(() => {
        dispatch({
          type: CLOSE_PROBLEM,
        });
      })
      .then(() => {
        // Send the closed message to display in comment list
        firebase
          .firestore()
          .collection("problems")
          .doc(getState().problem.problemID)
          .update({
            comments: firebase.firestore.FieldValue.arrayUnion({
              type: "close",
              createdBy: getState().general.signedInUser,
              time: firebase.firestore.Timestamp.now(),
            }),
          });
      });
  };
}
export function sendReply() {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("problems")
      .doc(getState().problem.problemID)
      .update({
        comments: firebase.firestore.FieldValue.arrayUnion({
          type: "text",
          deleted: false,
          createdBy: getState().general.signedInUser,
          text: getState().problem.replyText,
          time: firebase.firestore.Timestamp.now(),
        }),
      })
      .then(() => {
        dispatch({
          type: SEND_REPLY,
        });
      });
  };
}

export function loadProblem(id) {
  return (dispatch) => {
    firebase
      .firestore()
      .collection("problems")
      .doc(id)
      .onSnapshot(async (doc) => {
        let prob = doc.data();
        console.log(prob);
        dispatch({
          type: LOAD_PROBLEM,
          payload: {
            problemID: id,
            title: prob.title,
            open: prob.open,
            type: prob.type,
            team: prob.team,
            createdBy: prob.createdBy,
          },
        });
        dispatch(loadUser(prob.createdBy));
        let comments = [
          {
            createdBy: prob.createdBy,
            text: prob.text,
            time: prob.time,
          },
          ...prob.comments,
        ];
        dispatch({
          type: LOAD_COMMENTS,
          payload: {
            comments: comments.map((p, index) => ({
              ...p,
              key: `${id}-${index}`,
            })),
          },
        });
      });
  };
}

export function reducer(state = defaultState, action) {
  switch (action.type) {
    case EDIT_REPLY:
      return { ...state, replyText: action.payload.text };
    case LOAD_PROBLEM:
      return {
        ...state,
        problemID: action.payload.problemID,
        title: action.payload.title,
        open: action.payload.open,
        type: action.payload.type,
        team: action.payload.team,
        createdBy: action.payload.createdBy,
      };
    case LOAD_COMMENTS:
      return {
        ...state,
        comments: action.payload.comments,
      };
    case CLEAR_PROBLEM:
      return { ...defaultState };
    default:
      return state;
  }
}
