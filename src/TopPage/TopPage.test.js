import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import TopPage from "./TopPage";
import userEvent from "@testing-library/user-event";
import * as ReactRedux from "react-redux";
import * as userActions from "../Reducers/usersaction";
import { MemoryRouter } from "react-router-dom";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

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
  Layout: { Header: ({ children }) => <header>{children}</header> },
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
  Button: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock("../Reducers/usersaction", () => ({
  resetUserData: jest.fn(),
}));

describe("Header", () => {
  let store;
  let mockDispatch;
  const mockNavigate = jest.fn();

  const mockSessionStorage = (isAuthenticated) => {
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: jest.fn(() =>
          isAuthenticated
            ? '{"name": "Test User", "avatarURL": "avatar.png"}'
            : null
        ),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  };

  beforeEach(() => {
    store = mockStore({});
    jest.useFakeTimers();
    mockDispatch = jest.fn();
    jest.spyOn(ReactRedux, "useDispatch").mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders the header and avatar", () => {
    mockSessionStorage(true);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TopPage />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByRole("heading", { name: "Employee Polls" })
    ).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Leader board")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByTestId("avatar")).toHaveAttribute("src", "avatar.png");
  });

  it("does not render user name and avatar when not logged in", () => {
    mockSessionStorage(false);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TopPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText("Test User")).toBeNull();
    expect(screen.getByTestId("avatar")).not.toHaveAttribute(
      "src",
      "avatar.png"
    );
  });

  it("dispatches resetUserData and navigates to Login page on logout", async () => {
    mockSessionStorage(true);

    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/some-page"]}>
          <TopPage />
        </MemoryRouter>
      </Provider>
    );

    userEvent.click(screen.getByText("Log Out"));
    jest.runAllTimers();

    await waitFor(() => {
      expect(sessionStorage.removeItem).toHaveBeenCalledWith("sessionLogin");
    });
    await waitFor(() => {
      expect(userActions.resetUserData).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
