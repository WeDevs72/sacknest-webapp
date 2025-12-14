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

export default function AdminPromptsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    promptText: '',
    exampleOutput: '',
    exampleImageUrl: '',
    isPremium: false,
    seoTitle: '',
    seoDescription: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchPrompts(token)
  }, [])

  const fetchPrompts = async (token) => {
    try {
      const response = await fetch('/api/prompts', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setPrompts(data)
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPrompt(null)
    setFormData({
      title: '',
      category: '',
      tags: '',
      promptText: '',
      exampleOutput: '',
      exampleImageUrl: '',
      isPremium: false,
      seoTitle: '',
      seoDescription: ''
    })
    setShowDialog(true)
  }

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt)
    setFormData({
      title: prompt.title,
      category: prompt.category,
      tags: Array.isArray(prompt.tags) ? prompt.tags.join(', ') : '',
      promptText: prompt.promptText,
      exampleOutput: prompt.exampleOutput || '',
      exampleImageUrl: prompt.exampleImageUrl || '',
      isPremium: prompt.isPremium,
      seoTitle: prompt.seoTitle || '',
      seoDescription: prompt.seoDescription || ''
    })
    setShowDialog(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('adminToken')

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    }

    try {
      const url = editingPrompt 
        ? `/api/admin/prompts/${editingPrompt.id}`
        : '/api/admin/prompts'
      
      const method = editingPrompt ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: editingPrompt ? 'Prompt updated' : 'Prompt created'
        })
        setShowDialog(false)
        fetchPrompts(token)
      } else {
        throw new Error('Failed to save prompt')
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
    if (!confirm('Are you sure you want to delete this prompt?')) return

    const token = localStorage.getItem('adminToken')
    try {
      const response = await fetch(`/api/admin/prompts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        toast({ title: \"Deleted\", description: 'Prompt deleted successfully' })
        fetchPrompts(token)
      }
    } catch (error) {
      toast({
        title: \"Error\",
        description: 'Failed to delete prompt',
        variant: \"destructive\"
      })
    }
  }

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20\">
      <header className=\"bg-white dark:bg-gray-900 border-b border-purple-200 dark:border-purple-800 sticky top-0 z-50\">
        <div className=\"container mx-auto px-4 py-4\">
          <div className=\"flex items-center justify-between\">
            <Link href=\"/admin/dashboard\" className=\"flex items-center space-x-2\">
              <ArrowLeft className=\"w-5 h-5\" />
              <span>Back to Dashboard</span>
            </Link>
            <div className=\"flex items-center space-x-2\">
              <Sparkles className=\"w-5 h-5 text-purple-600\" />
              <span className=\"font-bold\">Manage Prompts</span>
            </div>
          </div>
        </div>
      </header>

      <div className=\"container mx-auto px-4 py-8\">
        <div className=\"flex items-center justify-between mb-8\">
          <h1 className=\"text-4xl font-bold\">Prompts</h1>
          <Button onClick={handleCreate} className=\"bg-gradient-to-r from-purple-600 to-indigo-600\">
            <Plus className=\"w-4 h-4 mr-2\" />
            Create Prompt
          </Button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className=\"grid md:grid-cols-2 lg:grid-cols-3 gap-6\">
            {prompts.map((prompt) => (
              <Card key={prompt.id} className=\"border-purple-200 dark:border-purple-800\">
                <CardContent className=\"p-6\">
                  <div className=\"flex items-start justify-between mb-3\">
                    <Badge variant=\"secondary\">{prompt.category}</Badge>
                    {prompt.isPremium && <Badge className=\"bg-amber-500\">Premium</Badge>}
                  </div>
                  <h3 className=\"text-lg font-bold mb-2 line-clamp-2\">{prompt.title}</h3>
                  <p className=\"text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4\">
                    {prompt.promptText}
                  </p>
                  <div className=\"flex gap-2\">
                    <Button onClick={() => handleEdit(prompt)} size=\"sm\" variant=\"outline\">
                      <Edit className=\"w-4 h-4 mr-1\" />
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(prompt.id)} size=\"sm\" variant=\"destructive\">
                      <Trash2 className=\"w-4 h-4\" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className=\"max-w-2xl max-h-[90vh] overflow-y-auto\">
          <DialogHeader>
            <DialogTitle>{editingPrompt ? 'Edit Prompt' : 'Create Prompt'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className=\"space-y-4\">
            <div>
              <label className=\"block text-sm font-medium mb-1\">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className=\"block text-sm font-medium mb-1\">Category *</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              />
            </div>
            <div>
              <label className=\"block text-sm font-medium mb-1\">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder=\"ai, content, instagram\"
              />
            </div>
            <div>
              <label className=\"block text-sm font-medium mb-1\">Prompt Text *</label>
              <textarea
                value={formData.promptText}
                onChange={(e) => setFormData({...formData, promptText: e.target.value})}
                required
                rows={6}
                className=\"w-full p-2 border rounded\"
              />
            </div>
            <div>
              <label className=\"block text-sm font-medium mb-1\">Example Output</label>
              <textarea
                value={formData.exampleOutput}
                onChange={(e) => setFormData({...formData, exampleOutput: e.target.value})}
                rows={4}
                className=\"w-full p-2 border rounded\"
              />
            </div>
            <div>
              <label className=\"block text-sm font-medium mb-1\">Example Image URL</label>
              <Input
                value={formData.exampleImageUrl}
                onChange={(e) => setFormData({...formData, exampleImageUrl: e.target.value})}
                placeholder=\"https://example.com/image.jpg\"
              />
            </div>
            <div className=\"flex items-center gap-2\">
              <input
                type=\"checkbox\"
                checked={formData.isPremium}
                onChange={(e) => setFormData({...formData, isPremium: e.target.checked})}
                className=\"w-4 h-4\"
              />
              <label className=\"text-sm font-medium\">Premium Prompt</label>
            </div>
            <div>
              <label className=\"block text-sm font-medium mb-1\">SEO Title</label>
              <Input
                value={formData.seoTitle}
                onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
              />
            </div>
            <div>
              <label className=\"block text-sm font-medium mb-1\">SEO Description</label>
              <Input
                value={formData.seoDescription}
                onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
              />
            </div>
            <Button type=\"submit\" className=\"w-full bg-gradient-to-r from-purple-600 to-indigo-600\">
              {editingPrompt ? 'Update' : 'Create'} Prompt
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
