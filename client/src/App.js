import './App.css';
import { Route, Routes } from "react-router-dom";
import Homepage from './pages/Homepage';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Meeting from './pages/Meeting';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="App">
     <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
    </div>
  );
}

export default App;
