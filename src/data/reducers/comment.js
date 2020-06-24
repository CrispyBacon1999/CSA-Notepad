import firebase from "firebase/app";
import "firebase/firestore";
import { loadUser } from "./user";

const LOAD_COMMENT = "LOAD_COMMENT";

const defaultState = {};

const listeners = {};

function subscribed(key) {
  return key in Object.keys(listeners);
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
    dispatch(loadUser(data.createdBy));
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
  if (!subscribed(key)) {
    return (dispatch, getState) => {
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
        });
      listeners[key] = unsub;
    };
  }
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
