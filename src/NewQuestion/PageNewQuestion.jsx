import React, { useEffect, useState, startTransition } from "react";
import "./PageNewQuestion.css";
import { Form, Input, Button, Typography, Layout, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewQuestion,
  resetAddQuestionData,
} from "../Reducers/questionsaction.js";
import { clearError } from "../Reducers/usersaction.js";
import { useNavigate } from "react-router-dom";
import TopPage from "../TopPage/TopPage";

const { Title } = Typography;
const { Content } = Layout;

const PageNewQuestion = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const loading = useSelector((state) => state.questionsState.loading);
  const error = useSelector((state) => state.questionsState.error);
  const newQuestionInfo = useSelector(
    (state) => state.questionsState.newQuestionInfo
  );

  const onFinish = (values) => {
    const { optionOneText, optionTwoText } = values;
    const question = {
      author: user?.id,
      optionOneText,
      optionTwoText,
    };
    startTransition(() => {
      dispatch(addNewQuestion(question));
    })
  };

  useEffect(() => {
    const sessionLogin = sessionStorage.getItem("sessionLogin");
    if (sessionLogin) {
      setUser(JSON.parse(sessionLogin));
    }
  }, []);

  useEffect(() => {
    if (newQuestionInfo) {
      if (newQuestionInfo.id) {
        navigate("/questions");
      } else {
        message.error("Add question failed!");
      }
      startTransition(() => {
        dispatch(resetAddQuestionData());
      })
    }
  }, [newQuestionInfo, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      message.error(error);
      startTransition(() => {
        dispatch(clearError());
      })
    }
  }, [dispatch, error]);

  return (
    <Layout className="add-question">
      <TopPage />
      <Content>
        <Title level={2}>Would You Rather</Title>
        <span className="decription text-secondary">Create Your Own Poll</span>
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="First Option"
            name="optionOneText"
            rules={[{ required: true, message: "Please enter First Option!" }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Second Option"
            name="optionTwoText"
            rules={[{ required: true, message: "Please enter Second Option!" }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default PageNewQuestion;
