import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { BookingProvider } from "./contexts/BookingContext";
import {
  publicRoutes,
  adminRoutes,
  managerRoutes,
  employeeRoutes,
} from "./routes/routes";
import ProtectedRoute from "./utils/ProtectedRoute";
import SeatStatusWrapper from "./SeatStatusWrapper.js";
import { RouteGuard } from "./utils/RouteGuard";
import AdminLayout from "./components/Admin/AdminLayout.js";
import ManagerLayout from "./components/Manager/ManagerLayout.js";
import EmployeeLayout from "./components/Employee/EmployeeLayout.js";
import RedirectIfAuthenticated from "./utils/RedirectIfAuthenticated.js";
function App() {
  return (
    <div className="App font-inter">
      <Router>
        <AuthProvider>
          <BookingProvider>
            <SeatStatusWrapper>
              <Routes>
                {/* Admin Routes */}
                {adminRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <RouteGuard allowedRoles={route.roles}>
                        <AdminLayout>
                          <route.component />
                        </AdminLayout>
                      </RouteGuard>
                    }
                  />
                ))}
                {/* Manager Routes */}
                {managerRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <RouteGuard allowedRoles={route.roles}>
                        <ManagerLayout>
                          <route.component />
                        </ManagerLayout>
                      </RouteGuard>
                    }
                  />
                ))}
                {/* Employee Routes */}
                {employeeRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <RouteGuard allowedRoles={route.roles}>
                        <EmployeeLayout>
                          <route.component />
                        </EmployeeLayout>
                      </RouteGuard>
                    }
                  />
                ))}

                {/* Public Routes */}
                {publicRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      route.authRoute ? (
                        <RedirectIfAuthenticated>
                          <Layout>
                            <route.component />
                          </Layout>
                        </RedirectIfAuthenticated>
                      ) : (
                        <RouteGuard allowedRoles={route.roles}>
                          <Layout>
                            <route.component />
                          </Layout>
                        </RouteGuard>
                      )
                    }
                  />
                ))}
              </Routes>
            </SeatStatusWrapper>
          </BookingProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}
export default App;
