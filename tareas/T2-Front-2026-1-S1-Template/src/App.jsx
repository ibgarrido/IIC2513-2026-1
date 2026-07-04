import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login/Login";
import ArtistMarketPage from "./pages/ArtistMarketPage/ArtistMarketPage";
import MyArtistsPage from "./pages/MyArtistsPage/MyArtistsPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MyReviewsPage from "./pages/MyReviewsPage/MyReviewsPage";
import Landing from "./pages/Landing/Landing";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/mercado" element={<ArtistMarketPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/mis-artistas" element={<MyArtistsPage />} />
              <Route path="/mis-reviews" element={<MyReviewsPage />} />
              <Route path="/perfil" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
