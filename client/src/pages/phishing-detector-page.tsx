import { PhishingDetector } from "@/components/security/phishing-detector";

export default function PhishingDetectorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Phishing URL Detection</h1>
        <p className="text-muted-foreground mt-2">
          Analyze URLs for common phishing patterns, suspicious domains, and malicious indicators to protect against social engineering attacks.
        </p>
      </div>
      
      <PhishingDetector />
      
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Phishing Protection Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Red Flags to Watch For:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• IP addresses instead of domain names</li>
              <li>• Suspicious subdomains or misspellings</li>
              <li>• Shortened URLs from unknown sources</li>
              <li>• Missing HTTPS encryption</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Stay Safe Online:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Always verify the sender's identity</li>
              <li>• Type URLs directly instead of clicking links</li>
              <li>• Check for valid SSL certificates</li>
              <li>• Report suspicious URLs to authorities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}