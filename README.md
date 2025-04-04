
# Eventique - Event Services Marketplace

A comprehensive event services marketplace platform that helps you discover, book, and manage event professionals for various occasions.

## Prerequisites

- Node.js (v20.x or higher)
- PostgreSQL (v16.x)
- npm (included with Node.js)

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd eventique
```

2. Create a `.env` file in the root directory with the following content:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/eventique
SESSION_SECRET=your-secret-key
NODE_ENV=development
```

3. Install dependencies:
```bash
npm install
```

## Database Setup

1. Create a PostgreSQL database named 'eventique'
2. Push the database schema:
```bash
npm run db:push
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. The application will be available at:
- Web interface: http://0.0.0.0:5000
- API endpoint: http://0.0.0.0:5000/api

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express server
- `/shared` - Shared TypeScript types and schemas
- `/android` - Android app configuration (Capacitor)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type-check TypeScript files
- `npm run db:push` - Update database schema

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL with Drizzle ORM
- Authentication: Passport.js
- Mobile: Capacitor for Android build

## Features

- User authentication (login/register)
- Service discovery and booking
- Real-time messaging
- Payment integration
- Service provider dashboard
- Customer dashboard
- Mobile-responsive design
