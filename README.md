# 🛡️ CyberSec Toolkit

> **A comprehensive cybersecurity analysis suite** - Professional-grade security testing toolkit for password analysis, phishing detection, network scanning, and system monitoring.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)

---

## 🌟 Project Overview

**CyberSec Toolkit** is a full-stack web application designed to provide comprehensive security analysis tools in one unified platform. Built with modern technologies and security best practices, it offers:

- 🔐 **Password Strength Analyzer** - Advanced entropy-based password security assessment
- 🎣 **Phishing URL Detector** - Multi-layered heuristic phishing detection with 17+ indicators
- 🌐 **Network Port Scanner** - Intelligent port scanning with service detection and banner grabbing
- ⌨️ **Keylogger Detection System** - Process behavior analysis for malware detection

---

## 🔬 Security Tools - Technical Approaches

### 1. Password Strength Analyzer

#### Technical Approach

The Password Analyzer uses a multi-factor scoring algorithm combining entropy calculation, pattern detection, and heuristic analysis to provide comprehensive password security assessment.

#### Implementation Methodology

**A. Entropy Calculation**

```
Entropy (bits) = log₂(charset_size ^ password_length)

Where charset_size is determined by:
- Lowercase letters (a-z): 26
- Uppercase letters (A-Z): 26
- Numbers (0-9): 10
- Special characters (!@#$%...): 32
```

**B. Scoring Algorithm (0-100 scale)**

1. **Length Analysis** (0-25 points)

   - ≥12 characters: 25 points
   - ≥8 characters: 15 points
   - ≥6 characters: 10 points
   - <6 characters: Proportional scoring

2. **Character Variety** (0-45 points)

   - Uppercase letters: 10 points
   - Lowercase letters: 10 points
   - Numbers: 10 points
   - Special characters: 15 points

3. **Entropy Bonus** (0-20 points)

   - ≥60 bits: 20 points
   - ≥50 bits: 15 points
   - ≥40 bits: 10 points

4. **Pattern Penalties** (-10 to -20 points)
   - Dictionary words: -20 points
   - Repeated characters (3+): -10 points
   - Sequential patterns (123, abc): -10 points
   - Keyboard patterns (qwerty, asdf): -10 points

**C. Dictionary & Pattern Detection**

The system maintains comprehensive databases:

- 40+ common passwords (password, 123456, qwerty, etc.)
- 30+ dictionary words frequently used in passwords
- Pattern recognition for:
  - Sequential numbers: 012, 123, 234, etc.
  - Sequential letters: abc, bcd, cde, etc.
  - Keyboard patterns: qwer, asdf, zxcv, etc.
  - Repeated characters: aaa, 111, etc.
  - Alternating patterns

**D. Crack Time Estimation**

Using the calculated entropy, we estimate crack time based on:

```
Total Combinations = 2^entropy
Average Attempts = Total Combinations / 2
Crack Time = Average Attempts / Attack Speed

Attack Scenarios:
- Basic online: 1,000 attempts/second
- Moderate offline: 1,000,000 attempts/second
- Advanced rig: 1,000,000,000,000 attempts/second (1 trillion/sec)
```

**E. Real-time Feedback**

- ✅ Instant analysis as user types
- ✅ Visual strength indicator (color-coded progress bar)
- ✅ Detailed criteria checklist with pass/fail status
- ✅ Actionable improvement suggestions
- ✅ Entropy visualization in bits

#### Key Features

- Zero-latency client-side fallback for instant feedback
- Server-side validation for enhanced security
- No password storage - analysis only
- Privacy-focused: passwords never logged or transmitted externally

---

### 2. Phishing URL Detector

#### Technical Approach

Advanced heuristic-based phishing detection using 17 comprehensive indicators including typosquatting, brand impersonation, suspicious patterns, and structural analysis. Completely offline operation for maximum privacy.

#### Implementation Methodology

**A. Multi-Layer Analysis System**

1. **Domain Structure Analysis**

   - TLD (Top-Level Domain) validation
   - Subdomain depth analysis
   - Domain length checks
   - Suspicious character detection (@, -, numbers in domain)

2. **Typosquatting Detection**

   - Levenshtein distance algorithm for similarity matching
   - Character substitution detection (o→0, i→l, etc.)
   - Homoglyph detection (unicode lookalike characters)
   - Brand name database (40+ major brands)

3. **URL Pattern Analysis**

   - Suspicious keywords detection (50+ keywords)
     - Account-related: login, signin, verify, update, secure
     - Action-related: confirm, validate, urgent, suspend
     - Brand impersonation: paypal, google, microsoft, bank
   - IP address usage detection
   - Port number analysis
   - Path depth and complexity

4. **Security Indicators**
   - HTTPS vs HTTP protocol check
   - Shortened URL detection (bit.ly, tinyurl, etc.)
   - Suspicious TLD analysis (.tk, .ml, .ga, etc.)
   - Free hosting service detection

**B. Scoring Algorithm (0-100 scale)**

Each indicator contributes to the final risk score:

| Indicator                    | Weight | Example                  |
| ---------------------------- | ------ | ------------------------ |
| Typosquatting detected       | 35     | g00gle.com vs google.com |
| Brand impersonation          | 25     | paypal-secure.com        |
| Suspicious keywords (3+)     | 20     | verify-account-urgent    |
| HTTP (no HTTPS)              | 15     | http://bank-login.com    |
| IP address in URL            | 25     | http://192.168.1.1       |
| Suspicious TLD               | 15     | example.tk               |
| Excessive subdomains (4+)    | 20     | a.b.c.d.example.com      |
| URL shortener                | 10     | bit.ly/xyz               |
| Suspicious characters (@, -) | 10     | http://paypal@evil.com   |

**C. Brand Detection Engine**

Maintains database of legitimate brands and their variations:

```
Protected Brands:
- Financial: paypal, stripe, visa, mastercard, amex
- Tech: google, microsoft, apple, amazon, facebook
- Services: netflix, spotify, adobe, zoom
- Email: gmail, outlook, yahoo, protonmail

Legitimate Subdomains:
- accounts.google.com ✅
- login.microsoft.com ✅
- secure.paypal.com ✅
```

**D. Risk Classification**

```
Score Range    Risk Level    Action
0-30          Low           Safe to proceed
31-60         Medium        Exercise caution
61-80         High          Likely phishing - avoid
81-100        Critical      Definite phishing - block
```

**E. Detailed Reporting**

For each analyzed URL, the system provides:

- Overall risk score and level
- List of detected indicators with explanations
- Comparison with legitimate brand domains
- Specific recommendations for user action

#### Key Features

- 17+ phishing indicators for comprehensive detection
- Brand awareness with typosquatting detection
- Privacy-focused: all analysis performed locally
- Optional Google Safe Browsing API integration
- Real-time analysis with detailed explanations
- Educational feedback showing WHY a URL is suspicious

---

### 3. Network Port Scanner

#### Technical Approach

Intelligent TCP port scanning with adaptive concurrency, service fingerprinting, banner grabbing, and security risk assessment using Node.js native networking capabilities.

#### Implementation Methodology

**A. Port Scanning Engine**

**1. Connection-Based Scanning**

```javascript
TCP Connect Scan:
1. Attempt TCP connection to target:port
2. If connection succeeds → Port is OPEN
3. If connection times out → Port is FILTERED
4. If connection refused → Port is CLOSED
```

**2. Adaptive Concurrency**

```
Concurrency = min(50, max(10, port_count / 10))

Examples:
- 100 ports → 10 concurrent scans
- 500 ports → 50 concurrent scans
- 1000 ports → 50 concurrent scans (capped)
```

**3. Timeout Strategy**

- Initial connection: 2000ms (2 seconds)
- Banner grab: 3000ms (3 seconds)
- Respectful delays: 100ms between chunks

**B. Service Detection**

Comprehensive service database (50+ common services):

| Port  | Service    | Description            | Risk Level |
| ----- | ---------- | ---------------------- | ---------- |
| 21    | FTP        | File Transfer Protocol | HIGH       |
| 22    | SSH        | Secure Shell           | MEDIUM     |
| 23    | Telnet     | Unencrypted terminal   | CRITICAL   |
| 25    | SMTP       | Email server           | MEDIUM     |
| 80    | HTTP       | Web server             | LOW        |
| 443   | HTTPS      | Secure web server      | LOW        |
| 1433  | MSSQL      | Microsoft SQL Server   | HIGH       |
| 3306  | MySQL      | MySQL Database         | HIGH       |
| 3389  | RDP        | Remote Desktop         | HIGH       |
| 5432  | PostgreSQL | PostgreSQL Database    | HIGH       |
| 6379  | Redis      | Redis Cache            | HIGH       |
| 8080  | HTTP-Alt   | Alternative HTTP       | MEDIUM     |
| 27017 | MongoDB    | MongoDB Database       | HIGH       |

**C. Banner Grabbing**

Service-specific probes for version detection:

```
FTP (21):     "HELP\r\n"
SSH (22):     "SSH-2.0-Scanner\r\n"
SMTP (25):    "EHLO scanner\r\n"
HTTP (80):    "GET / HTTP/1.0\r\n\r\n"
POP3 (110):   "USER scanner\r\n"
IMAP (143):   "A001 CAPABILITY\r\n"
```

**D. Security Analysis**

Automatic risk assessment for open ports:

- Identifies dangerous services (Telnet, FTP, RDP)
- Detects vulnerable versions (SSH-1.x, anonymous FTP)
- Flags high-risk database exposure
- Provides security recommendations

**E. Port Range Parsing**

Flexible input formats:

```
Single port:    "80"
Multiple ports: "80,443,8080"
Port range:     "1-1000"
Mixed:          "22,80-100,443,8080-8090"
```

#### Scanning Modes

**1. Full Scan**

- Custom port range
- User-defined targets
- Comprehensive analysis

**2. Quick Scan**

- Pre-configured 30+ common ports
- Optimized for speed
- Most critical services

#### Key Features

- Adaptive concurrency for optimal performance
- Service fingerprinting and version detection
- Banner grabbing for detailed information
- Security risk classification
- Private IP / localhost detection
- Network-friendly with rate limiting
- Support for both IP addresses and domain names

---

### 4. Keylogger Detection System

#### Technical Approach

Process behavior analysis using heuristic pattern matching, entropy calculation, and risk scoring to identify potentially malicious keylogging software. Multi-platform support (Windows, Linux, macOS).

#### Implementation Methodology

**A. Process Enumeration**

**Windows:**

```
Command: wmic process get Name,ProcessId,CommandLine,PageFileUsage,WorkingSetSize /format:csv
Retrieves: Process name, PID, full command line, memory usage
```

**Linux/macOS:**

```
Command: ps aux
Retrieves: User, PID, CPU%, Memory%, full command, resource usage
```

**B. Risk Analysis Algorithm**

**1. Keyword Detection** (25 points per match)

```
Suspicious Keywords Database (35+ terms):
- Direct indicators: keylog, keystroke, capture, hook
- Monitoring: monitor, record, spy, stealth
- Malware terms: trojan, rat, backdoor, rootkit
- Obfuscation: hidden, invisible, bypass
```

**2. Process Name Analysis** (40 points)

```
Known Malicious Patterns:
- keylogger, spyware, malware, rootkit
- remote_access, rat, trojan, virus
```

**3. System Process Mimicry** (20 points)

```
Illegitimate system-like names:
- svchost.exe (in wrong location)
- csrss.exe (not from System32)
- lsass.exe (suspicious path)
- winlogon.exe (wrong directory)
```

**4. File Location Analysis** (15 points)

```
Suspicious Indicators:
- .tmp extension
- Temp directory execution
- Cache folder execution
- Missing path information
```

**5. Resource Usage Analysis** (10 points)

```
High CPU usage (>50%): Potential monitoring activity
High Memory usage: Possible data buffering
```

**6. Name Entropy Analysis** (15 points)

```
Shannon Entropy Calculation:
H(X) = -Σ P(xi) * log₂(P(xi))

High entropy (>4.2) suggests random/obfuscated names:
- Good: chrome.exe (entropy: 2.5)
- Bad: xk7f92hn.exe (entropy: 4.8)
```

**C. Legitimate Process Whitelist**

Protected processes (50+ entries):

```
System: explorer.exe, csrss.exe, lsass.exe, services.exe
Browsers: chrome.exe, firefox.exe, msedge.exe, safari.exe
Development: code.exe, node.exe, python.exe, java.exe
Common: teams.exe, slack.exe, discord.exe, zoom.exe
```

**D. Overall Risk Classification**

```
Risk Score Aggregation:
- Calculate individual process risk scores
- Sum total risk across all suspicious processes
- Determine maximum risk score

Risk Levels:
Low:      0-30 score  OR  0 suspicious processes
Medium:   31-60 score  OR  total risk 60-100
High:     61-80 score  OR  total risk 100-150
Critical: 81+ score   OR  total risk 150+
```

**E. Recommendations Engine**

Context-aware recommendations based on risk level:

```
Critical:
- Immediate process termination
- Network disconnection
- Full antivirus scan
- Security team notification

High:
- Immediate investigation
- System isolation consideration
- Comprehensive malware scan

Medium:
- Close monitoring
- Process signature verification
- Manual inspection

Low:
- Routine monitoring
- Whitelist management
- Regular scans
```

#### Key Features

- Multi-platform support (Windows, Linux, macOS)
- Real-time process scanning
- Behavior-based detection (not signature-based)
- Risk scoring with detailed reasoning
- Safe process termination capability
- Auto-refresh monitoring (30-second intervals)
- Low false-positive rate with whitelist
- Detailed process information (PID, user, resources)

---

## 🛠️ Technology Stack

### Frontend Technologies

```
React 18.3.1
├── TypeScript 5.6.3               # Type safety and better DX
├── Vite 5.4.19                    # Ultra-fast build tool
├── Tailwind CSS 3.4.17            # Utility-first styling
├── Radix UI                       # Accessible component primitives
│   ├── @radix-ui/react-dialog
│   ├── @radix-ui/react-dropdown-menu
│   ├── @radix-ui/react-tabs
│   └── [20+ components]
├── TanStack Query 5.60.5          # Server state management
├── Wouter 3.3.5                   # Lightweight routing
├── Framer Motion 11.13.1          # Animations
├── Lucide React 0.453.0           # Icon library
└── React Hook Form 7.55.0         # Form management
```

### Backend Technologies

```
Node.js (18+)
└── Express 4.21.2                 # Web framework
    ├── TypeScript 5.6.3           # Type safety
    ├── Express Validator 7.2.1    # Input validation
    ├── Helmet 8.1.0               # Security headers
    ├── Express Rate Limit 8.1.0   # Rate limiting
    ├── Express Session 1.18.1     # Session management
    └── Zod 3.24.2                 # Schema validation
```

### Security Libraries

```
Cryptography & Security
├── bcrypt 6.0.0                   # Password hashing
├── Helmet                         # Security headers
├── Express Rate Limit             # DDoS protection
├── Express Validator              # Input sanitization
└── Zod                            # Runtime type checking
```

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm or pnpm package manager
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Step-by-Step Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd cybersec-toolkit

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:5000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables (Optional)

Create a `.env` file for optional configurations:

```env
# Google Safe Browsing API (optional)
GOOGLE_API_KEY=your_api_key_here

# Server configuration
PORT=5000
NODE_ENV=production
```

---

## 📡 API Documentation

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

Request Body:
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
    "lowerCase": true,
    "noDictionaryWords": true
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

Request Body:
{
  "url": "https://example.com"
}

Response:
{
  "url": "https://example.com",
  "isPhishing": false,
  "riskScore": 15,
  "riskLevel": "low",
  "indicators": [...],
  "recommendations": [...]
}
```

#### 3. Port Scan

```http
POST /port-scan
Content-Type: application/json

Request Body:
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
  "scanDuration": 45000,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 4. Keylogger Scan

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

```http

Request Body:
{
  "directory": "/path/to/directory",
  "recursive": true
}
```

## 🎓 Presentation Guide for Panel Members

### Key Highlights to Present

1. **Comprehensive Security Suite**

   - 5 integrated security tools in one platform
   - Real-world applicable solutions
   - Educational and practical value

2. **Technical Excellence**

   - Full-stack TypeScript implementation
   - Modern architecture (React + Express)
   - Industry-standard security practices
   - Clean, maintainable codebase

3. **Advanced Algorithms**

   - Entropy-based password analysis
   - Heuristic phishing detection
   - Process behavior analysis
   - Cryptographic file verification

4. **User Experience**

   - Intuitive interface design
   - Real-time feedback
   - Detailed explanations
   - Educational recommendations

5. **Security & Privacy**
   - Local-first processing
   - No data collection
   - Responsible disclosure practices
   - Ethical use guidelines

### Demo Flow Recommendation

1. **Start with Password Analyzer** (Most visual)

   - Show weak password → poor score
   - Show strong password → excellent score
   - Highlight real-time feedback

2. **Phishing Detector** (High impact)

   - Test legitimate URL → safe result
   - Test suspicious URL → high-risk detection
   - Explain detection techniques

3. **Port Scanner** (Technical depth)

   - Quick scan demonstration
   - Service detection showcase
   - Security assessment explanation

   - Initialize baseline
   - Modify a file
   - Detect changes

4. **Architecture Overview**
   - Show system diagram
   - Explain technology choices
   - Discuss scalability

---

## 📄 License

MIT License - Free for educational and commercial use.
