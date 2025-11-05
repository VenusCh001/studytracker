# 🚀 StudyTrackr — Smart Academic Companion

An intuitive and aesthetically designed app to manage everything a student needs to learn, track, and achieve in one place.

![StudyTrackr](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✅ What It Does

StudyTrackr centralizes courses, assignments, research goals, personal learning, and productivity — ensuring clarity, focus, and progress throughout a student's academic journey.

## 🌟 Key Features

### 🔹 Smart Task Manager
- Track courses, assignments, research work, projects, and online learning
- Progress bars, priorities, and reminders
- Status tracking (pending, in-progress, completed, overdue)
- Priority levels (low, medium, high, urgent)

### 🔹 Course Management
- Organize online learning from multiple platforms
- Track course progress with visual indicators
- Support for YouTube, Udemy, Coursera, edX, GeeksforGeeks, and custom courses
- Module/lesson completion tracking

### 🔹 Academic Resources Hub
- Store notes, links, references, and study materials
- Organize by type and category
- Tag-based filtering
- Favorite resources for quick access

### 🔹 Beautiful Progress Dashboards
- Clean analytics: completion %, streaks, productivity metrics
- Real-time statistics on tasks and courses
- Visual progress indicators
- Streak tracking for motivation

### 🔹 User Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes and API endpoints

## 🧩 Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Custom CSS** - Minimal, calming design with soft color palette

### Backend
- **Node.js + Express** - Server framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VenusCh001/studytracker.git
   cd studytracker
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/studytracker
   JWT_SECRET=your-secret-key-change-in-production
   PORT=5000
   NODE_ENV=development
   ```

   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Task Endpoints (Requires Authentication)

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete Math Assignment",
  "description": "Finish exercises 1-10",
  "type": "assignment",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

#### Update Task Progress
```http
PATCH /api/tasks/:id/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "progress": 75
}
```

### Course Endpoints (Requires Authentication)

#### Get All Courses
```http
GET /api/courses
Authorization: Bearer <token>
```

#### Create Course
```http
POST /api/courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "React Complete Guide",
  "platform": "udemy",
  "instructor": "John Doe",
  "url": "https://udemy.com/course/react"
}
```

### Resource Endpoints (Requires Authentication)

#### Get All Resources
```http
GET /api/resources
Authorization: Bearer <token>
```

#### Create Resource
```http
POST /api/resources
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "JavaScript Notes",
  "type": "note",
  "content": "Important JavaScript concepts...",
  "category": "lecture-notes",
  "tags": ["javascript", "programming"]
}
```

### Progress Endpoints (Requires Authentication)

#### Get Dashboard Statistics
```http
GET /api/progress/stats
Authorization: Bearer <token>
```

## 🎨 UI & Design

The application features:
- **Minimal + calming design** for a lightweight experience
- **Soft color palette** with high readability
- **Card-based layout** for visual clarity
- **Smooth animations** for engagement
- **Responsive design** for mobile and desktop

### Color Scheme
- Primary: `#6366f1` (Indigo)
- Secondary: `#10b981` (Green)
- Background: `#f9fafb` (Light Gray)
- Surface: `#ffffff` (White)
- Error: `#ef4444` (Red)
- Warning: `#f59e0b` (Amber)

## 📂 Project Structure

```
studytracker/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/       # React pages
│   │   ├── services/    # API services
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── package.json
└── README.md
```

## 🔐 Security Features

- Password hashing with bcryptjs (10 rounds)
- JWT-based authentication with 7-day token expiration
- Protected API routes with authentication middleware
- Input validation on Mongoose models
- CORS configuration for cross-origin requests
- Environment-specific database separation (dev/prod)

### Security Considerations

**Authentication Token Storage**
- Current implementation uses localStorage for JWT tokens
- For production deployment, consider:
  - Implementing httpOnly cookies for enhanced XSS protection
  - Token rotation and refresh token mechanism
  - Shorter token expiration times
  - Content Security Policy (CSP) headers

**Database Security**
- Always use environment variables for sensitive configuration
- Different database names for development and production
- Enable MongoDB authentication in production
- Use connection string encryption

**Password Security**
- Minimum 6 characters required (configurable in User model)
- Bcrypt hashing with salt rounds
- Consider adding password complexity requirements for production

## 🚦 Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Runs with Vite HMR
```

### Building for Production

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

## 🧪 Testing

### Backend Testing
The backend includes several security measures:
- Rate limiting on all API routes
- Input validation and sanitization
- NoSQL injection prevention
- JWT authentication

To test the API:
```bash
cd backend
npm start

# In another terminal, test the health endpoint
curl http://localhost:5000/health
```

### Frontend Testing
```bash
cd frontend
npm run dev

# Build for production
npm run build
```

## 🔮 Future Enhancements

### Phase 2 - Enhanced Features
- [ ] Auto-Fetch from Learning Platforms (YouTube API integration)
- [ ] Course metadata extraction from URLs
- [ ] Advanced search and filtering
- [ ] Export data (CSV, PDF)
- [ ] Dark mode support

### Phase 3 - AI & Productivity
- [ ] AI-Powered Roadmaps & Scheduling
- [ ] Focus & Well-Being Mode (Pomodoro timer)
- [ ] Mood tracking insights
- [ ] Smart task prioritization
- [ ] Predicted delays and workload balancing

### Phase 4 - Collaboration & Mobile
- [ ] Collaboration features (shared projects)
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] File upload support with cloud storage
- [ ] Advanced analytics and charts
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. Follow existing code style and patterns
2. Add comments for complex logic
3. Test your changes thoroughly
4. Update documentation as needed
5. Ensure security best practices

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

Created by the StudyTrackr team

## 🙏 Acknowledgments

- Inspired by the need for a comprehensive academic tracking solution
- Built with modern web technologies
- Designed with students in mind

---

**Made with ❤️ for students worldwide**
