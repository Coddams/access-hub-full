import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminUsers from "./pages/admin/Users";
import AdminRoles from "./pages/admin/Roles";
import AdminLogs from "./pages/admin/Logs";
import AdminSystem from "./pages/admin/System";
import ManagerTeam from "./pages/manager/Team";
import ManagerReports from "./pages/manager/Reports";
import ManagerActivity from "./pages/manager/Activity";
import UserActivity from "./pages/user/Activity";
import UserResources from "./pages/user/Resources";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forbidden" element={<Forbidden />} />

            {/* Protected Routes with Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Dashboard />} />
              <Route path="/notifications" element={<Dashboard />} />

              {/* Admin Routes */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/roles"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminRoles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/logs"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/system"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminSystem />
                  </ProtectedRoute>
                }
              />

              {/* Manager Routes */}
              <Route
                path="/manager/team"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <ManagerTeam />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/reports"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <ManagerReports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/manager/activity"
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <ManagerActivity />
                  </ProtectedRoute>
                }
              />

              {/* User Routes */}
              <Route
                path="/user/activity"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserActivity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/resources"
                element={
                  <ProtectedRoute allowedRoles={['user']}>
                    <UserResources />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
