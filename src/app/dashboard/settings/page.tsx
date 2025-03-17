"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AlertTriangle, Bell, Shield, Key, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock settings data
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSwitchChange = (name: string) => {
    setSettings((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate passwords
    if (settings.newPassword !== settings.confirmPassword) {
      alert("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Reset form
    setSettings((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    
    setIsLoading(false);
    alert("Password updated successfully");
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Theme Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Select your preferred theme mode.
                </p>
              </div>
              <ThemeToggle />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Manage your account settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {session?.user?.email || "No email address"}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data.
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose what notifications you receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your account activity.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={() => handleSwitchChange("emailNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about new features and updates.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.marketingEmails}
                  onCheckedChange={() => handleSwitchChange("marketingEmails")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-4 space-y-4">
          <Card>
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={settings.currentPassword}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={settings.newPassword}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={settings.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions and sign out from other devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Current Session</h3>
                    <p className="text-sm text-muted-foreground">
                      This is your current active session.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data.
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 