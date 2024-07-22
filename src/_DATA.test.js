import {
    _saveQuestion,
    _saveQuestionAnswer,
} from "./_DATA";

describe("_DATA", () => {
    it("save question success", async () => {
        const mockQuestion = {
            author: "sarahedo",
            optionOneText: "option 1",
            optionTwoText: "option 2",
        };

        const actual = await _saveQuestion(mockQuestion);
        const {
            author,
            optionOne,
            optionTwo
        } = actual;
        const option1 = optionOne.text;
        const option2 = optionTwo.text;

        expect(author).toEqual("sarahedo");
        expect(option1).toEqual("option 1");
        expect(option2).toEqual("option 2");
    });

    it("save question fail", async () => {
        const mockQuestion = {
            author: null,
            optionOneText: "option 1",
            optionTwoText: "option 2",
        };

        await expect(_saveQuestion(mockQuestion)).rejects.toEqual(
            "Please provide optionOneText, optionTwoText, and author"
        );
    });

    it("save question answer success", async () => {
        const mockAnswer = {
            authedUser: "sarahedo",
            qid: "8xf0y6ziyjabvozdd253nd",
            answer: "optionOne",
        };

        const status = await _saveQuestionAnswer(mockAnswer);

        expect(status).toBe(true);
    });

    it("save question answer fail", async () => {
        const mockAnswer = {
            authedUser: null,
            qid: "8xf0y6ziyjabvozdd253nd",
            answer: "optionOne",
        };

        await expect(_saveQuestionAnswer(mockAnswer)).rejects.toEqual(
            "Please provide authedUser, qid, and answer"
        );
    });
});