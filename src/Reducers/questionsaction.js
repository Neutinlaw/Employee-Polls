import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    _getQuestions,
    _saveQuestion,
    _saveQuestionAnswer,
  } from "../_DATA.js";
export const ACTION_TYPE = {
    FETCH_ALL_QUESTION: "questions/fetchAllQuestion",
    FETCH_QUESTION: "questions/fetchQuestion",
    UPDATE_QUESTION: "questions/updateQuestion",
    RESET_UPDATE_QUESTION_DATA: "questions/resetUpdateData",
    ADD_NEW_QUESTION: "questions/addNewQuestion",
    RESET_ADD_QUESTION_DATA: "questions/resetAddQuestionData",
}

export const fetchAllQuestion = createAsyncThunk(
    ACTION_TYPE.FETCH_ALL_QUESTION,
    async () => {
      const result = await _getQuestions();
      return result;
    }
  );

  export const fetchQuestion = createAsyncThunk(
    ACTION_TYPE.FETCH_QUESTION,
    async (id) => {
      const questionInfors = await _getQuestions();
      const result = Object.values(questionInfors).find(
        (question) => question.id === questionInfors?.id 
      );
      return result;
    }
  );

  export const updateQuestion = createAsyncThunk(
    ACTION_TYPE.UPDATE_QUESTION,
    async (data) => {
      const result = await _saveQuestionAnswer({authedUser : data.author, qid: data.questionId, answer : data.option});
      return result;
    }
  );


  export const addNewQuestion = createAsyncThunk(
    ACTION_TYPE.ADD_NEW_QUESTION,
    async (question) => {
      const result = await _saveQuestion(question);
      return result;
    }
  );

  export const resetUpdateData = createAsyncThunk(
    ACTION_TYPE.RESET_UPDATE_QUESTION_DATA,
    () => {}
  );

  export const resetAddQuestionData = createAsyncThunk(
    ACTION_TYPE.RESET_ADD_QUESTION_DATA,
    () => {}
  );

  