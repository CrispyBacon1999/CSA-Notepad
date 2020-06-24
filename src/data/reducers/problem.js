import firebase from "firebase/app";
import "firebase/firestore";
import { loadComment, fakeComment } from "./comment";

const EDIT_REPLY = "EDIT_REPLY";
const LOAD_PROBLEM = "LOAD_PROBLEM";
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
var listener = undefined;
function unsubscribe() {
  if (listener !== undefined) {
    listener();
    listener = undefined;
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
                comments: firebase.firestore.FieldValue.arrayUnion(doc.id),
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
                comments: firebase.firestore.FieldValue.arrayUnion(doc.id),
              });
          });
      });
  };
}
export function sendReply() {
  // TODO: Check text to make sure it exists
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
            comments: firebase.firestore.FieldValue.arrayUnion(doc.id),
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
            comments: [id, ...prob.comments],
          },
        });
        prob.comments.forEach((commentID) => {
          dispatch(loadComment(commentID));
        });

        dispatch(
          fakeComment({
            key: id,
            createdBy: prob.createdBy,
            text: prob.text,
            time: prob.time,
            base: true,
          })
        );
      });
    // Store the firestore listener so it can be unsubscribed from later
    listener = unsub;
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
        comments: action.payload.comments,
      };
    case SEND_REPLY:
      return { ...state, replyText: "" };
    case CLEAR_PROBLEM:
      return { ...defaultState };
    default:
      return state;
  }
}
