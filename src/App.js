import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminPage from "./pages/AdminPage";
import DetailAnalysisPage from "./pages/DetailAnalysisPage";
import AnalysisPage from "./pages/AnalysisPage";
import BenefitManagePage from "./pages/BenefitManagePage";
import MenuPosRecPage from "./pages/MenuPosRecPage";
import StoreManagePage from "./pages/StoreManagePage";
import OrderManagePage from "./pages/OrderManagePage";
import MenuManagePage from "./pages/MenuManagePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/analysis-detail" element={<DetailAnalysisPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/benefit-manage" element={<BenefitManagePage />} />
        <Route path="/menu-position" element={<MenuPosRecPage />} />
        <Route path="/store-manage" element={<StoreManagePage />} />
        <Route path="/order-manage" element={<OrderManagePage />} />
        <Route path="/menu-manage" element={<MenuManagePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
