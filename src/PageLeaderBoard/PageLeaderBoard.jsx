import React, { useEffect, useState, startTransition } from "react";
import { Avatar, Layout, Skeleton, Table } from "antd";
import "./PageLeaderBoard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUser } from "../Reducers/usersaction";
import { reduce, concat, size, sortBy } from "lodash";
import { UserOutlined } from "@ant-design/icons";
import TopPage from "../TopPage/TopPage";

const { Content } = Layout;

const columns = [
  {
    title: "Users",
    dataIndex: "user",
    key: "user",
    render: (_, { user }) => (
      <div className="user-contain">
        <Avatar
          src={user?.avatarURL}
          icon={<UserOutlined />}
          alt={user?.name}
        />
        <div className="user-info">
          <span className="fw-bold">{user?.name}</span>
          <span className="small text-secondary">{user?.userId}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Answered",
    dataIndex: "answered",
    key: "answered",
  },
  {
    title: "Created",
    dataIndex: "created",
    key: "created",
  },
];

const PageLeaderBoard = () => {
  const dispatch = useDispatch();
  const [leaderBoard, setLeaderBoard] = useState(null);
  const allUser = useSelector((state) => state.userState.allUser);

  useEffect(() => {
    if (allUser) {
      const data = reduce(
        allUser,
        (result = [], user) => {
          return concat(result, {
            key: user.id,
            user,
            answered: Object.keys(user.answers).length,
            created: size(user.questions),
          });
        },
        []
      );
      sortBy(data, ["answered", "created"]);
      setLeaderBoard(data);
    }
  }, [allUser]);

  useEffect(() => {
    startTransition(() => {
      dispatch(fetchAllUser());
    })
  }, [dispatch]);

  return (
    <Layout className="leader-board-page">
      <TopPage />
      <Content className="p-4">
      {leaderBoard ? (
        <Table columns={columns} dataSource={leaderBoard} bordered />
      ) : (
        <Skeleton />
      )}
    </Content>
    </Layout>
  );
};

export default PageLeaderBoard;
