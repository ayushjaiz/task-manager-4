# Task Manager

A modern, full-stack task management web application built with Next.js 14, TypeScript, MongoDB, and shadcn/ui. Users can register, log in, and manage their personal tasks with features like search, filtering, pagination, and optimistic updates.

## ✨ Features

### Authentication

- **Secure Registration & Login** - Email and password authentication
- **JWT-based Authentication** - Secure token-based authentication with HTTP-only cookies
- **Password Hashing** - Bcrypt encryption for secure password storage
- **Protected Routes** - Users can only access their own tasks

### Task Management (CRUD)

- **Create Tasks** - Add new tasks with title, description, and status
- **Read Tasks** - View all your tasks in a clean, organized interface
- **Update Tasks** - Edit task details or toggle status (pending/done)
- **Delete Tasks** - Remove tasks with confirmation dialog
- **Real-time Updates** - Optimistic updates for instant UI feedback

### Advanced Features

- **Search Functionality** - Search tasks by title or description
- **Status Filtering** - Filter tasks by status (All, Pending, Done)
- **Pagination** - Efficient pagination for large task lists
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Loading States** - Proper loading indicators and error handling

### Technical Features

- **Optimistic Updates** - Instant UI updates with React Query
- **Type Safety** - Full TypeScript implementation
- **Modern UI** - Beautiful interface with shadcn/ui components
- **Database Integration** - MongoDB with Mongoose ODM
- **API Routes** - RESTful API with proper error handling

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager-4
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

**Important**:

- Replace `your-super-secret-jwt-key-change-this-in-production` with a strong, random secret key
- For production, use MongoDB Atlas or another cloud MongoDB service
- Update `NEXTAUTH_URL` for production deployment

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database and collections

#### Option B: MongoDB Atlas (Recommended for Production)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### 5. Run the Application

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Getting Started

1. **Register**: Create a new account with your email and password
2. **Login**: Sign in with your credentials
3. **Create Tasks**: Click "New Task" to add your first task
4. **Manage Tasks**: Edit, delete, or mark tasks as done
5. **Search & Filter**: Use the search bar and status filter to find specific tasks

### Features Overview

- **Dashboard**: View all your tasks in one place
- **Task Creation**: Add tasks with title, description, and initial status
- **Quick Actions**: Toggle task status with a single click
- **Search**: Find tasks by typing in the search bar
- **Filtering**: Show only pending or completed tasks
- **Pagination**: Navigate through multiple pages of tasks

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── tasks/         # Task CRUD endpoints
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   ├── tasks/            # Task-related components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── models/               # Database models
└── types/                # TypeScript type definitions
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Tasks

- `GET /api/tasks` - Get user's tasks (with pagination, search, filter)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/[id]` - Get a specific task
- `PUT /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**: Push your code to a GitHub repository
2. **Connect to Vercel**: Import your project in Vercel
3. **Environment Variables**: Add your environment variables in Vercel dashboard
4. **Deploy**: Vercel will automatically deploy your application

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
JWT_SECRET=your-production-jwt-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your IP address (or use 0.0.0.0/0 for Vercel)
4. Get your connection string and update `MONGODB_URI`

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting and formatting
- **Component Structure**: Modular, reusable components
- **Error Handling**: Comprehensive error handling and user feedback

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Prevents XSS attacks
- **Input Validation**: Server-side validation for all inputs
- **Authorization**: Users can only access their own data
- **CORS Protection**: Proper CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [TanStack Query](https://tanstack.com/query) - Data fetching and caching
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Happy Task Managing! 🎉**
