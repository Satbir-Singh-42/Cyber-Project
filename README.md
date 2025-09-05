# CyberSec Toolkit

A comprehensive cybersecurity analysis suite built with React, Express, and TypeScript. This modern web application provides multiple security tools including password analysis, phishing detection, port scanning, keylogger detection, and file integrity monitoring.

![CyberSec Toolkit](https://img.shields.io/badge/CyberSec-Toolkit-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)

## 🚀 Features

### Security Analysis Tools
- **🔐 Password Analyzer**: Comprehensive password strength analysis with entropy calculations and crack time estimates
- **🎣 Phishing Detector**: URL analysis for phishing threats and suspicious indicators  
- **🌐 Port Scanner**: Network port scanning with service detection
- **⌨️ Keylogger Detector**: Process monitoring for malicious keylogger behavior
- **📁 File Integrity Monitor**: File system change detection and integrity verification

### User Experience
- **🌙 Dark/Light Mode**: Complete theme switching with system preference detection
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **⚡ Real-time Analysis**: Live security scanning with instant feedback
- **🎨 Modern UI**: Clean, professional interface using shadcn/ui components
- **🔧 Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern React with functional components and hooks
- **TypeScript**: Full type safety across the application
- **Vite**: Lightning-fast development and optimized production builds
- **Tailwind CSS**: Utility-first styling with custom design system
- **Radix UI**: Headless component library for accessibility
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing

### Backend Stack
- **Node.js**: Runtime environment with ESM modules
- **Express.js**: RESTful API server with security middleware
- **TypeScript**: Type-safe server-side development
- **Helmet**: Security headers and protection
- **Rate Limiting**: Request throttling and abuse prevention

### Database & Storage
- **PostgreSQL**: Primary database with Neon serverless hosting
- **Drizzle ORM**: Type-safe database operations and migrations
- **Session Management**: Secure user session handling

### Security Features
- **Content Security Policy**: XSS protection with CSP headers
- **Rate Limiting**: API endpoint protection against abuse
- **Input Validation**: Zod schema validation for all inputs
- **Secure Headers**: Comprehensive security header configuration
- **HTTPS Only**: Secure communication in production

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- PostgreSQL database (or Neon account)

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd cybersec-toolkit
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/cybersec_toolkit
NODE_ENV=development
PORT=5000
```

4. **Database Setup**
```bash
# Push database schema
npm run db:push
```

5. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

## 📁 Project Structure

```
cybersec-toolkit/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Layout components (header, sidebar)
│   │   │   ├── security/       # Security tool components
│   │   │   └── ui/             # shadcn/ui component library
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions and configurations
│   │   ├── pages/              # Page components and routing
│   │   ├── App.tsx             # Main application component
│   │   ├── main.tsx            # Application entry point
│   │   └── index.css           # Global styles and CSS variables
│   └── index.html              # HTML template
├── server/                     # Backend Express application
│   ├── services/               # Business logic services
│   │   ├── password-service.ts # Password analysis logic
│   │   ├── phishing-service.ts # Phishing detection logic
│   │   ├── port-service.ts     # Port scanning logic
│   │   ├── keylogger-service.ts# Keylogger detection logic
│   │   └── file-integrity-service.ts # File monitoring logic
│   ├── index.ts                # Server entry point
│   ├── routes.ts               # API route definitions
│   └── vite.ts                 # Vite development setup
├── shared/                     # Shared TypeScript schemas
│   └── schema.ts               # Database and validation schemas
├── package.json                # Dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── vite.config.ts              # Vite build configuration
└── tsconfig.json               # TypeScript configuration
```

## 🔧 API Endpoints

### Security Analysis Endpoints
All endpoints are prefixed with `/api/security/`

- **POST** `/password-analysis` - Analyze password strength
- **POST** `/phishing-detection` - Check URLs for phishing threats
- **POST** `/port-scan` - Scan network ports and services
- **POST** `/keylogger-detection` - Detect suspicious processes
- **POST** `/file-integrity-check` - Monitor file system changes

### Request/Response Format
All endpoints accept JSON payloads and return structured responses:

```typescript
// Example: Password Analysis
Request: {
  "password": "string"
}

Response: {
  "score": number,
  "strength": "very-weak" | "weak" | "medium" | "strong" | "very-strong",
  "criteria": {
    "length": boolean,
    "specialChars": boolean,
    "numbers": boolean,
    "upperCase": boolean,
    "lowerCase": boolean,
    "noDictionaryWords": boolean
  },
  "entropy": number,
  "suggestions": string[],
  "crackTime": string
}
```

## 🎨 Theme System

The application features a complete dark/light mode system with:

- **CSS Custom Properties**: Semantic color tokens for consistent theming
- **System Preference Detection**: Automatic theme selection based on OS settings
- **Local Storage Persistence**: User theme preference saved across sessions
- **Smooth Transitions**: Animated theme switching for better UX

### Color Palette
- **Primary Blue**: `hsl(217 91% 60%)` - Main brand color and accents
- **Secondary Gray**: Various shades for backgrounds and borders
- **Destructive Red**: `hsl(0 84% 60%)` - Error states and warnings
- **Success Green**: `hsl(158 64% 52%)` - Success states (legacy, now blue)

## 🔒 Security Considerations

### Client-Side Security
- Input sanitization and validation
- XSS prevention through proper escaping
- CSP headers to prevent script injection
- Secure cookie configuration

### Server-Side Security
- Rate limiting to prevent abuse
- Request size limitations
- Helmet.js security headers
- Input validation with Zod schemas

### Infrastructure Security
- HTTPS enforcement in production
- Database connection encryption
- Environment variable protection
- Secure session management

## 🧪 Testing

### Test IDs
All interactive elements include `data-testid` attributes for reliable testing:

```typescript
// Interactive elements
data-testid="button-{action}"           // e.g., "button-submit"
data-testid="input-{field}"             // e.g., "input-password"
data-testid="link-{target}"             // e.g., "link-dashboard"

// Display elements  
data-testid="text-{content}"            // e.g., "text-username"
data-testid="status-{state}"            // e.g., "status-loading"

// Dynamic elements
data-testid="{type}-{description}-{id}" // e.g., "card-scan-result-123"
```

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting with Vite
- **Tree Shaking**: Dead code elimination in production builds
- **Asset Optimization**: Image compression and lazy loading
- **Caching Strategy**: TanStack Query for intelligent data caching
- **Bundle Analysis**: Optimized dependency bundling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use the existing component patterns
- Add proper type definitions
- Include data-testid attributes for testing
- Follow the established naming conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the existing documentation
- Review the code comments for implementation details

## 🔄 Changelog

### Version 1.0.0
- Initial release with all core security tools
- Complete dark/light mode implementation
- Responsive design across all devices
- PostgreSQL database integration
- Production-ready deployment configuration

---

**Built with ❤️ for cybersecurity professionals and enthusiasts**