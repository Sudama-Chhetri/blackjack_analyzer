import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import BlackjackAnalyzer from './BlackjackAnalyzer';
import AnalyticsDashboard from './AnalyticsDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyzer" element={<BlackjackAnalyzer />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;