import { FileIntegrityMonitor } from "@/components/security/file-integrity-monitor";

export default function FileIntegrityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">File Integrity Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Monitor critical files and directories for unauthorized changes, detect tampering, and maintain system integrity against malware modifications.
        </p>
      </div>
      
      <FileIntegrityMonitor />
      
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">File System Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Critical Areas to Monitor:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• System configuration files</li>
              <li>• Application executables</li>
              <li>• User data directories</li>
              <li>• Log files and databases</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Best Practices:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Establish trusted baselines</li>
              <li>• Regular integrity checks</li>
              <li>• Automated alert systems</li>
              <li>• Secure backup strategies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}