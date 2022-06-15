import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useWindowDimensions from "./utils/windowDimension";
import MobileView from "./Mobile";
import WebView from "./Web";

const App = () => {
  const { width } = useWindowDimensions();

  return (
    <>
      {width < 769 ? <MobileView /> : <WebView />}

      <div id="modal-root" />
      <ToastContainer position="top-center" theme="dark" autoClose={1000} />
    </>
  );
};

export default App;
