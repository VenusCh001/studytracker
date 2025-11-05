# StudyTrackr 📚

A smart academic life-management application designed for students to organize courses, assignments, research, projects, and online learning with deadlines, reminders, progress tracking, and AI-based scheduling.

## Features ✨

### Core Functionality
- **Course Management**: Organize and track all your courses with schedules, professors, and resources
- **Assignment Tracking**: Manage assignments with deadlines, priorities, and progress tracking
- **Project Management**: Track research projects and course projects with milestones and team collaboration
- **Online Learning Integration**: Integrate with platforms like Coursera, Udemy, edX, and more
- **Auto-Fetch Capabilities**: Automatically fetch course details from supported platforms

### Smart Features
- **AI-Based Scheduling**: Intelligent task scheduling based on deadlines and workload
- **Smart Prioritization**: AI-powered task prioritization considering urgency and importance
- **Progress Tracking**: Visual progress indicators for all tasks and courses
- **Dashboard & Analytics**: Comprehensive overview of academic performance and productivity
- **Reminders & Notifications**: Never miss a deadline with smart reminders
- **Focus Tools**: Built-in productivity features to help maintain focus

### Platform Support
- **Web Application**: Full-featured web interface
- **RESTful API**: Complete API for mobile app integration
- **Cross-Platform**: Works on mobile and desktop

## Technology Stack 🛠️

- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful architecture
- **Authentication**: JWT-based (ready for implementation)

## Installation 🚀

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/VenusCh001/studytracker.git
   cd studytracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your MongoDB URI and other configurations.

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # On Linux/Mac
   sudo systemctl start mongodb
   # Or
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the API**
   The server will be running at `http://localhost:5000`

## API Endpoints 📡

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create new course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/auto-fetch` - Auto-fetch course from platform

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/:id` - Get single assignment
- `GET /api/assignments/upcoming` - Get upcoming assignments
- `GET /api/assignments/overdue` - Get overdue assignments
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id` - Update assignment
- `PUT /api/assignments/:id/progress` - Update progress
- `DELETE /api/assignments/:id` - Delete assignment

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Learning Resources
- `GET /api/learning` - Get all learning resources
- `GET /api/learning/:id` - Get single resource
- `POST /api/learning` - Add new resource
- `PUT /api/learning/:id` - Update resource
- `PUT /api/learning/:id/progress` - Update progress
- `DELETE /api/learning/:id` - Delete resource
- `POST /api/learning/auto-fetch` - Auto-fetch from platform

### AI Schedule
- `POST /api/schedule/generate` - Generate AI-based schedule
- `GET /api/schedule/optimal-times` - Get optimal study times
- `GET /api/schedule/prioritize` - Get prioritized tasks

### Dashboard
- `GET /api/dashboard` - Get dashboard overview
- `GET /api/dashboard/analytics` - Get analytics data

### Health Check
- `GET /api/health` - Check API status

## Usage Examples 💡

### Creating a Course
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Introduction to Computer Science",
    "code": "CS101",
    "professor": "Dr. Smith",
    "credits": 3,
    "semester": "Fall 2025"
  }'
```

### Creating an Assignment
```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Essay on AI Ethics",
    "course": "<course_id>",
    "dueDate": "2025-12-01T23:59:59Z",
    "priority": "high",
    "estimatedHours": 8
  }'
```

### Generating AI Schedule
```bash
curl -X POST http://localhost:5000/api/schedule/generate \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "studyHoursPerDay": 4,
      "breakDuration": 15
    }
  }'
```

## Project Structure 📁

```
studytracker/
├── server/
│   ├── models/           # Database models
│   │   ├── Course.js
│   │   ├── Assignment.js
│   │   ├── Project.js
│   │   └── LearningResource.js
│   ├── controllers/      # Route controllers
│   │   ├── courseController.js
│   │   ├── assignmentController.js
│   │   ├── projectController.js
│   │   ├── learningController.js
│   │   ├── scheduleController.js
│   │   └── dashboardController.js
│   ├── routes/          # API routes
│   │   ├── courseRoutes.js
│   │   ├── assignmentRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── learningRoutes.js
│   │   ├── scheduleRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   └── server.js        # Main server file
├── client/              # Frontend (to be implemented)
│   ├── src/
│   └── public/
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Data Models 📊

### Course
- Name, code, professor, credits
- Schedule (days, time, location)
- Resources and materials
- Auto-fetch support from platforms

### Assignment
- Title, description, due date
- Priority levels (low, medium, high, urgent)
- Progress tracking (0-100%)
- Status tracking (pending, in-progress, completed, overdue)
- Time estimation and actual hours
- Reminders system

### Project
- Research or course projects
- Milestones and team members
- Progress tracking
- Resource management

### Learning Resource
- Platform integration (Coursera, Udemy, etc.)
- Progress tracking
- Auto-fetch capabilities
- Notes and ratings

## Features in Detail 🔍

### AI-Based Scheduling
The system uses intelligent algorithms to:
- Distribute workload evenly across available time
- Consider assignment priorities and deadlines
- Suggest optimal study times based on cognitive patterns
- Balance multiple courses and commitments

### Progress Tracking
- Visual progress indicators for all tasks
- Automatic status updates based on deadlines
- Completion rate analytics
- Time tracking (estimated vs. actual)

### Auto-Fetch Integration
Currently supports mock auto-fetch for:
- Course details from educational platforms
- Learning resources from online platforms
- Can be extended to integrate with real platform APIs

### Dashboard Analytics
- Overview of all courses and assignments
- Upcoming deadlines at a glance
- Recent activity tracking
- Productivity metrics
- Progress by course visualization

## Future Enhancements 🚀

- [ ] User authentication and authorization
- [ ] Real platform API integrations (Coursera, Udemy, edX)
- [ ] Mobile app (React Native)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Collaborative features for group projects
- [ ] Advanced AI recommendations
- [ ] Gamification and achievements
- [ ] Study session timer (Pomodoro)
- [ ] Note-taking integration
- [ ] File attachment support
- [ ] Email notifications
- [ ] Dark mode support

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License.

## Support 💬

For support, please open an issue in the GitHub repository.

---

**StudyTrackr** - Helping students stay organized, consistent, and improve learning outcomes! 🎓
