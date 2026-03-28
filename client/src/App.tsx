import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardOverviewPage from "./pages/DashboardOverviewPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import NutritionPage from "./pages/NutritionPage";
import ProfilePage from "./pages/ProfilePage";
import ActiveWorkoutPage from "./pages/ActiveWorkoutPage";
import GymsPage from "./pages/GymsPage";
import {
  AdminUsersPage,
  AdminExercisesPage,
  AdminFoodsPage,
} from "./pages";
import { ProtectedRoute, useAuth } from "./features/auth";

function DashboardEntryRoute() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return <Navigate to="/admin/users" replace />;
  }

  return <DashboardOverviewPage />;
}

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
            <DashboardEntryRoute />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
            <Navigate to="/admin/users" replace />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/exercises"
        element={
          <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
            <AdminExercisesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/foods"
        element={
          <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
            <AdminFoodsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]} redirectTo="/dashboard">
            <Navigate to="/admin/users" replace />
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