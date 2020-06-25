import { combineReducers } from "redux";
import { reducer as userReducer } from "./user";
import { reducer as generalReducer } from "./general";
import { reducer as problemReducer } from "./problem";
import { reducer as commentReducer } from "./comment";

export const rootReducer = combineReducers({
  users: userReducer,
  general: generalReducer,
  problem: problemReducer,
  comments: commentReducer,
});
