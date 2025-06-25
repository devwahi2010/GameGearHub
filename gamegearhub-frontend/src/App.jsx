// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Devices from './pages/Devices.jsx';
import CreateDevice from './pages/CreateDevice.jsx';
import MyRentals from './pages/MyRentals.jsx';
import ManageRequests from './pages/ManageRequests.jsx';
import Chat from './pages/Chat.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DeviceDetail from './pages/DeviceDetail.jsx';
import OwnerProfile from './pages/OwnerProfile.jsx';
import Explore from './pages/Explore.jsx';
import RequireAuth from './auth/RequireAuth.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import AppNavbar from './components/Navbar.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/explore" element={<Explore />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/devices" element={<RequireAuth><Devices /></RequireAuth>} />
          <Route path="/devices/:id" element={<RequireAuth><DeviceDetail /></RequireAuth>} />
          <Route path="/create-device" element={<RequireAuth><CreateDevice /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/my-rentals" element={<RequireAuth><MyRentals /></RequireAuth>} />
          <Route path="/manage-requests" element={<RequireAuth><ManageRequests /></RequireAuth>} />
          <Route path="/chat/:requestId" element={<RequireAuth><Chat /></RequireAuth>} />
          <Route path="/owner/:ownerId" element={<RequireAuth><OwnerProfile /></RequireAuth>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
