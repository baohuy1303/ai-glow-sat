import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';


function UserLayout() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    if(!currentUser) {
        navigate('/login');
    }
    return (
        <div>
            <Navbar />
            {/* <h1>User Layout</h1> */}
            <Outlet />
        </div>
    )
}

export default UserLayout;