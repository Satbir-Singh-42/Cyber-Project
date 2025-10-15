# 🛡️ CyberSec Toolkit

> **A beginner-friendly cybersecurity analysis suite** - Your all-in-one security testing toolkit for password analysis, phishing detection, network scanning, and system monitoring.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)

---

## 🌟 What is CyberSec Toolkit?

**CyberSec Toolkit** is a web-based security analysis platform that helps you:
- 🔐 **Check password strength** - Find out if your passwords are secure
- 🎣 **Detect phishing URLs** - Identify fake or malicious websites
- 🌐 **Scan network ports** - Discover open ports on any system
- ⌨️ **Find keyloggers** - Detect suspicious processes on your computer
- 📁 **Monitor file changes** - Track unauthorized file modifications

Perfect for students, security enthusiasts, IT professionals, and anyone interested in cybersecurity!

---

## 📋 Table of Contents

- [Quick Start](#-quick-start-5-minutes)
- [Features Explained](#-features-explained)
- [Installation Guide](#-installation-guide)
- [How to Use Each Tool](#-how-to-use-each-tool)
- [Technology Stack](#-technology-stack)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-frequently-asked-questions)
- [Security & Ethics](#-security--ethics)
- [Contributing](#-contributing)
- [License](#-license)

---

## ⚡ Quick Start (5 Minutes)

Get up and running in just a few steps:

### Step 1: Prerequisites
Make sure you have these installed:
- **Node.js 18+** ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- A modern web browser (Chrome, Firefox, Edge, etc.)

### Step 2: Install

```bash
# 1. Clone or download this project
git clone <your-repo-url>
cd cybersec-toolkit

# 2. Install dependencies (this may take 1-2 minutes)
npm install

# 3. Start the application
npm run dev
```

### Step 3: Open in Browser
Open your browser and go to: **http://localhost:5000**

🎉 **That's it!** You should see the CyberSec Toolkit dashboard.

---

## 🔍 Features Explained

### 🔐 Password Strength Analyzer
**What it does:** Checks how strong your password is and tells you how long it would take hackers to crack it.

**Key Features:**
- **Strength Score (0-100):** Easy-to-understand rating
- **Crack Time Estimate:** "Instant", "Minutes", "Days", "Years", "Centuries"
- **Smart Suggestions:** Get tips to make your password stronger
- **Pattern Detection:** Finds weak patterns like "12345", "qwerty", etc.
- **Dictionary Check:** Detects common passwords that hackers know

**Example Results:**
- ❌ `password123` → Score: 20/100, Crack Time: Instant
- ✅ `MyD0g@Loves#Pizza!2024` → Score: 95/100, Crack Time: Centuries

---

### 🎣 Phishing URL Detector
**What it does:** Analyzes URLs to detect fake websites (phishing) that try to steal your information.

**Key Features:**
- **Google Safe Browsing:** Checks against Google's threat database (optional)
- **Typosquatting Detection:** Finds lookalike domains like `g00gle.com` instead of `google.com`
- **Risk Levels:** Low, Medium, High, Critical
- **Detailed Analysis:** Shows exactly what's suspicious about a URL
- **Subdomain Checking:** Recognizes legitimate subdomains like `accounts.google.com`

**Real Examples:**
- ✅ `https://www.youtube.com` → Safe (Score: 0)
- ✅ `https://accounts.google.com` → Safe (Score: 0)
- ⚠️ `http://paypal-secure-update.com` → High Risk (Score: 75)
- 🚨 `https://g00gle.com` → Critical (Score: 80)

**What to look for:**
- Typos in domain names (gooogle.com, microsft.com)
- Suspicious keywords (secure, verify, update, urgent)
- Missing HTTPS (http:// instead of https://)
- IP addresses instead of domain names

---

### 🌐 Port Scanner
**What it does:** Checks which network ports are open on a computer or server.

**Key Features:**
- **Service Detection:** Identifies what's running (HTTP, SSH, MySQL, etc.)
- **Banner Grabbing:** Gets version information from services
- **Custom Ranges:** Scan specific ports or ranges (e.g., "80,443" or "1-1000")
- **Risk Assessment:** Flags dangerous open ports
- **Quick Scan:** Pre-configured scan of 30+ common ports

**Common Ports:**
- Port 80 → HTTP (websites)
- Port 443 → HTTPS (secure websites)
- Port 22 → SSH (remote login)
- Port 3306 → MySQL (database)
- Port 3389 → RDP (remote desktop)

**Safety Note:** Only scan networks and systems you own or have permission to test!

---

### ⌨️ Keylogger Detector
**What it does:** Scans your computer for suspicious processes that might be recording your keystrokes.

**Key Features:**
- **Process Analysis:** Examines all running programs
- **Behavior Detection:** Identifies suspicious patterns
- **Risk Scoring:** Each process gets a risk score
- **Detailed Reasons:** Shows why a process is flagged
- **Termination Option:** Can stop suspicious processes

**What it looks for:**
- Processes with suspicious names (keylog, spy, stealth)
- Hidden or disguised processes
- Processes using lots of CPU/memory
- Random or obfuscated process names

**Risk Levels:**
- Low: Normal system activity
- Medium: Slightly unusual but likely safe
- High: Suspicious activity detected
- Critical: Highly likely malware

---

### 📁 File Integrity Monitor
**What it does:** Watches your files and alerts you when something changes.

**Key Features:**
- **Baseline Creation:** Takes a "snapshot" of your files
- **Change Detection:** Finds added, modified, or deleted files
- **SHA-256 Hashing:** Uses cryptographic verification
- **Risk Assessment:** Categorizes changes by security impact
- **Recursive Scanning:** Can scan entire folder structures

**Use Cases:**
- Monitor important system files
- Detect unauthorized changes to your code
- Track configuration file modifications
- Identify malware that creates new files

**How it works:**
1. **Initialize Baseline:** Create a snapshot of current files
2. **Check Integrity:** Compare current state to baseline
3. **Review Changes:** See what's different

---

## 📦 Installation Guide

### For Complete Beginners

#### Step 1: Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended for most users)
3. Run the installer and follow the prompts
4. Verify installation by opening terminal/command prompt and typing:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers for both.

#### Step 2: Download the Project
**Option A - Using Git (recommended):**
```bash
git clone <repository-url>
cd cybersec-toolkit
```

**Option B - Download ZIP:**
1. Download the ZIP file from the repository
2. Extract it to a folder
3. Open terminal/command prompt in that folder

#### Step 3: Install Dependencies
```bash
npm install
```
Wait 1-2 minutes while it downloads all required packages.

#### Step 4: Start the Application
```bash
npm run dev
```

You'll see output like:
```
[express] serving on port 5000
```

#### Step 5: Open in Browser
Go to: **http://localhost:5000**

---

### Optional: Google Safe Browsing API

To enable real-time phishing detection with Google's database:

1. Get a free API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the "Safe Browsing API"
3. Create a `.env` file in the project root:
   ```env
   GOOGLE_API_KEY=your_api_key_here
   ```
4. Restart the application

**Note:** The app works perfectly fine without this - it just won't have Google's additional verification.

---

## 🎯 How to Use Each Tool

### Password Analyzer

1. **Navigate:** Click "Password Analyzer" in the sidebar
2. **Enter Password:** Type or paste a password to test
3. **Analyze:** Click the "Analyze Password" button
4. **Review Results:** See:
   - Strength score (0-100)
   - Visual strength indicator (Weak/Fair/Good/Strong/Very Strong)
   - Crack time estimate
   - Detailed criteria (length, special chars, numbers, etc.)
   - Suggestions for improvement

**Pro Tips:**
- Never use personal information (birthdays, names)
- Aim for 12+ characters
- Mix uppercase, lowercase, numbers, and symbols
- Avoid common words and patterns
- Use a password manager for complex passwords

---

### Phishing Detector

1. **Navigate:** Click "Phishing Detector" in the sidebar
2. **Enter URL:** Paste the suspicious URL
3. **Analyze:** Click "Analyze URL"
4. **Review Results:** Check:
   - Overall risk level (Low/Medium/High/Critical)
   - Risk score (0-100)
   - Specific indicators (typosquatting, keywords, etc.)
   - Recommendations

**Example URLs to Test:**
```
✅ Safe: https://www.google.com
✅ Safe: https://github.com
⚠️ Suspicious: http://paypal-verify-account.com
🚨 Dangerous: https://g00gle.com
```

**What to Watch For:**
- Score above 60 = Don't trust the site
- "Typosquatting detected" = Fake website
- "Critical" risk = Absolutely avoid

---

### Port Scanner

1. **Navigate:** Click "Port Scanner" in the sidebar
2. **Enter Target:**
   - Domain: `scanme.nmap.org` (test site)
   - IP Address: `192.168.1.1`
3. **Choose Port Range:**
   - Common ports: Use "Quick Scan"
   - Specific ports: `80,443,8080`
   - Range: `1-1000`
4. **Scan:** Click "Scan Ports"
5. **Review Results:** See open ports and services

**Safety Guidelines:**
- ✅ Scan your own devices
- ✅ Use test sites like scanme.nmap.org
- ❌ Don't scan random websites
- ❌ Don't hammer servers with repeated scans

**Understanding Results:**
- **Open Port** = Service is running and accessible
- **Service Name** = What's running (HTTP, SSH, etc.)
- **[HIGH RISK]** = Potentially dangerous service

---

### Keylogger Detector

1. **Navigate:** Click "Keylogger Detector" in the sidebar
2. **Scan:** Click "Scan System"
3. **Wait:** Scanning may take 10-30 seconds
4. **Review Results:**
   - Number of processes scanned
   - Suspicious processes found
   - Overall risk level
   - Detailed reasons for each flagged process

**Understanding Risk Scores:**
- 0-30: Likely safe
- 31-60: Moderately suspicious
- 61-80: Highly suspicious
- 81-100: Very likely malicious

**What to Do:**
- **Low Risk:** No action needed
- **Medium Risk:** Investigate the process
- **High/Critical Risk:** Consider terminating or running antivirus

**Note:** Some legitimate programs may be flagged. Always research before terminating processes.

---

### File Integrity Monitor

#### First Time Setup:

1. **Navigate:** Click "File Integrity Monitor" in the sidebar
2. **Enter Directory:** Type the path to monitor
   - Windows: `C:\Users\YourName\Documents`
   - Mac/Linux: `/home/yourname/documents`
3. **Choose Recursive:** Check if you want to include subfolders
4. **Initialize:** Click "Initialize Baseline"

#### Checking for Changes:

1. **Same Directory:** Use the same path as initialization
2. **Check Integrity:** Click "Check Integrity"
3. **Review Results:**
   - Number of changes (added, modified, deleted)
   - Risk assessment
   - Detailed list of changed files

**Use Cases:**
```
Monitor important folders:
- Your project files: ./my-project
- System configs: /etc (Linux) or C:\Windows\System32 (Windows)
- Web server files: /var/www/html
```

**Understanding Results:**
- **Green** (Low): Normal activity
- **Yellow** (Medium): Moderate changes
- **Red** (High/Critical): Suspicious activity

---

## 🛠️ Technology Stack

### Frontend (What you see)
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Beautiful styling
- **Radix UI** - Accessible components
- **Vite** - Super-fast development

### Backend (Behind the scenes)
- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **TypeScript** - Type-safe server code
- **Zod** - Data validation

### Security Features
- Rate limiting (prevents abuse)
- Input sanitization (prevents attacks)
- Secure headers (HTTPS, CSP)
- Google Safe Browsing API (optional)

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Problem: "npm: command not found"
**Solution:** Node.js is not installed or not in PATH
```bash
# Check if Node.js is installed
node --version

# If not, download from https://nodejs.org/
```

#### Problem: "Port 5000 already in use"
**Solution:** Another app is using port 5000
```bash
# Option 1: Stop the other app
# Option 2: Change port in server/index.ts
# Or kill the process using the port (Advanced)
```

#### Problem: "Cannot connect to localhost:5000"
**Solution:** 
1. Make sure `npm run dev` is running
2. Check for errors in the terminal
3. Try restarting the application
4. Try a different browser

#### Problem: Port scanner shows no results
**Solution:**
- Check your internet connection
- Try scanning `scanme.nmap.org` (test site)
- Firewall might be blocking connections
- Some networks block port scanning

#### Problem: Keylogger detector shows many false positives
**Solution:** This is normal - many legitimate processes contain keywords like "monitor" or "capture". Always research processes before taking action.

#### Problem: File integrity monitor fails
**Solution:**
- Check that the directory path exists
- Ensure you have read permissions
- Don't use special characters in paths
- On Windows, use forward slashes: `C:/Users/Name` or escape backslashes: `C:\\Users\\Name`

---

## ❓ Frequently Asked Questions

### General Questions

**Q: Is this tool free to use?**
A: Yes! CyberSec Toolkit is completely free and open-source.

**Q: Do I need to be a developer to use this?**
A: No! While some technical knowledge helps, we've designed it to be beginner-friendly.

**Q: Does it work on Windows/Mac/Linux?**
A: Yes! It works on all platforms that support Node.js.

**Q: Is my data sent to any servers?**
A: No. All analysis happens locally on your computer. The only external connection is the optional Google Safe Browsing API for phishing detection.

### Security Questions

**Q: Is it legal to use these tools?**
A: Yes, but only on systems you own or have permission to test. Unauthorized scanning can be illegal.

**Q: Can this detect all phishing sites?**
A: No tool is 100% accurate. Use it as one layer of protection along with common sense.

**Q: Will the keylogger detector find all malware?**
A: No. It's a detection tool, not a full antivirus. Use it alongside proper security software.

**Q: Can I use this for my company's security?**
A: Yes, but for production environments, we recommend professional security tools.

### Technical Questions

**Q: Why do I need Google API key?**
A: It's optional. It adds real-time phishing detection from Google's database.

**Q: Can I use this offline?**
A: Mostly yes. Port scanning and phishing detection need internet, but other tools work offline.

**Q: How do I update to the latest version?**
A: Run `git pull` (if using Git) or download the latest release.

**Q: Can I add my own security tools?**
A: Yes! The code is open-source. Check the [Contributing](#-contributing) section.

---

## 🔒 Security & Ethics

### Responsible Use

**✅ DO:**
- Test your own systems and devices
- Use on networks you own
- Practice on authorized test sites (like scanme.nmap.org)
- Follow responsible disclosure for vulnerabilities
- Respect rate limits and be gentle with scans

**❌ DON'T:**
- Scan systems without permission
- Use for malicious purposes
- Hammer servers with rapid repeated scans
- Share results publicly without permission
- Test on production systems without authorization

### Legal Considerations

**Important:** Unauthorized access to computer systems is illegal in most countries. Always:
1. Get written permission before security testing
2. Understand your local cybersecurity laws
3. Follow your organization's security policies
4. Use these tools ethically and responsibly

**Remember:** Just because you *can* scan something doesn't mean you *should*.

### Data Privacy

- ✅ No user data collected or stored
- ✅ All analysis is local
- ✅ No telemetry or tracking
- ✅ Open-source code (verify yourself)
- ⚠️ Google API (if enabled) only sends URL hashes

---

## 💻 For Developers

### Project Structure
```
cybersec-toolkit/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   │   ├── layout/       # Header, sidebar, etc.
│   │   │   ├── security/     # Tool components
│   │   │   └── ui/           # Reusable components
│   │   ├── pages/            # Page routes
│   │   ├── lib/              # Utilities
│   │   └── hooks/            # React hooks
├── server/                   # Express backend
│   ├── services/             # Security services
│   │   ├── password-service.ts
│   │   ├── phishing-service.ts
│   │   ├── port-service.ts
│   │   ├── keylogger-service.ts
│   │   └── file-integrity-service.ts
│   ├── routes.ts             # API endpoints
│   └── index.ts              # Server entry
├── shared/                   # Shared code
│   └── schema.ts             # Validation schemas
└── package.json
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 5000)
npm run check           # TypeScript type checking

# Production
npm run build           # Build for production
npm start               # Start production server

# Database (if using)
npm run db:push         # Update database schema
```

### API Endpoints

All endpoints are prefixed with `/api/security/`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/password-analysis` | POST | Analyze password strength |
| `/phishing-analysis` | POST | Check URL for phishing |
| `/port-scan` | POST | Scan network ports |
| `/keylogger-scan` | POST | Scan for keyloggers |
| `/file-integrity-init` | POST | Initialize file baseline |
| `/file-integrity-check` | POST | Check for file changes |

### Adding New Security Tools

1. Create service in `server/services/your-tool-service.ts`
2. Add API route in `server/routes.ts`
3. Create UI component in `client/src/components/security/`
4. Add page in `client/src/pages/`
5. Register route in `client/src/App.tsx`

---

## 🤝 Contributing

We welcome contributions! Here's how to help:

### Reporting Bugs
1. Check existing issues first
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features
1. Open an issue with tag "enhancement"
2. Describe the feature and use case
3. Explain why it's valuable

### Code Contributions
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add feature: description"`
6. Push: `git push origin feature-name`
7. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow existing code patterns
- Add comments for complex logic
- Write meaningful commit messages

---

## 👥 About the Team

This project was built by passionate **B.Tech Information Technology students** (2022-26 batch) who wanted to make cybersecurity tools accessible to everyone.

**Our Mission:** Make security testing simple, educational, and accessible.

**Our Values:**
- Education over exploitation
- Security for everyone
- Open-source collaboration
- Ethical hacking practices

Visit the **"Developers"** page in the app to meet the team!

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

You're free to:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute copies
- ✅ Use privately

Conditions:
- Include the original license
- State changes made

---

## 🆘 Getting Help

**Need help?** Here's where to go:

1. **📖 Read this README** - Most questions are answered here
2. **🔍 Check Issues** - Someone may have had the same problem
3. **💬 Ask Questions** - Open a new issue with tag "question"
4. **🐛 Report Bugs** - Create an issue with details
5. **📧 Contact Team** - See the Developers page in the app

---

## 🎓 Learning Resources

Want to learn more about cybersecurity?

**Recommended Free Resources:**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Web security fundamentals
- [TryHackMe](https://tryhackme.com/) - Interactive security training
- [HackTheBox](https://www.hackthebox.com/) - Penetration testing practice
- [Cybrary](https://www.cybrary.it/) - Free cybersecurity courses
- [Google Safe Browsing](https://safebrowsing.google.com/) - Phishing detection

**Books for Beginners:**
- "The Web Application Hacker's Handbook"
- "Practical Malware Analysis"
- "Metasploit: The Penetration Tester's Guide"

---

## ⚠️ Disclaimer

**IMPORTANT - READ CAREFULLY:**

This toolkit is provided for **educational and authorized security testing purposes ONLY**.

- ✅ Learning about cybersecurity
- ✅ Testing your own systems
- ✅ Authorized penetration testing
- ❌ Unauthorized access or testing
- ❌ Malicious activities
- ❌ Breaking laws or regulations

**By using this tool, you agree to:**
1. Use it legally and ethically
2. Obtain proper authorization before testing
3. Take responsibility for your actions
4. Not hold developers liable for misuse

**The developers assume NO liability for:**
- Misuse of this software
- Damage caused by this software
- Legal consequences of unauthorized use
- Any other issues arising from use

**⚡ Always obtain explicit permission before conducting security assessments on systems you do not own.**

---

## 🚀 What's Next?

**Upcoming Features:**
- [ ] SSL/TLS certificate analysis
- [ ] Vulnerability scanning (CVE detection)
- [ ] Network traffic analysis
- [ ] Malware signature detection
- [ ] Security report generation (PDF)
- [ ] Multi-language support

**Vote for features** by creating an issue or starring your favorites!

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/your-repo?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-repo?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-repo)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-repo)

---

## 🙏 Acknowledgments

Special thanks to:
- Our professors and mentors
- The open-source community
- Security researchers worldwide
- Everyone who contributed to this project

Built with:
- ❤️ Passion for cybersecurity
- 🧠 Knowledge from our IT program
- 🔧 Modern web technologies
- 🌟 Support from our community

---

<div align="center">

**Built with ❤️ by IT Students for the Cybersecurity Community**

*Version 1.0.0 | Last Updated: October 2025*

**[⬆ Back to Top](#-cybersec-toolkit)**

---

**🌟 If this project helped you, please give it a star! 🌟**

</div>
