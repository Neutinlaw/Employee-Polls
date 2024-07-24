import "./App.css";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetUserData } from "./Reducers/usersaction";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
  useNavigate,
  useNavigationType,
} from "react-router-dom";
const LoginPage = React.lazy(() => import("./LoginPage/LoginPage"));
const PageQuestions = React.lazy(() => import("./PageQuestions/PageQuestions"));
const PageDetailQuestion = React.lazy(() =>
  import("./PageDetailQuestion/PageDetailQuestion")
);
const PageNewQuestion = React.lazy(() =>
  import("./NewQuestion/PageNewQuestion")
);
const PageLeaderBoard = React.lazy(() =>
  import("./PageLeaderBoard/PageLeaderBoard")
);
const PageNotFound = React.lazy(() => import("./PageNotFound/PageNotFound"));

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigationType = useNavigationType();

  const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!sessionStorage.getItem("sessionLogin");
    return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} replace />;
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sessionLogin");
    dispatch(resetUserData());
    setTimeout(
      () =>
        navigate("/login", {
          state: {
            from: location.pathname !== "/login" ? location.pathname : "",
          },
        }),
      100
    );
  };

  useEffect(() => {
    if (
      navigationType === 'POP' &&
      !navigate.state &&
      !location.state?.usr
    ) {
      handleLogout();
    }
  }, [location, navigate, navigationType]);

  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path={"/questions"} element={<PageQuestions />} />
        <Route path={"/questions/:id"} element={<PageDetailQuestion />} />
        <Route path={"/add"} element={<PageNewQuestion />} />
        <Route path={"/leaderboard"} element={<PageLeaderBoard />} />
      </Route>
      <Route path="/" element={<Navigate to={"/login"} />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path={"/login"} element={<LoginPage />} />
      <Route path={"/page-not-found"} element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
