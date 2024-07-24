import React, { useEffect, useState, startTransition } from "react";
import { Button, Card, Layout, Skeleton, Select } from "antd";
import { map, partition, replace, isNull, isEmpty, includes } from "lodash";
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
  const [typeDisplay, setTypeDisplay] = useState("all");
  const [newQuestion, setNewQuestion] = useState(null);
  const [doneQuestion, setDoneQuestion] = useState(null);
  const userInfo = useSelector((state) => state.userState.user);
  const questions = useSelector((state) => state.questionsState.allQuestion);
  useEffect(() => {
    startTransition(() => {
      dispatch(fetchAllQuestion(userInfo?.id));
    });
  }, [dispatch, userInfo]);

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
    navigate(replace("/questions/:id", ":id", id), { state: { usr: true } });
  };

  const handleChange = (value) => {
    setTypeDisplay(value);
  };

  return (
    <Layout className="questions-page">
      <TopPage />
      <div style={{ paddingLeft: 40, background: "#ffffff" }}>
        <span>Select type display</span>
        <Select
          defaultValue="all"
          style={{ width: 200, margin: 40 }}
          onChange={handleChange}
          options={[
            { label: <span>All question</span>, value: "all" },
            { label: <span>Done questions</span>, value: "done" },
            { label: <span>New Questions</span>, value: "new" },
          ]}
        />
      </div>
      {includes(["all", "new"], typeDisplay) && (
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
      )}
      {includes(["all", "done"], typeDisplay) && (
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
      )}
    </Layout>
  );
};

export default QuestionsPage;
