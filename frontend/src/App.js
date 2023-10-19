import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminSettingPage from "./pages/AdminSettingPage";
import CheckPasswdPage from "./pages/CheckPasswdPage";
import MenuReportPage from "./pages/MenuReportPage";
import SelectMenuPage from "./pages/SelectMenuPage";
import TotalReportPage from "./pages/TotalReportPage";
import ChooseReportPage from "./pages/ChooseReportPage";
import VisualizeGazePage from "./pages/VisualizeGazePage";
import BenefitManagePage from "./pages/BenefitManagePage";
import MenuPlacementPage from "./pages/MenuPlacementPage";
import StoreManagePage from "./pages/StoreManagePage";
import StoreSettingPage from "./pages/StoreSettingPage";
import OrderManagePage from "./pages/OrderManagePage";
import MenuManagePage from "./pages/MenuManagePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import VisualizeNoBackground from "./pages/VisualizeGazeNoBackground";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-setting" element={<AdminSettingPage />} />
        <Route path="/check-passwd" element={<CheckPasswdPage />} />
        <Route path="/menu-report" element={<MenuReportPage />} />
        <Route path="/select-menu" element={<SelectMenuPage />} />
        <Route path="/total-report" element={<TotalReportPage />} />
        <Route path="/choose-report" element={<ChooseReportPage />} />
        <Route path="/gaze-visualize" element={<VisualizeGazePage />} />
        <Route
          path="/gaze-visualize-no-background"
          element={<VisualizeNoBackground />}
        />
        <Route path="/benefit-manage" element={<BenefitManagePage />} />
        <Route path="/menu-placement" element={<MenuPlacementPage />} />
        <Route path="/store-manage" element={<StoreManagePage />} />
        <Route path="/store-setting" element={<StoreSettingPage />} />
        <Route path="/order-manage" element={<OrderManagePage />} />
        <Route path="/menu-manage" element={<MenuManagePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
