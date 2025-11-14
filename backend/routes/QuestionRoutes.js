const express = require("express");
const { createQuestion, getQuestions } = require("../controllers/Question");
const questionRouter = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const Redis = require("ioredis");
const admin = require("firebase-admin");
const axios = require('axios');
const { bucket } = require('../firebaseConfig');

const redis = new Redis();

questionRouter.post('/post', createQuestion);
questionRouter.get('/get', getQuestions);

// Test endpoint
questionRouter.get('/test', (req, res) => {
    res.json({
        status: 'Backend is working!',
        timestamp: new Date().toISOString(),
    });
});

// Get all Redis keys (parsed PDFs in review)
questionRouter.get('/redis-keys', async (req, res) => {
    try {
        const keys = await redis.keys('parsed:*');
        const keysData = await Promise.all(
            keys.map(async (key) => {
                const ttl = await redis.ttl(key);
                const data = await redis.get(key);
                const questions = data ? JSON.parse(data) : [];
                return {
                    key,
                    filename: key.replace('parsed:', ''),
                    questionsCount: Array.isArray(questions)
                        ? questions.length
                        : 0,
                    ttl,
                    expiresIn:
                        ttl > 0
                            ? `${Math.floor(ttl / 60)} minutes`
                            : 'No expiry',
                };
            })
        );
        res.json({ success: true, keys: keysData });
    } catch (error) {
        console.error('Error fetching Redis keys:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get specific Redis data
questionRouter.get('/redis-data/:key', async (req, res) => {
    try {
        const fullKey = `parsed:${req.params.key}`;
        const data = await redis.get(fullKey);

        if (!data) {
            return res.status(404).json({ error: 'Key not found or expired' });
        }

        const questions = JSON.parse(data);
        res.json({
            success: true,
            redis_key: fullKey,
            questions,
            questions_count: questions.length,
        });
    } catch (error) {
        console.error('Error fetching Redis data:', error);
        res.status(500).json({ error: error.message });
    }
});

questionRouter.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    console.log('📄 Upload PDF endpoint hit');
    console.log('File received:', req.file ? req.file.originalname : 'No file');

    try {
        if (!req.file) {
            console.error('❌ No file in request');
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        console.log(
            `✅ File details: ${req.file.originalname}, Size: ${req.file.size} bytes`
        );

        // Create FormData with axios-compatible format
        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: 'application/pdf',
        });

        console.log('📤 Sending to FastAPI...');

        // Send to FastAPI for parsing using axios
        const response = await axios.post(
            'http://localhost:8000/parse-pdf',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 120000, // 2 minute timeout
            }
        );

        console.log('✅ FastAPI response received');

        const data = response.data;

        // Data is already in Redis from FastAPI, just return it
        res.json({
            success: true,
            filename: req.file.originalname,
            redis_key: data.redis_key,
            questions_count: data.questions_count,
            questions: data.questions,
            message: data.message,
        });
    } catch (error) {
        console.error('❌ Error processing PDF:', error.message);
        if (error.response) {
            console.error('FastAPI Error Response:', error.response.data);
            console.error('Status:', error.response.status);
        } else if (error.code === 'ECONNREFUSED') {
            console.error(
                '❌ Cannot connect to FastAPI - is it running on port 8000?'
            );
        }

        const errorMessage =
            error.response?.data?.detail ||
            error.message ||
            'Error processing PDF';
        res.status(error.response?.status || 500).json({ error: errorMessage });
    }
});

// Upload image to Firebase Storage
questionRouter.post(
    '/upload-image',
    upload.single('image'),
    async (req, res) => {
        console.log('📷 Upload image endpoint hit');
        console.log(
            'File received:',
            req.file ? req.file.originalname : 'No file'
        );

        let responseSent = false;

        const sendResponse = (status, data) => {
            if (!responseSent) {
                responseSent = true;
                res.status(status).json(data);
            }
        };

        try {
            if (!req.file) {
                console.error('❌ No image file in request');
                return sendResponse(400, { error: 'No image file uploaded' });
            }

            // Validate file type
            const allowedTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/webp',
            ];
            if (!allowedTypes.includes(req.file.mimetype)) {
                console.error('❌ Invalid file type:', req.file.mimetype);
                return sendResponse(400, {
                    error: 'Invalid file type. Only images are allowed.',
                });
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (req.file.size > maxSize) {
                console.error('❌ File too large:', req.file.size);
                return sendResponse(400, {
                    error: 'File too large. Maximum size is 5MB.',
                });
            }

            console.log(
                `✅ File details: ${req.file.originalname}, Size: ${req.file.size} bytes, Type: ${req.file.mimetype}`
            );

            // Generate unique filename
            const timestamp = Date.now();
            const questionIndex = req.body.questionIndex || '0';
            const sanitizedFileName = req.file.originalname.replace(
                /[^a-zA-Z0-9.-]/g,
                '_'
            );
            const fileName = `question-images/${timestamp}-${questionIndex}-${sanitizedFileName}`;

            // Upload to Firebase Storage
            const file = bucket.file(fileName);

            // Upload file buffer
            const stream = file.createWriteStream({
                metadata: {
                    contentType: req.file.mimetype,
                    metadata: {
                        originalName: req.file.originalname,
                        uploadedAt: new Date().toISOString(),
                    },
                },
            });

            // Handle upload stream errors
            stream.on('error', (error) => {
                console.error('❌ Error uploading to Firebase Storage:', error);

                // Check if it's a bucket not found error
                if (
                    error.code === 404 ||
                    error.message?.includes('bucket does not exist')
                ) {
                    console.error(`❌ Bucket '${bucket.name}' does not exist`);
                    console.error(
                        `💡 Please check your Firebase Storage bucket name:`
                    );
                    console.error(`   1. Go to Firebase Console → Storage`);
                    console.error(
                        `   2. Check the bucket name (usually: project-id.firebasestorage.app)`
                    );
                    console.error(
                        `   3. Set it in .env file: storageBucket=your-bucket-name`
                    );
                    console.error(`   4. Or update backend/firebaseConfig.js`);

                    sendResponse(500, {
                        error:
                            `Storage bucket '${bucket.name}' does not exist. ` +
                            `Please check your Firebase Storage bucket name in .env file or firebaseConfig.js. ` +
                            `Expected format: project-id.firebasestorage.app or project-id.appspot.com`,
                    });
                } else {
                    sendResponse(500, {
                        error:
                            'Error uploading image to Firebase Storage: ' +
                            error.message,
                    });
                }
            });

            // Handle upload stream completion
            stream.on('finish', async () => {
                try {
                    // Make file publicly accessible
                    await file.makePublic();

                    // Get public URL
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

                    console.log(`✅ Image uploaded successfully: ${publicUrl}`);

                    sendResponse(200, {
                        success: true,
                        imageUrl: publicUrl,
                        fileName: fileName,
                        message: 'Image uploaded successfully',
                    });
                } catch (error) {
                    console.error(
                        '❌ Error making file public or getting URL:',
                        error
                    );
                    sendResponse(500, {
                        error: 'Error getting image URL: ' + error.message,
                    });
                }
            });

            // Write file buffer to stream
            stream.end(req.file.buffer);
        } catch (error) {
            console.error('❌ Error processing image:', error);
            sendResponse(500, {
                error: error.message || 'Error processing image',
            });
        }
    }
);

questionRouter.post('/finalize', async (req, res) => {
    const { redis_key, questions, removeFromRedis = true } = req.body;

    try {
        if (!questions || !Array.isArray(questions)) {
            return res.status(400).json({ error: 'Invalid questions data' });
        }

        console.log(`📦 Finalizing ${questions.length} questions to Firestore`);

        // Count questions with images
        const questionsWithImages = questions.filter((q) => q.imageUrl);
        if (questionsWithImages.length > 0) {
            console.log(
                `📷 ${questionsWithImages.length} questions have images attached`
            );
        }

        // Save each question to Firestore
        const batch = admin.firestore().batch();
        const questionsCollection = admin
            .firestore()
            .collection('SAT_Questions');

        questions.forEach((question, index) => {
            const docRef = questionsCollection.doc();
            const questionData = {
                ...question,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            // Log if question has imageUrl
            if (question.imageUrl) {
                console.log(
                    `  ✓ Question ${
                        index + 1
                    }: Has imageUrl - ${question.imageUrl.substring(0, 50)}...`
                );
            }

            batch.set(docRef, questionData);
        });

        await batch.commit();
        console.log(
            `✅ Successfully saved ${questions.length} questions to Firestore`
        );

        // Optionally remove from Redis
        if (removeFromRedis && redis_key) {
            await redis.del(redis_key);
        }

        res.json({
            success: true,
            message: `Successfully saved ${questions.length} questions to Firestore`,
            questions_saved: questions.length,
        });
    } catch (error) {
        console.error('Error finalizing questions:', error);
        res.status(500).json({
            error: error.message || 'Error saving questions',
        });
    }
});


module.exports = questionRouter;