# TaskManager

A modern task management application built with Next.js 16, React 19, and SQLite. Features user authentication, admin panel, and full CRUD operations.

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes, NextAuth.js
- **Database:** SQLite with Prisma ORM
- **Auth:** NextAuth.js with credentials provider

## Features

- User registration and login
- Create, read, update, delete tasks
- Task filtering (all/completed/pending) and search
- Priority levels (low/medium/high)
- Categories and due dates
- Dashboard statistics
- Admin panel for user and task management
- Role-based access control (user/admin)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd taskmanager

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_SECRET="admin123"
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Registration

1. Go to `/register`
2. Enter name, email, password
3. For admin access, enter `admin123` in Admin Secret field
4. Login with your credentials

### User Features

- Create tasks with title, description, priority, category, due date
- Mark tasks as complete/incomplete
- Edit and delete tasks
- Filter and search tasks

### Admin Features

- Access `/admin` panel
- View all registered users
- View all tasks across users
- Delete users and tasks

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/auth/[...nextauth]` | Login/logout |
| GET/POST | `/api/tasks` | List/create tasks |
| GET/PUT/DELETE | `/api/tasks/[id]` | Task operations |
| GET | `/api/stats` | Dashboard stats |
| GET | `/api/admin/users` | List users (admin) |
| GET/DELETE | `/api/admin/tasks` | List/delete tasks (admin) |

## Demo

Live demo: [Vercel Deployment URL]

## Screenshots

![Dashboard](public/screenshots/dashboard.png)
![Admin Panel](public/screenshots/admin.png)

## License

MIT