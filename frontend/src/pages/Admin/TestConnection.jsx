import { useState } from 'react';
import axios from 'axios';

export default function TestConnection() {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(false);

    const testBackend = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/api/question/test');
            setResults(prev => ({ ...prev, backend: { success: true, data: res.data } }));
        } catch (err) {
            setResults(prev => ({ ...prev, backend: { success: false, error: err.message } }));
        }
        setLoading(false);
    };

    const testFastAPI = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/');
            setResults(prev => ({ ...prev, fastapi: { success: true, data: res.data } }));
        } catch (err) {
            setResults(prev => ({ ...prev, fastapi: { success: false, error: err.message } }));
        }
        setLoading(false);
    };

    const testRedis = async () => {
        setLoading(true);
        try {
            // Test through backend
            const res = await axios.get('http://localhost:3000/api/question/test');
            setResults(prev => ({ ...prev, redis: { success: true, message: 'Backend connected (Redis used internally)' } }));
        } catch (err) {
            setResults(prev => ({ ...prev, redis: { success: false, error: err.message } }));
        }
        setLoading(false);
    };

    const testAll = async () => {
        await testBackend();
        await testFastAPI();
        await testRedis();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f3f4ff] to-[#e8e9ff] p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">
                    🔍 Connection Test
                </h1>

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Test Services</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <button
                            onClick={testBackend}
                            disabled={loading}
                            className="px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
                        >
                            Test Backend
                        </button>
                        <button
                            onClick={testFastAPI}
                            disabled={loading}
                            className="px-4 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
                        >
                            Test FastAPI
                        </button>
                        <button
                            onClick={testRedis}
                            disabled={loading}
                            className="px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition"
                        >
                            Test Redis
                        </button>
                        <button
                            onClick={testAll}
                            disabled={loading}
                            className="px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                        >
                            Test All
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Backend Results */}
                        {results.backend && (
                            <div className={`p-4 rounded-lg ${results.backend.success ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                                <h3 className="font-bold text-lg mb-2">
                                    {results.backend.success ? '✅ Backend (Express)' : '❌ Backend (Express)'}
                                </h3>
                                <pre className="text-sm overflow-auto bg-white p-3 rounded">
                                    {JSON.stringify(results.backend, null, 2)}
                                </pre>
                            </div>
                        )}

                        {/* FastAPI Results */}
                        {results.fastapi && (
                            <div className={`p-4 rounded-lg ${results.fastapi.success ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                                <h3 className="font-bold text-lg mb-2">
                                    {results.fastapi.success ? '✅ FastAPI (Python)' : '❌ FastAPI (Python)'}
                                </h3>
                                <pre className="text-sm overflow-auto bg-white p-3 rounded">
                                    {JSON.stringify(results.fastapi, null, 2)}
                                </pre>
                            </div>
                        )}

                        {/* Redis Results */}
                        {results.redis && (
                            <div className={`p-4 rounded-lg ${results.redis.success ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
                                <h3 className="font-bold text-lg mb-2">
                                    {results.redis.success ? '✅ Redis' : '❌ Redis'}
                                </h3>
                                <pre className="text-sm overflow-auto bg-white p-3 rounded">
                                    {JSON.stringify(results.redis, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                    <h3 className="font-bold text-lg mb-2 text-yellow-800">📋 Checklist</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Docker Desktop running (for Redis)</li>
                        <li>Redis container running: <code className="bg-white px-2 py-1 rounded">docker ps | grep redis</code></li>
                        <li>FastAPI running on port 8000: <code className="bg-white px-2 py-1 rounded">cd PythonAI && python api.py</code></li>
                        <li>Express backend running on port 3000: <code className="bg-white px-2 py-1 rounded">cd backend && npm run dev</code></li>
                        <li>OpenAI API key in PythonAI/.env file</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

