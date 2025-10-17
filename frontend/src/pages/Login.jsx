import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/aiglow_logo.png";


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [register, setRegister] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signup, login, currentUser, role, loginWithGoogle, emailVerified } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Handle navigation based on role and email verification after login
    useEffect(() => {
        if (currentUser && role) {
            // Check if email is verified
            if (!emailVerified) {
                navigate('/verify-email');
                return;
            }
            
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        }
    }, [currentUser, role, emailVerified, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        if (register && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            if (register && password === confirmPassword) {
                await signup(email, password);
                setPassword('');
                setConfirmPassword('');
                setRegister(false);
                // After signup, user will be redirected to email verification
            } else {
                await login(email, password);
                // Navigation will be handled by useEffect based on email verification status
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setPassword('');
            setConfirmPassword('');
        }
    }

    async function handleLoginWithGoogle() {
        setLoading(true);
        try {
            await loginWithGoogle();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setEmail('');
            setPassword('');
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen w-screen gap-10 bg-gradient-to-b from-[#d8f405] to-[#4e0bba] text-white px-4">
            <div className="flex justify-center items-center px-20 gap-4">
            <img src={logo} alt="Login Background" className="w-13 max-w-md rounded shadow-lg"></img>
            <h1 className="text-2xl font-bold text-[#4e0bba]">
                    ai glow
                </h1>
            </div>
                <h1 className="text-xl font-bold">
                    {register ? 'Register' : 'Login'}
                </h1>
                {currentUser && !emailVerified && (
                    <div className="text-center">
                        <p className="text-sm text-yellow-500 mb-2">
                            Please verify your email to continue
                        </p>
                        <button
                            onClick={() => navigate('/verify-email')}
                            className="text-sm text-blue-500 hover:text-blue-700 underline"
                        >
                            Go to Email Verification
                        </button>
                    </div>
                )}
                {currentUser && (
                    <p className="text-sm text-green-500">
                        {currentUser.email}
                    </p>
                )}
                {error && <p className="text-sm text-red-500">{error}</p>}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-2 justify-center items-center"
                >
                    <input
                        type="email"
                        placeholder="Email"
                        className="border-2 border-gray-300 rounded-md p-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border-2 border-gray-300 rounded-md p-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {register && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="border-2 border-gray-300 rounded-md p-2"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    )}
                    <button disabled={loading} type="submit" classnName="text-[#4e0bba]">
                        {register ? 'Register' : 'Login'}{' '}
                        {loading && <span className="animate-spin">...</span>}
                    </button>
                    <p
                        className="text-sm text-black hover:cursor-pointer hover:text-blue-500"
                        onClick={() => setRegister(!register)}
                    >
                        {register
                            ? 'Already have an account?'
                            : "Don't have an account?"}
                    </p>
                </form>
                <button
                onClick={handleLoginWithGoogle}
                className="gap-3 bg-white text-[#4e0bba] font-bold py-2 px-5 rounded-md shadow-md hover:bg-[#4e0bba] !important hover:text-white transition-colors duration-300"
                >
                Login with Google
                </button>

            </div>
        </>
    );
}

export default Login;
