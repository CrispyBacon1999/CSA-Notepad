import firebase from "firebase/app";
import "firebase/firestore";
import { watchUser } from "./user";

const LOAD_COMMENT = "LOAD_COMMENT";

const defaultState = {};

const listeners = {};

function subscribed(key) {
  return key in listeners;
}

export function unsubscribe(key = undefined) {
  if (key !== undefined) {
    if (subscribed(key)) {
      listeners[key]();
      delete listeners[key];
    }
  } else {
  }
}

export function fakeComment(data) {
  return function (dispatch) {
    dispatch(watchUser(data.createdBy));
    dispatch({
      type: LOAD_COMMENT,
      payload: {
        key: data.key,
        createdBy: data.createdBy,
        text: data.text,
        base: true,
        time: data.time,
      },
    });
  };
}

export function loadComment(key) {
  return (dispatch, getState) => {
    if (!subscribed(key)) {
      let unsub = firebase
        .firestore()
        .collection("comments")
        .doc(key)
        .onSnapshot((doc) => {
          var data = doc.data();
          dispatch({
            type: LOAD_COMMENT,
            payload: {
              key: key,
              createdBy: data.createdBy,
              deleted: data.deleted,
              problemID: data.problemID,
              text: data.text,
              time: data.time,
              type: data.type,
            },
          });
          dispatch(watchUser(data.createdBy));
        });

      listeners[key] = unsub;
    }
  };
}

export function reducer(state = defaultState, action) {
  switch (action.type) {
    case LOAD_COMMENT:
      return {
        ...state,
        [action.payload.key]: {
          createdBy: action.payload.createdBy,
          deleted: action.payload.deleted,
          problemID: action.payload.problemID,
          text: action.payload.text,
          time: action.payload.time,
          type: action.payload.type,
          base: action.payload.base,
        },
      };
    default:
      return state;
  }
}
