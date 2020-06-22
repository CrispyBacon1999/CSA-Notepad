const OPEN_DRAWER = "OPEN_DRAWER";
const CLOSE_DRAWER = "CLOSE_DRAWER";
const TOGGLE_DRAWER = "TOGGLE_DRAWER";
const OPEN_ACTIONS = "OPEN_ACTIONS";
const CLOSE_ACTIONS = "CLOSE_ACTIONS";
const TOGGLE_ACTIONS = "TOGGLE_ACTIONS";
const SIGN_IN = "SIGN_IN";

const defaultState = {
  drawerOpen: false,
  actionsOpen: false,
  signedInUser: null,
};

export function openActionsMenu() {
  return {
    type: OPEN_ACTIONS,
  };
}
export function closeActionsMenu() {
  return {
    type: CLOSE_ACTIONS,
  };
}
export function toggleActionsMenu() {
  return { type: TOGGLE_ACTIONS };
}
export function openDrawer() {
  return {
    type: OPEN_DRAWER,
  };
}
export function closeDrawer() {
  return {
    type: CLOSE_DRAWER,
  };
}
export function toggleDrawer() {
  return { type: TOGGLE_DRAWER };
}
export function signIn(key) {
  console.log("Sign in as:" + key);
  return { type: SIGN_IN, payload: key };
}

export function reducer(state = defaultState, action) {
  switch (action.type) {
    case OPEN_ACTIONS:
      return { ...state, actionsOpen: true };
    case CLOSE_ACTIONS:
      return { ...state, actionsOpen: false };
    case TOGGLE_ACTIONS:
      return {
        ...state,
        actionsOpen: !state.actionsOpen,
      };
    case OPEN_DRAWER:
      return { ...state, drawerOpen: true };
    case CLOSE_DRAWER:
      return { ...state, drawerOpen: false };
    case TOGGLE_DRAWER:
      return {
        ...state,
        drawerOpen: !state.drawerOpen,
      };
    case SIGN_IN:
      console.log("SIGN_IN");
      return {
        ...state,
        signedInUser: action.payload,
      };
    default:
      return state;
  }
}
