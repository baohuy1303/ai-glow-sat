import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Dashboard() {
    const { currentUser, logout } = useAuth();
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
        <>
        <div>
            <h1>Dashboard</h1>
            {currentUser && <p>{currentUser.email}</p>}
            {error && <p>{error}</p>}
        </div>

        <button onClick={handleLogout}>Logout</button>
        </>
    )
}

export default Dashboard;