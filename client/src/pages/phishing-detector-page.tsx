import { PhishingDetector } from "@/components/security/phishing-detector";
import { ShieldAlert, GlobeLock, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PhishingDetectorPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ShieldAlert className="h-7 w-7 text-red-500" />
          Phishing URL Detection
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Detect, analyze, and learn from suspicious URLs using advanced heuristics and 
          machine learning models to stay one step ahead of modern phishing threats.
        </p>
      </header>

      {/* Core Phishing Detector Component */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Analyze a URL</CardTitle>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            Reset
          </Button>
        </CardHeader>
        <CardContent>
          <PhishingDetector />
        </CardContent>
      </Card>

      {/* Dynamic Threat Intelligence Section */}
      <Card className="bg-muted/50 border border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <GlobeLock className="h-5 w-5 text-blue-500" />
            Live Threat Intelligence (Coming Soon)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Soon you’ll be able to cross-check URLs in real time against a live threat 
          intelligence database that aggregates global phishing indicators, 
          DNS reputation scores, and active attack patterns.
        </CardContent>
      </Card>

      {/* Phishing Protection Tips */}
      <section className="bg-muted/50 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-4">Phishing Protection Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">Red Flags to Watch For:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• IP addresses instead of domain names</li>
              <li>• Suspicious subdomains or typosquatting (e.g., amaz0n.com)</li>
              <li>• Shortened URLs from unknown senders</li>
              <li>• Missing HTTPS encryption</li>
              <li>• Fake urgency or login requests</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Stay Safe Online:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Verify the sender’s identity before clicking links</li>
              <li>• Hover over links to preview their destination</li>
              <li>• Use a password manager to detect spoofed sites</li>
              <li>• Report suspicious URLs to your IT/security team</li>
              <li>• Keep browsers and antivirus software updated</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
