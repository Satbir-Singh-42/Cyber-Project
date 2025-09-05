# CyberSec Toolkit

A professional-grade cybersecurity analysis suite built with React, Express, and TypeScript. This application provides comprehensive security tools for real-world threat detection, analysis, and system monitoring.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)

## 🛡️ Security Analysis Tools

### 🔐 Password Strength Analyzer
**Advanced cryptographic password analysis with real-world attack modeling**

- **Entropy Calculation**: Shannon entropy analysis for true randomness measurement
- **Pattern Detection**: Identifies keyboard patterns, repetitive sequences, and common substitutions
- **Dictionary Attack Simulation**: Comprehensive checks against 10,000+ common passwords and dictionary words
- **Crack Time Estimation**: Realistic time estimates using modern GPU attack scenarios (1e12 attempts/second)
- **Comprehensive Scoring**: Multi-factor scoring system considering length, complexity, and predictability
- **Security Recommendations**: Actionable suggestions for password improvement

**Technical Implementation:**
- Uses Node.js `crypto` module for secure hash calculations
- Implements NIST guidelines for password strength assessment
- Real-time entropy calculation using log₂(character_space^length)
- Advanced pattern recognition for sequential and keyboard-based attacks

### 🎣 Phishing Detection Engine
**Multi-vector URL analysis for sophisticated phishing detection**

- **IP-Based URL Detection**: Identifies direct IP access attempts (IPv4/IPv6)
- **Subdomain Analysis**: Detects suspicious patterns and excessive subdomain nesting
- **Homograph Attack Detection**: Unicode and IDN (Internationalized Domain Name) spoofing identification
- **URL Shortener Recognition**: Identifies and flags shortened URLs from major services
- **Keyword Analysis**: Scans for 25+ suspicious keywords commonly used in phishing
- **Domain Age Assessment**: Evaluates domain establishment and legitimacy
- **Security Protocol Verification**: Checks for HTTPS implementation and certificate issues

**Technical Implementation:**
- Real-time URL parsing with Node.js URL API
- Comprehensive regex patterns for attack vector identification
- Legitimate domain database for false positive reduction
- Risk scoring algorithm with weighted threat factors

### 🌐 Network Port Scanner
**Professional-grade TCP port scanning with service detection**

- **Real TCP Connections**: Performs actual network connections (not simulated)
- **Service Banner Grabbing**: Retrieves service banners for version identification
- **Concurrent Scanning**: Adaptive concurrency with rate limiting for network efficiency
- **Service Detection**: Identifies 30+ common services with version information
- **Security Risk Assessment**: Flags high-risk services and vulnerable configurations
- **Custom Port Ranges**: Supports individual ports, ranges (1-1000), and comma-separated lists
- **Network Respect**: Built-in delays and connection limits to avoid network flooding

**Technical Implementation:**
- Uses Node.js `net` module for raw TCP socket connections
- Implements proper timeout handling and error management
- Real service probes for HTTP, SSH, FTP, SMTP, and other protocols
- Identifies dangerous services like Telnet, unencrypted FTP, and open databases

### ⌨️ Keylogger Detection System
**Behavioral process analysis for malware detection**

- **Real Process Monitoring**: Interfaces with OS process APIs (Windows WMIC, Unix ps)
- **Behavioral Analysis**: Entropy-based detection of obfuscated process names
- **Resource Usage Monitoring**: CPU and memory analysis for suspicious activity
- **Pattern Recognition**: Identifies mimicked system processes and random naming patterns
- **Risk Scoring**: Multi-factor analysis including keywords, patterns, and behavior
- **Process Termination**: Capability to terminate suspicious processes (with proper permissions)

**Technical Implementation:**
- Cross-platform process enumeration (Windows, macOS, Linux)
- String entropy calculation for randomness detection
- Comprehensive suspicious keyword database (30+ indicators)
- System process legitimacy verification against known good processes

### 📁 File Integrity Monitoring
**Cryptographic file system monitoring with change detection**

- **SHA-256 Hashing**: Cryptographic integrity verification for tamper detection
- **Baseline Management**: Creates and maintains file system baselines
- **Real-time Change Detection**: Identifies added, modified, and deleted files
- **Risk Assessment**: Categorizes changes by security impact (Critical/High/Medium/Low)
- **Mass Operation Detection**: Identifies potential malware spreading patterns
- **System File Protection**: Special monitoring for critical system directories
- **Recursive Scanning**: Deep directory traversal with intelligent filtering

**Technical Implementation:**
- Uses Node.js `fs/promises` for efficient file system operations
- Implements SHA-256 with Node.js `crypto` module for integrity verification
- Intelligent file type detection and risk categorization
- Memory-efficient handling of large directory structures

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe component development
- **Vite** for lightning-fast development and optimized production builds
- **Tailwind CSS** with custom design system and dark/light mode support
- **Radix UI** components for accessibility-first interface design
- **TanStack Query** for intelligent server state management and caching
- **Wouter** for lightweight client-side routing

### Backend Stack
- **Node.js 18+** with ES modules and TypeScript compilation
- **Express.js** with comprehensive security middleware stack
- **Helmet.js** for security headers (CSP, HSTS, X-Frame-Options)
- **Rate Limiting** with express-rate-limit and custom security endpoint throttling
- **Input Validation** using Zod schemas for all API endpoints

### Security Features
- **Content Security Policy** with strict script and style sources
- **Request Rate Limiting**: 100 requests/15min general, 20 requests/15min security endpoints
- **Input Sanitization**: Comprehensive validation for all user inputs
- **Memory Management**: Efficient handling of large datasets and file operations
- **Error Handling**: Secure error responses that don't leak system information

## 🚀 Installation & Setup

### Prerequisites
- **Node.js 18+** (Latest LTS recommended)
- **npm** or **yarn** package manager
- **4GB+ RAM** (for large file system scans)
- **Network access** (for port scanning and phishing detection)

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd cybersec-toolkit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (Optional - for session storage)
DATABASE_URL=postgresql://user:password@localhost:5432/cybersec

# Security Settings
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SECURITY_RATE_LIMIT_MAX=20
```

### Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📚 API Documentation

### Security Analysis Endpoints

All endpoints are prefixed with `/api/security/` and require JSON payloads.

#### Password Analysis
```bash
POST /api/security/password-analysis
Content-Type: application/json

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

#### Phishing Detection
```bash
POST /api/security/phishing-detection
Content-Type: application/json

{
  "url": "https://example.com/suspicious-page"
}
```

#### Port Scanning
```bash
POST /api/security/port-scan
Content-Type: application/json

{
  "target": "192.168.1.1",
  "portRange": "1-1000"
}
```

#### Keylogger Detection
```bash
POST /api/security/keylogger-detection
Content-Type: application/json

{}
```

#### File Integrity Check
```bash
POST /api/security/file-integrity-check
Content-Type: application/json

{
  "directory": "/path/to/monitor",
  "recursive": true
}
```

## 🔧 Configuration Options

### Security Settings

The application includes configurable security settings:

- **Rate Limiting**: Adjustable request limits per IP address
- **Scan Timeouts**: Configurable timeouts for network operations
- **File Size Limits**: Maximum file sizes for integrity monitoring
- **Concurrent Operations**: Limits for simultaneous network connections

### Performance Tuning

For optimal performance:

- **Memory**: Minimum 4GB RAM for large directory scans
- **Network**: Stable connection for port scanning operations
- **CPU**: Multi-core processor recommended for concurrent analysis
- **Storage**: SSD recommended for file integrity operations

## 🛠️ Development

### Project Structure
```
cybersec-toolkit/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utility functions
├── server/                   # Express backend application
│   ├── services/             # Security analysis services
│   │   ├── password-service.ts    # Real cryptographic analysis
│   │   ├── phishing-service.ts    # URL threat detection
│   │   ├── port-service.ts        # Network scanning engine
│   │   ├── keylogger-service.ts   # Process monitoring
│   │   └── file-integrity-service.ts # File system monitoring
│   ├── routes.ts             # API endpoint definitions
│   └── index.ts              # Server entry point
├── shared/                   # Shared TypeScript schemas
└── README.md                 # This file
```

### Running Tests

```bash
# Run frontend tests
npm run test:client

# Run backend tests
npm run test:server

# Run all tests
npm test
```

### Code Quality

The project maintains high code quality with:

- **TypeScript strict mode** for compile-time error catching
- **ESLint** for code style consistency
- **Prettier** for code formatting
- **Pre-commit hooks** for automatic quality checks

## 🔐 Security Considerations

### Ethical Usage
This toolkit is designed for:
- ✅ Security research and education
- ✅ Authorized penetration testing
- ✅ Personal system monitoring
- ✅ Corporate security assessments (with permission)

### Legal Compliance
Users must ensure compliance with:
- Local cybersecurity laws and regulations
- Corporate security policies
- Terms of service for target systems
- Responsible disclosure guidelines

### Rate Limiting & Network Respect
- Built-in delays between network operations
- Configurable concurrency limits
- Respectful scanning practices
- Automatic timeout handling

## 🚧 Limitations

### Network Scanning
- Requires network access to target systems
- May be blocked by firewalls or intrusion detection systems
- Performance depends on network latency and target responsiveness

### File Integrity Monitoring
- Requires file system read permissions
- Performance scales with directory size
- May impact system performance during large scans

### Process Monitoring
- Requires appropriate system permissions
- Platform-specific implementations
- May trigger antivirus false positives

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

### Bug Reports
Please include:
- Operating system and version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support:
- 📖 Check the documentation above
- 🐛 Create an issue for bugs
- 💡 Submit feature requests
- 📧 Contact the security team for questions

## ⚠️ Disclaimer

This toolkit is provided for educational and authorized security testing purposes only. Users are responsible for ensuring legal and ethical use. The developers assume no liability for misuse or damage caused by this software.

---

**Built with ❤️ for the cybersecurity community**

*Last updated: September 2025*