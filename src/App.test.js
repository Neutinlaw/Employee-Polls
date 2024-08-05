import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import * as ReactRedux from "react-redux";
import App from "./App";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("./PageQuestions/PageQuestions", () => () => (
  <div>Page Questions</div>
));
jest.mock("./LoginPage/LoginPage", () => () => <div>Login Page</div>);

describe("App", () => {
  let store;

  const mockSessionStorage = (isAuthenticated) => {
    Object.defineProperty(window, "sessionStorage", {
      value: {
        getItem: jest.fn(() => (isAuthenticated ? "sessionLogin" : null)),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  };

  beforeEach(() => {
    store = mockStore({});
    jest.spyOn(ReactRedux, "useDispatch").mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Page Questions when authenticated", async () => {
    mockSessionStorage(true);
    render(
      <MemoryRouter initialEntries={["/questions"]}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => screen.findByText("Page Questions"));
    expect(screen.getByText("Page Questions")).toBeInTheDocument();
  });

  it("redirects to Login Page when not authenticated", async () => {
    mockSessionStorage(false);
    render(
      <MemoryRouter initialEntries={["/questions"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => screen.findByText("Login Page"));
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
