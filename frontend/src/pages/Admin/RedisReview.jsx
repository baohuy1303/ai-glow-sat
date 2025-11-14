import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RedisReview() {
    const navigate = useNavigate();
    const [redisKeys, setRedisKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedKey, setSelectedKey] = useState(null);
    const [questions, setQuestions] = useState([]);
    
    // State for editing
    const [editedQuestions, setEditedQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState(new Set());
    const [questionImages, setQuestionImages] = useState({});
    const [editMode, setEditMode] = useState({});

    // Fetch Redis keys on mount
    useEffect(() => {
        fetchRedisKeys();
    }, []);

    const fetchRedisKeys = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('http://localhost:3000/api/question/redis-keys');
            if (response.data.success) {
                setRedisKeys(response.data.keys);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching Redis keys');
            console.error('Fetch keys error:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadQuestions = async (key) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const filename = key.replace('parsed:', '');
            const response = await axios.get(`http://localhost:3000/api/question/redis-data/${filename}`);
            
            if (response.data.success) {
                setSelectedKey(response.data.redis_key);
                setQuestions(response.data.questions);
                setEditedQuestions(response.data.questions);
                // Select all by default
                const allIndexes = new Set(response.data.questions.map((_, idx) => idx));
                setSelectedQuestions(allIndexes);
                setQuestionImages({});
                setEditMode({});
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error loading questions');
            console.error('Load questions error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionEdit = (index, field, value) => {
        const updated = [...editedQuestions];
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            updated[index][parent][child] = value;
        } else {
            updated[index][field] = value;
        }
        setEditedQuestions(updated);
    };

    const handleOptionEdit = (questionIndex, optionIndex, field, value) => {
        const updated = [...editedQuestions];
        updated[questionIndex].options[optionIndex][field] = value;
        setEditedQuestions(updated);
    };

    const toggleQuestionSelection = (index) => {
        const newSelected = new Set(selectedQuestions);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedQuestions(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedQuestions.size === editedQuestions.length) {
            setSelectedQuestions(new Set());
        } else {
            setSelectedQuestions(new Set(editedQuestions.map((_, idx) => idx)));
        }
    };

    const handleImageUpload = (index, e) => {
        const imageFile = e.target.files[0];
        if (imageFile) {
            if (!imageFile.type.startsWith('image/')) {
                setError('Please select a valid image file');
                return;
            }
            setQuestionImages({
                ...questionImages,
                [index]: imageFile
            });
        }
    };

    const removeImage = (index) => {
        const updated = { ...questionImages };
        delete updated[index];
        setQuestionImages(updated);
    };

    const toggleEditMode = (index) => {
        setEditMode({
            ...editMode,
            [index]: !editMode[index]
        });
    };

    const uploadImageToFirebase = async (imageFile, questionIndex) => {
        try {
            console.log(`📷 Uploading image for question ${questionIndex + 1}: ${imageFile.name}`);
            
            // Create FormData to send image to backend
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('questionIndex', questionIndex.toString());
            
            // Upload to backend endpoint
            const response = await axios.post(
                'http://localhost:3000/api/question/upload-image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            if (response.data.success) {
                console.log(`✅ Image uploaded successfully: ${response.data.imageUrl}`);
                return response.data.imageUrl;
            } else {
                throw new Error('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleFinalize = async () => {
        if (!selectedKey || selectedQuestions.size === 0) {
            setError('Please select at least one question to save');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Process selected questions with their original indices
            // This ensures we can correctly map images to questions
            const questionsWithImages = await Promise.all(
                editedQuestions.map(async (question, index) => {
                    // Skip if not selected
                    if (!selectedQuestions.has(index)) {
                        return null;
                    }
                    
                    // If image exists for this question, upload it
                    if (questionImages[index]) {
                        try {
                            console.log(`📷 Uploading image for question ${index + 1}: ${questionImages[index].name}`);
                            const imageUrl = await uploadImageToFirebase(questionImages[index], index);
                            console.log(`✅ Image uploaded successfully for question ${index + 1}`);
                            return {
                                ...question,
                                imageUrl: imageUrl
                            };
                        } catch (err) {
                            console.error(`❌ Error uploading image for question ${index + 1}:`, err);
                            const errorMessage = err.response?.data?.error || err.message || 'Image upload failed';
                            
                            // Return question without imageUrl if upload fails
                            console.warn(`⚠️ Continuing without image for question ${index + 1}: ${errorMessage}`);
                            return question;
                        }
                    }
                    
                    // Return question without imageUrl if no image
                    return question;
                })
            );
            
            // Filter out null values (unselected questions)
            const questionsToSave = questionsWithImages.filter(q => q !== null);

            const response = await axios.post('http://localhost:3000/api/question/finalize', {
                redis_key: selectedKey,
                questions: questionsToSave,
                removeFromRedis: true
            });

            if (response.data.success) {
                setSuccess(`Successfully saved ${response.data.questions_saved} questions to database!`);
                // Clear current selection and refresh keys
                setSelectedKey(null);
                setQuestions([]);
                setEditedQuestions([]);
                setSelectedQuestions(new Set());
                setQuestionImages({});
                setEditMode({});
                fetchRedisKeys();
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Error saving questions to database');
            console.error('Finalize error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setSelectedKey(null);
        setQuestions([]);
        setEditedQuestions([]);
        setSelectedQuestions(new Set());
        setQuestionImages({});
        setEditMode({});
        setSuccess('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f3f4ff] to-[#e8e9ff] p-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/admin')}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#6210E8] font-semibold transition"
                >
                    <span className="text-xl">←</span>
                    <span>Back to Dashboard</span>
                </button>

                <h1 className="text-4xl font-extrabold text-center mb-2 text-gray-900">
                    Redis Review - Cached Questions
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Review and finalize questions currently in Redis cache
                </p>

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

                {/* Redis Keys List */}
                {!selectedKey && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Cached PDFs in Review
                            </h2>
                            <button
                                onClick={fetchRedisKeys}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-l  hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
                            >
                                {loading ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>

                        {redisKeys.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No cached questions found in Redis</p>
                                <p className="text-gray-400 text-sm mt-2">Upload a PDF to start reviewing questions</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {redisKeys.map((keyData, index) => (
                                    <div 
                                        key={index}
                                        className="border-2 border-gray-200 rounded-lg p-6 hover:border-[#6210E8] transition cursor-pointer"
                                        onClick={() => loadQuestions(keyData.key)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                    📄 {keyData.filename}
                                                </h3>
                                                <div className="flex gap-4 text-sm text-gray-600">
                                                    <span>
                                                        <span className="font-semibold">{keyData.questionsCount}</span> questions
                                                    </span>
                                                    <span>
                                                        ⏰ Expires in: <span className="font-semibold">{keyData.expiresIn}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className="px-4 py-2 bg-[#6210E8] text-white font-semibold rounded-lg hover:bg-[#520bcf] transition"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    loadQuestions(keyData.key);
                                                }}
                                            >
                                                Review →
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Questions Review Section */}
                {selectedKey && editedQuestions.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Review & Edit Questions</h2>
                                <p className="text-gray-600 mt-1">
                                    Edit questions, upload images, and select which ones to save
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Selected: <span className="font-bold text-[#6210E8]">{selectedQuestions.size}</span> of {editedQuestions.length} questions
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={toggleSelectAll}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                                >
                                    {selectedQuestions.size === editedQuestions.length ? 'Deselect All' : 'Select All'}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFinalize}
                                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition"
                                    disabled={loading || selectedQuestions.size === 0}
                                >
                                    {loading ? 'Saving...' : `Save ${selectedQuestions.size} Selected Questions`}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                            {editedQuestions.map((question, index) => (
                                <div 
                                    key={index} 
                                    className={`border-2 rounded-lg p-6 transition ${
                                        selectedQuestions.has(index) 
                                            ? 'border-[#6210E8] bg-purple-50' 
                                            : 'border-gray-200 bg-white'
                                    }`}
                                >
                                    {/* Header with Checkbox and Edit Button */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedQuestions.has(index)}
                                                onChange={() => toggleQuestionSelection(index)}
                                                className="mt-1 w-5 h-5 cursor-pointer"
                                            />
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    Question {index + 1}
                                                </h3>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                                        {question.section}
                                                    </span>
                                                    {question.difficulty && (
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                            question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                                            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {question.difficulty}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleEditMode(index)}
                                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
                                        >
                                            {editMode[index] ? '✓ Done Editing' : '✏️ Edit'}
                                        </button>
                                    </div>

                                    {/* Edit Mode */}
                                    {editMode[index] ? (
                                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                            {/* Question Text */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Question Text:</label>
                                                <textarea
                                                    value={question.questionText}
                                                    onChange={(e) => handleQuestionEdit(index, 'questionText', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#6210E8] focus:outline-none"
                                                    rows="3"
                                                />
                                            </div>

                                            {/* Passage */}
                                            {question.passage !== null && (
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Passage:</label>
                                                    <textarea
                                                        value={question.passage || ''}
                                                        onChange={(e) => handleQuestionEdit(index, 'passage', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#6210E8] focus:outline-none"
                                                        rows="4"
                                                    />
                                                </div>
                                            )}

                                            {/* Options */}
                                            {question.options && question.options.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Options:</label>
                                                    {question.options.map((option, optIdx) => (
                                                        <div key={optIdx} className="mb-3 p-3 border border-gray-200 rounded-lg bg-white">
                                                            <div className="flex gap-2 mb-2">
                                                                <input
                                                                    value={option.label}
                                                                    onChange={(e) => handleOptionEdit(index, optIdx, 'label', e.target.value)}
                                                                    className="w-16 px-2 py-1 border border-gray-300 rounded focus:border-[#6210E8] focus:outline-none font-bold"
                                                                    placeholder="A"
                                                                />
                                                                <input
                                                                    value={option.text}
                                                                    onChange={(e) => handleOptionEdit(index, optIdx, 'text', e.target.value)}
                                                                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:border-[#6210E8] focus:outline-none"
                                                                    placeholder="Option text"
                                                                />
                                                            </div>
                                                            <textarea
                                                                value={option.explanation || ''}
                                                                onChange={(e) => handleOptionEdit(index, optIdx, 'explanation', e.target.value)}
                                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:border-[#6210E8] focus:outline-none"
                                                                rows="2"
                                                                placeholder="Explanation (optional)"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Correct Answer */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Correct Answer:</label>
                                                <input
                                                    value={question.correctAnswer || ''}
                                                    onChange={(e) => handleQuestionEdit(index, 'correctAnswer', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#6210E8] focus:outline-none"
                                                    placeholder="A, B, C, D, or answer text"
                                                />
                                            </div>

                                            {/* Metadata */}
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty:</label>
                                                    <select
                                                        value={question.difficulty || ''}
                                                        onChange={(e) => handleQuestionEdit(index, 'difficulty', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#6210E8] focus:outline-none"
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value="easy">Easy</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="hard">Hard</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Domain:</label>
                                                    <input
                                                        value={question.domain || ''}
                                                        onChange={(e) => handleQuestionEdit(index, 'domain', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#6210E8] focus:outline-none"
                                                        placeholder="e.g., algebra"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Skill:</label>
                                                    <input
                                                        value={question.skill || ''}
                                                        onChange={(e) => handleQuestionEdit(index, 'skill', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#6210E8] focus:outline-none"
                                                        placeholder="e.g., linear_equations"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* View Mode */
                                        <div>
                                            {question.passage && (
                                                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                                                    <p className="text-sm font-semibold text-gray-700 mb-2">Passage:</p>
                                                    <p className="text-sm text-gray-600 italic">{question.passage}</p>
                                                </div>
                                            )}

                                            <div className="mb-4">
                                                <p className="text-sm font-semibold text-gray-700 mb-2">Question:</p>
                                                <p className="text-gray-800">{question.questionText}</p>
                                            </div>

                                            {question.options && question.options.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-semibold text-gray-700 mb-2">Options:</p>
                                                    <div className="space-y-2">
                                                        {question.options.map((option, optIndex) => (
                                                            <div 
                                                                key={optIndex} 
                                                                className={`p-3 rounded-lg ${
                                                                    option.label === question.correctAnswer 
                                                                        ? 'bg-green-50 border-2 border-green-500' 
                                                                        : 'bg-gray-50 border border-gray-200'
                                                                }`}
                                                            >
                                                                <span className="font-bold">{option.label}. </span>
                                                                {option.text}
                                                                {option.label === question.correctAnswer && (
                                                                    <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Image Upload Section */}
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            📷 Question Image (Optional):
                                        </label>
                                        {questionImages[index] ? (
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 p-3 bg-blue-50 border border-blue-300 rounded-lg">
                                                    <p className="text-sm text-blue-800">
                                                        ✓ Image selected: <span className="font-semibold">{questionImages[index].name}</span>
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(index, e)}
                                                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#6210E8] transition"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t-2 border-gray-200 flex justify-between items-center">
                            <p className="text-gray-700">
                                <span className="font-bold text-[#6210E8]">{selectedQuestions.size}</span> questions will be saved to database
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFinalize}
                                    className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition"
                                    disabled={loading || selectedQuestions.size === 0}
                                >
                                    {loading ? 'Saving...' : `Save ${selectedQuestions.size} Selected Questions`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

