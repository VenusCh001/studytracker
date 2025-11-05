// Mock data for demo mode when MongoDB is not available

const mockCourses = [
  {
    _id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    professor: 'Dr. Smith',
    credits: 3,
    semester: 'Fall 2025',
    status: 'active',
    color: '#3B82F6'
  },
  {
    _id: '2',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    professor: 'Dr. Johnson',
    credits: 4,
    semester: 'Fall 2025',
    status: 'active',
    color: '#10B981'
  },
  {
    _id: '3',
    name: 'Web Development',
    code: 'CS301',
    professor: 'Dr. Williams',
    credits: 3,
    semester: 'Fall 2025',
    status: 'active',
    color: '#F59E0B'
  }
];

const mockAssignments = [
  {
    _id: 'a1',
    title: 'Build a Calculator App',
    course: mockCourses[0],
    description: 'Create a functional calculator using HTML, CSS, and JavaScript',
    dueDate: new Date('2025-12-15'),
    priority: 'high',
    status: 'in-progress',
    progress: 60,
    estimatedHours: 8
  },
  {
    _id: 'a2',
    title: 'Binary Search Tree Implementation',
    course: mockCourses[1],
    description: 'Implement a BST with insert, delete, and search operations',
    dueDate: new Date('2025-12-10'),
    priority: 'urgent',
    status: 'pending',
    progress: 20,
    estimatedHours: 12
  },
  {
    _id: 'a3',
    title: 'Portfolio Website',
    course: mockCourses[2],
    description: 'Create a personal portfolio website',
    dueDate: new Date('2025-12-20'),
    priority: 'medium',
    status: 'pending',
    progress: 10,
    estimatedHours: 15
  },
  {
    _id: 'a4',
    title: 'Algorithm Analysis Paper',
    course: mockCourses[1],
    description: 'Write a paper analyzing sorting algorithms',
    dueDate: new Date('2025-12-05'),
    priority: 'high',
    status: 'completed',
    progress: 100,
    estimatedHours: 6,
    actualHours: 7
  }
];

const mockProjects = [
  {
    _id: 'p1',
    title: 'Machine Learning Research',
    type: 'research',
    description: 'Research project on neural networks',
    status: 'in-progress',
    progress: 45,
    startDate: new Date('2025-09-01'),
    endDate: new Date('2026-05-01')
  }
];

const mockLearningResources = [
  {
    _id: 'l1',
    title: 'Python for Data Science',
    platform: 'coursera',
    type: 'course',
    progress: 75,
    completed: false
  },
  {
    _id: 'l2',
    title: 'React Complete Guide',
    platform: 'udemy',
    type: 'course',
    progress: 100,
    completed: true
  }
];

module.exports = {
  mockCourses,
  mockAssignments,
  mockProjects,
  mockLearningResources
};
