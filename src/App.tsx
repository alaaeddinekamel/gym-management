import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/Dashboard';
import { Store } from './pages/store/Store';
import { Cart } from './pages/store/Cart';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Schedule } from './pages/schedule/Schedule';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/store" element={<Store />} />
              <Route path="/cart" element={<Cart />} />
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;