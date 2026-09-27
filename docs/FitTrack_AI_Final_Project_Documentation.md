# FitTrack AI

## AI-Powered Fitness Tracker Backend REST API

**Project:** FitTrack AI – Personalized Fitness Recommendations Powered by AI  
**Technology:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcrypt.js, Google Gemini AI  
**Project Type:** Secure AI-Augmented Fitness Tracking Backend  

## Table of Contents

1. Abstract
2. Introduction
3. Project Title
4. Project Description
5. Problem Statement
6. Proposed Solution
7. Objectives
8. System Requirements
9. Technology Used
10. System Architecture
11. MVC and Application Architecture
12. Database Design
13. Entity and Collection Details
14. Entity Relationship Diagram
15. User Roles and Responsibilities
16. Role-Based Access Control
17. Authentication and JWT
18. Core Fitness Tracking Functionality
19. AI Integration
20. AI-Powered Fitness Recommendations
21. AI Fitness Insights
22. Document Upload and Processing
23. Embeddings
24. Search Functionality
25. RAG-Based Chat
26. Prompt Engineering
27. Security Features
28. API Module Summary
29. API Testing
30. Testing Results
31. System Functionality Summary
32. Advantages
33. Limitations
34. Future Enhancements
35. Conclusion

---

## Abstract

FitTrack AI is a secure backend REST application for recording, searching, and analyzing personal workouts. It uses Node.js, Express.js, MongoDB Atlas, Mongoose, JWT authentication, bcrypt password hashing, and Google Gemini AI. Authenticated users can manage their own workout history, search workouts, request personalized workout recommendations, and receive fitness insights. The expanded backend also supports text document uploads, embeddings, semantic and vector search, RAG chat, summarization, content generation, activity logs, and admin APIs.

## Introduction

Fitness users often record workouts in notebooks, spreadsheets, or disconnected applications. This creates inaccurate history, slow calculations, and difficulty finding previous activities. Traditional trackers also do not provide guidance based on a user’s age, goal, experience, or workout statistics. FitTrack AI combines reliable backend storage and authentication with Gemini-powered recommendations and insights to make workout tracking more useful and personalized.

## Project Title

**FitTrack AI – Personalized Fitness Recommendations Powered by AI**

## Project Description

FitTrack AI is a secure REST API platform for workout management and AI-assisted fitness guidance. Users register, log in, and receive a JWT token. They can add, view, update, delete, and search personal workouts. AI endpoints generate workout recommendations from age, goal, and experience, and fitness insights from workout statistics. The system also supports document-based RAG chat and administrator management APIs.

## Problem Statement

### 5.1 Manual Content Creation

Recording workouts manually is time-consuming and causes missing or incorrect entries.

### 5.2 Manual Summarization

Users must manually calculate duration, calories, and progress from raw workout records.

### 5.3 Content Organization

Workout history becomes difficult to organize and search as the number of activities increases.

### 5.4 Permission Management

Personal fitness records must be accessible only to their authenticated owner.

### 5.5 Traditional Search Limitations

Keyword search does not answer questions or retrieve conceptually related fitness information.

### 5.6 Security Issues

Passwords, protected routes, validation, and user data isolation must be handled securely.

## Proposed Solution

FitTrack AI provides secure authentication, user-scoped workout CRUD, keyword and semantic search, Gemini workout recommendations, fitness insights, document upload, embeddings, RAG chat, summarization, content generation, activity logs, and admin APIs.

## Objectives

### 7.1 Primary Objectives

1. Develop a secure fitness tracking REST API.
2. Implement JWT authentication and password hashing.
3. Implement user-level workout data isolation.
4. Provide complete workout CRUD operations.
5. Integrate Google Gemini AI.
6. Generate personalized workout recommendations.
7. Generate fitness insights from workout statistics.
8. Implement semantic and vector search with local fallbacks.

### 7.2 Secondary Objectives

1. Reduce manual workout tracking effort.
2. Improve workout discovery.
3. Provide role-based administration.
4. Support document-based AI question answering.
5. Provide testable and modular backend services.

## System Requirements

### 8.1 Software Requirements

| Component | Requirement |
|---|---|
| Operating System | Windows 10/11, macOS, or Linux |
| Runtime | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT |
| Password Security | bcrypt.js |
| AI Service | Google Gemini |
| Search | Atlas Search and Vector Search with fallbacks |
| API Testing | Postman, Thunder Client, and end-to-end tests |

### 8.2 Hardware Requirements

- Intel Core i5 8th Gen or equivalent
- 8 GB RAM minimum; 16 GB recommended
- 1 GB project storage
- Internet connection for Atlas and Gemini

## Technology Used

Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcrypt.js, Google Gemini through `@google/genai`, Multer, dotenv, Morgan, Postman, and local cosine-similarity fallback.

## System Architecture

```text
Client -> Express Routes -> JWT/Role Middleware -> Controllers
                                              -> Gemini Service
                                              -> Retrieval Service
                                              -> Mongoose Models -> MongoDB Atlas
```

The architecture diagram shows the API client, Express application, MongoDB Atlas collections, and Google Gemini services.

## MVC Architecture

### 11.1 Model Layer

User, Workout, Document, Embedding, Chat, and ActivityLog Mongoose models.

### 11.2 Controller Layer

Authentication, workout, AI, document, and admin controllers.

### 11.3 Routing Layer

Express routes for `/api/auth`, `/api/workouts`, `/api/ai`, `/api/documents`, and `/api/admin`.

### 11.4 Service Layer

Gemini service, retrieval service, and activity service.

## Database Design

MongoDB Atlas stores Users, Workouts, Documents, Embeddings, Chats, and ActivityLogs.

### User Entity

Fields: `_id`, name, email, hashed password, role, createdAt, updatedAt.

### Workout Entity

Fields: `_id`, user reference, workoutName, category, duration, caloriesBurned, workoutDate, timestamps.

### Document Entity

Fields: `_id`, title, content, originalName, mimeType, size, uploadedBy, embeddingStatus, timestamps.

### Embedding Entity

Fields: `_id`, document reference, user reference, chunkIndex, text, vector, model, timestamps.

### Chat Entity

Fields: `_id`, user reference, message, response, mode, sources, timestamps.

### ActivityLog Entity

Fields: `_id`, user reference, action, resourceType, resourceId, metadata, timestamps.

## Entity Relationship Diagram

A User owns Workouts, uploads Documents, creates Chats, and generates ActivityLogs. A Document produces multiple Embeddings. Every workout and document query is scoped to the authenticated user.

## User Roles and Responsibilities

### 19.1 Admin

Manage users, roles, documents, activity logs, and system summary.

### 19.2 Authenticated User

Register, log in, manage personal workouts, upload documents, search content, use RAG chat, and request AI recommendations.

## Role-Based Access Control

| Operation | Admin | User |
|---|---|---|
| Manage own workouts | Yes | Yes |
| Manage any workout | Yes | No |
| Upload documents | Yes | Yes |
| Request AI features | Yes | Yes |
| Manage user roles | Yes | No |
| View activity summary | Yes | No |

## Authentication and JWT

`POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/profile` are implemented. Protected requests use `Authorization: Bearer <JWT_TOKEN>`.

## Workout Management

Workout APIs provide create, list, retrieve, update, delete, and search. Search supports name, category, and date. Ownership protection prevents access to another user’s workouts.

## AI and Document Features

Gemini generates workout recommendations, fitness insights, summaries, and content. Users can upload text documents, create embeddings, search semantically, and ask RAG questions with retrieved context.

## MongoDB Atlas Search and Vector Search Index

Atlas Search uses `document_search_index` on `documents.title` and `documents.content`. Vector Search uses `document_vector_index` on `embeddings.vector` with cosine similarity. Local fallbacks keep the API usable when indexes are unavailable.

## Semantic Search

`POST /api/ai/semantic-search` retrieves conceptually related document chunks using Gemini query embeddings and vector retrieval. The system falls back to local cosine similarity when necessary.

## MongoDB Atlas Search

`GET /api/documents/search?q=<term>` performs keyword or Atlas Search across uploaded documents, with a keyword fallback.

## Security Features

- bcrypt password hashing
- JWT authentication
- Protected routes
- User-level data isolation
- Input validation
- Safe error responses
- Environment-based secrets
- Role-based admin middleware

## API Module Summary

| Module | Endpoints |
|---|---|
| Auth | `/api/auth/register`, `/login`, `/logout`, `/profile` |
| Workouts | `/api/workouts` CRUD and search |
| AI | `/api/ai/workout-recommendation`, `/fitness-insights`, `/chat`, `/semantic-search`, `/summarize`, `/content-generator` |
| Documents | `/api/documents` upload, list, search, analyze, delete |
| Admin | `/api/admin/users`, `/documents`, `/activity`, `/summary` |

## API Testing

Testing uses Postman, Thunder Client, and repeatable end-to-end tests.

## Testing Results

| Test suite | Passed | Failed |
|---|---:|---:|
| Core API end-to-end suite | 19 | 0 |
| Expanded AI feature suite | 19 | 0 |
| Focused RAG suite | 4 | 0 |
| Focused negative suite | 6 | 0 |
| Consolidated UAT scenarios | 32 | 0 |

## System Functionality Summary

Authentication, authorization, workout management, document management, embeddings, semantic search, Atlas Search, Vector Search, RAG chat, AI recommendations, AI insights, activity logs, and admin APIs.

## Advantages

- Centralized workout history
- Secure user data
- Personalized AI guidance
- Semantic and keyword search
- Modular MVC structure
- Reusable AI and retrieval services

## Limitations

- Backend-only project
- Atlas index configuration is required for native search
- Gemini availability affects AI endpoints
- PDF and Office document parsing is not included
- Admin dashboard is API-based rather than a frontend screen

## Future Enhancements

- Web and mobile frontend
- Progress dashboard and charts
- Nutrition and BMI tracking
- Wearable integration
- Workout reminders
- PDF parsing
- Richer AI fitness coaching

## Conclusion

FitTrack AI demonstrates how traditional backend development can be augmented with AI. Secure authentication, user-scoped workout management, Gemini recommendations, fitness insights, document embeddings, Atlas Search, Vector Search, RAG chat, and admin services provide a practical and extensible fitness platform.

## Selected Project Code

```javascript
// src/server.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
connectDB();
const server = app.listen(process.env.PORT || 5000);
```

```javascript
// JWT-protected AI route
router.use(protect);
router.post('/workout-recommendation', getWorkoutRecommendation);
```

```javascript
// Gemini request
const response = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL,
  contents: prompt
});
```

```javascript
// User-scoped workout query
const workouts = await Workout.find({ user: req.user._id });
```

## Appendix: Source Inspection and Implementation Notes

### Files inspected

- `package.json`, `package-lock.json`, `.env.example`, `README.md`
- `src/server.js`, `src/app.js`, `src/config/db.js`
- All files in `src/routes`, `src/controllers`, `src/models`, `src/middleware`, and `src/services`
- `FitTrack.postman_collection.json`
- `Testing Phase/FitTrack_AI_UAT_Report.md`

### Verified modules

Authentication, workout CRUD, user-level ownership, Google Gemini text generation, Gemini embeddings, document chunking, Atlas Search, Atlas Vector Search, keyword and local cosine fallbacks, RAG chat, chat history, activity logging, admin management, Multer upload validation, and centralized error handling.

### Verified collections

`users`, `workouts`, `documents`, `embeddings`, `chats`, and `activitylogs`.

### Verified API modules

`/api/auth`, `/api/workouts`, `/api/ai`, `/api/documents`, `/api/admin`, and the root health endpoint `GET /`.

### Testing evidence

The repository contains a Postman collection and a Testing Phase UAT report. The report records a consolidated result of 32 passed and 0 failed scenarios after the negative batch was rerun successfully. `package.json` does not define an `npm test` script, so the evidence is UAT/E2E based rather than an npm test-suite result.

### Implementation boundaries

The source does not implement Helmet, rate limiting, refresh-token revocation, PDF/Office parsing, a frontend, or a dedicated workout pagination contract. These are documented as limitations or future enhancements rather than implemented features.
