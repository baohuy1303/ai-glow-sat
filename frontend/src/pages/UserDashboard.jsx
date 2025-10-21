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
        {/* Main Content*/}
        <div className="min-h-screen bg-[#E9E8F5] flex flex-col items-center justify-start py-16">
            {/* Header */}
            <h1 className="text-4xl font-extrabold text-center mb-10 text-black">
                STUDENT DASHBOARD
            </h1>
            <h2 className="text-2xl md:text-3xl text-center mb-10 text-black font-medium">
                Welcome back, Glower!
            </h2>

            { /* Top Buttons */}
            <div className="flex gap-8 mb-12">
                <button onClick={handleLogout} className="bg-[#6210E8] text-black font-semibold text-lg px-8 py-3 rounded-full hover:bg[#520bcf] transition">
                    Custom Test
                </button>
                <button onClick={handleLogout} className="bg-[#6210E8] text-black font-semibold text-lg px-8 py-3 rounded-full hover:bg[#520bcf] transition">
                    Account Settings
                </button>
            </div>

            { /* Dash Cards */}
            <div className="flex flex-col md:flex-row gap-10 items-center mb-16">
                { /* Progress Bar */}
                <div className="bg-white shadow-md rounded-2xl p-8 w-80">
                    <h3 className="text-xl font-extrabold mb-4 text-black">Your Progress</h3>
                    <ul className="text-lg text-black space-y-2">
                        <li>Questions Answered: 200</li>
                        <li>Last Exam Taken: MM/DD/YY</li>
                    </ul>
                </div>
                {/* Next Exam */}
                <div className="bg-[#d8f405] text-black rounded-3xl px-10 py-6 text-xl font-bold">
                    Next Exam: <span className="font-medium">MM/DD/YY</span>
                </div>
            </div>

            <div className="w-full flex flex-col items-center space-y-10 mb-20">
                {/* Mission Statement */}
                <div className="bg-white rounded-2xl w-11/12 md:w-3/4 p-10 text-center">
                    <h3 className="text-2xl font-extrabold mb-4 text-black">MISSION STATEMENT</h3>
                    <p className="text-lg text-black">
                        AI-powered learning for the future <br />
                        Smarter, faster, and more personalized SAT prep — built for today’s students.
                    </p>
                </div>

                {/* About Us */}
                <div className="bg-[#CBB8D6] rounded-2xl w-11/12 md:w-3/4 p-10 text-center">
                    <h3 className="text-2xl font-extrabold mb-4 text-black">ABOUT US</h3>
                    <p className="text-lg text-black">
                        AI Glow was created to solve a simple problem: most online test prep tools are outdated, expensive, and one-size-fits-all. We believe students deserve better — and we’re using AI to build it.<br />

                        We’re dedicated to redefining SAT prep through innovation and inclusivity, making high-quality learning accessible to every student.
                    </p>
                </div>

                {/* Features */}
                <div className="bg-white rounded-2xl w-11/12 md:w-3/4 p-10 text-center">
                    <h3 className="text-2xl font-extrabold mb-4 text-black">FEATURES</h3>
                    <p className="text-lg text-black">
                        AI-powered learning for the future <br />
                        Smarter, faster, and more personalized SAT prep — built for today’s students.
                    </p>
                </div>

                {/* Pricing */}
                <div className="bg-[#CBB8D6] rounded-2xl w-11/12 md:w-3/4 p-10 text-center">
                    <h3 className="text-2xl font-extrabold mb-4 text-black">PRICING</h3>
                    <p className="text-lg text-black">
                        Affordable plans for every student — start learning for free, and upgrade for access to premium tools and analytics.
                    </p>
                </div>
                {/* Support */}
                <div className="bg-white rounded-2xl w-11/12 md:w-3/4 p-10 text-center">
                    <h3 className="text-2xl font-extrabold mb-4 text-black">SUPPORT</h3>
                    <p className="text-lg text-black">
                        Have questions? Need help navigating the site? Email us at support@aiglow.edu for information.
                    </p>
                </div>
            </div>
        </div>

        
        </>
    )
}

export default Dashboard;