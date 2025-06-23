import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import RequireAuth from './auth/RequireAuth.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import Devices from './pages/Devices.jsx';
import CreateDevice from './pages/CreateDevice.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />
          <Route path="/devices" element={
            <RequireAuth>
              <Devices />
          </RequireAuth>
          } />
          <Route path="/create-device" element={
            <RequireAuth>
              <CreateDevice />
            </RequireAuth>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
