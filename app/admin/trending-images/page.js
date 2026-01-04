"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, Plus, Edit, Trash2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminTrendingImagesPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  const [showDialog, setShowDialog] = useState(false)
  const [editingImage, setEditingImage] = useState(null)

  const [formData, setFormData] = useState({
    title: "",
    promptText: "",
    aiToolName: "",
    aiToolUrl: "",
    image: null
  })

  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }

    fetchImages(token)
  }, [])

  const fetchImages = async (token) => {
    try {
      const res = await fetch("/api/trending-ai-images")
      const data = await res.json()
      if (Array.isArray(data)) setImages(data)
    } catch {
      console.log("Error fetching")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingImage(null)
    setFormData({
      title: "",
      promptText: "",
      aiToolName: "",
      aiToolUrl: "",
      image: null
    })
    setShowDialog(true)
  }

  const handleEdit = (img) => {
    setEditingImage(img)
    setFormData({
      title: img.title || "",
      promptText: img.promptText || "",
      aiToolName: img.aiToolName || "",
      aiToolUrl: img.aiToolUrl || "",
      image: null
    })
    setShowDialog(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Delete this trending image?")) return

    const token = localStorage.getItem("adminToken")

    try {
      const res = await fetch(`/api/admin/trending-ai-images/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        toast({ title: "Deleted", description: "Trending image removed" })
        fetchImages(token)
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete",
        variant: "destructive"
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("adminToken")
    setUploading(true)

    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("promptText", formData.promptText)
      data.append("aiToolName", formData.aiToolName)
      data.append("aiToolUrl", formData.aiToolUrl)

      if (formData.image) data.append("image", formData.image)

      const url = editingImage
        ? `/api/admin/trending-ai-images/${editingImage.id}`
        : `/api/admin/trending-ai-images`

      const res = await fetch(url, {
        method: editingImage ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data
      })

      if (!res.ok) throw new Error("Failed to save")

      toast({
        title: editingImage ? "Updated" : "Created",
        description: "Trending image saved successfully"
      })

      setShowDialog(false)
      fetchImages(token)
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-purple-200 dark:border-purple-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-bold">Trending AI Images</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Trending Images</h1>

          <Button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Trending Image
          </Button>
        </div>

        {/* Grid */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {images.map((img) => (
              <Card key={img.id} className="border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <img src={img.imageUrl} className="w-full h-48 object-cover rounded mb-3" />
                  <h3 className="font-bold text-lg">{img.title}</h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {img.promptText}
                  </p>

                  <div className="mt-2">
                    <Badge>{img.aiToolName}</Badge>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(img)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>

                    <Button size="sm" variant="destructive" onClick={() => handleDelete(img.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingImage ? "Edit Trending Image" : "Add Trending Image"}
            </DialogTitle>
          </DialogHeader>

          {editingImage && (
            <img
              src={editingImage.imageUrl}
              className="w-full h-52 object-cover rounded mb-3"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Prompt *</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={4}
                value={formData.promptText}
                onChange={(e) =>
                  setFormData({ ...formData, promptText: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>AI Tool Name *</label>
              <Input
                value={formData.aiToolName}
                onChange={(e) =>
                  setFormData({ ...formData, aiToolName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>AI Tool URL</label>
              <Input
                value={formData.aiToolUrl}
                onChange={(e) =>
                  setFormData({ ...formData, aiToolUrl: e.target.value })
                }
              />
            </div>

            <div>
              <label>Upload Image {editingImage ? "(optional)" : "*"}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files?.[0] })
                }
                className="w-full"
                required={!editingImage}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              {uploading ? "Saving..." : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
