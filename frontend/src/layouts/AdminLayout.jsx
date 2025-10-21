import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';


function AdminLayout() {
    const { role, currentUser } = useAuth();
    const navigate = useNavigate();
    if(role !== 'admin' || !currentUser) {
        navigate('/login');
    }

    return (
        <div>
            <Navbar />
            <Outlet />  
        </div>
    )
}

export default AdminLayout;