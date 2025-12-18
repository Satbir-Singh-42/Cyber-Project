import axios from "axios";

export interface AIThreatAnalysis {
  aiScore: number;
  confidence: number;
  threatType: string;
  explanation: string;
  verified: boolean;
}

export class AIThreatAnalyzer {
  private geminiApiKey: string;

  constructor() {
    this.geminiApiKey = process.env.GOOGLE_API_KEY || "";
  }

  async analyzeUrlWithAI(
    url: string,
    indicators: any
  ): Promise<AIThreatAnalysis> {
    // If no Gemini key, return minimal analysis
    if (!this.geminiApiKey) {
      return {
        aiScore: 0,
        confidence: 0,
        threatType: "unknown",
        explanation: "AI analysis unavailable - no GOOGLE_API_KEY configured",
        verified: false,
      };
    }

    try {
      const prompt = `You are a cybersecurity expert analyzing phishing URLs. Analyze the following URL and security indicators:

URL: ${url}

Security Indicators Detected:
- IP-based URL: ${indicators.ipBasedUrl}
- Suspicious subdomains: ${indicators.suspiciousSubdomains}
- Short URL service: ${indicators.shortUrl}
- Suspicious keywords: ${indicators.suspiciousKeywords}
- Missing HTTPS: ${indicators.missingHttps}
- Typosquatting detected: ${indicators.homoglyphDetected}
- Brand impersonation: ${indicators.brandImpersonation}
- Suspicious TLD: ${indicators.suspiciousTLD}

Provide a JSON response with:
1. threatLevel (0-100): your AI assessment of threat level
2. threatType: what type of threat (phishing, malware, spam, legitimate, etc.)
3. explanation: brief technical explanation of your assessment

Respond ONLY with valid JSON, no other text.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (
        response.data.candidates &&
        response.data.candidates[0]?.content?.parts?.[0]?.text
      ) {
        const responseText = response.data.candidates[0].content.parts[0].text;

        // Extract JSON from response (Gemini might add extra text)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const aiResponse = JSON.parse(jsonMatch[0]);

          return {
            aiScore: Math.min(100, Math.max(0, aiResponse.threatLevel || 0)),
            confidence: 85,
            threatType: aiResponse.threatType || "unknown",
            explanation: aiResponse.explanation || "AI analysis completed",
            verified: true,
          };
        }
      }

      return {
        aiScore: 0,
        confidence: 0,
        threatType: "error",
        explanation: "Failed to parse AI response",
        verified: false,
      };
    } catch (error) {
      console.error(
        "Gemini threat analysis error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return {
        aiScore: 0,
        confidence: 0,
        threatType: "unknown",
        explanation: "AI analysis failed - using heuristic analysis only",
        verified: false,
      };
    }
  }

  // Check against VirusTotal API if available
  async checkVirusTotal(
    url: string
  ): Promise<{ detected: boolean; detections: number }> {
    const vtApiKey = process.env.VIRUSTOTAL_API_KEY;

    if (!vtApiKey) {
      return { detected: false, detections: 0 };
    }

    try {
      const response = await axios.get(
        `https://www.virustotal.com/api/v3/urls/${Buffer.from(url).toString(
          "base64"
        )}`,
        {
          headers: {
            "x-apikey": vtApiKey,
          },
          timeout: 5000,
        }
      );

      const lastAnalysis = response.data?.data?.attributes?.last_analysis_stats;
      if (lastAnalysis) {
        const detections = lastAnalysis.malicious || 0;
        return {
          detected: detections > 0,
          detections,
        };
      }

      return { detected: false, detections: 0 };
    } catch (error) {
      console.error(
        "VirusTotal check error:",
        error instanceof Error ? error.message : "Unknown error"
      );
      return { detected: false, detections: 0 };
    }
  }
}
