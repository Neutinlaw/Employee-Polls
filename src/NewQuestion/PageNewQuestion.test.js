import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { MemoryRouter } from "react-router-dom";
import PageNewQuestion from "./PageNewQuestion";
import * as questionsaction from "../Reducers/questionsaction";
import { message } from "antd";
import * as ReactRedux from "react-redux";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("../Reducers/questionsaction", () => ({
  addNewQuestion: jest.fn(() => Promise.resolve(true)),
  resetAddQuestionData: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("antd/lib/form/FormItem", () => ({
  __esModule: true,
  default: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

jest.mock("../TopPage/TopPage", () => ({
  __esModule: true,
  default: () => <div>Mock Header</div>,
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

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("PageNewQuestion", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      questionsState: {
        questions: [],
        loading: false,
        error: null,
        newQuestionInfo: null,
      },
      usersState: {
        userInfo: {
          id: "user1",
          userId: "user1",
          questions: ["q1"],
        },
      },
    });

    Storage.prototype.getItem = jest.fn(
      () =>
        '{"id": "user1","userId": "user 1","questions": "[]", "name": "Test User", "avatarURL": "avatar.png"}'
    );
    Storage.prototype.removeItem = jest.fn();

    jest.spyOn(message, "error").mockImplementation(() => {});

    jest
      .spyOn(ReactRedux, "useSelector")
      .mockImplementation((selector) => selector(store.getState()));

    jest.spyOn(ReactRedux, "useDispatch").mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the PageNewQuestion component correctly", async () => {
    const {container} =  render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/add"]}>
          <PageNewQuestion />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Would You Rather")).toBeInTheDocument();
    expect(screen.getByText("Create Your Own Poll")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByRole("textbox")).toHaveLength(2);
    });

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("submits the form and dispatches addQuestion", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/add"]}>
          <PageNewQuestion />
        </MemoryRouter>
      </Provider>
    );

    const textAreas = screen.getAllByRole("textbox");
    const firstOptionTextArea = textAreas[0];
    const secondOptionTextArea = textAreas[1];
    fireEvent.change(firstOptionTextArea, { target: { value: "Option 1" } });
    fireEvent.change(secondOptionTextArea, { target: { value: "Option 2" } });

    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(questionsaction.addNewQuestion).toHaveBeenCalled();
    });
  });
});
