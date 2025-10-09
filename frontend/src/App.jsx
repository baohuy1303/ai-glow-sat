import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import Login from './pages/Login.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import UserLayout from './layouts/UserLayout.jsx';
import RoleRoutesCheck from './helper/RoleRoutesCheck.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

function App() {
    return (
            <AuthProvider>
                <Routes>
                    {/* login form */}
                    <Route path="/login" element={<Login />} />
                    {/* dashboard */}
                    <Route
                        path="/user"
                        element={
                            <RoleRoutesCheck requiredRole="user">
                                <UserLayout />
                            </RoleRoutesCheck>
                        }
                    >
                        <Route index element={<Dashboard />} />
                    </Route>

                    {/* admin dashboard */}
                    <Route
                        path="/admin"
                        element={
                            <RoleRoutesCheck requiredRole="admin">
                                <AdminLayout />
                            </RoleRoutesCheck>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                    </Route>

                    {/* Default route - redirect to login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>

    );
}

export default App;
