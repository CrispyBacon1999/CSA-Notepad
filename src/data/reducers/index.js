import { combineReducers } from "redux";
import { reducer as userReducer } from "./user";
import { reducer as generalReducer } from "./general";
import { reducer as problemReducer } from "./problem";

export const rootReducer = combineReducers({
  users: userReducer,
  general: generalReducer,
  problem: problemReducer,
});
