import firebase from "firebase/app";
import "firebase/firestore";

const STORE_USER = "STORE_USER";

const defaultState = {};

export function updateUserProfilePicture(id, url) {
  var userRef = firebase.firestore().collection("users").doc(id);
  userRef.update({ photoURL: url });
}

export function watchUser(id) {
  return function (dispatch) {
    var userRef = firebase.firestore().collection("users").doc(id);
    userRef.onSnapshot((snapshot) => {
      console.log(snapshot.data());
      dispatch(storeUser(snapshot.data()));
    });
  };
}

export function loadUser(id) {
  return function (dispatch, getState) {
    if (!(id in getState().users)) {
      var userRef = firebase.firestore().collection("users").doc(id);
      userRef
        .get()
        .then((doc) => {
          console.log(doc.data());
          dispatch(storeUser({ uid: id, ...doc.data() }));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
}

export function storeUser(user) {
  return {
    type: STORE_USER,
    payload: {
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      preferences: user.preferences,
    },
  };
}

export function reducer(state = defaultState, action) {
  switch (action.type) {
    case STORE_USER:
      if (action.payload) {
        return {
          ...state,
          [action.payload.id]: {
            name: action.payload.displayName || "",
            pic: action.payload.photoURL || "",
            preferences: action.payload.preferences || undefined,
          },
        };
      }
      return state;
    default:
      return state;
  }
}
