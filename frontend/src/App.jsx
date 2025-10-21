import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import Login from './pages/Login.jsx';
import EmailVerification from './pages/EmailVerification.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Dashboard from './pages/UserDashboard.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import UserLayout from './layouts/UserLayout.jsx';
import RoleRoutesCheck from './helper/RoleRoutesCheck.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Home from "./pages/Home.jsx";
import QuestionBank from "./pages/QuestionBank.jsx";

function App() {
    return (
            <AuthProvider>
                <Routes>
                    {/* login form */}
                    <Route path="/login" element={<Login />} />
                    {/* email verification */}
                    <Route path="/verify-email" element={<EmailVerification />} />
                    {/* User branch */}
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

                    {/* Admin branch */}
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

                    {/* Default route - redirect to login for now*/}
                    {/* !! UNCOMMENT THE BELOW LINE ONCE DONE EDITING THE HOME */}
                    {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/" element={<QuestionBank />} />
                </Routes>
            </AuthProvider>

    );
}

export default App;
