# School Management System

A comprehensive school management system built with modern web technologies.

## Tech Stack

- **Framework**: Next.js 16.1.3 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page
│   ├── students/           # Student management
│   ├── teachers/           # Teacher management
│   ├── classes/            # Class management
│   ├── attendance/         # Attendance tracking
│   ├── assignments/        # Assignment management
│   ├── finance/            # Financial management
│   ├── reports/            # Reports & analytics
│   └── login/              # Authentication
│
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── table.tsx
│   │   ├── skeleton.tsx
│   │   └── error-boundary.tsx
│   ├── layout/             # Layout components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── dashboard-layout.tsx
│   └── features/           # Feature-specific components
│
├── hooks/                  # Custom React hooks
│   ├── useNavigation.ts
│   └── useCommon.ts
│
├── lib/
│   ├── config/             # App configuration
│   ├── services/           # API services layer
│   ├── validation/         # Form validation
│   ├── types/              # TypeScript type definitions
│   ├── constants.ts        # Application constants
│   ├── demo-data.ts        # Demo/mock data
│   ├── metadata.ts         # SEO metadata utilities
│   ├── store.ts            # Zustand stores
│   └── utils.ts            # Utility functions
│
└── public/                 # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sm-system

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Run TypeScript type checking
npm run clean        # Clean build artifacts
```

## Features

### For Administrators
- 📊 **Dashboard**: Overview with key metrics and charts
- 👨‍🎓 **Student Management**: Add, edit, view student records
- 👨‍🏫 **Teacher Management**: Manage teacher profiles and assignments
- 🏫 **Class Management**: Organize classes and sections
- 💰 **Financial Management**: Track fees, expenses, and payments
- 📋 **Reports**: Generate various reports and analytics

### For Teachers
- 📊 **Personal Dashboard**: View assigned classes and schedules
- ✅ **Attendance**: Mark and manage student attendance
- 📝 **Assignments**: Create and manage class assignments
- 📚 **Class Notes**: Upload and share study materials

## Demo Accounts

| Role    | Email                  | Password |
|---------|------------------------|----------|
| Admin   | admin@school.edu.bd    | any      |
| Teacher | rashida@school.edu.bd  | any      |

## Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Component Structure**: Modular and reusable components
- **Error Handling**: Error boundaries for graceful failures
- **Loading States**: Skeleton loaders for better UX

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and proprietary.
