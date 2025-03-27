import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Chat from "./aichat/Chat.tsx/index.js";
import StockProfile from "./stockprofile/StockProfile.tsx";
import VideoInsights from "./insight/VideoInsights.tsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/stockprofile" element={<StockProfile />} />
        <Route path="/insights" element={<VideoInsights />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
