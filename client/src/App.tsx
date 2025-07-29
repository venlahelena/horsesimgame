// src/App.tsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import StableView from "./components/StableView/StableView";
import HorseDetail from "./components/StableView/HorseDetail/HorseDetail";

function App() {
  return (
    <div>
      <h1>Stableworks</h1>
      <Routes>
        <Route path="/" element={<StableView />} />
        <Route path="/horse/:id" element={<HorseDetail />} />
      </Routes>
    </div>
  );
}

export default App;
