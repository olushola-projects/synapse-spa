# Synapse - Pure React Application

A modern, responsive React application built with TypeScript, Vite, and Tailwind CSS. This is a pure client-side React application with no external service dependencies.

## 🚀 Features

- **Modern Tech Stack**: React 18, TypeScript, Vite for fast development
- **Beautiful UI**: Tailwind CSS with shadcn/ui component library
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Authentication**: Mock authentication system with localStorage persistence
- **Navigation**: React Router for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Charts & Visualizations**: Recharts for data visualization
- **Icons**: Lucide React for beautiful icons
- **Animations**: Framer Motion for smooth animations
- **Code Quality**: ESLint, Prettier, TypeScript for robust development
- **Testing**: Vitest and React Testing Library
- **Carousels**: Embla Carousel for image/content sliders

## 📁 Project Structure

```
synapse/
├── public/                     # Static assets
│   ├── data/                  # JSON data files
│   ├── lovable-uploads/       # Image assets
│   └── ...
├── src/
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components (shadcn/ui)
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── features/         # Feature-specific components
│   │   └── ...
│   ├── contexts/             # React contexts (Auth, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   ├── lib/                  # Utility libraries
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript type definitions
│   ├── data/                 # Static data and mock data
│   ├── services/             # API services and mock implementations
│   └── styles/               # CSS and styling files
├── package.json              # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🛠️ Technologies Used

### Core

- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 7.0.5** - Fast build tool and dev server

### UI & Styling

- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful component library built on Radix
- **Framer Motion 12.23.0** - Animation library
- **Lucide React 0.462.0** - Icon library

### Routing & Navigation

- **React Router DOM 6.26.2** - Client-side routing

### Forms & Validation

- **React Hook Form 7.53.0** - Performant forms library
- **Zod 3.23.8** - TypeScript-first schema validation
- **@hookform/resolvers 3.9.0** - Validation resolvers

### Data & Charts

- **Recharts 2.12.7** - Chart library for React
- **Date-fns 3.6.0** - Date utility library
- **TanStack React Query 5.56.2** - Data fetching and caching

### Development Tools

- **ESLint 9.9.0** - Linting
- **Prettier 3.6.2** - Code formatting
- **Vitest 1.3.1** - Unit testing
- **@testing-library/react 14.2.1** - Component testing utilities
- **Husky 9.1.7** - Git hooks

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm 8+

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd synapse
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:8080`

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run preview          # Preview production build

# Building
npm run build            # Build for production

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run quality:check    # Run all quality checks

# Testing
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage
```

## 🔧 Configuration

### Environment Variables

The application currently runs without external services, but you can add environment variables by creating a `.env` file:

```env
# Example environment variables
VITE_APP_NAME=Synapse
VITE_APP_VERSION=1.0.0
```

### Vite Configuration

Key features configured in `vite.config.ts`:

- Path aliases (`@/` points to `src/`)
- Development server on port 8080
- Code splitting and optimization
- React SWC for fast compilation

### Tailwind Configuration

Configured with:

- Custom color scheme
- Component animations
- Typography plugin
- Responsive breakpoints

## 🎨 UI Components

The application uses shadcn/ui components built on Radix UI:

- **Buttons, Inputs, Forms** - Interactive elements
- **Dialogs, Modals, Dropdowns** - Overlay components
- **Charts, Cards, Badges** - Data display components
- **Navigation, Tabs, Accordion** - Layout components
- **Toast, Alert, Progress** - Feedback components

All components are fully accessible and customizable with Tailwind CSS.

## 🔐 User Management & Authentication

The application features a comprehensive user management system integrated with the ai-chat-backend API:

### **🚀 Core Features**

- **Mock Authentication**: Full simulation of real authentication flows
- **Session Management**: Secure session handling with auto-refresh
- **Social Login**: Google and LinkedIn login simulation
- **Form Validation**: Comprehensive input validation and error handling
- **Persistent Sessions**: localStorage and sessionStorage support
- **Remember Me**: Extended session duration option

### **🛡️ Security Features**

- **Password Validation**: Strength checking with detailed feedback
- **Session Expiry**: Automatic session timeout handling
- **Secure Storage**: Safe session data management
- **Email Verification**: Mock email verification workflow

### **👥 Role-Based Access Control**

- **Multiple Roles**: User, Moderator, Admin roles
- **Permission System**: Granular permission control (read, write, delete, admin)
- **Resource Protection**: Fine-grained access control for components and routes
- **Dynamic Authorization**: Real-time permission checking

### **🔧 Developer Tools**

- **AuthGuard Service**: Utility class for programmatic auth checks
- **Enhanced Hooks**: `useAuth` and `useAuthGuard` for easy integration
- **Protected Routes**: Multiple protection levels with custom fallbacks
- **Auth Demo Page**: Interactive demonstration at `/auth-demo`

### **📝 Mock Users**

The system includes predefined users with different roles:

- **admin@synapse.com**: Admin user with all permissions
- **user@synapse.com**: Regular user with basic permissions
- **Any email**: Creates new mock user automatically

### **🔗 Protected Route Components**

```tsx
// Basic protection
<ProtectedRoute>
  <ComponentToProtect />
</ProtectedRoute>

// Role-based protection
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

// Permission-based protection
<ProtectedRoute requiredPermissions={['write', 'delete']}>
  <Editor />
</ProtectedRoute>

// Convenience wrappers
<AdminRoute><AdminContent /></AdminRoute>
<ModeratorRoute><ModeratorContent /></ModeratorRoute>
<VerifiedUserRoute><VerifiedContent /></VerifiedUserRoute>
<PublicRoute><LoginForm /></PublicRoute>
```

### **🎣 Auth Hooks Usage**

```tsx
// Basic auth state
const { user, isAuthenticated, login, logout } = useAuth();

// Enhanced auth utilities
const guard = useAuthGuard();
const canEdit = guard.hasPermission('write');
const isAdmin = guard.isAdmin();
const timeLeft = guard.timeLeft;
```

## 🤖 AI Chat Integration

### Backend Service Integration

The application integrates with the `ai-chat-backend` NestJS service for AI-powered chat functionality:

#### Key Features:

- **Real-time Streaming**: Server-Sent Events for streaming AI responses
- **Thread Management**: Persistent conversation history
- **Message Storage**: DynamoDB integration for chat persistence
- **File Attachments**: Support for document uploads
- **Error Handling**: Comprehensive API error management

#### API Services:

- **`chatApiService`**: Main service for chat operations
- **`useChatApi`**: React hook for chat state management
- **`ApiClient`**: Base HTTP client with timeout and error handling

#### Testing the Chat API:

1. **Start the backend**: Follow the ai-chat-backend setup instructions
2. **Configure API URL**: Set `VITE_API_BASE_URL=http://localhost:3000` in `.env`
3. **Visit chat demo**: Navigate to `/chat-demo` to test the integration
4. **Login required**: Use the mock authentication to access chat features

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first design approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Progressive enhancement

## 🧪 Testing

Testing setup includes:

- **Vitest** for unit tests
- **React Testing Library** for component tests
- **jsdom** for DOM simulation
- **Coverage reporting** with v8

Run tests with:

```bash
npm run test
npm run test:coverage
```

## 🚀 Deployment

The application is a pure client-side React app and can be deployed to any static hosting service:

### Build for Production

```bash
npm run build
```

This creates a `dist/` directory with optimized static files.

### Deployment Options

- **Netlify** - Drag and drop the `dist/` folder
- **Vercel** - Connect your Git repository
- **GitHub Pages** - Use the built files
- **AWS S3** - Upload to S3 bucket with static hosting
- **Any web server** - Serve the `dist/` folder

### Build Optimization

The production build includes:

- Code splitting and lazy loading
- Asset optimization
- Gzip compression support
- Modern browser targets

## 📚 Key Features

### Dashboard

- Interactive charts and visualizations
- Real-time data display (mocked)
- Responsive grid layout
- Mobile-optimized navigation

### Forms & Validation

- Type-safe form handling
- Real-time validation
- Accessible error messages
- Beautiful UI components

### Navigation

- Client-side routing
- Breadcrumb navigation
- Mobile hamburger menu
- Smooth page transitions

### Data Visualization

- Interactive charts with Recharts
- Responsive chart layouts
- Multiple chart types (line, bar, pie, area)
- Custom styling and animations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Format code with Prettier
- Write tests for new features
- Use semantic commit messages

## 📄 License

This project is private and proprietary.

## 🛠️ Troubleshooting

### Common Issues

**Development server won't start:**

- Ensure Node.js 16+ is installed
- Delete `node_modules` and run `npm install`
- Check if port 8080 is available

**Build fails:**

- Run `npm run lint` to check for errors
- Ensure all TypeScript types are correct
- Check for missing dependencies

**Tests fail:**

- Ensure test environment is set up correctly
- Run `npm run test:coverage` for detailed output

### Performance Tips

- Use React.memo() for expensive components
- Implement code splitting with React.lazy()
- Optimize images in the public folder
- Use the React DevTools for debugging

---

## 🔐 Backend User Management Integration

### **Real API Integration**

The frontend now integrates with the ai-chat-backend user management system providing:

- **Real Authentication**: JWT-like token-based auth with the backend API
- **User Registration**: Complete user signup with email verification
- **Profile Management**: Real-time user profile updates
- **Session Tracking**: Multi-device session management
- **Password Security**: Secure password changes and reset flows
- **Role-Based Access**: Backend-driven role and permission system

### **Demo Pages**

- **User Management Demo** (`/user-management`): Complete backend integration showcase
- **Auth Demo** (`/auth-demo`): Enhanced auth testing with real backend data
- **Chat Demo** (`/chat-demo`): Chat system with authenticated users

### **Getting Started**

1. **Start Backend**: `cd ai-chat-backend && npm run dev:start`
2. **Configure Frontend**: Set `VITE_API_BASE_URL=http://localhost:3000`
3. **Register/Login**: Create account and test all user management features

The user management system is **production-ready** with comprehensive security and real backend integration!

---

Built with ❤️ using React, TypeScript, NestJS, and modern web technologies.
