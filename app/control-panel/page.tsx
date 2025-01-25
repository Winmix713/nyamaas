"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ControlPanelPage() {
  const [systemStatus, setSystemStatus] = useState("Connected")
  const [modelVersion, setModelVersion] = useState("v2.3")
  const [accuracy, setAccuracy] = useState(78)
  const [isTraining, setIsTraining] = useState(false)
  const [predictionSettings, setPredictionSettings] = useState({
    useHistoricalData: true,
    usePlayerStats: true,
    useWeatherData: false,
    confidenceThreshold: 70,
    maxPredictions: 10,
  })
  const [selectedDataSource, setSelectedDataSource] = useState("api")
  const [alertMessage, setAlertMessage] = useState(null)

  const handleSettingChange = (setting, value) => {
    setPredictionSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handleModelRetrain = async () => {
    setIsTraining(true)
    // Simulating API call for model retraining
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsTraining(false)
    setAccuracy(Math.floor(Math.random() * (85 - 75 + 1) + 75))
    setAlertMessage({ type: "success", message: "Model successfully retrained!" })
  }

  const handleDataSourceChange = (source) => {
    setSelectedDataSource(source)
    setAlertMessage({ type: "info", message: `Data source changed to ${source.toUpperCase()}` })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Control Panel</h1>

      {alertMessage && (
        <Alert variant={alertMessage.type === "success" ? "default" : "destructive"} className="mb-6">
          {alertMessage.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{alertMessage.type === "success" ? "Success" : "Info"}</AlertTitle>
          <AlertDescription>{alertMessage.message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system">System Status</TabsTrigger>
          <TabsTrigger value="model">Prediction Model</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Database Status: {systemStatus}</p>
                <p>Last Update: {new Date().toLocaleString()}</p>
                <p>Active Users: 1,234</p>
                <Button onClick={() => setSystemStatus("Reconnecting...")}>Refresh Status</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p>Current Model: {modelVersion}</p>
                  <p>Accuracy: {accuracy}%</p>
                </div>
                <Button onClick={handleModelRetrain} disabled={isTraining}>
                  {isTraining ? "Retraining..." : "Retrain Model"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="historical-data">Use Historical Data</Label>
                  <Switch
                    id="historical-data"
                    checked={predictionSettings.useHistoricalData}
                    onCheckedChange={(checked) => handleSettingChange("useHistoricalData", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="player-stats">Use Player Statistics</Label>
                  <Switch
                    id="player-stats"
                    checked={predictionSettings.usePlayerStats}
                    onCheckedChange={(checked) => handleSettingChange("usePlayerStats", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="weather-data">Use Weather Data</Label>
                  <Switch
                    id="weather-data"
                    checked={predictionSettings.useWeatherData}
                    onCheckedChange={(checked) => handleSettingChange("useWeatherData", checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                  <Slider
                    id="confidence-threshold"
                    min={0}
                    max={100}
                    step={1}
                    value={[predictionSettings.confidenceThreshold]}
                    onValueChange={([value]) => handleSettingChange("confidenceThreshold", value)}
                  />
                  <p className="text-sm text-muted-foreground">Current: {predictionSettings.confidenceThreshold}%</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-predictions">Max Predictions</Label>
                  <Input
                    id="max-predictions"
                    type="number"
                    value={predictionSettings.maxPredictions}
                    onChange={(e) => handleSettingChange("maxPredictions", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="data-source">Data Source</Label>
                  <Select value={selectedDataSource} onValueChange={handleDataSourceChange}>
                    <SelectTrigger id="data-source">
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="csv">CSV Upload</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="backup">Backup Database</Label>
                  <div className="flex mt-1">
                    <Input id="backup" placeholder="Backup name" />
                    <Button className="ml-2">Backup</Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="restore">Restore Database</Label>
                  <div className="flex mt-1">
                    <Input id="restore" type="file" />
                    <Button className="ml-2">Restore</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

