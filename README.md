# EventOps

A modern, full-stack event management platform built with NestJS backend and Next.js frontend. Streamline event organization with powerful features wrapped in a beautiful, glass-morphic interface.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/Participant)
  - Secure password hashing with bcrypt

- **Event Management**
  - Create and manage events
  - Event status tracking (Draft/Published/Canceled)
  - Capacity management
  - Location and date/time scheduling

- **Reservation System**
  - Easy event reservations
  - Reservation status tracking (Pending/Confirmed/Refused/Canceled)
  - Real-time availability updates

- **Admin Dashboard**
  - Comprehensive event oversight
  - Reservation management
  - User administration

- **Modern UI/UX**
  - Glass-morphic design
  - Responsive layout
  - Intuitive navigation
  - Built with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Testing**: Jest

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Icons**: Lucide React

### DevOps
- **Containerization**: Docker & Docker Compose
- **Linting**: ESLint
- **Code Formatting**: Prettier

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- MongoDB (via Docker)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd EventOps
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Start MongoDB with Docker
docker-compose up -d

# Generate Prisma client
npx prisma generate

# Run database migrations (if schema exists)
npx prisma db push

# Start development server
npm run start:dev
```

The backend will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3001`

## 📁 Project Structure

```
EventOps/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── events/         # Event management
│   │   ├── reservations/   # Reservation system
│   │   ├── users/          # User management
│   │   ├── prisma/         # Database service
│   │   └── generated/      # Prisma generated types
│   ├── test/               # End-to-end tests
│   └── docker-compose.yml  # MongoDB setup
├── frontend/               # Next.js client
│   ├── app/                # App router pages
│   │   ├── (auth)/         # Authentication pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── dashboard/      # User dashboard
│   │   └── components/     # Reusable UI components
│   └── lib/                # Utilities and API client
└── README.md
```

## 🔧 Available Scripts

### Backend Scripts
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login

### Events
- `GET /events` - Get all published events
- `GET /events/admin` - Get all events (admin only)
- `POST /events` - Create new event (admin only)
- `PUT /events/:id` - Update event (admin only)
- `DELETE /events/:id` - Delete event (admin only)

### Reservations
- `GET /reservations/my` - Get user's reservations
- `GET /reservations/admin` - Get all reservations (admin only)
- `POST /reservations` - Create reservation
- `PUT /reservations/:id` - Update reservation status (admin only)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# End-to-end tests
npm run test:e2e

# Frontend tests (if configured)
cd frontend
npm run test
```

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm run start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the UNLICENSED License.

## 📞 Support

For support, please contact the development team or create an issue in the repository.

---

Built with ❤️ using NestJS, Next.js, and modern web technologies.