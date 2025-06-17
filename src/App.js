import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/home";
import UserPage from "./pages/userPage";
import Navbar from './components/navbar';
import ProductsPage from "./pages/productsPage";

import BucketsPage from './pages/BucketsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/buckets" element={<BucketsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;