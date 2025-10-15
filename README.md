# 🛡️ Cybersecurity Toolkit

A comprehensive, professional-grade cybersecurity analysis suite built with modern web technologies. This application provides real-time security tools for threat detection, vulnerability assessment, and system monitoring.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Security Tools](#-security-tools)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Security Considerations](#-security-considerations)
- [Team](#-team)
- [License](#-license)

## ✨ Features

### 🔐 Password Strength Analyzer
Advanced cryptographic password analysis with real-world attack modeling:
- **Entropy Calculation**: Shannon entropy analysis for true randomness measurement
- **Pattern Detection**: Identifies keyboard patterns, repetitive sequences, and common substitutions
- **Dictionary Attack Simulation**: Checks against extensive common password databases
- **Crack Time Estimation**: Realistic time estimates using modern GPU attack scenarios
- **Comprehensive Scoring**: Multi-factor scoring system considering length, complexity, and predictability
- **Security Recommendations**: Actionable suggestions for password improvement

### 🎣 Phishing Detector
Multi-vector URL analysis for sophisticated phishing detection:
- **Google Safe Browsing API Integration**: Real-time threat intelligence from Google's database
- **Typosquatting Detection**: Levenshtein distance algorithm identifies lookalike domains
- **Heuristic Analysis**: Pattern matching against 250+ known typosquatting variations
- **IP-Based URL Detection**: Identifies direct IP access attempts
- **Subdomain Analysis**: Detects suspicious patterns and excessive nesting
- **URL Shortener Recognition**: Flags shortened URLs from major services
- **Risk Scoring**: Advanced algorithm with weighted threat factors
- **Secure Caching**: 1-hour TTL cache to minimize API calls

### 🌐 Port Scanner
Professional-grade network port scanning with service detection:
- **Real TCP Connections**: Performs actual network connections
- **Service Banner Grabbing**: Retrieves service banners for version identification
- **Concurrent Scanning**: Adaptive concurrency with rate limiting
- **Service Detection**: Identifies 30+ common services
- **Security Risk Assessment**: Flags high-risk services and vulnerable configurations
- **Custom Port Ranges**: Supports individual ports, ranges, and comma-separated lists
- **Network Respect**: Built-in delays and connection limits

### ⌨️ Keylogger Detector
Behavioral process analysis for malware detection:
- **Real Process Monitoring**: Interfaces with OS process APIs
- **Behavioral Analysis**: Entropy-based detection of obfuscated process names
- **Resource Usage Monitoring**: CPU and memory analysis for suspicious activity
- **Pattern Recognition**: Identifies mimicked system processes
- **Risk Scoring**: Multi-factor analysis including keywords, patterns, and behavior
- **Process Termination**: Capability to terminate suspicious processes

### 📁 File Integrity Monitor
Cryptographic file system monitoring with change detection:
- **SHA-256 Hashing**: Cryptographic integrity verification
- **Baseline Management**: Creates and maintains file system baselines
- **Real-time Change Detection**: Identifies added, modified, and deleted files
- **Risk Assessment**: Categorizes changes by security impact
- **Mass Operation Detection**: Identifies potential malware spreading patterns
- **Recursive Scanning**: Deep directory traversal with intelligent filtering

## 🏗️ Technology Stack

### Frontend
- **React 18** - Modern UI component library
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing solution
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **Helmet.js** - Security middleware
- **Express Rate Limit** - Request throttling
- **Zod** - Schema validation
- **Express Validator** - Input sanitization

### Security Features
- **Content Security Policy** - Strict script and style sources
- **Rate Limiting** - 100 req/15min general, 20 req/15min security endpoints
- **Input Sanitization** - Comprehensive validation for all inputs
- **Secure Headers** - HSTS, X-Frame-Options, CSP
- **Google Safe Browsing API** - Real-time threat intelligence
- **Error Handling** - Secure error responses

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- 4GB+ RAM (for large file system scans)
- Network access (for port scanning and phishing detection)

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd cybersec-toolkit

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Environment Configuration

Create a `.env` file in the root directory (optional):

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Google Safe Browsing API (Optional)
GOOGLE_API_KEY=your_api_key_here

# Database (Optional - for advanced features)
DATABASE_URL=postgresql://user:password@localhost:5432/cybersec
```

### Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Usage

### Password Analysis
1. Navigate to "Password Analyzer" from the sidebar
2. Enter a password to analyze
3. View comprehensive strength analysis and recommendations

### Phishing Detection
1. Navigate to "Phishing Detector" from the sidebar
2. Enter a URL to analyze
3. View risk assessment with detailed indicators
4. Check Google Safe Browsing verification status (if API key configured)

### Port Scanning
1. Navigate to "Port Scanner" from the sidebar
2. Enter target IP address or domain
3. Specify port range (e.g., "1-1000", "80,443,8080")
4. View open ports and identified services

### Keylogger Detection
1. Navigate to "Keylogger Detector" from the sidebar
2. Click "Scan System" to analyze running processes
3. Review suspicious processes with risk scores
4. Terminate suspicious processes if needed

### File Integrity Monitoring
1. Navigate to "File Integrity Monitor" from the sidebar
2. Enter directory path to monitor
3. Initialize baseline or check for changes
4. Review detected modifications with risk levels

## 🔧 Security Tools

### Password Analyzer
**Endpoint:** `POST /api/security/password-analysis`

**Request:**
```json
{
  "password": "your_password_here"
}
```

**Response:**
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

### Phishing Detector
**Endpoint:** `POST /api/security/phishing-analysis`

**Request:**
```json
{
  "url": "https://example.com/page"
}
```

### Port Scanner
**Endpoint:** `POST /api/security/port-scan`

**Request:**
```json
{
  "target": "192.168.1.1",
  "portRange": "1-1000"
}
```

### Keylogger Detector
**Endpoint:** `POST /api/security/keylogger-scan`

### File Integrity Monitor
**Endpoint:** `POST /api/security/file-integrity-check`

**Request:**
```json
{
  "directory": "/path/to/monitor",
  "recursive": true
}
```

## 💻 Development

### Project Structure
```
cybersec-toolkit/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── security/     # Security tool components
│   │   │   └── ui/           # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utility functions
├── server/                   # Express backend
│   ├── services/             # Security analysis services
│   │   ├── password-service.ts
│   │   ├── phishing-service.ts
│   │   ├── port-service.ts
│   │   ├── keylogger-service.ts
│   │   └── file-integrity-service.ts
│   ├── routes.ts             # API endpoints
│   ├── index.ts              # Server entry
│   └── vite.ts               # Vite integration
├── shared/                   # Shared schemas
│   └── schema.ts             # Zod validation schemas
└── README.md
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run check           # TypeScript type checking

# Production
npm run build           # Build for production
npm start               # Start production server

# Database
npm run db:push         # Push schema to database
```

### Code Quality
- **TypeScript strict mode** for compile-time safety
- **Zod schemas** for runtime validation
- **ESLint** for code consistency
- **Proper error handling** throughout the application

## 🔒 Security Considerations

### Ethical Usage
This toolkit is designed for:
- ✅ Security research and education
- ✅ Authorized penetration testing
- ✅ Personal system monitoring
- ✅ Corporate security assessments (with permission)

### Legal Compliance
**Important:** Users must ensure compliance with:
- Local cybersecurity laws and regulations
- Corporate security policies
- Terms of service for target systems
- Responsible disclosure guidelines

### Network Scanning Ethics
- Only scan systems you own or have permission to test
- Respect rate limits and network resources
- Follow responsible disclosure practices
- Understand legal implications in your jurisdiction

### Data Privacy
- No user data is stored or transmitted to external servers
- All analysis is performed locally
- Google Safe Browsing API only sends URL hashes (when configured)
- No personally identifiable information is collected

## 👥 Team

This Cybersecurity Toolkit is developed by a team of passionate B.Tech students from the Information Technology department (2022-26 batch). Our team brings expertise in:
- Full-stack web development
- Cybersecurity and threat analysis
- Modern web technologies
- Secure software development practices

Visit the "Developers" page in the application to learn more about the team.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- 📖 Read the documentation above
- 🐛 Create an issue for bugs
- 💡 Submit feature requests
- 📧 Contact the team through the Developers page

## ⚠️ Disclaimer

This toolkit is provided for **educational and authorized security testing purposes only**. Users are responsible for ensuring legal and ethical use. The developers assume no liability for misuse or damage caused by this software.

**Always obtain proper authorization before conducting security assessments on systems you do not own.**

---

**Built with ❤️ by IT Students for the Cybersecurity Community**

*Version 1.0.0 | Last Updated: January 2025*
