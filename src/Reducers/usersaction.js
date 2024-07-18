import { createAsyncThunk } from "@reduxjs/toolkit";
import {_getUsers} from "../_DATA.js"

export const ACTION_TYPE = {
    FETCH_USER: "user/fetchUser",
    RESET_USER_DATA: "user/resetUserData",
    FETCH_ALL_USER: "user/fetchAllUser",
    CLEAR_ERROR: "user/clearError",
};


export const fetchUser = createAsyncThunk(ACTION_TYPE.FETCH_USER, async (userData) => {
    const user = await _getUsers();
    const result = Object.values(user).find(
        (user) => user.id === userData?.username 
      );
      return result;
  });

  export const fetchAllUser = createAsyncThunk(ACTION_TYPE.FETCH_ALL_USER, async (userData) => {
    const allUser = await _getUsers();
      return allUser;
  });

  export const clearError = createAsyncThunk(ACTION_TYPE.CLEAR_ERROR, () => {});

  export const resetUserData = createAsyncThunk(
    ACTION_TYPE.RESET_USER_DATA,
    () => {}
  );