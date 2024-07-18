import {
    ACTION_PENDING_APPROVAL,
    ACTION_FULFILLED,
    ACTION_REJECTED,
} from "./action-type.util";

import {
    ACTION_TYPE
} from "./questionsaction";
import {
    sortBy,
    reduce,
    concat,
    isEmpty
} from "lodash";

const initialState = {
    loading: false,
    allQuestion: null,
    question: null,
    newQuestionInfo: null,
    updateQuestionInfo: null,
    error: null,
};

const questionsReducer = (state = initialState, action) => {

    switch (action.type) {
        case ACTION_PENDING_APPROVAL(ACTION_TYPE.FETCH_ALL_QUESTION):
        case ACTION_PENDING_APPROVAL(ACTION_TYPE.FETCH_QUESTION):
        case ACTION_PENDING_APPROVAL(ACTION_TYPE.UPDATE_QUESTION):
        case ACTION_PENDING_APPROVAL(ACTION_TYPE.ADD_NEW_QUESTION):
            return {
                ...state,
                error: null,
                    loading: true,
            };
        case ACTION_FULFILLED(ACTION_TYPE.FETCH_ALL_QUESTION):
            const newQuestionData = reduce(
                action.payload,
                (result, question) => {
                    const newQuestionFlag = {
                        ...question,
                        newQuestionFlag: isEmpty(question.optionOne.votes) &&
                            isEmpty(question.optionTwo.votes),
                    };
                    return concat(result || [], newQuestionFlag);
                },
                []
            );

            return {
                ...state,
                loading: false,
                    allQuestion: sortBy(newQuestionData, "timestamp").reverse(),
            };
        case ACTION_FULFILLED(ACTION_TYPE.FETCH_QUESTION):
            return {
                ...state,
                loading: false,
                    question: action.payload,
            };
        case ACTION_FULFILLED(ACTION_TYPE.UPDATE_QUESTION):
            return {
                ...state,
                loading: false,
                    updateQuestionInfo: action.payload,
            };
        case ACTION_FULFILLED(ACTION_TYPE.RESET_UPDATE_QUESTION_DATA):
            return {
                ...state,
                updateQuestionInfo: null,
            };
        case ACTION_FULFILLED(ACTION_TYPE.ADD_NEW_QUESTION):
            return {
                ...state,
                loading: false,
                newQuestionInfo: action.payload,
            };
        case ACTION_FULFILLED(ACTION_TYPE.RESET_ADD_QUESTION_DATA):
            return {
                ...state,
                newQuestionInfo: null,
            };
        case ACTION_REJECTED(ACTION_TYPE.FETCH_ALL_QUESTION):
        case ACTION_REJECTED(ACTION_TYPE.FETCH_QUESTION):
        case ACTION_REJECTED(ACTION_TYPE.UPDATE_QUESTION):
        case ACTION_REJECTED(ACTION_TYPE.ADD_NEW_QUESTION):
            return {
                ...state,
                loading: false,
                    error: action.payload || "System error",
            };

        default:
            return state;
    }
}

export default questionsReducer;