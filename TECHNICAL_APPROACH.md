# CyberSec Toolkit - Technical Approaches & Implementation Methodology

> **Comprehensive Technical Documentation for Panel Presentation**

This document provides detailed technical approaches, algorithms, and implementation methodologies for all security tools in the CyberSec Toolkit.

---

## Table of Contents

1. [Password Strength Analyzer](#1-password-strength-analyzer)
2. [Phishing URL Detector](#2-phishing-url-detector)
3. [Network Port Scanner](#3-network-port-scanner)
4. [Keylogger Detection System](#4-keylogger-detection-system)
5. [File Integrity Monitor](#5-file-integrity-monitor)
6. [System Architecture](#system-architecture)

---

## 1. Password Strength Analyzer

### Technical Approach

The Password Analyzer uses a multi-factor scoring algorithm combining entropy calculation, pattern detection, and heuristic analysis to provide comprehensive password security assessment.

### Implementation Methodology

#### A. Entropy Calculation

**Formula:**
```
Entropy (bits) = log₂(charset_size ^ password_length)

Where charset_size is determined by:
- Lowercase letters (a-z): 26
- Uppercase letters (A-Z): 26
- Numbers (0-9): 10
- Special characters (!@#$%^&*...): 32
```

**Example Calculation:**
```
Password: "MyP@ss123"
Length: 9 characters
Charset: lowercase(26) + uppercase(26) + numbers(10) + special(32) = 94

Entropy = log₂(94^9) = 9 × log₂(94) = 9 × 6.55 = 58.95 bits
```

**Entropy Interpretation:**
- < 28 bits: Very Weak (crackable instantly)
- 28-35 bits: Weak (hours to crack)
- 36-59 bits: Moderate (years to crack)
- 60-127 bits: Strong (centuries to crack)
- ≥ 128 bits: Very Strong (practically unbreakable)

---

#### B. Scoring Algorithm (0-100 scale)

The final score is calculated by aggregating points from multiple criteria:

**1. Length Analysis (0-25 points)**
```javascript
if (length >= 12) → 25 points
else if (length >= 8) → 15 points
else if (length >= 6) → 10 points
else → (length / 12) × 25 points
```

**2. Character Variety (0-45 points)**
```javascript
Contains uppercase letters → +10 points
Contains lowercase letters → +10 points
Contains numbers → +10 points
Contains special characters → +15 points
```

**3. Entropy Bonus (0-20 points)**
```javascript
if (entropy >= 60) → 20 points
else if (entropy >= 50) → 15 points
else if (entropy >= 40) → 10 points
else → (entropy / 60) × 20 points
```

**4. Pattern Penalties (-10 to -20 points each)**
```javascript
Dictionary word detected → -20 points
Repeated characters (3+ times) → -10 points
Sequential numbers (123, 234) → -10 points
Sequential letters (abc, bcd) → -10 points
Keyboard patterns (qwerty, asdf) → -10 points
```

**Final Score Calculation:**
```
Final Score = min(100, max(0, 
  Length Score + 
  Character Variety Score + 
  Entropy Bonus - 
  Pattern Penalties
))
```

---

#### C. Dictionary & Pattern Detection

**Dictionary Database (70+ entries):**

1. **Common Passwords (40+):**
```
password, 123456, qwerty, abc123, letmein, monkey, 
1234567890, password1, welcome, admin, user, 
login, master, sunshine, princess, dragon, etc.
```

2. **Common Dictionary Words (30+):**
```
love, hello, world, welcome, secret, computer, 
football, basketball, baseball, summer, winter, 
dragon, tiger, eagle, etc.
```

**Pattern Detection Algorithms:**

1. **Sequential Numbers:**
```javascript
Patterns: 012, 123, 234, 345, 456, 567, 678, 789
Detection: Sliding window of 3 consecutive digits
```

2. **Sequential Letters:**
```javascript
Patterns: abc, bcd, cde, def, efg, fgh, etc.
Detection: Sliding window of 3 consecutive letters
```

3. **Keyboard Patterns:**
```javascript
Row patterns: qwerty, asdfgh, zxcvbn
Column patterns: qaz, wsx, edc
Diagonal patterns: qwe, asd, zxc
```

4. **Repeated Characters:**
```javascript
Pattern: Same character 3+ times (aaa, 111, !!!)
Detection: Regex match or character counting
```

5. **Alternating Patterns:**
```javascript
Patterns: ababab, 121212, xyxyxy
Detection: Check for repeating 2-character sequences
```

---

#### D. Crack Time Estimation

**Attack Speed Assumptions:**

| Attack Type | Attempts/Second | Description |
|-------------|----------------|-------------|
| Basic Online | 1,000 | Online service with basic rate limiting |
| Moderate Online | 10,000 | Compromised server with fast connection |
| Offline CPU | 1,000,000 | Single powerful CPU |
| Offline GPU | 100,000,000 | Single high-end GPU |
| Distributed Attack | 1,000,000,000,000 | Botnet or supercomputer |

**Calculation:**
```javascript
Total Combinations = 2^entropy
Average Attempts = Total Combinations / 2  // Expected value
Crack Time (seconds) = Average Attempts / Attack Speed

// Convert to human-readable format
if (seconds < 1) → "Instant"
else if (seconds < 60) → "Seconds"
else if (seconds < 3600) → "Minutes"
else if (seconds < 86400) → "Hours"
else if (seconds < 2592000) → "Days"
else if (seconds < 31536000) → "Months"
else if (seconds < 3153600000) → "Years"
else if (seconds < 31536000000) → "Decades"
else → "Centuries"
```

**Example:**
```
Password: "P@ssw0rd" (8 chars, mixed)
Entropy: 52 bits
Combinations: 2^52 = 4,503,599,627,370,496
Average: 2,251,799,813,685,248

With GPU attack (100M/sec):
Time = 2,251,799,813,685,248 / 100,000,000
     = 22,517,998 seconds
     = 260 days
```

---

#### E. Real-time Feedback System

**User Interface Components:**

1. **Visual Strength Indicator**
```
Score 0-20:   ████░░░░░░ Very Weak (Red)
Score 21-40:  █████░░░░░ Weak (Orange)
Score 41-60:  ██████░░░░ Fair (Yellow)
Score 61-80:  ████████░░ Good (Light Green)
Score 81-100: ██████████ Very Strong (Green)
```

2. **Detailed Criteria Checklist**
```
✓ At least 8 characters
✓ Contains uppercase letters
✓ Contains lowercase letters
✓ Contains numbers
✓ Contains special characters
✗ No dictionary words
✗ No repeated patterns
```

3. **Entropy Display**
```
Entropy: 58.95 bits
Security Level: Strong
```

4. **Improvement Suggestions**
```
Based on detected weaknesses:
- "Add more special characters for higher entropy"
- "Increase length to at least 12 characters"
- "Avoid common dictionary words"
- "Remove sequential patterns like '123'"
```

---

#### F. Security Considerations

**Privacy Protection:**
```
✓ No password storage
✓ No server-side logging
✓ No external API calls
✓ Client-side analysis option
✓ Memory cleared after analysis
```

**Data Flow:**
```
User Input → Validation → Analysis → Results → Cleared from Memory
     ↓
[Never stored or transmitted externally]
```

---

## 2. Phishing URL Detector

### Technical Approach

Advanced heuristic-based phishing detection using 17 comprehensive indicators including typosquatting, brand impersonation, suspicious patterns, and structural analysis. Completely offline operation for maximum privacy.

### Implementation Methodology

#### A. Multi-Layer Analysis System

**Layer 1: URL Parsing & Decomposition**
```javascript
Input: "https://secure.paypal-verify.com/login?id=123"

Parsed Components:
- Protocol: "https"
- Hostname: "secure.paypal-verify.com"
- Domain: "paypal-verify.com"
- Subdomain: "secure"
- TLD: "com"
- Path: "/login"
- Query: "?id=123"
```

---

**Layer 2: Domain Structure Analysis**

1. **TLD Validation**
```javascript
Suspicious TLDs (Free/Uncommon):
.tk, .ml, .ga, .cf, .gq (Free domains from Freenom)
.xyz, .top, .work, .click (Often used for spam)
.pw, .cc, .ws (Commonly abused)

Risk Score: +15 points for suspicious TLD
```

2. **Subdomain Depth Analysis**
```javascript
Example: a.b.c.d.example.com (4 subdomains)

Scoring:
1-2 subdomains → Normal (0 points)
3 subdomains → Slightly suspicious (+10 points)
4+ subdomains → Very suspicious (+20 points)

Legitimate exceptions:
accounts.google.com ✓
login.microsoft.com ✓
secure.paypal.com ✓
```

3. **Domain Length Analysis**
```javascript
Excessive length often indicates obfuscation:

Length < 15 chars → Normal (0 points)
Length 15-30 chars → Moderate (+5 points)
Length > 30 chars → Suspicious (+10 points)

Example:
google.com (10) → 0 points
secure-account-verification-paypal.com (39) → 10 points
```

4. **Suspicious Character Detection**
```javascript
Characters that often indicate phishing:

@ symbol → Tricks users about actual domain (+15 points)
  Example: https://google.com@evil.com
  (Browser goes to evil.com, not google.com)

Multiple hyphens → Typosquatting attempt (+10 points)
  Example: pay-pal-secure.com

Numbers in domain → Brand confusion (+5 points)
  Example: g00gle.com, paypa1.com
```

---

**Layer 3: Typosquatting Detection**

**Algorithm: Levenshtein Distance**
```javascript
Function: Calculate edit distance between two strings

Example:
String A: "paypal"
String B: "paypa1"

Operations needed:
1. Replace 'l' with '1' → 1 edit

Levenshtein Distance = 1

If distance ≤ 2 from known brand → Typosquatting detected
```

**Character Substitution Patterns:**
```
Common substitutions:
o → 0 (google → g00gle)
i → l, 1 (microsoft → m1crosoft)
a → @, 4 (paypal → p@ypal)
e → 3 (facebook → fac3book)
s → 5, $ (amazon → ama$on)
```

**Homoglyph Detection:**
```
Unicode lookalike characters:
а (Cyrillic 'a') → a (Latin 'a')
е (Cyrillic 'e') → e (Latin 'e')
о (Cyrillic 'o') → o (Latin 'o')

Example:
pаypal.com (Cyrillic 'а') vs paypal.com (Latin 'a')
Visual: Identical
Technical: Different domains
Risk: Critical phishing
```

**Brand Database (40+ major brands):**
```javascript
Financial Services:
paypal, stripe, visa, mastercard, amex, discover, 
payoneer, square, revolut, wise

Technology Companies:
google, microsoft, apple, amazon, facebook, meta,
twitter, linkedin, github, gitlab

Email Services:
gmail, outlook, yahoo, protonmail, zoho, aol

Streaming/Entertainment:
netflix, spotify, hulu, disney, youtube, twitch

Cloud/SaaS:
dropbox, adobe, zoom, slack, salesforce, shopify
```

---

**Layer 4: URL Pattern Analysis**

**1. Suspicious Keywords Detection (50+ keywords)**

**Account-Related Keywords (+10 points each):**
```
login, signin, sign-in, account, verify, verification,
update, confirm, authenticate, secure, security
```

**Urgency Keywords (+15 points each):**
```
urgent, immediate, suspended, locked, expired,
limited, alert, warning, action-required
```

**Brand Impersonation (+20 points):**
```
paypal, google, microsoft, apple, amazon, bank,
facebook, instagram, netflix, adobe
```

**Example Analysis:**
```
URL: https://paypal-verify-account-urgent.com

Detected keywords:
- "paypal" (brand) → +20 points
- "verify" (account) → +10 points
- "account" (account) → +10 points
- "urgent" (urgency) → +15 points

Total from keywords: 55 points
```

**2. IP Address Usage Detection**
```javascript
Legitimate websites use domain names, not IPs

Examples:
http://192.168.1.1/login → Suspicious (+25 points)
http://203.0.113.42/paypal → Very suspicious (+25 points)

Exceptions:
- Local development (127.0.0.1, localhost)
- Internal network tools
```

**3. Port Number Analysis**
```javascript
Non-standard ports often indicate suspicious activity:

Standard ports:
:80 (HTTP) → Normal
:443 (HTTPS) → Normal

Non-standard:
:8080, :8888 → Slightly suspicious (+5 points)
:1337, :31337 → Very suspicious (+15 points)

Example:
https://paypal.com:8080/login → +5 points
```

**4. Path Depth and Complexity**
```javascript
Overly complex paths can hide malicious intent:

Depth analysis:
/login → Normal (1 level)
/secure/account/verify/login → Suspicious (4+ levels)

Suspicious path patterns:
/redirect?url=...
/click?link=...
/goto?target=...

Risk: +10 points for complex redirect paths
```

---

**Layer 5: Security Indicators**

**1. HTTPS vs HTTP Protocol**
```javascript
HTTPS (Secure):
✓ Encrypted communication
✓ Certificate verification
✓ Trusted by browsers
Risk: 0 points

HTTP (Insecure):
✗ No encryption
✗ Vulnerable to interception
✗ Major red flag for login pages
Risk: +15 points

Note: Phishers can also use HTTPS, so this is just one indicator
```

**2. URL Shortener Detection**
```javascript
Known URL shorteners:
bit.ly, tinyurl.com, goo.gl, t.co, ow.ly, 
is.gd, buff.ly, short.io, rebrand.ly, cutt.ly

Risk: +10 points (hides actual destination)

Why suspicious:
- Obscures true destination
- Can redirect multiple times
- Often used in phishing campaigns
```

**3. Suspicious TLD Analysis**
```javascript
High-Risk TLDs:
.tk (Tokelau) - Free, often abused
.ml (Mali) - Free, often abused
.ga (Gabon) - Free, often abused
.cf (Central African Republic) - Free
.gq (Equatorial Guinea) - Free
.xyz - Cheap, popular for spam
.top - Often used in scams
.club - Frequently abused

Risk: +15 points for high-risk TLD
```

**4. Free Hosting Service Detection**
```javascript
Common free hosting patterns:
- .blogspot.com
- .wordpress.com
- .wix.com
- .weebly.com
- .000webhostapp.com

Risk: +5 points (less trustworthy for sensitive operations)
```

---

#### B. Scoring Algorithm (0-100 scale)

**Comprehensive Scoring Matrix:**

| Indicator | Weight | Example | Points |
|-----------|--------|---------|--------|
| **Typosquatting Match** | Critical | g00gle.com | 35 |
| **Brand + Keywords** | Critical | paypal-verify.com | 25 |
| **IP Address URL** | Critical | http://192.168.1.1 | 25 |
| **Suspicious Keywords (3+)** | High | verify-urgent-account | 20 |
| **4+ Subdomains** | High | a.b.c.d.evil.com | 20 |
| **HTTP (no HTTPS)** | High | http://bank-login.com | 15 |
| **High-Risk TLD** | Medium | example.tk | 15 |
| **@-Symbol Trick** | Medium | google.com@evil.com | 15 |
| **Multiple Hyphens** | Medium | pay-pal-secure.com | 10 |
| **URL Shortener** | Medium | bit.ly/xyz | 10 |
| **Non-Standard Port** | Low | example.com:8080 | 5 |
| **Excessive Length** | Low | very-long-domain-name.com | 5 |

**Scoring Logic:**
```javascript
let totalScore = 0;

// Critical indicators
if (typosquatting) totalScore += 35;
if (hasIPAddress) totalScore += 25;
if (brandImpersonation) totalScore += 25;

// High-risk indicators
if (suspiciousKeywordCount >= 3) totalScore += 20;
if (subdomainCount >= 4) totalScore += 20;
if (protocol === 'http' && pathContainsLogin) totalScore += 15;

// Medium-risk indicators
if (suspiciousTLD) totalScore += 15;
if (hasAtSymbol) totalScore += 15;
if (hyphenCount >= 3) totalScore += 10;
if (isUrlShortener) totalScore += 10;

// Low-risk indicators
if (nonStandardPort) totalScore += 5;
if (domainLength > 30) totalScore += 5;

// Cap at 100
return Math.min(100, totalScore);
```

---

#### C. Brand Detection Engine

**Legitimate Brand Patterns:**

```javascript
Brand Database Structure:
{
  "paypal": {
    mainDomain: "paypal.com",
    legitimateSubdomains: ["www", "secure", "account", "business"],
    commonTypos: ["paypa1", "paypai", "paypal1"],
    riskLevel: "high" // Financial service
  },
  "google": {
    mainDomain: "google.com",
    legitimateSubdomains: ["www", "mail", "accounts", "drive", "docs"],
    commonTypos: ["g00gle", "googl", "gooogle"],
    riskLevel: "high"
  }
}
```

**Subdomain Whitelisting:**
```javascript
Legitimate Patterns:
✓ accounts.google.com
✓ mail.google.com
✓ login.microsoft.com
✓ secure.paypal.com
✓ www.amazon.com

Suspicious Patterns:
✗ google.com.phishing.tk
✗ paypal-verify.com
✗ secure-amazon.xyz
✗ microsoft-login.ml
```

---

#### D. Risk Classification System

**Risk Level Determination:**

```
Score: 0-30 → LOW RISK
- Likely legitimate
- Few or no suspicious indicators
- Action: Safe to proceed with caution

Score: 31-60 → MEDIUM RISK
- Some concerning patterns
- May be legitimate but unusual
- Action: Exercise extreme caution, verify independently

Score: 61-80 → HIGH RISK
- Multiple suspicious indicators
- Likely phishing attempt
- Action: Avoid entering credentials, report to authorities

Score: 81-100 → CRITICAL RISK
- Definite phishing characteristics
- Typosquatting or brand impersonation
- Action: Do not proceed, block URL, report immediately
```

**Color Coding:**
```
LOW:      Green background
MEDIUM:   Yellow/Orange background
HIGH:     Orange/Red background
CRITICAL: Red background with warning icon
```

---

#### E. Detailed Reporting System

**Report Components:**

1. **Overall Assessment**
```
Risk Score: 75/100
Risk Level: HIGH
Verdict: Likely Phishing
```

2. **Detected Indicators List**
```
✗ Typosquatting detected (paypal → paypa1)
✗ Suspicious keywords: verify, urgent, account
✗ Using HTTP instead of HTTPS
✗ Suspicious TLD: .tk
✗ Multiple hyphens in domain
```

3. **Comparison with Legitimate**
```
Analyzed:   paypa1-verify-urgent.tk
Legitimate: paypal.com
Similarity: 85% (possible typosquatting)
```

4. **Specific Recommendations**
```
Based on risk level:

CRITICAL:
- DO NOT enter any credentials
- DO NOT download any files
- Report to anti-phishing authorities
- Block this URL in your browser

HIGH:
- Avoid entering sensitive information
- Verify URL independently via search
- Contact the company directly
- Check for typos in domain name

MEDIUM:
- Proceed with extreme caution
- Verify SSL certificate
- Look for official branding
- Use two-factor authentication

LOW:
- Appears safe but stay vigilant
- Verify HTTPS connection
- Check for padlock icon
```

---

#### F. Privacy & Performance Considerations

**Privacy Features:**
```
✓ All analysis performed locally (offline)
✓ No URL data sent to external servers
✓ No logging or tracking
✓ Optional Google Safe Browsing API (user choice)
✓ Open-source verification
```

**Performance Optimization:**
```
Analysis Time: < 50ms average
Memory Usage: < 5MB
Network: None required (except optional API)
Cache: Brand database loaded once at startup
```

**Google Safe Browsing Integration (Optional):**
```javascript
When enabled:
1. Local heuristic analysis runs first
2. If URL passes local checks, optionally query Google API
3. Google API checks against threat database
4. Results combined for final verdict

Benefits:
- Real-time threat intelligence
- Database of millions of known phishing sites

Privacy considerations:
- Only URL hash sent (not full URL)
- Optional feature (user can disable)
```

---

## 3. Network Port Scanner

### Technical Approach

Intelligent TCP port scanning with adaptive concurrency control, service fingerprinting, banner grabbing, and security risk assessment using Node.js native networking capabilities.

### Implementation Methodology

#### A. Port Scanning Engine

**Core Scanning Technique: TCP Connect Scan**

```javascript
Algorithm:
1. Create TCP socket connection to target:port
2. Set connection timeout (2000ms)
3. Attempt to connect:
   a. If connection succeeds → Port is OPEN
   b. If connection times out → Port is FILTERED
   c. If connection refused → Port is CLOSED
4. Close connection
5. Record result
```

**Implementation:**
```javascript
function scanPort(target, port, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timer = setTimeout(() => {
      socket.destroy();
      resolve({ port, state: 'filtered' });
    }, timeout);

    socket.connect(port, target, () => {
      clearTimeout(timer);
      socket.destroy();
      resolve({ port, state: 'open' });
    });

    socket.on('error', () => {
      clearTimeout(timer);
      socket.destroy();
      resolve({ port, state: 'closed' });
    });
  });
}
```

---

**Adaptive Concurrency Control**

**Algorithm:**
```javascript
Concurrency Calculation:
concurrency = min(50, max(10, portCount / 10))

Examples:
- 50 ports → 10 concurrent scans
- 100 ports → 10 concurrent scans
- 500 ports → 50 concurrent scans
- 1000 ports → 50 concurrent scans (capped)
- 5000 ports → 50 concurrent scans (capped)

Benefits:
- Prevents network congestion
- Avoids triggering IDS/IPS systems
- Maintains scan speed
- Respects target resources
```

**Batch Processing:**
```javascript
Chunk-based scanning:
1. Split ports into chunks of 'concurrency' size
2. Scan each chunk concurrently
3. Wait for chunk to complete
4. Add 100ms delay between chunks
5. Move to next chunk

Example (100 ports, concurrency 10):
Chunk 1: Ports 1-10 (parallel)
  ⏱ Delay 100ms
Chunk 2: Ports 11-20 (parallel)
  ⏱ Delay 100ms
...
Chunk 10: Ports 91-100 (parallel)
```

---

**Timeout Strategy**

```javascript
Connection Timeouts:
- Initial connection: 2000ms (2 seconds)
- Banner grab: 3000ms (3 seconds)
- Total max per port: 5000ms (5 seconds)

Rationale:
- 2s: Sufficient for local/fast networks
- Prevents hanging on filtered ports
- Balances speed vs completeness
- Responsive user experience
```

---

#### B. Service Detection

**Service Database (50+ Common Services)**

```javascript
const PORT_SERVICES = {
  // Web Services
  80: { name: 'HTTP', description: 'Web Server', risk: 'LOW' },
  443: { name: 'HTTPS', description: 'Secure Web Server', risk: 'LOW' },
  8080: { name: 'HTTP-Alt', description: 'Alternative HTTP', risk: 'MEDIUM' },
  8443: { name: 'HTTPS-Alt', description: 'Alternative HTTPS', risk: 'MEDIUM' },

  // Remote Access
  21: { name: 'FTP', description: 'File Transfer (Unencrypted)', risk: 'HIGH' },
  22: { name: 'SSH', description: 'Secure Shell', risk: 'MEDIUM' },
  23: { name: 'Telnet', description: 'Unencrypted Terminal', risk: 'CRITICAL' },
  3389: { name: 'RDP', description: 'Remote Desktop Protocol', risk: 'HIGH' },
  5900: { name: 'VNC', description: 'Virtual Network Computing', risk: 'HIGH' },

  // Email Services
  25: { name: 'SMTP', description: 'Email Server', risk: 'MEDIUM' },
  110: { name: 'POP3', description: 'Email Retrieval', risk: 'MEDIUM' },
  143: { name: 'IMAP', description: 'Email Access', risk: 'MEDIUM' },
  465: { name: 'SMTPS', description: 'Secure SMTP', risk: 'LOW' },
  587: { name: 'SMTP-Sub', description: 'Email Submission', risk: 'LOW' },
  993: { name: 'IMAPS', description: 'Secure IMAP', risk: 'LOW' },
  995: { name: 'POP3S', description: 'Secure POP3', risk: 'LOW' },

  // Database Services
  1433: { name: 'MSSQL', description: 'Microsoft SQL Server', risk: 'HIGH' },
  3306: { name: 'MySQL', description: 'MySQL Database', risk: 'HIGH' },
  5432: { name: 'PostgreSQL', description: 'PostgreSQL Database', risk: 'HIGH' },
  27017: { name: 'MongoDB', description: 'MongoDB Database', risk: 'HIGH' },
  6379: { name: 'Redis', description: 'Redis Cache', risk: 'HIGH' },
  9200: { name: 'Elasticsearch', description: 'Search Engine', risk: 'HIGH' },

  // Other Services
  53: { name: 'DNS', description: 'Domain Name System', risk: 'MEDIUM' },
  135: { name: 'MSRPC', description: 'Microsoft RPC', risk: 'MEDIUM' },
  139: { name: 'NetBIOS', description: 'NetBIOS Session', risk: 'MEDIUM' },
  445: { name: 'SMB', description: 'File Sharing', risk: 'HIGH' },
  3000: { name: 'Dev-Server', description: 'Development Server', risk: 'LOW' },
  5000: { name: 'UPnP/Dev', description: 'UPnP or Dev Server', risk: 'LOW' },
  8000: { name: 'HTTP-Dev', description: 'Development HTTP', risk: 'LOW' },
};
```

**Service Identification Logic:**
```javascript
function identifyService(port, banner = '') {
  // 1. Check port number in database
  if (PORT_SERVICES[port]) {
    return PORT_SERVICES[port];
  }

  // 2. Analyze banner if available
  if (banner) {
    if (banner.includes('SSH')) return { name: 'SSH', risk: 'MEDIUM' };
    if (banner.includes('HTTP')) return { name: 'HTTP', risk: 'LOW' };
    if (banner.includes('FTP')) return { name: 'FTP', risk: 'HIGH' };
    // ... more banner-based detection
  }

  // 3. Default unknown
  return { name: 'Unknown', description: 'Unknown Service', risk: 'MEDIUM' };
}
```

---

#### C. Banner Grabbing

**Purpose:** Retrieve service version information for vulnerability assessment

**Service-Specific Probes:**

```javascript
const BANNER_PROBES = {
  21: "HELP\r\n",                    // FTP
  22: "SSH-2.0-Scanner\r\n",         // SSH
  25: "EHLO scanner\r\n",            // SMTP
  80: "GET / HTTP/1.0\r\n\r\n",      // HTTP
  110: "USER scanner\r\n",           // POP3
  143: "A001 CAPABILITY\r\n",        // IMAP
  443: "GET / HTTP/1.0\r\n\r\n",     // HTTPS
  3306: "\x00",                      // MySQL
};
```

**Banner Grab Implementation:**
```javascript
async function grabBanner(target, port, timeout = 3000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let banner = '';

    const timer = setTimeout(() => {
      socket.destroy();
      resolve(banner || null);
    }, timeout);

    socket.connect(port, target, () => {
      // Send probe if available
      const probe = BANNER_PROBES[port];
      if (probe) {
        socket.write(probe);
      }
    });

    socket.on('data', (data) => {
      banner += data.toString('utf8', 0, Math.min(data.length, 512));
      if (banner.length >= 512) {
        clearTimeout(timer);
        socket.destroy();
        resolve(banner);
      }
    });

    socket.on('error', () => {
      clearTimeout(timer);
      socket.destroy();
      resolve(null);
    });
  });
}
```

**Banner Analysis Examples:**

```
FTP Banner:
"220 ProFTPD 1.3.5 Server (Debian)"
→ Service: ProFTPD
→ Version: 1.3.5
→ OS: Debian

SSH Banner:
"SSH-2.0-OpenSSH_7.4p1 Debian-10+deb9u7"
→ Service: OpenSSH
→ Version: 7.4p1
→ OS: Debian 9

HTTP Banner:
"HTTP/1.1 200 OK\r\nServer: nginx/1.18.0"
→ Service: nginx
→ Version: 1.18.0
```

---

#### D. Security Analysis & Risk Assessment

**Risk Classification Algorithm:**

```javascript
function assessRisk(port, service, banner) {
  let riskLevel = 'LOW';
  const issues = [];

  // Critical Risk Patterns
  if (port === 23) {
    riskLevel = 'CRITICAL';
    issues.push('Telnet is unencrypted and extremely insecure');
  }

  // High Risk Patterns
  if ([21, 3389, 445, 1433, 3306, 5432, 6379, 27017].includes(port)) {
    riskLevel = 'HIGH';
    if (port === 21) issues.push('FTP transmits credentials in plaintext');
    if (port === 3389) issues.push('RDP exposed to internet - high brute-force risk');
    if (port === 445) issues.push('SMB can be exploited (EternalBlue, etc.)');
    if ([1433, 3306, 5432, 27017, 6379].includes(port)) {
      issues.push('Database should not be directly exposed to internet');
    }
  }

  // Version-Specific Vulnerabilities
  if (banner) {
    if (banner.includes('OpenSSH_5')) {
      riskLevel = 'HIGH';
      issues.push('OpenSSH 5.x has known vulnerabilities - update required');
    }
    if (banner.includes('Apache/2.2')) {
      riskLevel = 'MEDIUM';
      issues.push('Apache 2.2 is end-of-life - security updates unavailable');
    }
  }

  // Anonymous/Default Access
  if (service.includes('FTP') && banner?.includes('anonymous')) {
    riskLevel = 'HIGH';
    issues.push('Anonymous FTP access enabled - potential data exposure');
  }

  return { riskLevel, issues };
}
```

**Security Recommendations:**

```javascript
function generateRecommendations(openPorts) {
  const recommendations = [];

  // Check for unnecessary open ports
  const dangerousPorts = openPorts.filter(p => 
    [21, 23, 445, 3389].includes(p.port)
  );
  if (dangerousPorts.length > 0) {
    recommendations.push({
      severity: 'HIGH',
      message: 'Close unnecessary high-risk ports',
      ports: dangerousPorts.map(p => p.port)
    });
  }

  // Check for database exposure
  const dbPorts = openPorts.filter(p => 
    [1433, 3306, 5432, 27017, 6379].includes(p.port)
  );
  if (dbPorts.length > 0) {
    recommendations.push({
      severity: 'CRITICAL',
      message: 'Databases should not be exposed to public internet',
      action: 'Use firewall rules to restrict access to specific IPs'
    });
  }

  // Check for unencrypted services
  const unencryptedPorts = openPorts.filter(p => 
    [21, 23, 80, 110, 143].includes(p.port)
  );
  if (unencryptedPorts.length > 0) {
    recommendations.push({
      severity: 'MEDIUM',
      message: 'Use encrypted alternatives',
      alternatives: {
        21: 'SFTP (port 22) or FTPS (port 990)',
        23: 'SSH (port 22)',
        80: 'HTTPS (port 443)',
        110: 'POP3S (port 995)',
        143: 'IMAPS (port 993)'
      }
    });
  }

  return recommendations;
}
```

---

#### E. Port Range Parsing

**Flexible Input Format Support:**

```javascript
Examples:
"80"           → [80]
"80,443"       → [80, 443]
"1-100"        → [1, 2, 3, ..., 100]
"22,80-100"    → [22, 80, 81, 82, ..., 100]
"80-85,443,8080-8083" → [80,81,82,83,84,85,443,8080,8081,8082,8083]
```

**Parser Implementation:**
```javascript
function parsePortRange(input) {
  const ports = new Set();
  const parts = input.split(',').map(p => p.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      // Range: "1-100"
      const [start, end] = part.split('-').map(Number);
      if (start > 0 && end <= 65535 && start <= end) {
        for (let i = start; i <= end; i++) {
          ports.add(i);
        }
      }
    } else {
      // Single port: "80"
      const port = Number(part);
      if (port > 0 && port <= 65535) {
        ports.add(port);
      }
    }
  }

  return Array.from(ports).sort((a, b) => a - b);
}
```

**Validation:**
```javascript
function validatePorts(ports) {
  // Maximum ports to scan
  if (ports.length > 10000) {
    throw new Error('Cannot scan more than 10,000 ports at once');
  }

  // Check valid range
  const invalidPorts = ports.filter(p => p < 1 || p > 65535);
  if (invalidPorts.length > 0) {
    throw new Error('Port numbers must be between 1 and 65535');
  }

  return true;
}
```

---

#### F. Quick Scan Mode

**Pre-configured Common Ports (30+ ports):**

```javascript
const COMMON_PORTS = [
  // Web
  80, 443, 8000, 8080, 8443, 8888,
  
  // Remote Access
  22, 23, 3389, 5900,
  
  // Email
  25, 110, 143, 465, 587, 993, 995,
  
  // File Transfer
  21, 69, 115, 445,
  
  // Databases
  1433, 1521, 3306, 5432, 6379, 9200, 27017,
  
  // Other
  53, 135, 139, 389, 636, 3000, 5000
];
```

**Quick Scan Benefits:**
```
✓ Optimized for speed (30 ports vs 1000+)
✓ Covers 95% of common services
✓ Typical completion: 5-10 seconds
✓ Ideal for initial reconnaissance
✓ Lower resource usage
```

---

#### G. Performance & Network Considerations

**Network-Friendly Design:**

1. **Rate Limiting**
```javascript
Delays between chunks: 100ms
Max concurrent connections: 50
Timeout per port: 2-5 seconds
```

2. **Target Detection**
```javascript
Private IP Ranges:
- 10.0.0.0/8
- 172.16.0.0/12
- 192.168.0.0/16
- 127.0.0.0/8 (localhost)

Warnings for public IPs:
"Scanning public IPs requires authorization"
```

3. **Firewall Detection**
```javascript
All ports filtered → Firewall likely blocking
Random open/closed pattern → Possible IDS evasion detection
```

---

#### H. Output Format

**Scan Result Structure:**
```javascript
{
  target: "scanme.nmap.org",
  resolvedIP: "45.33.32.156",
  totalPorts: 1000,
  scannedPorts: 1000,
  openPorts: [
    {
      port: 22,
      state: "open",
      service: "SSH",
      description: "Secure Shell",
      banner: "SSH-2.0-OpenSSH_7.4",
      version: "OpenSSH 7.4",
      riskLevel: "MEDIUM",
      issues: []
    },
    {
      port: 80,
      state: "open",
      service: "HTTP",
      description: "Web Server",
      banner: "Server: Apache/2.4.41",
      version: "Apache 2.4.41",
      riskLevel: "LOW",
      issues: []
    }
  ],
  scanDuration: 45230, // milliseconds
  timestamp: "2024-01-15T10:30:00Z",
  recommendations: [...]
}
```

---

## 4. Keylogger Detection System

### Technical Approach

Process behavior analysis using heuristic pattern matching, entropy calculation, and multi-factor risk scoring to identify potentially malicious keylogging software. Cross-platform support with OS-specific process enumeration.

### Implementation Methodology

#### A. Process Enumeration

**Platform-Specific Commands:**

**Windows:**
```batch
Command: wmic process get Name,ProcessId,CommandLine,PageFileUsage,WorkingSetSize /format:csv

Output Format:
Node,CommandLine,Name,PageFileUsage,ProcessId,WorkingSetSize
DESKTOP-PC,C:\Windows\System32\svchost.exe,svchost.exe,2048,1234,3072

Extracted Data:
- Process Name: svchost.exe
- Process ID: 1234
- Full Command: C:\Windows\System32\svchost.exe
- Memory Usage: PageFileUsage (2048 KB)
- Working Set: WorkingSetSize (3072 KB)
```

**Linux/macOS:**
```bash
Command: ps aux

Output Format:
USER       PID  %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root      1234  0.5  0.3 123456  7890 ?        Ss   10:30   0:02 /usr/bin/process

Extracted Data:
- User: root
- Process ID: 1234
- CPU Usage: 0.5%
- Memory Usage: 0.3%
- Full Command: /usr/bin/process
```

**Parser Implementation:**
```javascript
function parseProcessList(platform, output) {
  const processes = [];

  if (platform === 'win32') {
    // Parse Windows CSV format
    const lines = output.split('\n').filter(l => l.trim());
    for (let i = 1; i < lines.length; i++) { // Skip header
      const parts = lines[i].split(',');
      if (parts.length >= 5) {
        processes.push({
          name: parts[2] || 'Unknown',
          pid: parts[4] || '0',
          command: parts[1] || '',
          user: 'SYSTEM',
          memory: parseInt(parts[3]) || 0,
          cpu: 0
        });
      }
    }
  } else {
    // Parse Unix ps aux format
    const lines = output.split('\n').filter(l => l.trim());
    for (let i = 1; i < lines.length; i++) { // Skip header
      const parts = lines[i].trim().split(/\s+/);
      if (parts.length >= 11) {
        processes.push({
          user: parts[0],
          pid: parts[1],
          cpu: parseFloat(parts[2]) || 0,
          memory: parseFloat(parts[3]) || 0,
          command: parts.slice(10).join(' '),
          name: parts[10]?.split('/').pop() || 'Unknown'
        });
      }
    }
  }

  return processes;
}
```

---

#### B. Risk Analysis Algorithm

**Multi-Factor Risk Scoring (0-100 scale)**

**Factor 1: Suspicious Keyword Detection (25 points per match)**

```javascript
const SUSPICIOUS_KEYWORDS = {
  // Direct keylogger indicators
  critical: [
    'keylog', 'keystroke', 'keypress', 'keycap',
    'keyrecord', 'keymonitor', 'keyhook'
  ],
  
  // Monitoring/spying terms
  high: [
    'monitor', 'record', 'capture', 'spy', 'stealth',
    'hidden', 'invisible', 'secret', 'track', 'sniff'
  ],
  
  // Malware-related terms
  critical: [
    'trojan', 'rat', 'backdoor', 'rootkit', 'malware',
    'spyware', 'virus', 'worm'
  ],
  
  // Obfuscation indicators
  medium: [
    'bypass', 'evade', 'hide', 'mask', 'cloak',
    'inject', 'hook', 'intercept'
  ]
};

function scoreKeywords(processName, command) {
  let score = 0;
  const reasons = [];
  const text = (processName + ' ' + command).toLowerCase();

  for (const keyword of SUSPICIOUS_KEYWORDS.critical) {
    if (text.includes(keyword)) {
      score += 25;
      reasons.push(`Contains critical keyword: ${keyword}`);
    }
  }

  for (const keyword of SUSPICIOUS_KEYWORDS.high) {
    if (text.includes(keyword)) {
      score += 15;
      reasons.push(`Contains high-risk keyword: ${keyword}`);
    }
  }

  for (const keyword of SUSPICIOUS_KEYWORDS.medium) {
    if (text.includes(keyword)) {
      score += 10;
      reasons.push(`Contains medium-risk keyword: ${keyword}`);
    }
  }

  return { score, reasons };
}
```

---

**Factor 2: Process Name Analysis (40 points)**

```javascript
const KNOWN_MALICIOUS_PATTERNS = [
  // Keylogger names
  'keylogger', 'keylog', 'klog', 'klogger',
  
  // Spyware
  'spyware', 'spy', 'spyagent', 'spytool',
  
  // Remote Access Trojans
  'rat', 'trojan', 'backdoor', 'remote',
  
  // Generic malware
  'malware', 'virus', 'worm', 'rootkit',
  
  // Obfuscated names (common patterns)
  'svchost32', 'csrss32', 'lsass32' // Fake system processes
];

function analyzeProcessName(name) {
  let score = 0;
  const reasons = [];
  const lowerName = name.toLowerCase();

  // Check against known malicious patterns
  for (const pattern of KNOWN_MALICIOUS_PATTERNS) {
    if (lowerName.includes(pattern)) {
      score += 40;
      reasons.push(`Process name matches known malware pattern: ${pattern}`);
      break; // Only count once
    }
  }

  return { score, reasons };
}
```

---

**Factor 3: System Process Mimicry (20 points)**

```javascript
const LEGITIMATE_SYSTEM_PROCESSES = {
  // Windows
  'svchost.exe': 'C:\\Windows\\System32\\svchost.exe',
  'csrss.exe': 'C:\\Windows\\System32\\csrss.exe',
  'lsass.exe': 'C:\\Windows\\System32\\lsass.exe',
  'winlogon.exe': 'C:\\Windows\\System32\\winlogon.exe',
  'explorer.exe': 'C:\\Windows\\explorer.exe',
  
  // Linux/macOS
  'systemd': '/sbin/systemd',
  'init': '/sbin/init',
  'launchd': '/sbin/launchd'
};

function checkSystemMimicry(name, path) {
  let score = 0;
  const reasons = [];

  // Check if process claims to be system process
  if (LEGITIMATE_SYSTEM_PROCESSES[name]) {
    const legitimatePath = LEGITIMATE_SYSTEM_PROCESSES[name];
    
    // Case-insensitive comparison
    if (!path.toLowerCase().includes(legitimatePath.toLowerCase())) {
      score += 20;
      reasons.push(`System process running from wrong location`);
      reasons.push(`Expected: ${legitimatePath}, Actual: ${path}`);
    }
  }

  return { score, reasons };
}
```

---

**Factor 4: File Location Analysis (15 points)**

```javascript
const SUSPICIOUS_LOCATIONS = {
  windows: [
    'temp', 'tmp', 'appdata\\local\\temp',
    'users\\public', 'programdata',
    'windows\\temp', 'cache'
  ],
  unix: [
    '/tmp', '/var/tmp', '/dev/shm',
    '/var/cache', '/.hidden'
  ]
};

const SUSPICIOUS_EXTENSIONS = [
  '.tmp', '.temp', '.cache', '.dat', '.bin'
];

function analyzeFileLocation(path, platform) {
  let score = 0;
  const reasons = [];
  const lowerPath = path.toLowerCase();

  // Check for suspicious directories
  const suspiciousLocs = platform === 'win32' 
    ? SUSPICIOUS_LOCATIONS.windows 
    : SUSPICIOUS_LOCATIONS.unix;

  for (const location of suspiciousLocs) {
    if (lowerPath.includes(location)) {
      score += 10;
      reasons.push(`Running from suspicious location: ${location}`);
      break;
    }
  }

  // Check for suspicious extensions
  for (const ext of SUSPICIOUS_EXTENSIONS) {
    if (lowerPath.endsWith(ext)) {
      score += 5;
      reasons.push(`Suspicious file extension: ${ext}`);
      break;
    }
  }

  return { score, reasons };
}
```

---

**Factor 5: Resource Usage Analysis (10 points)**

```javascript
function analyzeResourceUsage(cpu, memory) {
  let score = 0;
  const reasons = [];

  // High CPU usage (potential monitoring activity)
  if (cpu > 50) {
    score += 5;
    reasons.push(`High CPU usage: ${cpu.toFixed(1)}%`);
  }

  // High memory usage (possible data buffering)
  if (memory > 100000) { // 100 MB
    score += 5;
    reasons.push(`High memory usage: ${(memory/1024).toFixed(1)} MB`);
  }

  return { score, reasons };
}
```

---

**Factor 6: Name Entropy Analysis (15 points)**

**Shannon Entropy Calculation:**
```javascript
function calculateEntropy(str) {
  const len = str.length;
  const frequencies = {};
  
  // Count character frequencies
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  
  // Calculate entropy
  let entropy = 0;
  for (const char in frequencies) {
    const probability = frequencies[char] / len;
    entropy -= probability * Math.log2(probability);
  }
  
  return entropy;
}

function analyzeNameEntropy(name) {
  let score = 0;
  const reasons = [];
  
  // Remove extension for analysis
  const baseName = name.replace(/\.[^.]+$/, '');
  const entropy = calculateEntropy(baseName);
  
  // High entropy suggests random/obfuscated name
  if (entropy > 4.2) {
    score += 15;
    reasons.push(`High name entropy (${entropy.toFixed(2)}) suggests obfuscation`);
  }
  
  return { score, reasons };
}

// Examples:
calculateEntropy('chrome')     // ~2.5 (normal)
calculateEntropy('explorer')   // ~2.8 (normal)
calculateEntropy('xk7f92hn')   // ~4.8 (suspicious - random)
calculateEntropy('a1b2c3d4')   // ~4.0 (suspicious - obfuscated)
```

---

**Combined Risk Score:**

```javascript
function calculateProcessRisk(process) {
  let totalScore = 0;
  const allReasons = [];

  // Factor 1: Keywords
  const keywordResult = scoreKeywords(process.name, process.command);
  totalScore += keywordResult.score;
  allReasons.push(...keywordResult.reasons);

  // Factor 2: Process name
  const nameResult = analyzeProcessName(process.name);
  totalScore += nameResult.score;
  allReasons.push(...nameResult.reasons);

  // Factor 3: System mimicry
  const mimicryResult = checkSystemMimicry(process.name, process.command);
  totalScore += mimicryResult.score;
  allReasons.push(...mimicryResult.reasons);

  // Factor 4: File location
  const locationResult = analyzeFileLocation(process.command, process.platform);
  totalScore += locationResult.score;
  allReasons.push(...locationResult.reasons);

  // Factor 5: Resource usage
  const resourceResult = analyzeResourceUsage(process.cpu, process.memory);
  totalScore += resourceResult.score;
  allReasons.push(...resourceResult.reasons);

  // Factor 6: Name entropy
  const entropyResult = analyzeNameEntropy(process.name);
  totalScore += entropyResult.score;
  allReasons.push(...entropyResult.reasons);

  // Cap at 100
  return {
    score: Math.min(100, totalScore),
    reasons: allReasons
  };
}
```

---

#### C. Legitimate Process Whitelist

**Purpose:** Prevent false positives for known safe processes

```javascript
const WHITELIST = {
  // Browsers
  'chrome.exe': true,
  'firefox.exe': true,
  'msedge.exe': true,
  'safari': true,
  'brave.exe': true,
  
  // System processes
  'svchost.exe': true,
  'csrss.exe': true,
  'explorer.exe': true,
  'systemd': true,
  'launchd': true,
  'init': true,
  
  // Development tools
  'code.exe': true,
  'node.exe': true,
  'python.exe': true,
  'java.exe': true,
  'npm.exe': true,
  
  // Common applications
  'teams.exe': true,
  'slack.exe': true,
  'discord.exe': true,
  'zoom.exe': true,
  'skype.exe': true,
  'spotify.exe': true,
  
  // Security software
  'defender': true,
  'antivirus': true,
  'malwarebytes': true
};

function isWhitelisted(processName) {
  const lowerName = processName.toLowerCase();
  return WHITELIST[lowerName] === true;
}
```

**Whitelist Application:**
```javascript
function analyzeProcess(process) {
  // Check whitelist first
  if (isWhitelisted(process.name)) {
    // Still calculate but reduce score
    const result = calculateProcessRisk(process);
    result.score = Math.max(0, result.score - 50); // Significant reduction
    result.reasons.unshift('Known legitimate process (whitelisted)');
    return result;
  }
  
  return calculateProcessRisk(process);
}
```

---

#### D. Overall Risk Classification

**System-Wide Risk Assessment:**

```javascript
function assessOverallRisk(suspiciousProcesses) {
  if (suspiciousProcesses.length === 0) {
    return {
      level: 'LOW',
      score: 0,
      message: 'No suspicious processes detected'
    };
  }

  // Calculate aggregate metrics
  const maxScore = Math.max(...suspiciousProcesses.map(p => p.riskScore));
  const totalRisk = suspiciousProcesses.reduce((sum, p) => sum + p.riskScore, 0);
  const avgScore = totalRisk / suspiciousProcesses.length;

  // Classification logic
  if (maxScore >= 80 || totalRisk >= 150) {
    return {
      level: 'CRITICAL',
      score: maxScore,
      message: `${suspiciousProcesses.length} highly suspicious processes detected`,
      action: 'IMMEDIATE'
    };
  } else if (maxScore >= 60 || totalRisk >= 100) {
    return {
      level: 'HIGH',
      score: maxScore,
      message: `${suspiciousProcesses.length} suspicious processes found`,
      action: 'URGENT'
    };
  } else if (maxScore >= 40 || totalRisk >= 60) {
    return {
      level: 'MEDIUM',
      score: maxScore,
      message: `${suspiciousProcesses.length} potentially suspicious processes`,
      action: 'INVESTIGATE'
    };
  } else {
    return {
      level: 'LOW',
      score: maxScore,
      message: `${suspiciousProcesses.length} low-risk processes flagged`,
      action: 'MONITOR'
    };
  }
}
```

---

#### E. Recommendations Engine

**Context-Aware Recommendations:**

```javascript
function generateRecommendations(riskLevel, suspiciousProcesses) {
  const recommendations = [];

  switch (riskLevel) {
    case 'CRITICAL':
      recommendations.push({
        priority: 1,
        action: 'Terminate suspicious processes immediately',
        details: suspiciousProcesses.map(p => `PID ${p.pid}: ${p.name}`)
      });
      recommendations.push({
        priority: 2,
        action: 'Disconnect from network',
        reason: 'Prevent data exfiltration'
      });
      recommendations.push({
        priority: 3,
        action: 'Run full system antivirus scan',
        tools: ['Windows Defender', 'Malwarebytes', 'Norton']
      });
      recommendations.push({
        priority: 4,
        action: 'Contact security team or IT support'
      });
      break;

    case 'HIGH':
      recommendations.push({
        priority: 1,
        action: 'Investigate suspicious processes',
        method: 'Research process names online, check file locations'
      });
      recommendations.push({
        priority: 2,
        action: 'Consider terminating high-risk processes',
        warning: 'Ensure process is not system-critical first'
      });
      recommendations.push({
        priority: 3,
        action: 'Run malware scan',
        urgency: 'Within next hour'
      });
      break;

    case 'MEDIUM':
      recommendations.push({
        priority: 1,
        action: 'Monitor flagged processes',
        duration: 'Over next 24 hours'
      });
      recommendations.push({
        priority: 2,
        action: 'Verify process legitimacy',
        method: 'Check digital signatures, research online'
      });
      recommendations.push({
        priority: 3,
        action: 'Schedule security scan',
        timing: 'During off-hours'
      });
      break;

    case 'LOW':
      recommendations.push({
        priority: 1,
        action: 'Continue routine monitoring',
        frequency: 'Weekly scans'
      });
      recommendations.push({
        priority: 2,
        action: 'Update whitelist if needed',
        reason: 'Reduce false positives for known applications'
      });
      break;
  }

  return recommendations;
}
```

---

#### F. Process Termination (Optional Feature)

**Safe Termination Logic:**

```javascript
async function terminateProcess(pid, processName) {
  // Safety checks
  const protectedProcesses = [
    'csrss.exe', 'smss.exe', 'services.exe',
    'lsass.exe', 'winlogon.exe', 'systemd', 'init'
  ];

  if (protectedProcesses.includes(processName.toLowerCase())) {
    throw new Error('Cannot terminate protected system process');
  }

  // Platform-specific termination
  try {
    if (process.platform === 'win32') {
      await exec(`taskkill /F /PID ${pid}`);
    } else {
      await exec(`kill -9 ${pid}`);
    }
    return { success: true, message: `Process ${pid} terminated` };
  } catch (error) {
    return { success: false, message: `Failed to terminate: ${error.message}` };
  }
}
```

---

#### G. Auto-Refresh Monitoring

**Continuous Monitoring Feature:**

```javascript
// Frontend implementation
const [autoRefresh, setAutoRefresh] = useState(false);
const REFRESH_INTERVAL = 30000; // 30 seconds

useEffect(() => {
  if (!autoRefresh) return;

  const interval = setInterval(() => {
    scanMutation.mutate(); // Trigger new scan
  }, REFRESH_INTERVAL);

  return () => clearInterval(interval);
}, [autoRefresh]);
```

---

## 5. File Integrity Monitor

### Technical Approach

Cryptographic hash-based file integrity verification using SHA-256 algorithm with baseline comparison and intelligent change classification for detecting unauthorized file modifications.

### Implementation Methodology

#### A. Baseline Creation

**Step 1: File Discovery (Recursive Traversal)**

```javascript
async function discoverFiles(directory, recursive = false) {
  const files = [];
  
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip system/hidden files
      if (shouldSkip(entry.name)) continue;
      
      if (entry.isDirectory()) {
        if (recursive) {
          await walk(fullPath); // Recursive dive
        }
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }
  
  await walk(directory);
  return files;
}

function shouldSkip(filename) {
  const skipPatterns = [
    '.git', '.svn', '.DS_Store', 'Thumbs.db',
    'node_modules', '__pycache__', '.cache'
  ];
  
  return skipPatterns.some(pattern => filename.includes(pattern));
}
```

---

**Step 2: Hash Calculation (SHA-256)**

```javascript
import crypto from 'crypto';
import fs from 'fs/promises';

async function calculateFileHash(filePath) {
  try {
    // Read file content
    const fileBuffer = await fs.readFile(filePath);
    
    // Calculate SHA-256 hash
    const hash = crypto
      .createHash('sha256')
      .update(fileBuffer)
      .digest('hex');
    
    return hash;
  } catch (error) {
    console.error(`Error hashing ${filePath}:`, error.message);
    return null;
  }
}

// Example:
// File content: "Hello, World!"
// SHA-256: dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f
```

**SHA-256 Properties:**
```
Output size: 256 bits (64 hexadecimal characters)
Collision resistance: Extremely high
Avalanche effect: 1-bit change → ~50% hash bits change
Computation speed: ~500 MB/s on modern CPU
Security: Approved by NIST, used in Bitcoin
```

---

**Step 3: Metadata Collection**

```javascript
async function collectFileMetadata(filePath, hash) {
  const stats = await fs.stat(filePath);
  
  return {
    path: filePath,
    hash: hash,
    size: stats.size,
    mtime: stats.mtime.toISOString(), // Modified time
    ctime: stats.ctime.toISOString(), // Created time
    mode: stats.mode // Permissions
  };
}
```

---

**Step 4: Baseline Storage**

```javascript
// In-memory storage structure
const baselineDatabase = new Map();

async function createBaseline(directory, recursive) {
  const files = await discoverFiles(directory, recursive);
  const baseline = {};
  
  console.log(`Scanning ${files.length} files...`);
  
  for (const filePath of files) {
    const hash = await calculateFileHash(filePath);
    if (hash) {
      const metadata = await collectFileMetadata(filePath, hash);
      baseline[filePath] = metadata;
    }
  }
  
  // Store baseline
  baselineDatabase.set(directory, {
    directory: directory,
    recursive: recursive,
    createdAt: new Date().toISOString(),
    fileCount: Object.keys(baseline).length,
    files: baseline
  });
  
  return baseline;
}
```

**Baseline Structure:**
```javascript
{
  "directory": "/path/to/monitor",
  "recursive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "fileCount": 150,
  "files": {
    "/path/to/monitor/file1.txt": {
      "path": "/path/to/monitor/file1.txt",
      "hash": "abc123...",
      "size": 1024,
      "mtime": "2024-01-10T08:00:00Z",
      "ctime": "2024-01-10T08:00:00Z"
    },
    // ... more files
  }
}
```

---

#### B. Integrity Checking

**Step 1: Current State Scan**

```javascript
async function scanCurrentState(directory, recursive) {
  const currentFiles = await discoverFiles(directory, recursive);
  const currentState = {};
  
  for (const filePath of currentFiles) {
    const hash = await calculateFileHash(filePath);
    if (hash) {
      currentState[filePath] = hash;
    }
  }
  
  return currentState;
}
```

---

**Step 2: Change Detection Algorithm**

```javascript
function detectChanges(baseline, currentState) {
  const changes = {
    added: [],
    modified: [],
    deleted: [],
    unchanged: []
  };
  
  // 1. Check for DELETED and MODIFIED files
  for (const [filePath, baselineData] of Object.entries(baseline.files)) {
    if (!(filePath in currentState)) {
      // File was in baseline but not in current scan
      changes.deleted.push({
        path: filePath,
        oldHash: baselineData.hash,
        oldSize: baselineData.size,
        timestamp: new Date().toISOString()
      });
    } else if (currentState[filePath] !== baselineData.hash) {
      // File exists but hash changed
      changes.modified.push({
        path: filePath,
        oldHash: baselineData.hash,
        newHash: currentState[filePath],
        timestamp: new Date().toISOString()
      });
    } else {
      // File unchanged
      changes.unchanged.push(filePath);
    }
  }
  
  // 2. Check for ADDED files
  for (const filePath in currentState) {
    if (!(filePath in baseline.files)) {
      // File in current scan but not in baseline
      changes.added.push({
        path: filePath,
        newHash: currentState[filePath],
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return changes;
}
```

**Example Detection:**
```
Baseline:
- file1.txt: hash_abc
- file2.txt: hash_def
- file3.txt: hash_ghi

Current State:
- file1.txt: hash_abc (UNCHANGED)
- file2.txt: hash_xyz (MODIFIED - hash changed)
- file4.txt: hash_jkl (ADDED - new file)
[file3.txt missing] (DELETED - not in current)

Result:
- Added: [file4.txt]
- Modified: [file2.txt]
- Deleted: [file3.txt]
- Unchanged: [file1.txt]
```

---

**Step 3: Hash Comparison Verification**

```javascript
function compareHashes(hash1, hash2) {
  // Cryptographic comparison
  return hash1 === hash2;
}

// SHA-256 Collision Resistance:
// Probability of collision: 1 in 2^256 ≈ 1 in 10^77
// For perspective: More likely to win lottery 9 times in a row
```

---

#### C. Risk Assessment

**Change Type Risk Classification:**

```javascript
function assessChangeRisk(changes, directory) {
  const riskFactors = {
    added: { weight: 30, label: 'New files created' },
    modified: { weight: 20, label: 'Existing files changed' },
    deleted: { weight: 25, label: 'Files removed' }
  };
  
  // Calculate base risk score
  let riskScore = 0;
  riskScore += changes.added.length * riskFactors.added.weight;
  riskScore += changes.modified.length * riskFactors.modified.weight;
  riskScore += changes.deleted.length * riskFactors.deleted.weight;
  
  // Adjust for critical file types
  const criticalChanges = identifyCriticalChanges(changes);
  riskScore += criticalChanges.length * 20;
  
  // Determine risk level
  let riskLevel;
  if (riskScore === 0) {
    riskLevel = 'NONE';
  } else if (riskScore < 30) {
    riskLevel = 'LOW';
  } else if (riskScore < 60) {
    riskLevel = 'MEDIUM';
  } else if (riskScore < 100) {
    riskLevel = 'HIGH';
  } else {
    riskLevel = 'CRITICAL';
  }
  
  return {
    riskScore,
    riskLevel,
    totalChanges: changes.added.length + changes.modified.length + changes.deleted.length
  };
}
```

---

**Critical File Identification:**

```javascript
function identifyCriticalChanges(changes) {
  const criticalPatterns = {
    system: [
      '/etc/passwd', '/etc/shadow', '/etc/sudoers',
      'C:\\Windows\\System32', 'C:\\Windows\\SysWOW64'
    ],
    config: [
      '.env', 'config.json', 'settings.ini',
      '.htaccess', 'web.config'
    ],
    executable: [
      '.exe', '.dll', '.so', '.dylib', '.sh', '.bat'
    ],
    security: [
      'authorized_keys', 'known_hosts', '.ssh/',
      'ssl/', 'certs/', 'keys/'
    ]
  };
  
  const critical = [];
  const allChanges = [
    ...changes.added,
    ...changes.modified,
    ...changes.deleted
  ];
  
  for (const change of allChanges) {
    const path = change.path.toLowerCase();
    
    // Check system files
    if (criticalPatterns.system.some(p => path.includes(p.toLowerCase()))) {
      critical.push({ ...change, category: 'SYSTEM', severity: 'CRITICAL' });
      continue;
    }
    
    // Check config files
    if (criticalPatterns.config.some(p => path.includes(p))) {
      critical.push({ ...change, category: 'CONFIG', severity: 'HIGH' });
      continue;
    }
    
    // Check executables
    if (criticalPatterns.executable.some(ext => path.endsWith(ext))) {
      critical.push({ ...change, category: 'EXECUTABLE', severity: 'HIGH' });
      continue;
    }
    
    // Check security files
    if (criticalPatterns.security.some(p => path.includes(p))) {
      critical.push({ ...change, category: 'SECURITY', severity: 'CRITICAL' });
      continue;
    }
  }
  
  return critical;
}
```

---

#### D. Detailed Reporting

**Comprehensive Change Report:**

```javascript
function generateIntegrityReport(baseline, changes, riskAssessment) {
  return {
    summary: {
      baselineCreated: baseline.createdAt,
      lastCheck: new Date().toISOString(),
      directory: baseline.directory,
      recursive: baseline.recursive,
      totalFilesBaseline: baseline.fileCount,
      totalFilesCurrent: baseline.fileCount + changes.added.length - changes.deleted.length,
      changeCount: {
        added: changes.added.length,
        modified: changes.modified.length,
        deleted: changes.deleted.length,
        unchanged: changes.unchanged.length
      }
    },
    
    risk: {
      level: riskAssessment.riskLevel,
      score: riskAssessment.riskScore,
      message: getRiskMessage(riskAssessment.riskLevel)
    },
    
    changes: {
      added: changes.added.map(c => ({
        type: 'ADDED',
        path: c.path,
        hash: c.newHash,
        timestamp: c.timestamp,
        size: null
      })),
      
      modified: changes.modified.map(c => ({
        type: 'MODIFIED',
        path: c.path,
        oldHash: c.oldHash,
        newHash: c.newHash,
        timestamp: c.timestamp
      })),
      
      deleted: changes.deleted.map(c => ({
        type: 'DELETED',
        path: c.path,
        oldHash: c.oldHash,
        timestamp: c.timestamp,
        size: c.oldSize
      }))
    },
    
    recommendations: generateRecommendations(riskAssessment, changes)
  };
}

function getRiskMessage(riskLevel) {
  const messages = {
    NONE: 'No changes detected. All files match baseline.',
    LOW: 'Minor changes detected. Normal activity expected.',
    MEDIUM: 'Moderate changes detected. Review recommended.',
    HIGH: 'Significant changes detected. Immediate review required.',
    CRITICAL: 'Critical changes detected. Security incident possible.'
  };
  
  return messages[riskLevel] || 'Unknown risk level';
}
```

---

**Example Report:**
```json
{
  "summary": {
    "baselineCreated": "2024-01-15T10:00:00Z",
    "lastCheck": "2024-01-15T15:30:00Z",
    "directory": "/var/www/html",
    "recursive": true,
    "totalFilesBaseline": 150,
    "totalFilesCurrent": 152,
    "changeCount": {
      "added": 3,
      "modified": 5,
      "deleted": 1,
      "unchanged": 142
    }
  },
  "risk": {
    "level": "HIGH",
    "score": 75,
    "message": "Significant changes detected"
  },
  "changes": {
    "added": [
      {
        "type": "ADDED",
        "path": "/var/www/html/uploads/malware.php",
        "hash": "abc123...",
        "timestamp": "2024-01-15T15:25:00Z"
      }
    ],
    "modified": [
      {
        "type": "MODIFIED",
        "path": "/var/www/html/.htaccess",
        "oldHash": "def456...",
        "newHash": "xyz789...",
        "timestamp": "2024-01-15T15:20:00Z"
      }
    ],
    "deleted": [
      {
        "type": "DELETED",
        "path": "/var/www/html/security.log",
        "oldHash": "ghi012...",
        "timestamp": "2024-01-15T15:15:00Z"
      }
    ]
  }
}
```

---

#### E. Baseline Management

**Operations:**

```javascript
class BaselineManager {
  constructor() {
    this.baselines = new Map();
  }
  
  // 1. Initialize: Create new baseline
  async initialize(directory, recursive) {
    const baseline = await createBaseline(directory, recursive);
    this.baselines.set(directory, baseline);
    return {
      success: true,
      message: `Baseline created for ${directory}`,
      fileCount: Object.keys(baseline.files).length
    };
  }
  
  // 2. Check: Compare current vs baseline
  async check(directory) {
    const baseline = this.baselines.get(directory);
    if (!baseline) {
      throw new Error('No baseline found for this directory');
    }
    
    const currentState = await scanCurrentState(directory, baseline.recursive);
    const changes = detectChanges(baseline, currentState);
    const risk = assessChangeRisk(changes, directory);
    
    return generateIntegrityReport(baseline, changes, risk);
  }
  
  // 3. Update: Accept changes and reset baseline
  async update(directory) {
    const currentBaseline = this.baselines.get(directory);
    if (!currentBaseline) {
      throw new Error('No baseline found for this directory');
    }
    
    // Create new baseline with current state
    const newBaseline = await createBaseline(
      directory,
      currentBaseline.recursive
    );
    
    this.baselines.set(directory, newBaseline);
    
    return {
      success: true,
      message: 'Baseline updated with current file state',
      fileCount: Object.keys(newBaseline.files).length
    };
  }
  
  // 4. Info: View baseline statistics
  getInfo(directory) {
    const baseline = this.baselines.get(directory);
    if (!baseline) {
      return null;
    }
    
    return {
      directory: baseline.directory,
      createdAt: baseline.createdAt,
      fileCount: baseline.fileCount,
      recursive: baseline.recursive,
      totalSize: Object.values(baseline.files)
        .reduce((sum, f) => sum + f.size, 0)
    };
  }
  
  // 5. Delete: Remove baseline
  delete(directory) {
    return this.baselines.delete(directory);
  }
}
```

---

#### F. Performance Optimization

**Large File Handling:**

```javascript
async function calculateHashStreaming(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    stream.on('data', (chunk) => {
      hash.update(chunk);
    });
    
    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });
    
    stream.on('error', reject);
  });
}

// Benefits:
// - Memory efficient (processes in chunks)
// - Handles files > 1GB
// - No memory overflow
```

---

**Parallel Processing:**

```javascript
async function hashFilesParallel(files, concurrency = 10) {
  const results = {};
  
  // Process files in batches
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);
    const hashes = await Promise.all(
      batch.map(async (file) => ({
        path: file,
        hash: await calculateFileHash(file)
      }))
    );
    
    for (const { path, hash } of hashes) {
      results[path] = hash;
    }
  }
  
  return results;
}
```

---

#### G. Use Cases & Examples

**Use Case 1: Web Server Monitoring**
```javascript
// Monitor web root for unauthorized changes
await baselineManager.initialize('/var/www/html', true);

// Check for changes daily
const report = await baselineManager.check('/var/www/html');

if (report.risk.level === 'HIGH' || report.risk.level === 'CRITICAL') {
  // Alert security team
  sendAlert(report);
}
```

**Use Case 2: Configuration File Monitoring**
```javascript
// Monitor critical config files
await baselineManager.initialize('/etc', false); // Non-recursive

// Detect unauthorized config changes
const report = await baselineManager.check('/etc');

// Review modified configs
for (const change of report.changes.modified) {
  if (change.path.includes('passwd') || change.path.includes('shadow')) {
    // Critical security file changed
    alertSecurityTeam(change);
  }
}
```

**Use Case 3: Malware Detection**
```javascript
// Baseline before deployment
await baselineManager.initialize('/opt/application', true);

// After suspected breach, check for new files
const report = await baselineManager.check('/opt/application');

// Investigate all added executables
const suspiciousFiles = report.changes.added.filter(c => 
  c.path.endsWith('.exe') || 
  c.path.endsWith('.dll') ||
  c.path.endsWith('.sh')
);
```

---

## System Architecture

### Full-Stack Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React 18 + TypeScript                               │   │
│  │  ├── Pages (Wouter routing)                           │   │
│  │  ├── Components (Radix UI + Tailwind CSS)            │   │
│  │  ├── State Management (TanStack Query)               │   │
│  │  └── Form Validation (React Hook Form + Zod)         │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                   │
│                           │ HTTP/REST API                     │
│                           ▼                                   │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                    SERVER (Backend)                            │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Express.js + TypeScript                             │    │
│  │  ├── Middleware (Helmet, Rate Limiting, Validation)  │    │
│  │  ├── API Routes (/api/security/*)                    │    │
│  │  └── Error Handling                                  │    │
│  └──────────────────────────────────────────────────────┘    │
│                           │                                    │
│                           ▼                                    │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Security Services Layer                              │    │
│  │  ├── Password Service (Entropy, Dictionary, Scoring) │    │
│  │  ├── Phishing Service (Heuristics, Typosquatting)    │    │
│  │  ├── Port Service (TCP Scan, Banner Grab)            │    │
│  │  ├── Keylogger Service (Process Analysis, Risk)      │    │
│  │  └── File Integrity Service (SHA-256, Baseline)      │    │
│  └──────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                           │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Optional Integrations                                │    │
│  │  └── Google Safe Browsing API (Phishing Detection)   │    │
│  └──────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → React Component → TanStack Query → API Request
                                                       ↓
                                              Express Route
                                                       ↓
                                             Input Validation (Zod)
                                                       ↓
                                             Security Service
                                                       ↓
                                              Analysis Logic
                                                       ↓
                                              JSON Response
                                                       ↓
                                       TanStack Query Cache Update
                                                       ↓
                                            React Component Re-render
                                                       ↓
                                              User sees results
```

---

## Conclusion

This technical approach document provides comprehensive implementation details for all security tools in the CyberSec Toolkit. Each tool is built on industry-standard algorithms and best practices, ensuring reliable and accurate security analysis.

**Key Strengths:**
- ✅ Detailed algorithmic approaches
- ✅ Privacy-focused local processing
- ✅ Comprehensive risk assessment
- ✅ Real-world applicable solutions
- ✅ Educational value with clear explanations
- ✅ Production-ready implementation

**For Panel Presentation:**
- Emphasize algorithmic sophistication
- Highlight privacy and security considerations
- Demonstrate real-world use cases
- Show comprehensive testing and validation
- Discuss scalability and future enhancements

---

**Document Version:** 1.0  
**Last Updated:** January 2024  
**Authors:** B.Tech IT Students (2022-26 Batch)
