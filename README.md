# CyberSec Toolkit

> **A comprehensive cybersecurity analysis suite** - Professional-grade security testing toolkit for password analysis, phishing detection, network scanning, and system monitoring.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)

---

## Project Overview

**CyberSec Toolkit** is a full-stack web application designed to provide comprehensive security analysis tools in one unified platform. Built with modern technologies and security best practices, it offers:

- **Password Strength Analyzer** - Advanced entropy-based password security assessment
- **Phishing URL Detector** - AI-powered threat analysis with Google Gemini and multi-layered heuristic detection
- **Network Port Scanner** - Intelligent port scanning with service detection and banner grabbing
- **Keylogger Detection System** - Process behavior analysis for malware detection

---

## Security Tools - Technical Overview

### 1. Password Strength Analyzer

**Advanced entropy-based password security assessment** with multi-factor scoring algorithm combining entropy calculation, pattern detection, and heuristic analysis.

#### Key Features

- Entropy calculation using charset analysis
- 25-point length scoring system
- 45-point character variety assessment
- 20-point entropy bonus system
- Pattern penalty detection (dictionary words, sequences, keyboard patterns)
- Dictionary database with 40+ common passwords
- Crack time estimation across three attack scenarios
- Real-time feedback with visual strength indicator
- Zero-latency client-side analysis with server-side validation

#### Scoring Algorithm

- **Length Analysis** (0-25 points): ≥12 chars = 25 pts, ≥8 chars = 15 pts, ≥6 chars = 10 pts
- **Character Variety** (0-45 points): Uppercase, lowercase, numbers, special characters
- **Entropy Bonus** (0-20 points): ≥60 bits = 20 pts, ≥50 bits = 15 pts, ≥40 bits = 10 pts
- **Pattern Penalties** (-10 to -20 points): Dictionary words, repeated chars, sequences, keyboard patterns

#### Risk Levels

```
0-30:    Weak          - High vulnerability
31-50:   Fair          - Moderate risk
51-70:   Strong        - Good security
71-100:  Very Strong   - Excellent protection
```

---

### 2. Phishing URL Detector

**AI-powered threat analysis** using Google Gemini combined with multi-layered heuristic detection featuring 18+ security indicators for comprehensive phishing detection.

#### Key Features

- **Dual-Layer Analysis**: 60% heuristic scoring + 40% AI analysis blended score
- **Google Gemini AI Integration**: Professional threat classification and context analysis
- **Google Safe Browsing API**: Real threat data verification
- **Multi-Indicator Detection**:
  - Typosquatting and lookalike domain detection using Levenshtein distance
  - Brand impersonation identification (40+ protected brands)
  - Suspicious keyword detection (50+ keywords)
  - IP address vs domain name validation
  - HTTPS/SSL certificate verification
  - Suspicious TLD analysis (high-risk domains)
  - URL length and structure analysis
  - Special character and encoding detection
  - Homoglyph and Unicode attack detection

#### AI-Powered Analysis

When GOOGLE_API_KEY is configured:

- Real-time threat assessment using Google Gemini API
- Threat type classification (phishing, malware, spam, legitimate)
- Confidence scoring with reasoning
- Blended analysis for improved accuracy

#### Risk Classification

```
0-30:    Low       - Safe to proceed
31-60:   Medium    - Exercise caution
61-80:   High      - Likely phishing - avoid
81-100:  Critical  - Definite phishing - block
```

#### Legitimate Domain Database

Protected brands and services: PayPal, Stripe, Google, Microsoft, Apple, Amazon, Facebook, Netflix, Adobe, Zoom, Slack, Discord, GitHub, and 30+ more.

#### Key Features

- Real-time URL analysis with detailed findings
- AI confidence levels and threat type classification
- Optional VirusTotal integration for malware detection
- Professional reporting without false positives
- Educational feedback explaining detection reasoning
- Privacy-focused: no external logging or data collection

---

### 3. Network Port Scanner

**Intelligent TCP port scanning** with adaptive concurrency, service fingerprinting, banner grabbing, and security risk assessment using Node.js native networking.

#### Technical Approach

**Connection-Based Scanning**:
- Attempt TCP connection to target:port
- Port is OPEN if connection succeeds
- Port is FILTERED if connection times out
- Port is CLOSED if connection refused

**Adaptive Concurrency**:
- Minimum 10 concurrent connections
- Maximum 50 concurrent connections
- Scales based on port range size

**Service Detection**: 50+ common services with fingerprinting
- FTP (21), SSH (22), Telnet (23), SMTP (25)
- HTTP (80), HTTPS (443), POP3 (110), IMAP (143)
- MSSQL (1433), MySQL (3306), RDP (3389), PostgreSQL (5432)
- Redis (6379), MongoDB (27017), and more

**Banner Grabbing**:
- Service-specific probes for version detection
- FTP, SSH, SMTP, HTTP, POP3, IMAP protocol support
- Security vulnerability identification

#### Scanning Modes

**Full Scan**:
- Custom port ranges
- User-defined targets
- Comprehensive analysis

**Quick Scan**:
- Pre-configured 30+ common ports
- Optimized for speed
- Most critical services only

#### Port Range Formats

- Single port: `80`
- Multiple ports: `80,443,8080`
- Port ranges: `1-1000`
- Mixed formats: `22,80-100,443,8080-8090`

#### Key Features

- Adaptive concurrency for optimal performance
- Service fingerprinting and version detection
- Banner grabbing for detailed information
- Security risk classification
- Private IP and localhost detection
- Network-friendly with rate limiting
- Support for both IP addresses and domain names
- Timeout strategy: 2s connection, 3s banner grab, 100ms chunk delays

---

### 4. Keylogger Detection System

**Process behavior analysis** using heuristic pattern matching, entropy calculation, and risk scoring to identify potentially malicious keylogging software. Multi-platform support (Windows, Linux, macOS).

#### Analysis Algorithms

**1. Keyword Detection** (25 points per match)
- Direct indicators: keylog, keystroke, capture, hook
- Monitoring: monitor, record, spy, stealth
- Malware terms: trojan, rat, backdoor, rootkit
- Obfuscation: hidden, invisible, bypass

**2. Process Name Analysis** (40 points)
- Known malicious patterns
- Legitimate process verification

**3. System Process Mimicry** (20 points)
- Illegitimate system-like names
- Path validation

**4. File Location Analysis** (15 points)
- Temporary directory execution
- Cache folder execution
- Missing path information

**5. Resource Usage Analysis** (10 points)
- High CPU usage (>50%)
- High memory usage indicators

**6. Name Entropy Analysis** (15 points)
- Shannon entropy calculation
- High entropy (>4.2) suggests random/obfuscated names

#### Risk Classification

```
Low:      0-30 score   - 0 suspicious processes
Medium:   31-60 score  - Total risk 60-100
High:     61-80 score  - Total risk 100-150
Critical: 81+ score    - Total risk 150+
```

#### Key Features

- Multi-platform support (Windows, Linux, macOS)
- Real-time process scanning
- Behavior-based detection (not signature-based)
- Risk scoring with detailed reasoning
- Legitimate process whitelist (50+ entries)
- Low false-positive rate
- Auto-refresh monitoring
- Detailed process information (PID, user, resources)

---

## Technology Stack

### Frontend

```
React 18.3.1
├── TypeScript 5.6.3
├── Vite 5.4.19
├── Tailwind CSS 3.4.17
├── Radix UI Components (20+)
├── TanStack Query 5.60.5
├── Wouter 3.3.5 (Routing)
├── Lucide React 0.453.0 (Icons)
└── React Hook Form 7.55.0 (Forms)
```

### Backend

```
Node.js 18+
└── Express 4.21.2
    ├── TypeScript 5.6.3
    ├── Express Validator 7.2.1
    ├── Helmet 8.1.0
    ├── Express Rate Limit 8.1.0
    ├── Axios 1.12.2 (HTTP requests)
    └── Zod 3.24.2 (Schema validation)
```

### Security Libraries

- Helmet - Security headers
- Express Rate Limit - DDoS protection
- Express Validator - Input sanitization
- Zod - Runtime type checking

---

## Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm or pnpm package manager
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Step-by-Step Installation

```bash
# Clone the repository
git clone <repository-url>
cd cybersec-toolkit

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# Navigate to http://localhost:5000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env` file for optional configurations:

```env
# Google API Key for Gemini AI and Safe Browsing (recommended)
GOOGLE_API_KEY=your_api_key_here

# VirusTotal API (optional) - for advanced phishing detection
VIRUSTOTAL_API_KEY=your_virustotal_key

# Server configuration
PORT=5000
NODE_ENV=production
```

---

## Setting Up Your Google API Key

### Step 1: Create a Google Cloud Project
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Generative Language API" for Gemini
4. Create an API key from the credentials page

### Step 2: Add to Replit
1. Open the Secrets tool in Replit sidebar
2. Click "Add"
3. Key: `GOOGLE_API_KEY`
4. Value: Paste your API key
5. Click "Add Secret"

### Step 3: Verify Configuration
- Restart your application
- Test the Phishing Detector
- AI analysis will activate when a URL is analyzed

---

## API Documentation

### Base URL

```
Development: http://localhost:5000/api/security
Production:  https://your-domain.com/api/security
```

### Endpoints

#### 1. Password Analysis

```http
POST /password-analysis
Content-Type: application/json

Request:
{
  "password": "string (1-256 chars)"
}

Response:
{
  "score": 85,
  "strength": "very-strong",
  "criteria": {
    "length": true,
    "specialChars": true,
    "numbers": true,
    "upperCase": true,
    "lowerCase": true
  },
  "entropy": 68.5,
  "suggestions": [],
  "crackTime": "Centuries"
}
```

#### 2. Phishing Analysis

```http
POST /phishing-analysis
Content-Type: application/json

Request:
{
  "url": "https://example.com"
}

Response:
{
  "score": 15,
  "risk": "low",
  "indicators": {...},
  "details": ["Analysis details..."],
  "recommendations": ["Recommendations..."],
  "metadata": {
    "hostname": "example.com",
    "tld": "com",
    "aiAnalysis": {
      "enabled": true,
      "score": 12,
      "confidence": 85,
      "threatType": "legitimate"
    }
  }
}
```

#### 3. Port Scan

```http
POST /port-scan
Content-Type: application/json

Request:
{
  "target": "scanme.nmap.org",
  "portRange": "1-1000"
}

Response:
{
  "target": "scanme.nmap.org",
  "totalPorts": 1000,
  "openPorts": [
    {
      "port": 22,
      "state": "open",
      "service": "SSH",
      "banner": "SSH-2.0-OpenSSH_7.4"
    }
  ],
  "scanDuration": 45000
}
```

#### 4. Quick Port Scan

```http
POST /port-scan-quick
Content-Type: application/json

Request:
{
  "target": "example.com"
}

Response:
{
  "target": "example.com",
  "commonPorts": 30,
  "openPorts": [...],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 5. Keylogger Scan

```http
POST /keylogger-scan
Content-Type: application/json

Response:
{
  "processesScanned": 156,
  "suspiciousProcesses": [
    {
      "pid": 1234,
      "name": "suspicious.exe",
      "command": "C:\\temp\\suspicious.exe",
      "riskScore": 75,
      "reasons": ["Contains suspicious keyword: keylog"],
      "user": "SYSTEM",
      "cpuUsage": 45.2,
      "memoryUsage": 125000
    }
  ],
  "riskLevel": "high",
  "recommendations": [...],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Features Highlights

### Password Strength Analyzer

- Real-time entropy calculation
- Multi-factor strength assessment
- Dictionary and pattern detection
- Crack time estimation
- Visual strength indicator
- Privacy-first: no password storage

### Phishing URL Detector

- AI-powered with Google Gemini API
- 18+ security indicators
- Brand impersonation detection
- Typosquatting detection
- Google Safe Browsing integration
- Optional VirusTotal support
- Professional reporting
- No external logging

### Network Port Scanner

- Adaptive concurrency control
- Service fingerprinting
- Banner grabbing
- Security risk assessment
- Quick and full scan modes
- Domain and IP support
- Network-friendly rate limiting

### Keylogger Detection

- Process behavior analysis
- Entropy-based detection
- Multi-platform support
- Real-time scanning
- Low false-positive rate
- Detailed risk reporting
- Legitimate process whitelist

---

## Security & Privacy

- Local-first processing where possible
- No personal data collection
- No external logging of sensitive information
- Encrypted secure transmission
- HTTPS enforcement
- Input validation and sanitization
- Rate limiting and DDoS protection
- Helmet security headers enabled

---

## Use Cases

**For IT Security Professionals**:
- Network security assessment
- Threat detection and analysis
- Security awareness training
- Incident response support

**For Developers**:
- Security testing toolkit
- Password validation integration
- URL safety verification
- System monitoring

**For Educational Purposes**:
- Learn cybersecurity concepts
- Understand threat detection
- Study algorithm implementation
- Practice security analysis

---

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Modern mobile browsers

---

## Performance Considerations

- Frontend: React with Vite for fast builds
- Backend: Express with Express Rate Limit
- Caching: TanStack Query for efficient data management
- Security: Helmet for response headers
- Validation: Zod for runtime type checking

---

## License

MIT License - Free for educational and commercial use.

---

## Support & Contact

For issues, feature requests, or security concerns, please open an issue in the repository.

---

**CyberSec Toolkit** - Professional Security Analysis Made Simple
