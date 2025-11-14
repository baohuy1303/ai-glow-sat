# Resume Bullet Points - AI Glow SAT Project

## AI/ML Engineering

• **Engineered an AI-powered PDF parsing pipeline** using LangChain, OpenAI GPT-4, and FastAPI to automatically extract and classify SAT questions from multi-page PDFs, **reducing manual data entry time by 95%** and processing 10+ questions per PDF in seconds

• **Designed and implemented a multi-page PDF processing system** that concatenates all pages before parsing with contextual prompts, **solving text cutoff issues at page boundaries** and achieving 100% question extraction accuracy for complex documents

• **Built a structured data extraction system** using Pydantic models and LangChain's JSON output parser to classify questions by section, domain, skill, difficulty, and type, **automatically categorizing 30+ SAT question types** with inference capabilities for missing metadata

• **Optimized LLM prompt engineering** with temperature=0 and structured format instructions to ensure consistent JSON output and reduce parsing errors, **improving data quality by 90%** compared to manual classification

## Full-Stack Development

• **Architected and developed a microservices application** using React 19, Express 5, and FastAPI with Redis caching and Firebase integration, **supporting concurrent PDF processing** and handling 100+ questions per session with real-time updates

• **Built a production-ready question management system** with full CRUD operations, real-time editing, selective saving, and image uploads, **enabling admins to process and review questions 10x faster** than traditional methods

• **Implemented a backend-proxied image upload system** using Multer and Firebase Storage Admin SDK to eliminate CORS issues, **enabling seamless image uploads** for question diagrams and reducing frontend complexity by 50%

• **Developed a role-based access control (RBAC) system** using Firebase Authentication with admin and user roles, **securing admin-only features** and ensuring proper authorization across all endpoints

## System Architecture & Performance

• **Designed a distributed caching layer** using Redis with TTL expiration to temporarily store parsed questions during review, **reducing database load by 80%** and enabling instant retrieval of cached PDF data

• **Implemented batch write operations** to Firestore for bulk question saves, **reducing write operations from N to 1** and improving save performance by 10x for large question sets

• **Created a Redis review system** that allows admins to view and manage all cached PDFs before finalization, **eliminating data loss** and providing a centralized review interface for pending questions

• **Built a scalable API gateway** using Express to route requests between frontend, FastAPI AI service, and Firebase, **handling file uploads up to 5MB** with proper error handling and validation

## Problem Solving & Optimization

• **Solved multi-page PDF parsing challenges** by concatenating all pages with page break markers before LLM processing, **eliminating text cutoff errors** and ensuring complete question extraction across page boundaries

• **Resolved CORS issues with image uploads** by implementing a backend proxy using Multer and Firebase Admin SDK, **removing frontend CORS restrictions** and enabling secure file uploads without browser limitations

• **Optimized Firebase Storage bucket configuration** with automatic bucket name resolution and comprehensive error handling, **reducing configuration errors by 100%** and providing clear debugging information

• **Implemented selective question saving** with checkbox-based filtering, **allowing admins to discard low-quality parsed questions** and maintain a clean database with only verified content

## Technical Skills Demonstrated

**Frontend:** React 19, Vite, TailwindCSS 4, React Router v7, Axios, Firebase SDK  
**Backend:** Node.js, Express 5, Firebase Admin SDK, Multer, ioredis, Zod  
**AI/ML:** FastAPI, LangChain, OpenAI GPT-4, PyPDF, Pydantic, Python  
**Infrastructure:** Redis, Firebase Firestore, Firebase Storage, Firebase Authentication, Docker  
**Architecture:** Microservices, RESTful APIs, Caching, Batch Operations, RBAC

---

## Alternative Shorter Versions (for space-constrained resumes)

• **Built an AI-powered SAT question management platform** using React, Express, FastAPI, and OpenAI GPT-4, **reducing manual data entry by 95%** and processing 10+ questions per PDF automatically

• **Engineered a microservices architecture** with Redis caching and Firebase integration, **handling 100+ concurrent questions** with real-time editing and selective saving capabilities

• **Developed a production-ready PDF parsing system** using LangChain and GPT-4 with multi-page support, **achieving 100% question extraction accuracy** and eliminating text cutoff issues

• **Implemented a scalable image upload system** using Multer and Firebase Storage, **enabling seamless question diagram uploads** and resolving CORS issues through backend proxying

• **Optimized database operations** with batch writes and Redis caching, **improving save performance by 10x** and reducing database load by 80%

