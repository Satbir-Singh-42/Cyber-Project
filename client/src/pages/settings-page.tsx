import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings2, Database, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your security toolkit preferences and system settings.
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings2 className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save" className="text-base font-medium">
                Auto-save scan results
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically save all security scan results to the database
              </p>
            </div>
            <Switch id="auto-save" defaultChecked data-testid="switch-auto-save" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="text-base font-medium">
                Enable notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Show system notifications for security alerts
              </p>
            </div>
            <Switch id="notifications" defaultChecked data-testid="switch-notifications" />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Default scan timeout</Label>
            <Select defaultValue="30">
              <SelectTrigger className="w-48" data-testid="select-timeout">
                <SelectValue placeholder="Select timeout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">60 seconds</SelectItem>
                <SelectItem value="120">2 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="strict-mode" className="text-base font-medium">
                Strict security mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable enhanced security checks and warnings
              </p>
            </div>
            <Switch id="strict-mode" data-testid="switch-strict-mode" />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Password minimum strength</Label>
            <Select defaultValue="medium">
              <SelectTrigger className="w-48" data-testid="select-password-strength">
                <SelectValue placeholder="Select strength" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="very-high">Very High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-medium">Data retention period</Label>
            <Select defaultValue="30">
              <SelectTrigger className="w-48" data-testid="select-retention">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="never">Never delete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="backup" className="text-base font-medium">
                Automatic backups
              </Label>
              <p className="text-sm text-muted-foreground">
                Create daily backups of scan results and settings
              </p>
            </div>
            <Switch id="backup" defaultChecked data-testid="switch-backup" />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-2 block">Email notifications</Label>
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="max-w-sm"
              data-testid="input-email"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="alert-emails" className="text-base font-medium">
                Security alert emails
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts for critical security findings
              </p>
            </div>
            <Switch id="alert-emails" data-testid="switch-alert-emails" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-reports" className="text-base font-medium">
                Weekly summary reports
              </Label>
              <p className="text-sm text-muted-foreground">
                Get weekly email summaries of security activity
              </p>
            </div>
            <Switch id="weekly-reports" data-testid="switch-weekly-reports" />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" data-testid="button-reset">
          Reset to Defaults
        </Button>
        <Button data-testid="button-save-settings">
          Save Settings
        </Button>
      </div>
    </div>
  );
}