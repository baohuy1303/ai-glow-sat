import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function RoleRoutesCheck({ children }) {
    const { currentUser } = useAuth();

    if(currentUser.role === 'user') {
        return <Navigate to="/user" replace />;
    } else {
        return <Navigate to="/admin" replace />;
    }
}

export default RoleRoutesCheck;