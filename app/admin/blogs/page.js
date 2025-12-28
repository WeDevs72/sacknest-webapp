'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from "next/dynamic"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sparkles, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

// ⭐ Load Markdown Editor (SSR Safe)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false
})

export default function AdminBlogsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    contentMarkdown: '',
    published: false,
    seoTitle: '',
    seoDescription: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchBlogs(token)
  }, [])

  const fetchBlogs = async (token) => {
    try {
      const response = await fetch('/api/blogs?published=false', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (Array.isArray(data)) setBlogs(data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingBlog(null)
    setFormData({
      title: '',
      slug: '',
      contentMarkdown: '',
      published: false,
      seoTitle: '',
      seoDescription: ''
    })
    setShowDialog(true)
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      slug: blog.slug,
      contentMarkdown: blog.contentMarkdown,
      published: blog.published,
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || ''
    })
    setShowDialog(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('adminToken')

    try {
      const url = editingBlog 
        ? `/api/admin/blogs/${editingBlog.id}`
        : '/api/admin/blogs'
      
      const method = editingBlog ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingBlog ? 'Blog updated' : 'Blog created'
        })
        setShowDialog(false)
        fetchBlogs(token)
      } else {
        throw new Error('Failed to save blog')
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
    if (!confirm('Are you sure you want to delete this blog?')) return
    const token = localStorage.getItem('adminToken')

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        toast({ title: "Deleted", description: 'Blog deleted successfully' })
        fetchBlogs(token)
      }
    } catch {
      toast({
        title: "Error",
        description: 'Failed to delete blog',
        variant: "destructive"
      })
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
              <span className="font-bold">Manage Blogs</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Blog Posts</h1>
          <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-600 to-indigo-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Blog
          </Button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <Card key={blog.id} className="border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant={blog.published ? "default" : "secondary"}>
                      {blog.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold mb-2">{blog.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    /{blog.slug}
                  </p>

                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(blog)} size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(blog.id)} size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog' : 'Create Blog'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value
                  setFormData({
                    ...formData,
                    title,
                    slug: title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '')
                  })
                }}
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                required
              />
            </div>

            {/* Markdown Editor */}
            <div>
              <label className="block text-sm font-medium mb-1">Content (Markdown) *</label>

              <div data-color-mode="light" className="border rounded">
                <MDEditor
                  value={formData.contentMarkdown}
                  height={400}
                  onChange={(val) =>
                    setFormData({ ...formData, contentMarkdown: val || "" })
                  }
                />
              </div>
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({...formData, published: e.target.checked})}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium">Publish immediately</label>
            </div>

            {/* SEO Fields */}
            <div>
              <label className="block text-sm font-medium mb-1">SEO Title</label>
              <Input
                value={formData.seoTitle}
                onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">SEO Description</label>
              <Input
                value={formData.seoDescription}
                onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600">
              {editingBlog ? 'Update' : 'Create'} Blog
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
