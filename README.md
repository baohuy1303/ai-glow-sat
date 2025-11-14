# AI Glow SAT - AI-Powered SAT Question Management Platform

A full-stack microservices application for parsing, managing, and organizing SAT questions using AI (OpenAI GPT-4), with a modern React frontend, Express backend, and FastAPI AI service.

## 🚀 Features

- **AI-Powered PDF Parsing**: Automatically extract SAT questions from PDFs using OpenAI GPT-4
- **Question Management**: Edit, review, and manage questions with a beautiful admin interface
- **Image Support**: Upload images for questions (stored in Firebase Storage)
- **Redis Caching**: Temporary storage for parsed questions during review
- **Firestore Database**: Permanent storage for finalized questions
- **Role-Based Access**: Admin and user roles with Firebase Authentication
- **Real-time Updates**: View and manage questions in real-time

## 📋 Tech Stack

### Frontend
- **React 19** with Vite
- **TailwindCSS 4** for styling
- **React Router v7** for navigation
- **Firebase SDK** for authentication and storage
- **Axios** for API calls

### Backend
- **Node.js** with Express 5
- **Firebase Admin SDK** for Firestore and Storage
- **Redis (ioredis)** for caching
- **Multer** for file uploads
- **Axios** for HTTP requests

### AI Service
- **FastAPI** (Python)
- **LangChain** for LLM orchestration
- **OpenAI GPT-4** for question parsing
- **PyPDF** for PDF processing
- **Redis** for temporary storage

### Infrastructure
- **Firebase Firestore** - Database
- **Firebase Storage** - File storage (images)
- **Firebase Authentication** - User auth
- **Redis** - Caching (Docker)
- **Docker** - Redis container

## 🛠️ Prerequisites

- **Node.js** v16+ and npm
- **Python** 3.8+
- **Docker Desktop** (for Redis)
- **Firebase Project** with Firestore and Storage enabled
- **OpenAI API Key**
- **Git Bash** or PowerShell (Windows)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-glow-sat
```

### 2. Setup Redis (Docker)

```bash
# Start Redis container
docker run -d -p 6379:6379 --name redis redis:latest

# Verify it's running
docker ps | grep redis
```

### 3. Setup Python AI Service

```bash
# Navigate to PythonAI folder
cd PythonAI

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Or Git Bash
source venv/Scripts/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### 4. Setup Express Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (if needed)
# Add Firebase Storage bucket name:
# storageBucket=your-project-id.firebasestorage.app
```

### 5. Setup React Frontend

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file with Firebase config
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# VITE_FIREBASE_PROJECT_ID=...
# VITE_FIREBASE_STORAGE_BUCKET=...
# VITE_FIREBASE_MESSAGING_SENDER_ID=...
# VITE_FIREBASE_APP_ID=...
```

### 6. Firebase Configuration

1. **Service Account**: Place `certs.json` in `backend/` folder
2. **Firebase Config**: Add Firebase config to `frontend/.env`
3. **Storage Bucket**: Configure Firebase Storage bucket name

## 🚀 Running the Application

### Option 1: Use Start Script (Windows)

```bash
# Run from project root
start-services.bat
```

This will:
- Start Redis Docker container
- Start FastAPI service (port 8000)
- Start Express backend (port 3000)
- Start React frontend (port 5173)

### Option 2: Manual Start

**Terminal 1 - Redis:**
```bash
docker start redis
```

**Terminal 2 - FastAPI:**
```bash
cd PythonAI
.\venv\Scripts\Activate.ps1
python api.py
```

**Terminal 3 - Express Backend:**
```bash
cd backend
npm run dev
```

**Terminal 4 - React Frontend:**
```bash
cd frontend
npm run dev
```

## 📡 API Endpoints

### FastAPI (Port 8000)
- `GET /` - Health check
- `POST /parse-pdf` - Parse PDF and extract questions
- `GET /redis/{key}` - Get data from Redis
- `DELETE /redis/{key}` - Delete data from Redis

### Express Backend (Port 3000)
- `GET /api/question/test` - Health check
- `POST /api/question/upload-pdf` - Upload PDF (forwards to FastAPI)
- `POST /api/question/finalize` - Save questions to Firestore
- `POST /api/question/upload-image` - Upload image to Firebase Storage
- `GET /api/question/redis-keys` - Get all Redis keys
- `GET /api/question/redis-data/:key` - Get Redis data by key
- `GET /api/question/get` - Get all questions from Firestore

## 🔄 Architecture

### Data Flow

```
1. Frontend: Admin uploads PDF
   ↓
2. Express: Receives PDF via Multer
   ↓
3. FastAPI: Parses PDF with OpenAI GPT-4
   ↓
4. Redis: Stores parsed questions (temporary)
   ↓
5. Frontend: Displays questions for review
   ↓
6. Admin: Edits questions, uploads images
   ↓
7. Express: Uploads images to Firebase Storage
   ↓
8. Firestore: Saves finalized questions
   ↓
9. Redis: Deletes temporary cache
```

### Services

- **Frontend (React)**: User interface on `localhost:5173`
- **Express Backend**: API gateway on `localhost:3000`
- **FastAPI**: AI service on `localhost:8000`
- **Redis**: Cache on `localhost:6379`
- **Firestore**: Database (Firebase)
- **Firebase Storage**: File storage (images)

## 🎯 Admin Features

### Upload Questions
- Upload PDF files
- Automatic AI parsing
- Review parsed questions
- Edit questions before saving
- Upload images for questions
- Select which questions to save

### Redis Review
- View all cached PDFs
- Review questions in Redis
- Edit and finalize questions
- See expiry times

### View Questions
- Browse all questions in Firestore
- Filter by section, difficulty, domain
- Search questions
- Delete questions
- View full question details

## 🔐 Authentication

- **Firebase Authentication** for user login
- **Role-based access control** (admin/user)
- **Email verification** required
- **Google Sign-In** supported

## 📊 Database Structure

### Firestore Collections

**SAT_Questions:**
```javascript
{
  id: "auto-generated",
  section: "math" | "reading_and_writing",
  domain: "algebra" | ...,
  skill: "linear_equations" | ...,
  difficulty: "easy" | "medium" | "hard",
  type: "multiple_choice" | "short_answer",
  passage: "string" | null,
  questionText: "string",
  options: [
    {
      label: "A",
      text: "string",
      explanation: "string"
    }
  ],
  correctAnswer: "string",
  imageUrl: "string" | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Redis Keys

- Format: `parsed:{filename}`
- Example: `parsed:TestPDF3.pdf`
- TTL: 1 hour (auto-expires)

## 🐛 Troubleshooting

### Redis Connection Error
```bash
# Check if Redis is running
docker ps | grep redis

# Start Redis if not running
docker start redis

# Or create new container
docker run -d -p 6379:6379 --name redis redis:latest
```

### FastAPI Not Running
```bash
# Check if virtual environment is activated
cd PythonAI
.\venv\Scripts\Activate.ps1

# Check if dependencies are installed
pip list | grep fastapi

# Install dependencies
pip install -r requirements.txt

# Check OpenAI API key
cat .env
```

### Firebase Storage Bucket Error
```bash
# Check bucket name in backend/.env
storageBucket=your-project-id.firebasestorage.app

# Or check in Firebase Console
# Firebase Console → Storage → Check bucket name
```

### Port Already in Use
```bash
# Windows - Find process using port
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

## 📝 Environment Variables

### Backend (.env)
```env
storageBucket=your-project-id.firebasestorage.app
```

### Frontend (.env)
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### PythonAI (.env)
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## 🔒 Security

- **Firebase Authentication** for user management
- **Role-based access control** for admin features
- **Firebase Security Rules** for Firestore and Storage
- **Environment variables** for sensitive data
- **Service account** for backend Firebase access

## 📈 Performance

- **Redis caching** for fast access to parsed questions
- **Batch operations** for Firestore writes
- **Image optimization** through Firebase Storage
- **Lazy loading** for question lists
- **Efficient filtering** on frontend

## 🚀 Deployment

### Frontend
- Build: `npm run build`
- Deploy to: Vercel, Netlify, or Firebase Hosting

### Backend
- Deploy to: Heroku, Railway, or AWS
- Set environment variables
- Keep Redis connection

### FastAPI
- Deploy to: Railway, Render, or AWS
- Set OpenAI API key
- Keep Redis connection

## 📄 License

[Your License Here]

## 👥 Contributors

[Your Name/Team]

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  
**Last Updated:** November 2024

