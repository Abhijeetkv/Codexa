# CODEXA

> A collaborative code editor and project management platform with AI assistance, designed for modern development workflows

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-404D59?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://postgresql.org/)

## ✨ Features

- **GitHub Integration**: Seamless OAuth authentication and repository management
- **AI-Powered Chat**: Contextual AI assistance for coding queries and debugging
- **Project Management**: Full-stack project organization with file versioning
- **Real-time Collaboration**: Multi-user editor states and session management
- **File Snapshots**: Version control with automatic snapshots and undo functionality
- **Web Container Sessions**: Browser-based code execution environments
- **Smart Editor State**: Persistent cursor position, open files, and layout preferences
- **AI Usage Tracking**: Monitor AI model usage and costs across projects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub OAuth App (for authentication)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Codexa
   ```

2. **Set up the database**
   ```bash
   # Create a PostgreSQL database
   createdb codexa_dev
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in backend directory
   cd backend
   cp .env.example .env
   ```

   Update the `.env` file with:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/codexa_dev"
   GITHUB_CLIENT_ID="your_github_client_id"
   GITHUB_CLIENT_SECRET="your_github_client_secret"
   GITHUB_CALLBACK_URL="http://localhost:3000/api/auth/github/callback"
   PORT=3000
   ```

4. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

5. **Set up the database schema**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Start the development servers**
   ```bash
   # Start the backend server (Terminal 1)
   cd backend
   npm run dev

   # Start the frontend server (Terminal 2)
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Backend API: `http://localhost:3000`
   - Frontend: `http://localhost:5173` (Vite default)

## 📁 Project Structure

```
Codexa/
├── README.md
├── package.json        # Root package.json (if using monorepo)
├── backend/            # Express.js API server
│   ├── index.ts        # Main server entry point
│   ├── package.json    # Backend dependencies
│   ├── package-lock.json
│   ├── prisma.config.ts    # Prisma configuration
│   ├── tsconfig.json   # TypeScript configuration
│   ├── config/
│   │   └── env.ts          # Environment configuration
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── ai.controller.ts
│   │   ├── file.controller.ts
│   │   ├── github.controller.ts
│   │   └── project.controller.ts
│   ├── generated/          # Generated Prisma client
│   │   └── prisma/         # Prisma client types and models
│   ├── lib/
│   │   └── prisma.ts       # Prisma client instance
│   ├── middleware/         # Express middleware
│   │   └── auth.middleware.ts
│   ├── prisma/             # Database schema and migrations
│   │   ├── schema.prisma   # Database schema definition
│   │   └── migrations/     # Database migration files
│   ├── routes/             # API endpoints
│   │   ├── auth.routes.ts
│   │   ├── ai.routes.ts
│   │   ├── file.routes.ts
│   │   ├── github.routes.ts
│   │   └── project.routes.ts
│   ├── services/           # Business logic
│   │   ├── auth.service.ts
│   │   ├── ai.service.ts           # AI integration service
│   │   ├── file.service.ts         # File management service
│   │   ├── project.service.ts      # Project management service
│   │   └── github.service.ts       # GitHub API integration
│   ├── types/              # TypeScript type definitions
│   │   └── express.d.ts
│   └── utils/              # Utility functions
│       └── jwt.ts
└── frontend/               # React application
    ├── package.json        # Frontend dependencies
    ├── package-lock.json   # Dependency lock file
    ├── vite.config.ts      # Vite configuration
    ├── tsconfig.json       # TypeScript configuration
    ├── tsconfig.app.json   # App TypeScript configuration
    ├── tsconfig.node.json  # Node TypeScript configuration
    ├── eslint.config.js    # ESLint configuration
    ├── index.html          # HTML entry point
    ├── public/             # Static assets
    └── src/
        ├── App.tsx         # Main React component
        ├── main.tsx        # React app entry point
        ├── App.css         # Global styles
        ├── index.css       # Base styles
        ├── api/            # API client services
        │   ├── ai.ts
        │   ├── auth.ts
        │   ├── client.ts
        │   ├── files.ts
        │   ├── github.ts
        │   └── projects.ts
        ├── assets/         # Static assets
        ├── components/     # Reusable React components
        │   ├── editor/
        │   │   ├── CodeEditor.tsx
        │   │   └── EditorTabs.tsx
        │   ├── layout/
        │   │   ├── Sidebar.tsx
        │   │   ├── StatusBar.tsx
        │   │   └── Topbar.tsx
        │   ├── modals/
        │   │   ├── LoginModal.tsx
        │   │   ├── NewFileModal.tsx
        │   │   └── NewProjectModal.tsx
        │   └── panels/
        │       ├── AIChat.tsx
        │       ├── FileExplorer.tsx
        │       ├── GitPanel.tsx
        │       ├── SearchPanel.tsx
        │       └── Terminal.tsx
        ├── pages/          # Page components
        │   ├── AuthCallback.tsx
        │   └── IDEPage.tsx
        ├── stores/         # State management
        │   ├── authStore.ts
        │   ├── editorStore.ts
        │   ├── projectStore.ts
        │   └── uiStore.ts
        └── utils/          # Utility functions
            ├── fileIcons.ts
            └── languages.ts
```

## 🔧 Development

### Backend Development

The backend is built with TypeScript, Express.js, and Prisma:

```bash
cd backend
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript for production
npm start          # Start production server
```

### Frontend Development

The frontend is built with React, TypeScript, and Vite:

```bash
cd frontend
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

### Database Operations

```bash
cd backend

# Generate Prisma client after schema changes
npx prisma generate

# Create and apply new migration
npx prisma migrate dev --name migration_name

# Reset database (development only)
npx prisma migrate reset

# View data in Prisma Studio
npx prisma studio
```

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key entities include:

- **Users**: GitHub OAuth integration with session management
- **Projects**: Code project organization with repository linking
- **Files**: File management with versioning and snapshots
- **Chat Sessions**: AI-powered coding assistance conversations
- **Editor States**: Persistent editor preferences and configurations
- **AI Usage**: Tracking of AI model consumption and costs
- **Web Container Sessions**: Browser-based development environments

## 🎯 Key Features

### GitHub Integration
- OAuth authentication flow
- Repository synchronization
- Commit tracking and version management
- User profile and avatar integration

### AI-Powered Development
- **Chat Interface**: Context-aware AI coding assistant
- **Usage Tracking**: Monitor AI model consumption and costs
- **Referenced Files**: AI responses with file context
- **Multi-role Conversations**: User, assistant, and system messages

### Web Container Development
- **Browser Environments**: Run code directly in browser containers
- **Session Management**: Persistent development environments per project
- **Multi-language Support**: Execute various programming languages

## 🔒 Authentication & Security

### GitHub OAuth Flow
1. User initiates login via GitHub
2. OAuth redirect to GitHub authorization
3. Callback with authorization code
4. Token exchange and user profile retrieval
5. JWT token generation for session management

### Security Features
- Encrypted access and refresh tokens
- Session-based authentication with expiration
- IP address and user agent tracking
- Cascade deletion for data consistency

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: GitHub OAuth + JWT
- **Environment**: dotenv for configuration

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Linting**: ESLint with React plugins

### Development Tools
- **ORM**: Prisma with automatic client generation
- **Hot Reload**: nodemon for backend, Vite HMR for frontend
- **Type Safety**: Full TypeScript coverage
- **Database Migrations**: Prisma migrate

## 📊 API Endpoints

### Authentication
- `POST /api/auth/github` - Initiate GitHub OAuth flow
- `GET /api/auth/github/callback` - Handle OAuth callback
- `POST /api/auth/logout` - End user session

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Files
- `GET /api/projects/:id/files` - List project files
- `POST /api/projects/:id/files` - Create/upload file
- `PUT /api/files/:id` - Update file content
- `GET /api/files/:id/snapshots` - Get file version history

### Chat
- `POST /api/projects/:id/chat` - Start chat session
- `POST /api/chat/:id/messages` - Send chat message
- `GET /api/chat/:id/history` - Get chat history

### AI Services
- `GET /api/ai/models` - List available AI models
- `POST /api/ai/usage` - Track AI model usage

## 🔮 Future Enhancements

- [ ] Real-time collaborative editing with WebSockets
- [ ] Advanced AI code completion and suggestions
- [ ] Plugin system for custom extensions
- [ ] Integrated debugging tools
- [ ] Multi-language syntax highlighting
- [ ] Code review and commenting system
- [ ] Project templates and scaffolding
- [ ] Advanced search and navigation
- [ ] Performance analytics and monitoring
- [ ] Mobile companion app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern code editors like Cursor and VSCode
- Built with the amazing React and Express.js ecosystems
- Powered by Prisma for type-safe database operations
- GitHub's OAuth platform for seamless authentication

---

**Note**: This project is currently in active development. Features and API endpoints may change as the platform evolves.

