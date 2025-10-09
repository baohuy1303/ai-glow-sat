import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(''); 
    
    async function handleLogout() {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            setError(error.message);
        }
    }
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
            {error && <p>{error}</p>}
        </div>
    )
}

export default AdminDashboard;