import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function ViewQuestions() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Filters
    const [filters, setFilters] = useState({
        section: '',
        difficulty: '',
        domain: '',
        searchText: ''
    });

    const [selectedQuestion, setSelectedQuestion] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, questions]);

    const fetchQuestions = async () => {
        setLoading(true);
        setError('');
        try {
            const querySnapshot = await getDocs(collection(db, 'SAT_Questions'));
            const questionsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setQuestions(questionsData);
            setFilteredQuestions(questionsData);
            setSuccess(`Loaded ${questionsData.length} questions`);
        } catch (err) {
            setError('Error fetching questions: ' + err.message);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...questions];

        // Filter by section
        if (filters.section) {
            filtered = filtered.filter(q => q.section === filters.section);
        }

        // Filter by difficulty
        if (filters.difficulty) {
            filtered = filtered.filter(q => q.difficulty === filters.difficulty);
        }

        // Filter by domain
        if (filters.domain) {
            filtered = filtered.filter(q => q.domain === filters.domain);
        }

        // Search in question text
        if (filters.searchText) {
            const searchLower = filters.searchText.toLowerCase();
            filtered = filtered.filter(q => 
                q.questionText?.toLowerCase().includes(searchLower) ||
                q.passage?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredQuestions(filtered);
    };

    const handleDelete = async (questionId) => {
        if (!window.confirm('Are you sure you want to delete this question?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'SAT_Questions', questionId));
            setSuccess('Question deleted successfully');
            fetchQuestions();
        } catch (err) {
            setError('Error deleting question: ' + err.message);
        }
    };

    const clearFilters = () => {
        setFilters({
            section: '',
            difficulty: '',
            domain: '',
            searchText: ''
        });
    };

    // Get unique values for filters
    const uniqueSections = [...new Set(questions.map(q => q.section).filter(Boolean))];
    const uniqueDifficulties = [...new Set(questions.map(q => q.difficulty).filter(Boolean))];
    const uniqueDomains = [...new Set(questions.map(q => q.domain).filter(Boolean))];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f3f4ff] to-[#e8e9ff] p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/admin')}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#6210E8] font-semibold transition"
                >
                    <span className="text-xl">←</span>
                    <span>Back to Dashboard</span>
                </button>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            Question Database
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage and view all SAT questions
                        </p>
                    </div>
                    <button
                        onClick={fetchQuestions}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={filters.searchText}
                            onChange={(e) => setFilters({...filters, searchText: e.target.value})}
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#6210E8] focus:outline-none"
                        />

                        {/* Section Filter */}
                        <select
                            value={filters.section}
                            onChange={(e) => setFilters({...filters, section: e.target.value})}
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#6210E8] focus:outline-none cursor-pointer"
                        >
                            <option value="">All Sections</option>
                            {uniqueSections.map(section => (
                                <option key={section} value={section}>
                                    {section.replace(/_/g, ' ').toUpperCase()}
                                </option>
                            ))}
                        </select>

                        {/* Difficulty Filter */}
                        <select
                            value={filters.difficulty}
                            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#6210E8] focus:outline-none cursor-pointer"
                        >
                            <option value="">All Difficulties</option>
                            {uniqueDifficulties.map(diff => (
                                <option key={diff} value={diff}>
                                    {diff.toUpperCase()}
                                </option>
                            ))}
                        </select>

                        {/* Domain Filter */}
                        <select
                            value={filters.domain}
                            onChange={(e) => setFilters({...filters, domain: e.target.value})}
                            className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#6210E8] focus:outline-none cursor-pointer"
                        >
                            <option value="">All Domains</option>
                            {uniqueDomains.map(domain => (
                                <option key={domain} value={domain}>
                                    {domain.replace(/_/g, ' ').toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        Showing <span className="font-bold text-gray-800">{filteredQuestions.length}</span> of <span className="font-bold text-gray-800">{questions.length}</span> questions
                    </div>
                </div>

                {/* Questions List */}
                {loading ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6210E8] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading questions...</p>
                    </div>
                ) : filteredQuestions.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <p className="text-xl text-gray-600">No questions found</p>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or upload some PDFs!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredQuestions.map((question, index) => (
                            <div 
                                key={question.id} 
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                                onClick={() => setSelectedQuestion(selectedQuestion?.id === question.id ? null : question)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                                {question.section?.replace(/_/g, ' ').toUpperCase()}
                                            </span>
                                            {question.difficulty && (
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {question.difficulty.toUpperCase()}
                                                </span>
                                            )}
                                            {question.type && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                                                    {question.type.replace(/_/g, ' ').toUpperCase()}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-800 font-medium mb-2">
                                            {question.questionText}
                                        </p>

                                        {question.domain && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Domain:</span> {question.domain.replace(/_/g, ' ')}
                                            </p>
                                        )}

                                        {question.skill && (
                                            <p className="text-sm text-gray-600">
                                                <span className="font-semibold">Skill:</span> {question.skill.replace(/_/g, ' ')}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(question.id);
                                            }}
                                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {selectedQuestion?.id === question.id && (
                                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                                        {question.passage && (
                                            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                                <p className="text-sm font-semibold text-gray-700 mb-2">Passage:</p>
                                                <p className="text-sm text-gray-600 italic">{question.passage}</p>
                                            </div>
                                        )}

                                        {question.options && question.options.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-sm font-semibold text-gray-700 mb-3">Options:</p>
                                                <div className="space-y-2">
                                                    {question.options.map((option, optIndex) => (
                                                        <div 
                                                            key={optIndex} 
                                                            className={`p-4 rounded-lg ${
                                                                option.label === question.correctAnswer 
                                                                    ? 'bg-green-50 border-2 border-green-500' 
                                                                    : 'bg-gray-50 border border-gray-200'
                                                            }`}
                                                        >
                                                            <div className="flex items-start gap-2">
                                                                <span className="font-bold">{option.label}.</span>
                                                                <div className="flex-1">
                                                                    <p className="text-gray-800">{option.text}</p>
                                                                    {option.explanation && (
                                                                        <p className="text-sm text-gray-600 mt-2 italic">
                                                                            💡 {option.explanation}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {option.label === question.correctAnswer && (
                                                                    <span className="text-green-600 font-bold text-lg">✓</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {question.correctAnswer && !question.options && (
                                            <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    Correct Answer: <span className="text-green-800 text-lg font-bold">{question.correctAnswer}</span>
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-4 text-xs text-gray-500">
                                            <p>Question ID: {question.id}</p>
                                            {question.createdAt && (
                                                <p>Created: {new Date(question.createdAt?.seconds * 1000).toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

