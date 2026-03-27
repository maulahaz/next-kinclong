"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsClientPage({ settings }: { settings: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // General States
  const [appName, setAppName] = useState(settings?.appName || "");
  const [companyName, setCompanyName] = useState(settings?.companyName || "");
  const [companyAddress, setCompanyAddress] = useState(settings?.companyAddress || "");
  const [phone, setPhone] = useState(settings?.phone || "");
  const [email, setEmail] = useState(settings?.email || "");

  // Brand States
  const [companyLogo, setCompanyLogo] = useState(settings?.companyLogo || "");
  const [companyIcon, setCompanyIcon] = useState(settings?.companyIcon || "");

  // Localization States
  const [currency, setCurrency] = useState(settings?.currency || "IDR");
  const [timezone, setTimezone] = useState(settings?.timezone || "Asia/Jakarta");

  // JSON States (simplified via strings for demo, or parsing)
  const [instagram, setInstagram] = useState(settings?.socialMedia?.instagram || "");
  const [facebook, setFacebook] = useState(settings?.socialMedia?.facebook || "");
  
  // Others
  const [primaryColor, setPrimaryColor] = useState(settings?.others?.primaryColor || "#2ED573");

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const socialMedia = { instagram, facebook };
      const others = { ...settings?.others, primaryColor };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName,
          companyName,
          companyAddress,
          phone,
          email,
          companyLogo,
          companyIcon,
          currency,
          timezone,
          socialMedia,
          others,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success("Settings updated successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Global Settings</h2>
          <p className="text-muted-foreground mt-1">
            Manage your application configurations and brand details.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading} className="bg-primary hover:bg-primary/90 shadow-[0_4px_10px_rgba(46,213,115,0.2)] text-white">
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4 bg-card border border-border shadow-sm p-1">
          <TabsTrigger value="general" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">General</TabsTrigger>
          <TabsTrigger value="brand" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Brand & Assets</TabsTrigger>
          <TabsTrigger value="localization" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Localization</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-primary/20 shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Primary details about your business.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">App Name (System)</Label>
                  <Input id="appName" value={appName} onChange={(e) => setAppName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="companyAddress">Company Address</Label>
                  <Input id="companyAddress" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Support Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand">
          <Card className="border-primary/20 shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Brand Assets</CardTitle>
              <CardDescription>Logo and visual identity settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyLogo">Company Logo URL</Label>
                <Input id="companyLogo" value={companyLogo} onChange={(e) => setCompanyLogo(e.target.value)} placeholder="https://..." />
                {companyLogo && <img src={companyLogo} alt="Logo Preview" className="h-12 mt-2 object-contain bg-muted p-2 rounded" />}
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyIcon">Company Icon URL (Small)</Label>
                <Input id="companyIcon" value={companyIcon} onChange={(e) => setCompanyIcon(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Theme Color (Hex)</Label>
                <div className="flex gap-2">
                  <Input type="color" id="primaryColor-picker" className="w-12 h-10 p-1" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                  <Input id="primaryColor" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization">
          <Card className="border-primary/20 shadow-sm bg-card">
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Currency and timezone preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="currency">Currency Code</Label>
                  <Input id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="e.g. IDR, USD" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="e.g. Asia/Jakarta" />
                </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  );
}
