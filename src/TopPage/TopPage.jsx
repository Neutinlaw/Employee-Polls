import React, { useEffect, useState, startTransition } from "react";
import { Layout, Menu, Space, Typography, Button, Avatar } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./TopPage.css";
import { PoweroffOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { resetUserData } from "../Reducers/usersaction";
const { Header: AntHeader } = Layout;
const { Title } = Typography;
const menuItems = [
  {
    key: "question",
    label: <Link to={"/questions"}>Home</Link>,
  },
  {
    key: "leaderboard",
    label: <Link to={"/leaderboard"}>Leader board</Link>,
  },
  {
    key: "add",
    label: <Link to={"/add"}>New</Link>,
  },
];

const TopPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("sessionLogin");
    startTransition(() => {
    dispatch(resetUserData());
    })
    setTimeout(() => navigate("/login"), 100);
  };

  useEffect(() => {
    const sessionLogin = sessionStorage.getItem("sessionLogin");
    if (sessionLogin) {
      setUserInfo(JSON.parse(sessionLogin));
    }
  }, []);

  return (
    <AntHeader className="header">
      <div className="logo">
        <Title level={3}>
          <Link to={"/questions"}>Employee Polls</Link>
        </Title>
      </div>
      <Menu
        mode="horizontal"
        items={menuItems}
        selectedKeys={[location.pathname]}
        defaultSelectedKeys={["/questions"]}
      />
      <Space className="header-buttons">
        <Avatar
          src={userInfo?.avatarURL}
          icon={<UserOutlined />}
          alt={userInfo?.name}
        />
        <span>{userInfo?.name}</span>
        <Button type="link" icon={<PoweroffOutlined />} onClick={handleLogout}>
          Log Out
        </Button>
      </Space>
    </AntHeader>
  );
};

export default TopPage;
