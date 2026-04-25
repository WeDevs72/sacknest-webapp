"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Settings, FileType } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState(null)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
  }, [router])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    const token = localStorage.getItem("adminToken")
    
    try {
      const data = new FormData()
      data.append("pdf", file)

      const res = await fetch("/api/admin/settings/pdf", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data
      })

      const resData = await res.json()

      if (!res.ok) throw new Error(resData.error || "Failed to upload")

      toast({
        title: "Success",
        description: "PDF uploaded successfully!"
      })
      
      setCurrentUrl(resData.url)
      setFile(null)
      e.target.reset()
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="font-bold">Site Settings</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <Card className="border-2 border-black shadow-[4px_4px_0_0_#000]">
          <CardContent className="p-8">
            <h2 className="text-2xl font-black mb-6 uppercase flex items-center">
              <FileType className="mr-2" />
              Free Prompts PDF
            </h2>
            
            <p className="text-gray-600 mb-6 font-bold">
              Upload the PDF document that will be automatically emailed to users when they join the mailing list on the homepage.
            </p>

            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="border-2 border-black p-2 h-auto"
                  required
                />
              </div>

              {currentUrl && (
                <div className="p-4 bg-green-50 border-2 border-green-600 rounded text-green-800 font-bold break-all">
                  Successfully uploaded new PDF!
                </div>
              )}

              <Button 
                type="submit" 
                disabled={uploading || !file}
                className="w-full h-14 text-lg font-black uppercase border-2 border-black bg-yellow-400 hover:bg-yellow-300 text-black shadow-[4px_4px_0_0_#000]"
              >
                {uploading ? "Uploading..." : "Upload New PDF"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
