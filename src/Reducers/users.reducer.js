import {
  ACTION_TYPE
} from "./usersaction";
import {
  ACTION_PENDING_APPROVAL,
  ACTION_FULFILLED,
  ACTION_REJECTED,
} from "./action-type.util";
const initialState = {
  loading: false,
  user: null,
  allUser: null,
  changePassInfo: null,
  registerUserInfo: null,
  error: null,
};

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_PENDING_APPROVAL(ACTION_TYPE.FETCH_USER):
      return {
        ...state,
        error: null,
          loading: true,
      };
    case ACTION_PENDING_APPROVAL(ACTION_TYPE.FETCH_ALL_USER):
      return {
        ...state,
        error: null,
      };
    case ACTION_FULFILLED(ACTION_TYPE.FETCH_USER):
      return {
        ...state,
        error: null,
          loading: false,
          user: action.payload,
      };
    case ACTION_FULFILLED(ACTION_TYPE.RESET_USER_DATA):
      return {
        ...state,
        user: null,
      };
    case ACTION_FULFILLED(ACTION_TYPE.FETCH_ALL_USER):
      return {
        ...state,
        allUser: action.payload,
      };
    case ACTION_REJECTED(ACTION_TYPE.FETCH_USER):
      return {
        ...state,
        loading: false,
          error: action.payload || "System error",
      };
    default:
      return state;
  }
};

export default usersReducer;