import { PortScanner } from "@/components/security/port-scanner";

export default function PortScannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Network Port Scanner</h1>
        <p className="text-muted-foreground mt-2">
          Scan network ports to identify open services, detect potential vulnerabilities, and assess network security posture.
        </p>
      </div>
      
      <PortScanner />
      
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Network Security Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Common Vulnerable Ports:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Port 21 (FTP) - Often misconfigured</li>
              <li>• Port 23 (Telnet) - Unencrypted protocol</li>
              <li>• Port 1433 (MSSQL) - Database exposure</li>
              <li>• Port 3389 (RDP) - Remote access risks</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Security Best Practices:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Close unnecessary open ports</li>
              <li>• Use firewalls to restrict access</li>
              <li>• Regular security audits and scans</li>
              <li>• Keep services updated and patched</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}