import firebase from "firebase/app";
import "firebase/firestore";

import { loadUser } from "./user";

const EDIT_REPLY = "EDIT_REPLY";
const LOAD_PROBLEM = "LOAD_PROBLEM";
const LOAD_COMMENT = "LOAD_COMMENT";
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
var listeners = [];
function unsubscribe() {
  while (listeners.length > 0) {
    listeners.pop()();
  }
}

export function editReply(text) {
  return {
    type: EDIT_REPLY,
    payload: {
      text: text,
    },
  };
}

export function deleteComment(commentID) {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("comments")
      .doc(commentID)
      .update({ deleted: true });
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
        firebase
          .firestore()
          .collection("comments")
          .add({
            type: "open",
            createdBy: getState().general.signedInUser,
            time: firebase.firestore.Timestamp.now(),
            problemID: getState().problem.problemID,
          })
          .then((doc) => {
            firebase
              .firestore()
              .collection("problems")
              .doc(getState().problem.problemID)
              .update({
                comments: firebase.firestore.FieldValue.arrayUnion(doc),
              });
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
        firebase
          .firestore()
          .collection("comments")
          .add({
            type: "close",
            createdBy: getState().general.signedInUser,
            time: firebase.firestore.Timestamp.now(),
            problemID: getState().problem.problemID,
          })
          .then((doc) => {
            firebase
              .firestore()
              .collection("problems")
              .doc(getState().problem.problemID)
              .update({
                comments: firebase.firestore.FieldValue.arrayUnion(doc),
              });
          });
      });
  };
}
export function sendReply() {
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("comments")
      .add({
        type: "text",
        createdBy: getState().general.signedInUser,
        time: firebase.firestore.Timestamp.now(),
        text: getState().problem.replyText,
        deleted: false,
        problemID: getState().problem.problemID,
      })
      .then((doc) => {
        firebase
          .firestore()
          .collection("problems")
          .doc(getState().problem.problemID)
          .update({
            comments: firebase.firestore.FieldValue.arrayUnion(doc),
          })
          .then(() => {
            dispatch({
              type: SEND_REPLY,
            });
          });
      });
  };
}

export function loadProblem(id) {
  // Before loading a new problem, unsubscribe from other listeners (prevents memory leaks)
  unsubscribe();

  return (dispatch, getState) => {
    dispatch({
      type: CLEAR_PROBLEM,
    });
    let unsub = firebase
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
        for (var commentID in prob.comments) {
          var unsub = firebase
            .firestore()
            .collection("comments")
            .doc(commentID)
            .onSnapshot((doc) => {
              dispatch({
                type: LOAD_COMMENT,
                payload: {
                  comments: comments.map((p, index) => ({
                    ...p,
                    key: `${id}-${index}`,
                  })),
                },
              });
            });
          // Store the firestore listener so it can be unsubscribed from later
          listeners.push(unsub);
        }
        let comments = {
          [id]: {
            createdBy: prob.createdBy,
            text: prob.text,
            time: prob.time,
            base: true,
          },
        };

        dispatch({
          type: LOAD_COMMENT,
          payload: {
            comments: comments,
          },
        });
      });
    // Store the firestore listener so it can be unsubscribed from later
    listeners.push(unsub);
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
    case LOAD_COMMENT:
      return {
        ...state,
        comments: { ...state.comments, ...action.payload.comments },
      };
    case CLEAR_PROBLEM:
      return { ...defaultState };
    default:
      return state;
  }
}
