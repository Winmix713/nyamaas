import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MatchesUploadProps {
  onUpload: (matches: any[]) => void
}

export function MatchesUpload({ onUpload }: MatchesUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setError(null)
    } else {
      setFile(null)
      setError("Please select a valid CSV file.")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.")
      return
    }

    try {
      const text = await file.text()
      const rows = text.split("\n").map((row) => row.split(","))
      const headers = rows[0]
      const matches = rows.slice(1).map((row) => {
        const match: { [key: string]: string } = {}
        headers.forEach((header, index) => {
          match[header.trim()] = row[index].trim()
        })
        return match
      })
      onUpload(matches)
      setFile(null)
      setError(null)
    } catch (err) {
      setError("Error processing the file. Please try again.")
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="csv-upload">Upload CSV File</Label>
        <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={handleUpload} disabled={!file}>
        Upload Matches
      </Button>
    </div>
  )
}

