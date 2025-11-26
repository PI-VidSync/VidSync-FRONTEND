import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CreateMeetingPage from './pages/CreateMeetingPage';
import JoinMeetingPage from './pages/JoinMeetingPage';
import ProfilePage from './pages/profile/ProfilePage';
// import EditProfilePage from './pages/EditProfilePage';
import HomePage from './pages/home/HomePage';
import IntoMeeting from './pages/IntoMeeting';

import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';
import { ToastContainer } from './components/ui/toast';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/create-meeting" element={<CreateMeetingPage />} />
              <Route path="/join-meeting" element={<JoinMeetingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* <Route path="/profile/edit" element={<EditProfilePage />} /> */}
              <Route path="/meeting/:meetingCode" element={<IntoMeeting />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;