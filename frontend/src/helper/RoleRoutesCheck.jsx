import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

function RoleRoutesCheck({ children, requiredRole }) {
    const { currentUser, loading, role } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (!currentUser.emailVerified) {
        return <Navigate to="/verify-email" replace />;
    }
    
    // Wait for role to be loaded
    if (role === null) {
        return <div>Loading user permissions...</div>;
    }

    console.log('Current role:', role, 'Required role:', requiredRole);

    if (role !== requiredRole) {
        return (
            <>
                <h1>You are not authorized to access this page</h1>
                <button onClick={() => navigate('/login')}>Login</button>
            </>
        );
    }

    return children;
}

export default RoleRoutesCheck;