import React, { useEffect, startTransition } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";
import { fetchUser, fetchAllUser } from "../Reducers/usersaction";
import LoginImage from "../images/blog-image-Employee-Engagement-Survey-01.png";
import { resetUserData } from "../Reducers/usersaction";
import { map } from "lodash";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = useSelector((state) => state.userState.user);
  const allUser = useSelector((state) => state.userState.allUser);
  const loadingpage = useSelector((state) => state.userState.loadingpage);

  const onSubmit = (values) => {
    startTransition(() => {
      dispatch(fetchUser(values));
    });
  };

  useEffect(() => {
    dispatch(fetchAllUser());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.id) {
        sessionStorage.setItem("sessionLogin", JSON.stringify(userInfo));
        if (location.state?.from) {
          navigate(location.state.from, { state: { usr: true } });
        } else {
          navigate("/questions", { state: { usr: true } });
        }
      } else {
        message.error("Login failled!");
        dispatch(resetUserData());
      }
    }
  }, [dispatch, navigate, userInfo]);

  const filterOption = (input, option) =>
    option?.label?.toLowerCase().includes(input.toLowerCase());

  return (
    <div className="login-container ">
      <h1 className="text-center">Employee polls</h1>
      <img
        className="employee-image"
        src={LoginImage}
        aria-label="Sign in image"
      />
      <h2 className="text-center">Login</h2>
      <Form
        name="login"
        layout="vertical"
        className="login-form"
        initialValues={{ remember: true }}
        style={{ width: "300px" }}
        onFinish={onSubmit}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Select
            showSearch
            placeholder="Please select user!"
            optionFilterProp="children"
            filterOption={filterOption}
            options={map(allUser, (user) => ({
              value: user.id,
              label: user.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loadingpage} block>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
