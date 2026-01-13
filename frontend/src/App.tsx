import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProductPage from './ProductPage/ProductPage';
import HomePage from './HomePage/HomePage';
import FriendsPage from './FriendsPage/FriendsPage';
import ProfilePage from './ProfilePage/ProfilePage';
import RankingPage from './RankingPage/RankingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import GenderPage from './pages/GenderPage';
import ArticlePage from './pages/ArticlePage';
import BrandPage from './pages/BrandPage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/rankings" element={<RankingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Gender pages */}
          <Route path="/male" element={<GenderPage />} />
          <Route path="/female" element={<GenderPage />} />
          <Route path="/unisex" element={<GenderPage />} />
          {/* Brand page */}
          <Route path="/brand/:brand" element={<BrandPage />} />
          {/* Article pages */}
          <Route path="/article/paco-rabanne" element={<ArticlePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
