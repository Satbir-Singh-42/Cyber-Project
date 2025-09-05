import { PasswordAnalyzer } from "@/components/security/password-analyzer";

export default function PasswordAnalyzerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Password Strength Analyzer</h1>
        <p className="text-muted-foreground mt-2">
          Analyze password security, check strength criteria, and get improvement suggestions to prevent brute-force attacks.
        </p>
      </div>
      
      <PasswordAnalyzer />
      
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Password Security Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">Strong Password Criteria:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• At least 12 characters long</li>
              <li>• Mix of uppercase and lowercase letters</li>
              <li>• Include numbers and special characters</li>
              <li>• Avoid dictionary words and common patterns</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Security Best Practices:</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Use unique passwords for each account</li>
              <li>• Enable two-factor authentication</li>
              <li>• Consider using passphrases</li>
              <li>• Regularly update critical passwords</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}