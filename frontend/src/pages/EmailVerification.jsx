import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function EmailVerification() {
    const { currentUser, emailVerified, resendVerificationEmail, checkEmailVerification, logout } = useAuth();
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const navigate = useNavigate();

    const logoutGoBack = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (emailVerified) {
            navigate('/user');
            return;
        }
    }, [currentUser, emailVerified, navigate]);

    // Auto-refresh verification status every 5 seconds
    useEffect(() => {
        if (!currentUser || emailVerified) return;

        const startTime = Date.now();

        const interval = setInterval(async () => {
            try {
                const elapsedTime = Date.now() - startTime;
                if (elapsedTime > 300000) {
                    clearInterval(interval);
                    setMessage('Verification timed out. Please log in again.');
                    setTimeout(logoutGoBack, 4000);
                    return; 
                }
                const isVerified = await checkEmailVerification();
                if (isVerified) {
                    setMessage('Email verified successfully! Redirecting...');
                    setTimeout(() => navigate('/user'), 4000);
                }
            } catch (error) {
                console.error('Auto-check verification error:', error);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentUser, emailVerified, checkEmailVerification, navigate, logoutGoBack]);

    const handleResendVerification = async () => {
        setIsResending(true);
        setMessage('');
        try {
            await resendVerificationEmail();
            setMessage('Verification email sent! Please check your inbox.');
        } catch (error) {
            setMessage('Error sending verification email: ' + error.message);
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckVerification = async () => {
        setIsChecking(true);
        setMessage('');
        try {
            const isVerified = await checkEmailVerification();
            if (isVerified) {
                setMessage('Email verified successfully! Redirecting...');
                setTimeout(() => navigate('/user'), 2000);
            } else {
                setMessage('Email not yet verified. Please check your inbox and click the verification link.');
            }
        } catch (error) {
            setMessage('Error checking verification status: ' + error.message);
        } finally {
            setIsChecking(false);
        }
    };

    

    if (!currentUser) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen gap- text-black">
            <div className="bg-gray-500 p-8 rounded-lg shadow-lg max-w-md w-full">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
                    <p className="text-gray-300">
                        We've sent a verification email to <strong>{currentUser.email}</strong>
                    </p>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-gray-400 text-center">
                        Please check your email and click the verification link to activate your account.
                    </p>

                    {message && (
                        <div className={`p-3 rounded-md text-sm ${
                            message.includes('Error') || message.includes('not yet verified') 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-green-100 text-green-700'
                        }`}>
                            {message}
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleCheckVerification}
                            disabled={isChecking}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-black font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            {isChecking ? 'Checking...' : 'I\'ve Verified My Email'}
                        </button>

                        <button
                            onClick={handleResendVerification}
                            disabled={isResending}
                            className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-black font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            {isResending ? 'Sending...' : 'Resend Verification Email'}
                        </button>
                    </div>

                    <div className="text-center">
                        <button
                            onClick={logoutGoBack}
                            className="text-sm text-gray-400 hover:text-blue-500 transition-colors"
                        >
                            Back to Login
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmailVerification;
