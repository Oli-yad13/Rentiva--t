import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { VehiclesPage } from "./pages/VehiclesPage";
import { VehicleDetailsPage } from "./pages/VehicleDetailsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { BookingPage } from "./pages/BookingPage";
import { LoginPage, SignUpPage, ForgotPasswordPage, ResetPasswordPage } from "./pages/AuthPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AddCarPage } from "./pages/AddCarPage";
import { MyCarsPage } from "./pages/MyCarsPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { EditCarPage } from "./pages/EditCarPage";
import { preloadCriticalImages } from "./utils/imageCache";
import { NotificationProvider } from "./hooks/useNotifications";

export const App = (): JSX.Element => {
  useEffect(() => {
    // Preload critical images on app start
    preloadCriticalImages();
  }, []);

  return (
    <NotificationProvider>
      <Routes>
        {/* Auth routes without layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Main app routes with layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/add-car" element={<AddCarPage />} />
              <Route path="/my-cars" element={<MyCarsPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/edit-car/:id" element={<EditCarPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </NotificationProvider>
  );
};