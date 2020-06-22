import { combineReducers } from "redux";
import { reducer as userReducer } from "./user";
import { reducer as generalReducer } from "./general";

export const rootReducer = combineReducers({
  users: userReducer,
  general: generalReducer,
});
