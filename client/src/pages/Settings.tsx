import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, Shield, Globe, Bell } from "lucide-react";

export default function Settings() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account preferences and API integrations.</p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>API Configuration</CardTitle>
                </div>
                <CardDescription>
                  Configure your connection to Retell AI and Meta Services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retell-api">Retell API Key</Label>
                  <Input id="retell-api" type="password" placeholder="••••••••••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-token">Meta Access Token</Label>
                  <Input id="meta-token" type="password" placeholder="••••••••••••••••" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle>Global Preferences</CardTitle>
                </div>
                <CardDescription>
                  Default settings for new agents and communications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Input id="language" defaultValue="Spanish (ES)" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input id="timezone" defaultValue="Bogota (GMT-5)" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>
                  Receive alerts for call failures or agent status changes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive daily summaries of agent performance.</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="ghost">Cancel</Button>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
