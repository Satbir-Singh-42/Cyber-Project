import axios from 'axios';

export interface AIThreatAnalysis {
  aiScore: number;
  confidence: number;
  threatType: string;
  explanation: string;
  verified: boolean;
}

export class AIThreatAnalyzer {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  async analyzeUrlWithAI(url: string, indicators: any): Promise<AIThreatAnalysis> {
    // If no OpenAI key, return minimal analysis
    if (!this.openaiApiKey) {
      return {
        aiScore: 0,
        confidence: 0,
        threatType: 'unknown',
        explanation: 'AI analysis unavailable - no OpenAI API key configured',
        verified: false
      };
    }

    try {
      const prompt = `You are a cybersecurity expert analyzing phishing URLs. 
      
URL to analyze: ${url}

Security indicators detected:
- IP-based URL: ${indicators.ipBasedUrl}
- Suspicious subdomains: ${indicators.suspiciousSubdomains}
- Short URL service: ${indicators.shortUrl}
- Suspicious keywords: ${indicators.suspiciousKeywords}
- Missing HTTPS: ${indicators.missingHttps}
- Typosquatting detected: ${indicators.homoglyphDetected}
- Brand impersonation: ${indicators.brandImpersonation}
- Suspicious TLD: ${indicators.suspiciousTLD}

Based on these indicators, provide a JSON response with:
1. threatLevel (0-100): your AI assessment of threat level
2. threatType: what type of threat this is (phishing, malware, spam, legitimate, etc.)
3. explanation: brief technical explanation of why you assess it this way
4. keyRisks: array of top 3 risks detected

Format your response as valid JSON only, no other text.`;

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a cybersecurity threat analysis expert. Respond only with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data.choices && response.data.choices[0]?.message?.content) {
        const aiResponse = JSON.parse(response.data.choices[0].message.content);
        
        return {
          aiScore: Math.min(100, Math.max(0, aiResponse.threatLevel || 0)),
          confidence: 85,
          threatType: aiResponse.threatType || 'unknown',
          explanation: aiResponse.explanation || 'AI analysis completed',
          verified: true
        };
      }

      return {
        aiScore: 0,
        confidence: 0,
        threatType: 'error',
        explanation: 'Failed to parse AI response',
        verified: false
      };

    } catch (error) {
      console.error('AI threat analysis error:', error instanceof Error ? error.message : 'Unknown error');
      return {
        aiScore: 0,
        confidence: 0,
        threatType: 'unknown',
        explanation: 'AI analysis failed - using heuristic analysis only',
        verified: false
      };
    }
  }

  // Check against VirusTotal API if available
  async checkVirusTotal(url: string): Promise<{ detected: boolean; detections: number }> {
    const vtApiKey = process.env.VIRUSTOTAL_API_KEY;
    
    if (!vtApiKey) {
      return { detected: false, detections: 0 };
    }

    try {
      const encoded = encodeURIComponent(url);
      const response = await axios.get(
        `https://www.virustotal.com/api/v3/urls/${Buffer.from(url).toString('base64')}`,
        {
          headers: {
            'x-apikey': vtApiKey
          },
          timeout: 5000
        }
      );

      const lastAnalysis = response.data?.data?.attributes?.last_analysis_stats;
      if (lastAnalysis) {
        const detections = lastAnalysis.malicious || 0;
        return {
          detected: detections > 0,
          detections
        };
      }

      return { detected: false, detections: 0 };

    } catch (error) {
      console.error('VirusTotal check error:', error instanceof Error ? error.message : 'Unknown error');
      return { detected: false, detections: 0 };
    }
  }
}
