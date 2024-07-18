import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

jest.mock("./PageQuestions/PageQuestions", () => () => (
  <div>Page Questions</div>
));
jest.mock("./LoginPage/LoginPage", () => () => <div>Login Page</div>);

describe("App", () => {
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
