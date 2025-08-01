import "./App.css";
import { Routes, Route } from "react-router-dom";
import StableView from "./pages/StableView/StableView";
import HorseDetail from "./pages/HorseDetail";
import TopNavigation from "./components/layout/TopNaviagtion/TopNavigation";
import MarketView from "./pages/MarketView/MarketView";

function App() {
  return (
    <div>
      <TopNavigation />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<StableView />} />
          <Route path="/horse/:id" element={<HorseDetail />} />
          <Route path="/market" element={<MarketView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;