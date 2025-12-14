'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sparkles, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function AdminPremiumPacksPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [packs, setPacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingPack, setEditingPack] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceInr: '',
    priceUsd: '',
    fileUrl: '',
    enabled: true
  })
  const [uploadingFile, setUploadingFile] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchPacks(token)
  }, [])

  const fetchPacks = async (token) => {
    try {
      const response = await fetch('/api/premium-packs?enabled=false', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setPacks(data)
      }
    } catch (error) {
      console.error('Error fetching packs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPack(null)
    setFormData({
      name: '',
      description: '',
      priceInr: '',
      priceUsd: '',
      fileUrl: '',
      enabled: true
    })
    setShowDialog(true)
  }

  const handleEdit = (pack) => {
    setEditingPack(pack)
    setFormData({
      name: pack.name,
      description: pack.description || '',
      priceInr: pack.priceInr,
      priceUsd: pack.priceUsd,
      fileUrl: pack.fileUrl || '',
      enabled: pack.enabled
    })
    setShowDialog(true)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('zip')) {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF or ZIP file",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 50MB",
        variant: "destructive"
      })
      return
    }

    setSelectedFile(file)
    setUploadingFile(true)

    try {
      const token = localStorage.getItem('adminToken')
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('packId', editingPack?.id || 'new_' + Date.now())

      const response = await fetch('/api/upload-pack-file', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      
      // Update fileUrl with the uploaded file URL
      setFormData({...formData, fileUrl: data.fileUrl})
      
      toast({
        title: "Upload Successful",
        description: `${file.name} uploaded successfully`
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('adminToken')

    try {
      const url = editingPack 
        ? `/api/admin/premium-packs/${editingPack.id}`
        : '/api/admin/premium-packs'
      
      const method = editingPack ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          priceInr: parseFloat(formData.priceInr),
          priceUsd: parseFloat(formData.priceUsd)
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingPack ? 'Pack updated' : 'Pack created'
        })
        setShowDialog(false)
        setSelectedFile(null)
        fetchPacks(token)
      } else {
        throw new Error('Failed to save pack')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this pack?')) return

    const token = localStorage.getItem('adminToken')
    try {
      const response = await fetch(`/api/admin/premium-packs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        toast({ title: "Deleted", description: 'Pack deleted successfully' })
        fetchPacks(token)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to delete pack',
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      <header className="bg-white dark:bg-gray-900 border-b border-purple-200 dark:border-purple-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-bold">Manage Premium Packs</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Premium Packs</h1>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Pack
          </Button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {packs.map((pack) => (
              <Card key={pack.id} className="border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={pack.enabled ? "default" : "secondary"}>
                      {pack.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{pack.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {pack.description}
                  </p>
                  <div className="mb-4">
                    <div className="text-2xl font-bold">₹{pack.priceInr}</div>
                    <div className="text-sm text-gray-500">${pack.priceUsd}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(pack)} size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(pack.id)} size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPack ? 'Edit Pack' : 'Create Pack'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pack Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price (INR) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.priceInr}
                  onChange={(e) => setFormData({...formData, priceInr: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (USD) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.priceUsd}
                  onChange={(e) => setFormData({...formData, priceUsd: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Upload Premium Content File</label>
              
              {/* File Upload Button */}
              <div className="mb-3">
                <input
                  type="file"
                  accept=".pdf,.zip"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`inline-flex items-center px-4 py-2 border border-purple-600 rounded-md cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition ${
                    uploadingFile ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingFile ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {selectedFile ? 'Change File' : 'Upload PDF/ZIP'}
                    </>
                  )}
                </label>
                {selectedFile && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    ✓ {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Supports PDF and ZIP files up to 50MB
                </p>
              </div>

              {/* Generated URL Display */}
              <div>
                <label className="block text-sm font-medium mb-1">Generated Download URL</label>
                <Input
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                  placeholder="URL will be generated after file upload"
                  readOnly={uploadingFile}
                />
                {formData.fileUrl && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ File URL ready for download
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Enable pack</label>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600">
              {editingPack ? 'Update' : 'Create'} Pack
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
