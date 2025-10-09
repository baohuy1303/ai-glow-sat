import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [register, setRegister] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signup, login, currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    
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
                setRegister(false);
            } else {
                await login(email, password);
                navigate('/dashboard');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (<>
        <div className='flex flex-col items-center justify-center h-screen w-screen gap-10'>
            <h1 className='text-2xl font-bold'>{register ? 'Register' : 'Login'}</h1>
            {currentUser && <p className='text-sm text-green-500'>{currentUser.email}</p>}
            {error && <p className='text-sm text-red-500'>{error}</p>}
            <form onSubmit={handleSubmit} className='flex flex-col gap-2 justify-center items-center'>
                <input type="email" placeholder="Email" className='border-2 border-gray-300 rounded-md p-2' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" className='border-2 border-gray-300 rounded-md p-2' value={password} onChange={(e) => setPassword(e.target.value)} />
                {register && <input type="password" placeholder="Confirm Password" className='border-2 border-gray-300 rounded-md p-2' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />}
                <button disabled={loading} type="submit">{register ? 'Register' : 'Login'} {loading && <span className='animate-spin'>...</span>}</button>
                <p className='text-sm text-gray-500 hover:cursor-pointer hover:text-blue-500' onClick={() => setRegister(!register)}>{register ? 'Already have an account?' : "Don't have an account?"}</p>
            </form>
        </div>
    </>

    )

}

export default Login;