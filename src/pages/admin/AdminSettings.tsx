import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export function AdminSettings() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Configure system-wide email notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="new-user">New User Registration</Label>
              <Switch id="new-user" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-subscription">New Subscription</Label>
              <Switch id="new-subscription" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="failed-payment">Failed Payment</Label>
              <Switch id="failed-payment" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>Manage system maintenance tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Database Backup</Label>
                <p className="text-sm text-muted-foreground">Last backup: Never</p>
              </div>
              <Button>Run Backup</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Clear Cache</Label>
                <p className="text-sm text-muted-foreground">Last cleared: Never</p>
              </div>
              <Button variant="outline">Clear Cache</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}