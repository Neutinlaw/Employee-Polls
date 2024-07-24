import React, { useEffect, useState, startTransition } from "react";
import {
  Avatar,
  Typography,
  Card,
  Layout,
  Skeleton,
  Button,
  Progress,
} from "antd";
import {
  fetchAllQuestion,
  updateQuestion,
  resetUpdateData,
} from "../Reducers/questionsaction";
import "./PageDetailQuestion.css";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { LikeOutlined, UserOutlined, CheckOutlined } from "@ant-design/icons";
import { find, includes, size, round } from "lodash";
import { red } from "@ant-design/colors";
import TopPage from "../TopPage/TopPage";

const { Content } = Layout;
const { Title } = Typography;

const PageDetailQuestion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [questionInfomation, setquestionInfomation] = useState(null);
  const questions = useSelector((state) => state.questionsState.allQuestion);
  const updateQuestionInfo = useSelector(
    (state) => state.questionsState.updateQuestionInfo
  );

  useEffect(() => {
    if (!questions || updateQuestionInfo) {
      startTransition(() => {
        dispatch(fetchAllQuestion());
      });
      startTransition(() => {
        dispatch(resetUpdateData());
      });
    }
  }, [questions, updateQuestionInfo, dispatch]);

  useEffect(() => {
    if (questions) {
      const question = find(questions, ["id", id]);
      if (question) {
        setquestionInfomation(question);
      } else {
        navigate("/page-not-found", { state: { usr: true } });
      }
    }
  }, [questions, navigate, id]);

  useEffect(() => {
    const sessionLogin = sessionStorage.getItem("sessionLogin");
    if (sessionLogin) {
      setUser(JSON.parse(sessionLogin));
    }
  }, []);

  const vote = (option) => {
    const data = {
      author: user.id,
      questionId: questionInfomation.id,
      option: option,
    };
    startTransition(() => {
      dispatch(updateQuestion(data));
    });
  };
  return (
    <Layout className="question-details-page">
      <TopPage />
      <Content className="p-4">
        <Title level={2}>{`Poll By ${questionInfomation?.author}`}</Title>
        <Avatar
          src={user?.avatarURL}
          icon={<UserOutlined />}
          alt={user?.name}
        />
        <Title className="decription" level={2}>
          Would You Rather
        </Title>
        <Layout>
          {questionInfomation ? (
            <div className="question-contain">
              <Card
                className="card-wrap"
                actions={
                  includes(questionInfomation.optionOne.votes, user.id)
                    ? [
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={() => vote("optionOne")}
                        />,
                      ]
                    : [
                        <Button
                          type="primary"
                          icon={<LikeOutlined />}
                          onClick={() => vote("optionOne")}
                        >
                          Click
                        </Button>,
                      ]
                }
              >
                <pre>{questionInfomation.optionOne.text}</pre>
              </Card>
              <Progress
                percent={round(
                  (size(questionInfomation.optionOne.votes) /
                    (size(questionInfomation.optionOne.votes) +
                      size(questionInfomation.optionTwo.votes))) *
                    100
                )}
                steps={
                  size(questionInfomation.optionOne.votes) +
                  size(questionInfomation.optionTwo.votes)
                }
                format={(percent) => `${percent}%`}
              />
            </div>
          ) : (
            <Skeleton />
          )}
          {questionInfomation ? (
            <div className="question-contain">
              <Card
                className="card-wrap"
                actions={
                  includes(questionInfomation.optionTwo.votes, user.id)
                    ? [
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={() => vote("optionTwo")}
                        />,
                      ]
                    : [
                        <Button
                          type="primary"
                          icon={<LikeOutlined />}
                          onClick={() => vote("optionTwo")}
                        >
                          Click
                        </Button>,
                      ]
                }
              >
                <pre>{questionInfomation.optionTwo.text}</pre>
              </Card>
              <Progress
                percent={round(
                  (size(questionInfomation.optionTwo.votes) /
                    (size(questionInfomation.optionOne.votes) +
                      size(questionInfomation.optionTwo.votes))) *
                    100
                )}
                steps={
                  size(questionInfomation.optionOne.votes) +
                  size(questionInfomation.optionTwo.votes)
                }
                format={(percent) => `${percent}%`}
                strokeColor={red[5]}
              />
            </div>
          ) : (
            <Skeleton />
          )}
        </Layout>
      </Content>
    </Layout>
  );
};

export default PageDetailQuestion;
