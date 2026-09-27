# AI BLOGNEST API

## AI-Powered Backend REST API for Intelligent Blog Content Generation and Search

**Team ID:** SWTID-2026-6999  
**Team Leader:** Ganesh Kumar T  
**Team Members:** Hariharan R, Dinesh Karthick V, Santhosh M  
**Course:** B.Sc. Computer Science with Artificial Intelligence  
**College:** DRBCCC Hindu College  
**University:** University of Madras  
**Academic Year:** 2026-2027  

## 1. Abstract

AI BlogNest API is an AI-powered backend REST API for blog creation, content management, and intelligent content discovery. It is developed using Node.js, Express.js, MongoDB Atlas, Mongoose, JWT authentication, bcrypt password hashing, and Google Gemini AI. The system supports Administrator, Editor, Author, and Reader roles, category management, tag filtering, comment management, and comment moderation. Gemini generates blog content and summaries. MongoDB Atlas Search provides keyword-based full-text search, while Atlas Vector Search provides semantic search using vector embeddings. The backend follows modular MVC architecture with models, controllers, services, routes, and middleware. Postman is used to test and demonstrate the APIs.

## 2. Introduction

Blogging platforms are important for sharing information, knowledge, opinions, tutorials, and educational content. Managing large amounts of content becomes difficult when users must create articles, organize categories, manage comments, control permissions, and search large collections of posts. Traditional systems also require manual content creation, summaries, and tags, and keyword-only search may not retrieve conceptually related articles.

AI BlogNest API combines backend development with Generative AI and intelligent search. Google Gemini supports AI-assisted blog generation and summarization. MongoDB Atlas Search and Vector Search provide keyword and semantic discovery. The project is a headless backend REST API accessed through Postman or similar clients.

## 3. Project Title and Description

**Project Title:** AI BlogNest API  

**Theme:** AI-Powered Backend REST API for Intelligent Blog Content Generation, Management and Search.

AI BlogNest is a secure platform for blog creation and content management. Authors manage their own posts, editors review and publish content, administrators manage the platform, and readers view published blogs and comment. The system provides keyword and semantic search.

## 4. Problem Statement

- **Manual content creation:** Writing complete articles requires considerable time.
- **Manual summarization:** Long articles require additional work to summarize.
- **Content organization:** Drafts, categories, tags, statuses, and comments become difficult to manage.
- **Permission management:** Authors must not modify other authors’ content; administrators need broader permissions.
- **Traditional search limitations:** Exact keyword search may miss related concepts.
- **Security requirements:** Backend systems need authentication, authorization, password protection, validation, sanitization, and rate limiting.

## 5. Proposed Solution

AI BlogNest provides a centralized backend platform combining content management with AI:

- Secure registration and login
- JWT authentication
- Role-Based Access Control
- Blog CRUD operations
- Category management
- Tag-based filtering
- Comment management and moderation
- Gemini blog generation
- Gemini summarization
- MongoDB Atlas Search
- MongoDB Atlas Vector Search
- Semantic search
- Input validation and sanitization
- Rate limiting
- Structured logging

## 6. Objectives

### Primary Objectives

1. Develop a backend REST API for blog management.
2. Implement secure JWT authentication.
3. Implement role-based authorization.
4. Provide complete blog CRUD operations.
5. Integrate Google Gemini AI.
6. Generate blog content using AI.
7. Summarize blog content using AI.
8. Implement MongoDB Atlas Search.
9. Implement MongoDB Atlas Vector Search.
10. Implement semantic search using embeddings.

### Secondary Objectives

1. Improve content management efficiency.
2. Reduce manual content creation effort.
3. Provide controlled access for different users.
4. Improve blog discovery through intelligent search.
5. Maintain a secure backend environment.
6. Provide a testable and modular REST API.

## 7. System Requirements

### 7.1 Software Requirements

| Component | Requirement |
|---|---|
| Operating System | Windows 10/11, macOS, or Linux |
| Runtime | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT |
| Password Security | bcryptjs |
| AI Service | Google Gemini |
| Search | MongoDB Atlas Search |
| Semantic Search | MongoDB Atlas Vector Search |
| API Testing | Postman, Thunder Client, or EchoAPI |
| IDE | Visual Studio Code |

### 7.2 Hardware Requirements

- Intel Core i5 8th Generation or equivalent
- 8 GB RAM minimum; 16 GB recommended
- 1 GB available project storage
- Internet connection for Atlas and Gemini services

## 8. Technology Used

- **Node.js:** Runtime environment.
- **Express.js:** REST APIs, routing, and middleware.
- **MongoDB Atlas:** Cloud NoSQL database.
- **Mongoose:** Schemas, validation, and database operations.
- **JWT:** Authentication and protected access.
- **bcryptjs:** Password hashing.
- **Google Gemini:** Blog generation and summarization.
- **MongoDB Atlas Search:** Full-text keyword search.
- **MongoDB Atlas Vector Search:** Semantic search using embeddings.
- **Postman:** API testing and demonstration.

## 9. System Architecture

The application follows a layered backend architecture containing an Express server gateway, authentication and role middleware, business services, Mongoose database models, and AI/search services connected to Gemini and Atlas.

### Architecture Flow

```text
Client -> Express API -> JWT/RBAC -> Controllers -> Services
                                      |-> MongoDB Atlas
                                      |-> Google Gemini
```

## 10. MVC Architecture

### Model Layer

Models include User, Blog, Category, Comment, and Embedding.

### Controller Layer

Controllers include Authentication, User, Blog, Category, Comment, AI, and Search controllers.

### Routing Layer

Routes define REST endpoints and connect requests to controllers.

### Service Layer

Services include Blog, Category, Comment, User, Gemini, Embedding, Search, and Vector Search services.

## 11. Database Design

MongoDB Atlas is the primary database. Main collections are:

- Users
- Blogs
- Categories
- Comments
- Embeddings

### User Entity

| Field | Description |
|---|---|
| `_id` | Unique user identifier |
| `name` | User name |
| `email` | Unique email address |
| `password` | Hashed password |
| `role` | Admin, Editor, Author, or Reader |
| `createdAt` | Creation time |
| `updatedAt` | Last update time |

### Blog Entity

| Field | Description |
|---|---|
| `userID` | Author reference |
| `title` | Blog title |
| `photo` | Media information/path |
| `content` | Main blog content |
| `likes` | Number of likes |
| `category` | Blog category |
| `tags` | Search/filter tags |
| `status` | Draft, Pending, Scheduled, or Published |
| `timestamps` | Creation and update times |

### Category, Comment, and Embedding Entities

- Category: name, description, created date, updated date.
- Comment: blog ID, user ID, content, moderation status, timestamps.
- Embedding: blog ID, vector data, and model metadata.

## 12. Entity Relationship Diagram

- One user can create multiple blogs.
- One user can create multiple comments.
- One blog can contain multiple comments.
- A blog can belong to a category.
- A blog can have associated embedding data.

## 13. User Roles and Responsibilities

| Role | Responsibilities |
|---|---|
| Admin | Manage users, roles, blogs, categories, and moderation |
| Editor | Review content, manage publishing, categories, and comments |
| Author | Create and manage own blogs and use AI generation |
| Reader | View published blogs, search, and comment |

## 14. Role-Based Access Control

| Operation | Admin | Editor | Author | Reader |
|---|---|---|---|---|
| Create Blog | Yes | Yes | Yes | No |
| Update Own Blog | Yes | Yes | Yes | No |
| Update Any Blog | Yes | Yes | No | No |
| Delete Blog | Yes | Limited | Own | No |
| Manage Categories | Yes | Yes | No | No |
| Create Comment | Yes | Yes | Yes | Yes |
| Moderate Comments | Yes | Yes | No | No |
| Change User Role | Yes | No | No | No |
| View Published Blogs | Yes | Yes | Yes | Yes |

## 15. Authentication and JWT

- `POST /api/auth/register` creates an account and hashes the password.
- `POST /api/auth/login` verifies credentials and returns a JWT.
- `POST /api/auth/logout` supports client-side token discard.
- `GET /api/auth/me` returns the current user.
- Protected requests use `Authorization: Bearer <JWT_TOKEN>`.

## 16. Blog Management

Blog APIs:

```text
POST   /api/blogs
GET    /api/blogs
GET    /api/blogs/:id
PUT    /api/blogs/:id
DELETE /api/blogs/:id
```

Blog statuses are Draft, Pending, Scheduled, and Published. Ownership protection ensures authors manage their own posts while elevated roles manage broader content.

## 17. Category and Comment Management

Category APIs provide CRUD under `/api/categories`. Comment APIs are:

```text
POST   /api/blogs/:blogId/comments
GET    /api/blogs/:blogId/comments
PUT    /api/comments/:id
DELETE /api/comments/:id
```

Comment moderation states are Pending, Approved, and Spam. Admins and Editors moderate comments.

## 18. Google Gemini Integration

### AI Blog Generation

`POST /api/ai/generate-blog` accepts a topic and returns title, content, summary, and tags.

### Prompt Engineering

```text
Topic -> Structured Prompt -> Google Gemini -> Generated Blog Content
```

### AI Blog Summarization

`POST /api/ai/summarize` accepts long content and returns a concise summary.

## 19. Atlas Search, Vector Search, and Semantic Search

Atlas Search provides keyword search across blog titles, content, and tags. Blog content is converted into embeddings and stored in MongoDB for Vector Search.

```text
GET /api/search?q=<search-term>
GET /api/search/semantic?q=<question>
```

Recommended indexes:

- Atlas Search on `blogs.title`, `blogs.content`, and `blogs.tags`.
- Vector Search on `embeddings.vector` with cosine similarity.

## 20. Security Features

- Password hashing with bcrypt.
- JWT-protected routes.
- Role-based authorization.
- Input validation and sanitization.
- Rate limiting.
- Safe error handling.
- Sensitive-data protection.

## 21. API Module Summary

| Module | Endpoints |
|---|---|
| Authentication | `/api/auth/register`, `/login`, `/logout`, `/me` |
| AI | `/api/ai/generate-blog`, `/api/ai/summarize` |
| Users | `/api/users`, `/profile`, `/:id`, `/:id/role` |
| Blogs | `/api/blogs` CRUD |
| Categories | `/api/categories` CRUD |
| Comments | Blog and comment routes |
| Search | `/api/search` and `/api/search/semantic` |

## 22. API Testing and Results

Testing uses Postman, Thunder Client, or EchoAPI for VS Code. The reported verification result is **25 Passed, 0 Failed** across authentication, roles, categories, blogs, comments, ownership protection, pagination, and filtering.

## 23. System Functionality Summary

| Module | Main Functionality |
|---|---|
| Authentication | Registration, login, JWT |
| Authorization | Admin, Editor, Author, Reader |
| Blog | Create, read, update, delete |
| Category | Category management |
| Comments | Creation and moderation |
| Gemini AI | Blog generation and summarization |
| Atlas Search | Keyword search |
| Vector Search | Semantic search |
| Security | Validation, sanitization, rate limiting |
| Testing | Postman and automated testing |

## 24. Advantages

- AI-assisted blog creation reduces manual effort.
- AI summarization produces concise content.
- RBAC controls access to system operations.
- Atlas Search supports keyword discovery.
- Vector Search supports semantic discovery.
- MVC provides modular separation.
- Postman enables direct API testing.

## 25. Limitations

- The system is backend-focused.
- AI functionality depends on Gemini availability.
- Search depends on Atlas configuration.
- Semantic quality depends on embeddings and available content.
- Production scale requires additional infrastructure.

## 26. Future Enhancements

- Web frontend
- Rich text editor
- Advanced blog analytics
- Scheduled publishing
- Personalized recommendations
- AI-assisted SEO
- Automated content moderation
- Multi-language content generation

## 27. Conclusion

AI BlogNest API combines backend development, secure authentication, role-based authorization, database management, Generative AI, full-text search, and semantic vector search in one REST API platform. It supports blog lifecycle management and improves content discovery through Gemini and Atlas search technologies.

## 28. Selected Implementation Code

The following excerpts illustrate the documented BlogNest implementation patterns. No credentials or secret values are included.

### Express Server

```javascript
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.listen(process.env.PORT || 5000);
```

### Blog Model

```javascript
const blogSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [String],
  status: { type: String, enum: ['Draft', 'Pending', 'Scheduled', 'Published'], default: 'Draft' },
  likes: { type: Number, default: 0 }
}, { timestamps: true });
```

### Gemini Blog Generation

```javascript
const response = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL,
  contents: `Write a blog about ${topic}. Return title, content, summary, and tags.`
});
return response.text;
```

### Vector Search

```javascript
const results = await Embedding.aggregate([
  { $vectorSearch: { index: 'blog_vector_index', path: 'vector', queryVector, numCandidates: 100, limit: 10 } },
  { $addFields: { score: { $meta: 'vectorSearchScore' } } },
  { $sort: { score: -1 } }
]);
```

### RBAC Middleware

```javascript
const allow = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }
  next();
};
```