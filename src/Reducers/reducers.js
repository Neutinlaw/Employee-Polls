import { combineReducers } from "@reduxjs/toolkit";
import usersReducer from "./users.reducer";
import questionsReducer from "./questionsreducer";

const rootReducer = combineReducers({
  userState: usersReducer,
  questionsState: questionsReducer,
});

export default rootReducer;
