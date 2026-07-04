import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ArtistMarketPage from "./pages/ArtistMarketPage/ArtistMarketPage";
import MyArtistsPage from "./pages/MyArtistsPage/MyArtistsPage";
import Landing from "./pages/Landing/Landing";
// import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import "./App.css";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mercado" element={<ArtistMarketPage />} />
          <Route path="/mis-artistas" element={<MyArtistsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
