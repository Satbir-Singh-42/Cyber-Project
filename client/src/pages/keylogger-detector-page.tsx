import { KeyloggerDetector } from "@/components/security/keylogger-detector";

export default function KeyloggerDetectorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Keylogger Detection System</h1>
        <p className="text-muted-foreground mt-2">
          Monitor system processes for suspicious keylogging activity and detect malicious software that may be capturing sensitive information.
        </p>
      </div>
      
      <KeyloggerDetector />
      
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Endpoint Protection Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Signs of Keylogger Activity:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Unusual system slowdowns</li>
              <li>• Unknown processes consuming resources</li>
              <li>• Suspicious network activity</li>
              <li>• Random system crashes or freezes</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Prevention Strategies:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Regular antivirus scans</li>
              <li>• Keep operating system updated</li>
              <li>• Use virtual keyboards for sensitive data</li>
              <li>• Monitor running processes regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}