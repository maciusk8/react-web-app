import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductPage from './ProductPage/ProductPage';
import HomePage from './HomePage/HomePage';
import FriendsPage from './FriendsPage/FriendsPage';
import ProfilePage from './ProfilePage/ProfilePage';
import RankingPage from './RankingPage/RankingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/rankings" element={<RankingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
