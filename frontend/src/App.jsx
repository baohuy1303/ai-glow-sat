import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
                        <RoleRoutesCheck>
                            <UserLayout />
                        </RoleRoutesCheck>
                    }
                >
                    <Route path="/user/home" element={<Dashboard />} />
                </Route>
                {/* admin dashboard */}
                <Route
                    path="/admin"
                    element={
                        <RoleRoutesCheck>
                            <AdminLayout />
                        </RoleRoutesCheck>
                    }
                >
                    <Route path="/admin/home" element={<AdminDashboard />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
