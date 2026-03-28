import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardOverviewPage from "./pages/DashboardOverviewPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import NutritionPage from "./pages/NutritionPage";
import ProfilePage from "./pages/ProfilePage";
import ActiveWorkoutPage from "./pages/ActiveWorkoutPage";
import GymsPage from "./pages/GymsPage";
import { ProtectedRoute } from "./features/auth";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardOverviewPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workouts"
        element={
          <ProtectedRoute>
            <WorkoutsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/nutrition"
        element={
          <ProtectedRoute>
            <NutritionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workout-session/:sessionId"
        element={
          <ProtectedRoute>
            <ActiveWorkoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/gyms"
        element={
          <ProtectedRoute>
            <GymsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}