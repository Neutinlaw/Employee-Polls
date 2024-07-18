import React, { useEffect, useState, startTransition } from "react";
import { Button, Card, Layout, Skeleton } from "antd";
import { map, partition, replace, isNull, isEmpty } from "lodash";
import "./PageQuestions.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllQuestion } from "../Reducers/questionsaction";
import Meta from "antd/es/card/Meta";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import TopPage from "../TopPage/TopPage";


const QuestionsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [newQuestion, setNewQuestion] = useState(null);
    const [doneQuestion, setDoneQuestion] = useState(null);
    const questions = useSelector((state) => state.questionsState.allQuestion);
    useEffect(() => {
        startTransition(() => {
        dispatch(fetchAllQuestion());
        })
    }, [dispatch]);

    useEffect(() => {
        if (questions) {
            const [doneQuestion, newQuestion] = partition(
                questions,
                (n) => !n.newQuestionFlag
            );
            setNewQuestion(newQuestion);
            setDoneQuestion(doneQuestion);
        }
    }, [questions]);

    const showDetails = (id) => {
        navigate(replace("/questions/:id", ":id", id));
    };

    return (
        <Layout className="questions-page">
            <TopPage />
            <Card
                title="New Questions"
                className={`card-wrap ${isEmpty(newQuestion) ? "no-data" : ""}`}
            >
                {isNull(newQuestion) ? (
                    <Skeleton />
                ) : !isEmpty(newQuestion) ? (
                    map(newQuestion, (questions) => {
                        const { id, author, timestamp } = questions;
                        const date = new Date(timestamp);
                        const formatedDate = format(date, "hh:mm a | MM/dd/yyyy");
                        return (
                            <Card
                                key={id}
                                className="text-center"
                                actions={[
                                    <Button
                                        type="primary"
                                        ghost
                                        key="show"
                                        onClick={() => showDetails(id)}
                                    >
                                        Show
                                    </Button>,
                                ]}
                            >
                                <Meta title={author} description={formatedDate} />
                            </Card>
                        );
                    })
                ) : (
                    <p className="text-center">There are no new questions.</p>
                )}
            </Card>
            <Card
                title="Done"
                className={`card-wrap ${isEmpty(doneQuestion) ? "no-data" : ""}`}
            >
                {isNull(doneQuestion) ? (
                    <Skeleton />
                ) : !isEmpty(doneQuestion) ? (
                    map(doneQuestion, (question) => {
                        const { id, author, timestamp } = question;
                        const date = new Date(timestamp);
                        const formatedDate = format(date, "hh:mm a | MM/dd/yyyy");
                        return (
                            <Card
                                key={id}
                                className="text-center"
                                actions={[
                                    <Button
                                        type="primary"
                                        ghost
                                        key="show"
                                        onClick={() => showDetails(id)}
                                    >
                                        Show
                                    </Button>,
                                ]}
                            >
                                <Meta title={author} description={formatedDate} />
                            </Card>
                        );
                    })
                ) : (
                    <p className="text-center">There are no new questions.</p>
                )}
            </Card>

        </Layout>
    );
};

export default QuestionsPage;