# StudyTrackr Quick Start Guide

This guide will help you get StudyTrackr up and running in minutes.

## Prerequisites

- Node.js v20+ installed
- MongoDB running locally or MongoDB Atlas account
- Terminal/Command Prompt

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/VenusCh001/studytracker.git
cd studytracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb://localhost:27017/studytracker_dev
JWT_SECRET=your-secure-random-secret-key-here
PORT=5000
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

If using local MongoDB:
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# MongoDB should start automatically as a service
# Or run: mongod --dbpath C:\data\db
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB (development)
🚀 StudyTrackr server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### 6. Create Your First Account

1. Click "Register" on the login page
2. Enter your details:
   - Username: test_user
   - Email: test@example.com
   - Password: password123
3. Click "Register"
4. You'll be automatically logged in and redirected to the dashboard

## First Steps in the App

### Create Your First Task
1. Navigate to "Tasks" in the header
2. Click "+ Add Task"
3. Fill in the form:
   - Title: "Complete Math Assignment"
   - Type: Assignment
   - Priority: High
   - Due Date: Pick a date
4. Click "Create"

### Add Your First Course
1. Navigate to "Courses"
2. Click "+ Add Course"
3. Fill in the form:
   - Title: "React Complete Guide"
   - Platform: Udemy
   - URL: (optional)
   - Instructor: (optional)
4. Click "Create"

### Create a Resource
1. Navigate to "Resources"
2. Click "+ Add Resource"
3. Fill in the form:
   - Title: "JavaScript Notes"
   - Type: Note
   - Content: Your notes here
   - Tags: javascript, programming
4. Click "Create"

### Check Your Progress
1. Navigate back to "Dashboard"
2. View your statistics:
   - Task completion rate
   - Course progress
   - Current streak

## Common Issues

### MongoDB Connection Failed
- Make sure MongoDB is running
- Check the connection string in `backend/.env`
- For MongoDB Atlas, whitelist your IP address

### Port Already in Use
- Backend port 5000:
  ```bash
  # Change PORT in backend/.env to 5001
  PORT=5001
  ```
- Frontend port 5173:
  ```bash
  # Vite will automatically use the next available port
  # Or specify: npm run dev -- --port 3000
  ```

### API Connection Error
- Ensure backend is running
- Check `VITE_API_URL` in `frontend/.env`
- Check browser console for CORS errors

## What's Next?

- Explore all features (Tasks, Courses, Resources)
- Track your progress on the Dashboard
- Read the full [README.md](README.md) for detailed documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review the [API documentation](README.md#-api-documentation)
- Open an issue on GitHub for bugs or feature requests

---

**Happy Learning! 📚✨**
