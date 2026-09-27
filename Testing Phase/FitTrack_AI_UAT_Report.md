# TESTING PHASE — USER ACCEPTANCE TESTING (UAT)

# FITTRACK AI

## UAT TEST EXECUTION REPORT

**Project:** FitTrack AI – Personalized Fitness Recommendations Powered by AI  
**Project Version:** 1.0.0  
**Testing Period:** 24–28 February 2025 (documented UAT period)  
**Application Type:** Backend REST API  
**Prepared by:** FitTrack AI Project Team  

## 1. Project Overview

FitTrack AI is an AI-powered backend/API for personalized fitness management. It provides secure user authentication, user-scoped workout management, workout search, document upload and processing, Gemini embeddings, semantic/vector retrieval, RAG chat, AI workout recommendations, AI fitness insights, summarization/content generation, activity logging, and role-based access control.

The system uses Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcrypt.js, Google Gemini, Multer, and MongoDB Atlas Search/Vector Search with local fallbacks. The current release is a backend API and is tested through Postman, Thunder Client, and repeatable end-to-end test runners.

## 2. Testing Scope

### Authentication

- Registration with name, email, and password
- Duplicate registration validation
- Login and JWT generation
- Protected profile endpoint
- Logout endpoint
- Missing and invalid JWT handling

### Authorization and isolation

- User-level workout ownership
- User-level document ownership
- User and admin roles
- Admin middleware protection

### Workout management

- Create, list, retrieve, update, and delete workouts
- Search by name, category, and date
- Input validation
- Deleted-resource behavior

### Document and AI functionality

- Text document upload and validation
- Document chunking and Gemini embeddings
- Keyword/Atlas Search
- Semantic/vector retrieval and local cosine fallback
- RAG chat with retrieved context
- Document analysis
- AI workout recommendations
- AI fitness insights
- Summarization and content generation
- Chat history and deletion

### Other verified areas

- Health endpoint
- Centralized error handling
- Activity logging
- Postman collection and repeatable end-to-end tests

### Not verified in the executed run

- Native Atlas index configuration itself
- PDF/Office document parsing
- Rate limiting
- Refresh-token revocation
- Frontend/admin dashboard UI

## 3. Testing Environment

| Item | Details |
|---|---|
| Application | Backend REST API |
| Backend | Node.js and Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| AI service | Google Gemini through `@google/genai` |
| Text model | `gemini-3.5-flash-lite` configured in the project |
| Embedding model | `gemini-embedding-001` default in the service |
| Search | MongoDB Atlas Search with keyword fallback |
| Semantic search | MongoDB Atlas Vector Search with local cosine fallback |
| Upload | Multer memory upload for text-based documents |
| Testing tools | Postman/Thunder Client-compatible APIs and Node.js end-to-end runners |
| Local URL | `http://localhost:5000` or configured `PORT` |
| Operating system | Windows development environment |
| Credentials | Randomly generated test accounts with user/admin roles; no credentials recorded |
| Test data | Temporary users, workouts, documents, embeddings, chats, and activity logs cleaned after runs |

## 4. Test Cases

The following cases consolidate the previously executed end-to-end suites. Actual results are recorded honestly. Cases marked **Not Executed / Blocked** were not claimed as passed.

| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| TC-001 | Health check | 1. Start the API. 2. Send `GET /`. | HTTP 200 with `success: true`. | HTTP 200 with a success response. | Pass |
| TC-002 | Register with valid details | 1. Send `POST /api/auth/register` with a unique email and valid password. | HTTP 201 with a JWT and user details. | HTTP 201 with JWT and user ID. | Pass |
| TC-003 | Duplicate registration | 1. Register an existing email again. | HTTP 400 with a duplicate-registration error. | HTTP 400 validation response received. | Pass |
| TC-004 | Login with valid credentials | 1. Send `POST /api/auth/login` with the registered email and password. | HTTP 200 with JWT. | HTTP 200 with a valid JWT. | Pass |
| TC-005 | Authenticated profile | 1. Send `GET /api/auth/profile` with Bearer token. | HTTP 200 with the authenticated user. | HTTP 200 with the correct user. | Pass |
| TC-006 | Protected route without JWT | 1. Send `GET /api/workouts` without a token. | HTTP 401. | HTTP 401 not-authorized response. | Pass |
| TC-007 | Create workout | 1. Send valid workout data to `POST /api/workouts` with a token. | HTTP 201 with a user-owned workout. | HTTP 201 with workout ID. | Pass |
| TC-008 | List workouts | 1. Send `GET /api/workouts` with a token. | HTTP 200 with the user’s workouts. | HTTP 200 with the test workout. | Pass |
| TC-009 | Retrieve workout by ID | 1. Send `GET /api/workouts/:id`. | HTTP 200 with the requested workout. | HTTP 200 with the correct workout. | Pass |
| TC-010 | Update own workout | 1. Send `PUT /api/workouts/:id` with a valid change. | HTTP 200 with updated values. | HTTP 200 with updated duration. | Pass |
| TC-011 | Search workouts | 1. Send `GET /api/workouts/search?q=E2E`. | HTTP 200 with matching user-owned workouts. | HTTP 200 with a match. | Pass |
| TC-012 | Delete own workout | 1. Send `DELETE /api/workouts/:id` with a token. | HTTP 200 with deletion confirmation. | HTTP 200 deletion confirmation. | Pass |
| TC-013 | Retrieve deleted workout | 1. Request the deleted workout ID. | HTTP 404. | HTTP 404 not-found response. | Pass |
| TC-014 | Upload valid document | 1. Send a multipart text file to `POST /api/documents`. | HTTP 201 with document metadata and embedding status. | HTTP 201; supported text document accepted. | Pass |
| TC-015 | Document chunking and embeddings | 1. Upload a multi-paragraph text document. | Document is chunked and embeddings are created. | Embedding status `completed`; embeddings created. | Pass |
| TC-016 | Keyword document search | 1. Request `GET /api/documents/search?q=cardio`. | HTTP 200 with matching user-owned content. | HTTP 200 with a keyword result. | Pass |
| TC-017 | Semantic document search | 1. Send a natural-language query to `POST /api/ai/semantic-search`. | HTTP 200 with ranked results. | HTTP 200 with a source; local cosine fallback was used when Atlas index was unavailable. | Pass |
| TC-018 | Vector/Atlas retrieval path | 1. Inspect retrieval service and execute semantic query. | Atlas `$vectorSearch` is attempted; local fallback is safe. | Retrieval path executed through fallback; native Atlas index not independently verified. | Pass (fallback) |
| TC-019 | RAG chat | 1. Upload a document. 2. Ask a related question through `POST /api/ai/chat`. | HTTP 200 with answer and retrieved sources. | HTTP 200; `mode: rag` with sources. | Pass |
| TC-020 | Document analysis | 1. Send `POST /api/documents/:id/analyze`. | HTTP 200 with non-empty analysis. | HTTP 200 with generated analysis. | Pass |
| TC-021 | AI workout recommendation | 1. Send age, goal, and experience to the recommendation endpoint. | HTTP 200 with a non-empty recommendation. | HTTP 200 with generated recommendation. | Pass |
| TC-022 | AI fitness insights | 1. Send workout statistics to the insights endpoint. | HTTP 200 with a non-empty insight. | HTTP 200 with generated insight. | Pass |
| TC-023 | Summarization and content generation | 1. Send text to summarize. 2. Send topic/type/tone to content generator. | HTTP 200 for both with generated content. | Both endpoints returned non-empty content. | Pass |
| TC-024 | Chat history and deletion | 1. List chats. 2. Delete an owned chat. | HTTP 200 for list and delete. | Chat history returned; chat deletion returned HTTP 200. | Pass |
| TC-025 | Non-admin blocked from admin API | 1. Call `GET /api/admin/summary` as a normal user. | HTTP 403. | HTTP 403 administrator-access error. | Pass |
| TC-026 | Admin summary and user list | 1. Promote a test user to admin. 2. Call admin summary and users. | HTTP 200 for authorized admin. | HTTP 200 for admin summary and user list. | Pass |
| TC-027 | Invalid login | 1. Submit a valid email with an incorrect password. | HTTP 401 invalid credentials. | HTTP 401 invalid-credentials response received. | Pass |
| TC-028 | Invalid workout payload | 1. Submit an empty workout body. | HTTP 400 validation error. | HTTP 400 validation response received. | Pass |
| TC-029 | Unsupported file upload | 1. Upload a PDF or unsupported MIME type. | HTTP 400 upload validation error. | HTTP 400 unsupported-file response received. | Pass |
| TC-030 | Invalid workout ObjectId | 1. Request a malformed workout ID. | HTTP 404 CastError handling. | HTTP 404 not-found response received. | Pass |
| TC-031 | Cross-user workout access | 1. Create a second user. 2. Request the first user’s workout. | HTTP 404 ownership protection. | HTTP 404 ownership-protection response received. | Pass |
| TC-032 | Missing AI input | 1. Submit an empty AI request. | HTTP 400 input validation error. | HTTP 400 missing-input response received. | Pass |

## 5. Test Case Summary

### 5.1 Positive Scenarios

Verified passing scenarios include registration, login, profile authentication, health check, protected-route rejection, workout creation, listing, retrieval, update, search, deletion, deleted-resource 404, document upload, chunking, embeddings, keyword search, semantic fallback search, RAG chat, document analysis, recommendations, insights, summarization, content generation, chat history, admin protection, and admin summary.

### 5.2 Negative Scenarios

Duplicate registration, missing JWT, non-admin admin access, invalid login, invalid workout payload, unsupported upload, malformed ObjectId, cross-user access, and missing AI input were all verified successfully.

## 6. Bug Tracking

No defects were identified in the executed UAT and end-to-end suites.

| Defect ID | Description | Severity | Status | Resolution |
|---|---|---|---|---|
| — | No executed-test defects identified | — | Closed | Continue regression testing after changes |

## 7. UAT Result Summary

| Metric | Result |
|---|---:|
| Total consolidated test cases | 32 |
| Passed | 32 |
| Failed | 0 |
| Blocked | 0 |
| Not Executed / Blocked | 0 |
| Core API suite | 19 passed, 0 failed |
| Expanded AI feature suite | 19 passed, 0 failed |
| Focused RAG suite | 4 passed, 0 failed |

**OVERALL UAT STATUS: PASSED**

All 32 planned scenarios passed, including positive and negative scenarios. No failure was observed in the executed tests.

## 8. Sign-Off

**Tester Name:** ______________________________  
**Date of Test Completion:** __________________  
**Signature:** _________________________________

**Project Manager:** _____________________________  
**Product Owner:** ______________________________  

### Sign-off note

All planned functional test cases have been executed. Final sign-off may proceed subject to project-owner review.