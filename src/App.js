import './App.css';
import React from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
const LoginPage = React.lazy(() => import("./LoginPage/LoginPage"));
const PageQuestions = React.lazy(() => import("./PageQuestions/PageQuestions"));
const PageDetailQuestion = React.lazy(() =>
  import("./PageDetailQuestion/PageDetailQuestion"));
const PageNewQuestion = React.lazy(() =>
  import("./NewQuestion/PageNewQuestion")
);
const PageLeaderBoard = React.lazy(() =>
  import("./PageLeaderBoard/PageLeaderBoard")
);
const PageNotFound = React.lazy(() => import("./PageNotFound/PageNotFound"));

const App = () => {
  const location = useLocation();
  const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!sessionStorage.getItem("sessionLogin");
    return isAuthenticated ? (
      <Outlet />
    ) : (
      <Navigate to={"/login"} replace state={{ from: location }} />
    );
  };
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
}

export default App;
