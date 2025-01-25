"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    apiKey: "",
    notificationsEnabled: false,
    dataRetentionDays: 30,
    predictionThreshold: 70,
  })

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    console.log("Saving settings:", settings)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={settings.apiKey}
                onChange={(e) => handleChange("apiKey", e.target.value)}
                type="password"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => handleChange("notificationsEnabled", checked)}
              />
              <Label htmlFor="notifications">Enable Notifications</Label>
            </div>
            <div>
              <Label htmlFor="dataRetention">Data Retention (days)</Label>
              <Input
                id="dataRetention"
                type="number"
                value={settings.dataRetentionDays}
                onChange={(e) => handleChange("dataRetentionDays", Number.parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="predictionThreshold">Prediction Confidence Threshold (%)</Label>
              <Input
                id="predictionThreshold"
                type="number"
                value={settings.predictionThreshold}
                onChange={(e) => handleChange("predictionThreshold", Number.parseInt(e.target.value))}
              />
            </div>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

