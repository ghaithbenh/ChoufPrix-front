import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import TrackedItems from './pages/TrackedItems';
import AddProduct from './pages/AddProduct';
import MyProducts from './pages/MyProducts';
import Marketplace from './pages/Marketplace';
import AdminUsers from './pages/AdminUsers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracked" element={<TrackedItems />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/my-products" element={<MyProducts />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
