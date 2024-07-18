import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { thunk } from "redux-thunk";
import PageLeaderBoard from "./PageLeaderBoard";
import * as ReactRedux from "react-redux";
import * as userActions from "../Reducers/usersaction";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Menu: ({ items, selectedKeys }) => (
    <ul>
      {items.map((item) => (
        <li
          key={item.key}
          data-testid={item.key}
          className={item.key === selectedKeys[0] ? "active" : ""}
        >
          {item.label}
        </li>
      ))}
    </ul>
  ),
  Space: ({ children }) => <div>{children}</div>,
  Avatar: ({ src, icon, alt }) => (
    <img src={src} alt={alt} data-testid="avatar" />
  ),
  Typography: { Title: ({ children }) => <h1>{children}</h1> },
  Table: ({ columns, dataSource }) => (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key || col.dataIndex}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td>
              <div>
                <img
                  src={row.user.avatarURL}
                  alt="avatar"
                  data-testid="avatar"
                />
                <div>
                  <span>{row.user.userId}</span>
                  <span>{row.user.name}</span>
                </div>
              </div>
            </td>
            <td key={`${row.user.id}${rowIndex}`}>{row.answered}</td>
            <td key={`${row.user.id}${rowIndex + 1}`}>{row.created}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

describe("PageLeaderBoard", () => {
  let store;
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    jest.spyOn(ReactRedux, "useDispatch").mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeleton initially", async () => {
    store = mockStore({});
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <PageLeaderBoard />
        </MemoryRouter>
      </Provider>
    );

    const skeletonItems = container.querySelectorAll(".ant-skeleton");
    expect(skeletonItems).toHaveLength(1);
  });

  it("renders leaderboard table with user data", async () => {
    const mockData = [
      {
        id: "user1",
        userId: "user1",
        name: "User 1",
        avatarURL: "avatar1.jpg",
        answers: { q1: "optionOne", q2: "optionTwo" },
        questions: ["q1"],
      },
      {
        id: "user2",
        userId: "user2",
        name: "User 2",
        avatarURL: "avatar2.jpg",
        answers: { q3: "optionTwo" },
        questions: ["q2", "q3"],
      },
    ];
    store = mockStore({
      userState: {
        allUser: mockData,
      },
    });

    jest
      .spyOn(ReactRedux, "useSelector")
      .mockImplementation((selector) => selector(store.getState()));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PageLeaderBoard />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Answered")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("user1")).toBeInTheDocument();
    expect(screen.getByText("User 2")).toBeInTheDocument();
    expect(screen.getByText("user2")).toBeInTheDocument();
  });

  it("dispatches fetchAllUser action on mount", () => {
    const fetchAllUserSpy = jest.spyOn(userActions, "fetchAllUser");

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PageLeaderBoard />
        </MemoryRouter>
      </Provider>
    );

    expect(fetchAllUserSpy).toHaveBeenCalledTimes(1);
  });

  it("matches snapshot", async () => {
    const mockData = [
      {
        id: "user1",
        userId: "user1",
        name: "User 1",
        avatarURL: "avatar1.jpg",
        answers: { q1: "optionOne", q2: "optionTwo" },
        questions: ["q1"],
      },
      {
        id: "user2",
        userId: "user2",
        name: "User 2",
        avatarURL: "avatar2.jpg",
        answers: { q3: "optionTwo" },
        questions: ["q2", "q3"],
      },
    ];
    store = mockStore({
      userState: {
        allUser: mockData,
      },
    });

    jest
      .spyOn(ReactRedux, "useSelector")
      .mockImplementation((selector) => selector(store.getState()));

    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <PageLeaderBoard />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => screen.findByText("Users"));

    expect(container).toMatchSnapshot();
  });
});
