# CyberSec Toolkit

> **A comprehensive cybersecurity analysis suite** - Professional-grade security testing toolkit for password analysis, phishing detection, network scanning, and system monitoring.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)

---

## What is CyberSec Toolkit?

**CyberSec Toolkit** is a free web-based security analyzer that helps you:
- Check if your passwords are strong and secure
- Detect if URLs are phishing scams or safe
- Find open network ports on computers
- Identify suspicious programs that might be spying on you

Think of it like a security scanner for your digital life. You paste something in (a password, a URL, etc.), and it tells you if it's safe or at risk.

---

## Quick Start (For Beginners)

### Getting Started in 2 Minutes

1. **Open the toolkit** - Visit the website
2. **Choose a tool** from the left menu (Password Analyzer, Phishing Detector, Port Scanner, or Keylogger Detection)
3. **Enter your data** (password, URL, etc.)
4. **See the results** - Get instant analysis with recommendations

### What Each Tool Does (Simple Explanation)

| Tool | What It Does | Example Use |
|------|-------------|------------|
| **Password Analyzer** | Checks how strong your password is | Enter "MyP@ssw0rd123" and see if it's secure |
| **Phishing Detector** | Checks if a website is fake/scam | Paste a suspicious email link and check if it's safe |
| **Port Scanner** | Finds open ports on a computer | Scan example.com to see what services are running |
| **Keylogger Detection** | Finds suspicious spy programs | Scan your computer for keyloggers and malware |

---

## How to Use Each Tool (Step-by-Step)

### 1. Password Strength Analyzer

**What it does:** Analyzes your password and tells you if it's weak, medium, or strong.

**How to use it:**
1. Click "Password Strength Analyzer" from the left menu
2. Type your password in the text box
3. See the strength score (0-100)
4. Read the suggestions to make it stronger

**What it checks:**
- Length (longer = stronger)
- Mix of letters, numbers, and symbols
- Avoids common words like "password123"
- Estimates how long it would take to crack

**Tips for strong passwords:**
- Use at least 12 characters
- Include uppercase (A-Z), lowercase (a-z), numbers (0-9), and symbols (!@#$%)
- Avoid your name, birthday, or common words
- Don't reuse passwords across websites

**Example:**
```
Weak password: "password"      → Score: 10/100
Good password: "Blue$Sky2024"  → Score: 72/100
Strong password: "xR9!kL@mP2$vN7#w" → Score: 95/100
```

---

### 2. Phishing URL Detector

**What it does:** Checks if a website is legitimate or a phishing scam (fake website trying to steal information).

**How to use it:**
1. Click "Phishing URL Detector" from the left menu
2. Paste a website URL (example: https://www.paypal.com)
3. Click "Analyze URL"
4. See the risk level (Low/Medium/High/Critical)
5. Read the detailed findings

**What it checks:**
- If the domain looks like a fake version of a real site (typosquatting)
- If it uses HTTPS (secure) or HTTP (not secure)
- If the URL length is suspiciously long
- If it's on any known phishing lists
- Uses AI to analyze the threat level

**Risk Levels Explained:**
- **🟢 Low Risk (0-30):** Safe to visit
- **🟡 Medium Risk (31-60):** Be cautious, check the source
- **🔴 High Risk (61-80):** Likely phishing - avoid
- **⚫ Critical Risk (81-100):** Definite phishing - block immediately

**Red Flags to Watch:**
- URLs with typos (paypa1.com instead of paypal.com)
- Strange characters or encoded text in URL
- Very long URLs with random characters
- URLs asking you to "verify account" or "confirm password"

**Example:**
```
Safe URL: https://www.amazon.com           → Low Risk
Suspicious: https://www.amaz0n-verify.net → High Risk
```

---

### 3. Network Port Scanner

**What it does:** Scans a computer/website to find open ports (like doors to different services running on that computer).

**How to use it:**
1. Click "Network Port Scanner" from the left menu
2. Enter a website or IP address
3. Choose "Quick Scan" (tests common ports) or "Full Scan" (custom port range)
4. See which ports are open and what services are running

**What is a Port?**
Think of a computer like a building with numbered doors (ports). Each door leads to a different service:
- Port 80 = Web server (HTTP)
- Port 443 = Secure web (HTTPS)
- Port 22 = Remote access (SSH)
- Port 3306 = Database (MySQL)

**What it tells you:**
- Which ports are OPEN (service is running)
- What service is on that port (SSH, Apache, etc.)
- What version of the software is running
- Security risk of that port/service

**Example:**
```
Target: google.com
Port 80 (HTTP):   OPEN - Google Web Server
Port 443 (HTTPS): OPEN - Google Secure Web
```

**Quick Scan vs Full Scan:**
- **Quick Scan:** Tests 30 most common ports (fast, ~10 seconds)
- **Full Scan:** Tests any port range you specify (slower, but thorough)

---

### 4. Keylogger Detection System

**What it does:** Scans your computer's running programs to find suspicious ones that might be spying on your keyboard (keyloggers).

**How to use it:**
1. Click "Keylogger Detection" from the left menu
2. Click "Scan for Threats"
3. Wait for scan to complete
4. Review suspicious processes with risk scores

**What it looks for:**
- Program names with suspicious keywords (keylog, spy, stealth, etc.)
- Programs in temporary folders
- Programs with random, obfuscated names
- Programs using too much CPU/memory

**Risk Levels:**
- **Low (0-30):** Normal system processes
- **Medium (31-60):** Monitor these
- **High (61-80):** Investigate immediately
- **Critical (81+):** Likely malware - remove

**What NOT to worry about:**
- Windows system processes (svchost.exe, explorer.exe)
- Official software you installed (Chrome, Firefox, Office)

**If you find suspicious processes:**
1. Note the program name and path
2. Search it online to verify
3. Use your antivirus software to remove it
4. Restart your computer

---

## Installation & Setup

### For Users (Non-Technical)

If using this as a web app online, just visit the URL and start using it. No installation needed!

### For Developers / Self-Hosting

**Prerequisites:**
- Node.js 18 or higher ([Download](https://nodejs.org/))
- npm or pnpm
- Modern web browser

**Installation steps:**

```bash
# 1. Clone the repository
git clone <repository-url>
cd cybersec-toolkit

# 2. Install dependencies
npm install

# 3. Start the application
npm run dev

# 4. Open in browser
# Navigate to http://localhost:5000
```

**Production build:**
```bash
# Build for deployment
npm run build

# Start production server
npm start
```

---

## Setting Up AI Features (Optional)

The Phishing Detector works with basic heuristics out of the box, but can be enhanced with AI analysis using Google's Gemini API.

### Why AI?
AI analysis provides:
- More accurate threat detection
- Context-aware analysis
- Better understanding of sophisticated phishing attempts

### How to Enable (Step-by-Step)

#### Step 1: Get a Google API Key
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (name it "CyberSec Toolkit")
3. Search for "Generative Language API" and enable it
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key


#### Step 2: Restart and Test
1. Restart the application
2. Test the Phishing Detector
3. You should now see "AI Analysis Enabled" in the results

---

## Technology Stack (For Developers)

### Frontend
```
React 18 (Web framework)
├── Vite (Fast build tool)
├── Tailwind CSS (Styling)
├── Lucide React (Icons)
├── TanStack Query (Data fetching)
└── Zod (Data validation)
```

### Backend
```
Node.js + Express (Web server)
├── TypeScript (Type safety)
├── Helmet (Security headers)
├── Express Rate Limit (Prevent abuse)
└── Axios (HTTP requests)
```

### Security Integrations
- Google Gemini API (AI analysis)
- Google Safe Browsing API (Phishing lists)
- VirusTotal API (Malware detection)

---

## API Documentation (For Developers)

### Base URLs

**Development:** `http://localhost:5000/api/security`

**Production:** `https://your-domain.com/api/security`

### Endpoints

#### 1. Analyze Password
```http
POST /password-analysis

Request:
{
  "password": "MyP@ssw0rd123"
}

Response:
{
  "score": 72,
  "strength": "strong",
  "entropy": 48,
  "suggestions": ["Consider extending to 12+ characters"],
  "crackTime": "3 days"
}
```

#### 2. Analyze URL (Phishing Detection)
```http
POST /phishing-analysis

Request:
{
  "url": "https://www.paypal.com"
}

Response:
{
  "score": 15,
  "risk": "low",
  "indicators": {...},
  "aiAnalysis": {
    "enabled": true,
    "score": 12,
    "confidence": 85,
    "threatType": "legitimate"
  }
}
```

#### 3. Scan Ports
```http
POST /port-scan

Request:
{
  "target": "example.com",
  "portRange": "1-1000"
}

Response:
{
  "target": "example.com",
  "openPorts": [
    {
      "port": 80,
      "state": "open",
      "service": "HTTP",
      "banner": "Apache/2.4.41"
    }
  ]
}
```

#### 4. Quick Port Scan
```http
POST /port-scan-quick

Request:
{
  "target": "example.com"
}

Response:
{
  "target": "example.com",
  "openPorts": [...],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### 5. Keylogger Scan
```http
POST /keylogger-scan

Response:
{
  "processesScanned": 156,
  "suspiciousProcesses": [
    {
      "name": "suspicious.exe",
      "riskScore": 75,
      "reasons": ["Contains suspicious keyword: keylog"]
    }
  ],
  "riskLevel": "high"
}
```

---

## Features Summary

### Password Strength Analyzer ✓
- Real-time analysis
- Shows what makes password strong/weak
- Estimates how long it takes to crack
- Gives specific suggestions

### Phishing URL Detector ✓
- Checks for fake websites
- AI-powered analysis (with Google Gemini)
- Detects typosquatting (paypa1.com vs paypal.com)
- Checks if site uses HTTPS/SSL

### Network Port Scanner ✓
- Fast scanning with smart concurrency
- Identifies services on each port
- Shows software versions
- Quick and detailed scan modes

### Keylogger Detection System ✓
- Real-time process monitoring
- Detects suspicious programs
- Works on Windows, Mac, Linux
- Low false positive rate

---

## Security & Privacy

✓ **Your data stays private**
- No passwords are stored
- No URLs are logged
- No personal information collected
- Local processing where possible

✓ **Secure by default**
- All data is encrypted in transit
- HTTPS enforced
- Input validation on all requests
- Rate limiting to prevent abuse

---

## Common Questions (FAQ)

### Q: Is my password stored anywhere?
**A:** No! Passwords are analyzed in real-time but never stored, logged, or transmitted anywhere. Your password stays on your device.

### Q: Will this scan malware on my computer?
**A:** The Keylogger Detection tool looks for suspicious processes, but it's not a full antivirus. For complete security, use a dedicated antivirus software alongside this tool.

### Q: Can I scan any website with the Port Scanner?
**A:** Yes, but only scan websites/networks you own or have permission to test. Unauthorized scanning may be illegal.

### Q: Why is my password score low?
**A:** Common reasons:
- Too short (less than 8 characters)
- Missing numbers or symbols
- Using a common word ("password", "123456", etc.)
- Lacks variety in character types

### Q: What's the difference between HTTP and HTTPS?
**A:** HTTPS is secure (data is encrypted), HTTP is not. Always use HTTPS for sensitive sites. The phishing detector checks for this.

### Q: Do I need to enable AI features?
**A:** No! The tools work perfectly without AI. AI features just make phishing detection more accurate when enabled.

---

## Troubleshooting

### "Port Scanner says connection refused"
This usually means the port is closed or filtered by a firewall. That's actually good for security!

### "Phishing Detector says API error"
The AI features need a Google API key. Either:
1. Add your API key (see Setup section)
2. Or just use the basic detection (still works fine)

### "Website is running but won't load"
1. Try refreshing the browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check if the server is running (look for "listening on port 5000")
3. Try http://localhost:5000 in the address bar

### "Changes aren't showing up"
Try hard refresh: `Ctrl+Shift+Delete` then `Ctrl+Shift+R` (Chrome) or equivalent for your browser

---

## Use Cases

### I'm a Regular User
- Check password strength before using it
- Verify suspicious email links
- Monitor for malware on your computer

### I'm a Developer
- Test your server's open ports
- Validate passwords in security audits
- Integrate these tools into your security workflow

### I'm in IT/Security
- Security awareness training
- System security assessment
- Incident response support
- Network reconnaissance

### I'm a Student
- Learn cybersecurity concepts
- Understand how threat detection works
- Practice security testing techniques

---

## Browser Support

- **Chrome/Edge** (latest 2 versions) ✓
- **Firefox** (latest 2 versions) ✓
- **Safari** (latest 2 versions) ✓
- **Mobile browsers** (iOS Safari, Chrome Mobile) ✓

---

## Performance

- **Fast**: Vite for instant page loads
- **Responsive**: Works smoothly on any device
- **Efficient**: Smart caching for repeated requests
- **Secure**: Rate limiting prevents abuse

---

## License

MIT License - Free for educational and commercial use.

---

## Support

Found a bug or have a feature request?
- Open an issue on GitHub
- Check existing issues first
- Provide clear description of the problem

---

**CyberSec Toolkit** - Professional Security Analysis Made Simple and Accessible

Created for cybersecurity professionals, developers, and anyone concerned about their digital security.
