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
        <div className="min-h-screen bg-gradient-to-b from-[#f3f4ff] to-[#e8e9ff] p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900">
                    Admin Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div
                        onClick={() => navigate('/admin/upload-questions')}
                        className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-[#6210E8]"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            📄 Upload Questions
                        </h2>
                        <p className="text-gray-600">
                            Upload PDF files to automatically extract and parse
                            SAT questions using AI
                        </p>
                    </div>

                    <div
                        onClick={() => navigate('/admin/view-questions')}
                        className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-[#6210E8]"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            📊 View Questions
                        </h2>
                        <p className="text-gray-600">
                            Browse and manage all SAT questions in the database
                        </p>
                    </div>

                    <div
                        onClick={() => navigate('/admin/redis-review')}
                        className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-[#6210E8]"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            🔄 Redis Review
                        </h2>
                        <p className="text-gray-600">
                            Review and finalize questions cached in Redis before
                            database storage
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-[#6210E8]">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            👥 Manage Users
                        </h2>
                        <p className="text-gray-600">
                            View and manage student accounts and permissions
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-[#6210E8]">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            📈 Analytics
                        </h2>
                        <p className="text-gray-600">
                            View system analytics and student performance
                            metrics
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={handleLogout}
                        className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;