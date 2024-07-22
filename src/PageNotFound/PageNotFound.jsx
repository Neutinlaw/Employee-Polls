import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./PageNotFound.css";
import TopPage from "../TopPage/TopPage";


const PageNotFound = () => {
  const navigate = useNavigate();

  const btnContactClick = () => {
    window.location.href = "mailto:tunglevan1994@gmail.com";
  };

  return (
    <div className="not-found-page">
      <TopPage />
      <div className="not-found-container">
        <Result
          status="404"
          title="Page Not Found!"
          subTitle="Page Not Found. You can back and login!"
          extra={[
            <Button
              type="primary"
              key="home"
              onClick={() => navigate("/questions")}
            >
              Go back to the home page
            </Button>,
            <Button key="contact" onClick={btnContactClick}>
              Contact us
            </Button>,
          ]}
        />
      </div>
    </div>
  );
};
export default PageNotFound;
