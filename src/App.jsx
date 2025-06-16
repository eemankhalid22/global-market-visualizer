import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GDPChart from "./components/GDPChart";
import GDPInflation from "./components/GDPInflation";
import CurrencyConverter from "./components/CurrencyConverter";
import GenderSustainabilityChart from "./components/GenderSustainabilityChart";
import WorldMap from "./components/WorldMap";
import MarketNewsFeed from "./components/MarketNewsFeed";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gdp-chart" element={<GDPChart />} />
      <Route path="/gdp-inflation" element={<GDPInflation />} />
      <Route path="/currency" element={<CurrencyConverter />} />
      <Route path="/sustainability" element={<GenderSustainabilityChart />} />
      <Route path="/map" element={<WorldMap />} />
      <Route path="/news" element={<MarketNewsFeed />} />
    </Routes>
  );
}

export default App;
