import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Componentes
import Navbar from "./components/Navbar";

// Vistas (Páginas)
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import Register from "./pages/Register";
import DocsPage from "./pages/DocsPage";
import Catalog from "./pages/Catalog";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
        {/* Rutas públicas (accesibles para todos) */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="*" element={<Landing />} />

        {/* RUTAS SÓLO PARA ANÓNIMOS (Si entras logueado, te rebota al catálogo) */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />

        {/* Rutas protegidas (si entras deslogueado, te rebota al landing) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <Catalog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
