# CyberSec Toolkit

A comprehensive cybersecurity analysis suite built with React, Express, and TypeScript. This application provides multiple security tools for analyzing passwords, detecting phishing attempts, scanning ports, identifying keyloggers, and monitoring file integrity.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)

## 🛡️ Security Tools

### 🔐 Password Analyzer
Advanced password strength analysis with comprehensive security assessment:

- **Entropy Calculation**: Shannon entropy for randomness measurement
- **Pattern Detection**: Identifies keyboard patterns and common substitutions
- **Dictionary Protection**: Checks against extensive password databases
- **Crack Time Estimation**: Realistic attack time calculations
- **Security Scoring**: Multi-factor strength assessment
- **Improvement Suggestions**: Actionable security recommendations

### 🎣 Phishing Detector
Multi-vector URL analysis for phishing detection:

- **IP-Based Detection**: Identifies suspicious direct IP access
- **Subdomain Analysis**: Detects excessive subdomain nesting
- **Homograph Protection**: Unicode spoofing identification
- **URL Shortener Recognition**: Flags shortened URLs
- **Keyword Scanning**: Searches for phishing indicators
- **Risk Assessment**: Comprehensive threat scoring

### 🌐 Port Scanner
Professional TCP port scanning with service detection:

- **Real Network Connections**: Actual TCP socket connections
- **Service Banner Grabbing**: Version identification
- **Concurrent Scanning**: Optimized performance with rate limiting
- **Security Assessment**: Identifies vulnerable services
- **Custom Port Ranges**: Flexible scanning options
- **Network Respect**: Built-in delays and connection limits

### ⌨️ Keylogger Detector
Behavioral process analysis for malware detection:

- **Process Monitoring**: Real-time system process analysis
- **Behavioral Analysis**: Entropy-based obfuscation detection
- **Resource Monitoring**: CPU and memory usage analysis
- **Pattern Recognition**: Identifies suspicious naming patterns
- **Risk Scoring**: Multi-factor threat assessment
- **Cross-Platform**: Windows, macOS, and Linux support

### 📁 File Integrity Monitor
Cryptographic file system monitoring:

- **SHA-256 Hashing**: Cryptographic integrity verification
- **Baseline Management**: File system baseline creation
- **Change Detection**: Real-time modification tracking
- **Risk Assessment**: Security impact categorization
- **Mass Operation Detection**: Malware spreading identification
- **System Protection**: Critical file monitoring

## 🏗️ Technology Stack

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Tailwind CSS** with dark theme support and design system
- **Radix UI** components for accessibility
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **Vite** for fast development and optimized builds

### Backend Architecture
- **Node.js 20+** with Express framework
- **TypeScript** with ESM modules
- **PostgreSQL** with Drizzle ORM
- **Helmet** for security headers
- **Express Validator** for input validation
- **Rate Limiting** and session management

### Database Design
- **Users**: Authentication and profile management
- **Scan Results**: Security analysis storage
- **Monitored Files**: File integrity tracking
- **Sessions**: Secure session management

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- PostgreSQL database (Neon recommended)
- npm package manager

### Installation

1. **Clone and Install**:
```bash
git clone <repository-url>
cd cybersec-toolkit
npm install
```

2. **Environment Setup**:
```bash
# Create environment file
cp .env.example .env
```

Required environment variables:
```env
DATABASE_URL=postgresql://user:password@host:port/database
NODE_ENV=development
PORT=5000
```

3. **Start Development**:
```bash
npm run dev
```

Application runs at `http://localhost:5000`

### Production Deployment

**Build and Start**:
```bash
npm run build
npm start
```

**Render Deployment**:
- Build Command: `npm run build`
- Start Command: `npm start`
- Environment: Set `DATABASE_URL` in dashboard

## 📚 API Documentation

### Security Analysis Endpoints

All endpoints use `POST` requests with JSON payloads:

#### Password Analysis
```bash
POST /api/security/password-analysis
{
  "password": "your_password_here"
}
```

**Response**:
```json
{
  "score": 85,
  "strength": "very-strong",
  "criteria": {
    "length": true,
    "specialChars": true,
    "numbers": true,
    "upperCase": true,
    "lowerCase": true,
    "noDictionaryWords": true
  },
  "entropy": 72.3,
  "suggestions": [],
  "crackTime": "Centuries"
}
```

#### Phishing Detection
```bash
POST /api/security/phishing-analysis
{
  "url": "https://example.com/page"
}
```

#### Port Scanning
```bash
POST /api/security/port-scan
{
  "target": "192.168.1.1",
  "portRange": "1-1000"
}
```

#### Keylogger Detection
```bash
POST /api/security/keylogger-scan
{}
```

#### File Integrity
```bash
POST /api/security/file-integrity
{
  "directory": "/path/to/monitor",
  "recursive": true
}
```

## 🔧 Project Structure

```
cybersec-toolkit/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utilities
│   │   └── hooks/          # Custom hooks
├── server/                 # Express backend
│   ├── services/           # Security services
│   │   ├── password-service.ts
│   │   ├── phishing-service.ts
│   │   ├── port-service.ts
│   │   ├── keylogger-service.ts
│   │   └── file-integrity-service.ts
│   ├── routes.ts           # API routes
│   └── index.ts            # Server entry
├── shared/                 # Shared schemas
│   └── schema.ts           # Database schemas
└── dist/                   # Production build
```

## 🔐 Security Features

### Input Validation
- Comprehensive input sanitization
- Zod schema validation
- SQL injection prevention
- XSS protection

### Security Headers
- Content Security Policy
- X-Frame-Options protection
- HSTS enforcement
- XSS protection headers

### Rate Limiting
- API endpoint throttling
- Brute force protection
- DDoS mitigation

### Session Management
- Secure session storage
- PostgreSQL session store
- Automatic session cleanup

## 🛠️ Development

### Code Quality
- TypeScript strict mode
- ESLint code standards
- Prettier formatting
- Comprehensive error handling

### Testing
```bash
npm run test          # Run all tests
npm run check         # TypeScript validation
npm run build         # Production build test
```

### Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes with tests
4. Ensure TypeScript compilation
5. Submit pull request

## ⚡ Performance

### Optimized Build
- Frontend: 379KB (gzipped: 114KB)
- Backend: 52.7KB
- Fast Vite development server
- Efficient production bundling

### Resource Usage
- Memory: 4GB+ recommended for large scans
- Network: Stable connection for port scanning
- CPU: Multi-core for concurrent operations
- Storage: SSD recommended for file monitoring

## 🔒 Security Considerations

### Ethical Usage
✅ Authorized security testing  
✅ Educational purposes  
✅ Personal system monitoring  
✅ Corporate assessments (with permission)

### Legal Compliance
- Follow local cybersecurity laws
- Respect corporate security policies
- Comply with target system terms
- Practice responsible disclosure

### Network Respect
- Built-in scanning delays
- Configurable concurrency limits
- Automatic timeout handling
- Respectful network practices

## 📊 Features Overview

| Tool | Analysis Type | Real-time | Risk Scoring |
|------|---------------|-----------|--------------|
| Password Analyzer | Cryptographic | ✅ | ✅ |
| Phishing Detector | URL Analysis | ✅ | ✅ |
| Port Scanner | Network | ✅ | ✅ |
| Keylogger Detector | Process | ✅ | ✅ |
| File Integrity | Filesystem | ✅ | ✅ |

## 🤝 Support

- 📖 Documentation: Complete API and usage guides
- 🐛 Bug Reports: GitHub issues with reproduction steps
- 💡 Feature Requests: Enhancement suggestions welcome
- 📧 Security: Contact for vulnerability reports

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## ⚠️ Disclaimer

This toolkit is for educational and authorized security testing only. Users are responsible for legal and ethical use. Developers assume no liability for misuse.

---

**Built for the cybersecurity community**  
*Production-ready • Secure • Scalable*