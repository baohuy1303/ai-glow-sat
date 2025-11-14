@echo off
echo ========================================
echo   AI GLOW SAT - Starting All Services
echo ========================================
echo.

echo [0/4] Checking Redis Docker Container...
docker ps | findstr redis >nul 2>&1
if %errorlevel% neq 0 (
    echo Redis not running. Starting Redis container...
    docker start redis >nul 2>&1
    if %errorlevel% neq 0 (
        echo Redis container not found. Creating new Redis container...
        docker run -d -p 6379:6379 --name redis redis:latest
    )
    timeout /t 3 /nobreak >nul
    echo Redis started successfully!
) else (
    echo Redis is already running!
)
echo.

echo [1/4] Starting FastAPI Service (Port 8000)...
start "FastAPI Service" cmd /k "cd PythonAI && .\venv\Scripts\activate && python api.py"
timeout /t 3 /nobreak >nul

echo [2/4] Starting Express Backend (Port 3000)...
start "Express Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/4] Starting React Frontend (Port 5173)...
start "React Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   All Services Started Successfully!
echo ========================================
echo.
echo FastAPI:  http://localhost:8000
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Admin Upload Page: http://localhost:5173/admin/upload-questions
echo.
echo Press any key to exit this window...
pause >nul

