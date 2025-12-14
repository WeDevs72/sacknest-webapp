'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, FileText, DollarSign, Mail, Package, LogOut, Users } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    prompts: 0,
    blogs: 0,
    packs: 0,
    leads: 0,
    orders: 0
  })
  const [adminEmail, setAdminEmail] = useState('')

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    const email = localStorage.getItem('adminEmail')
    
    if (!token) {
      router.push('/admin/login')
      return
    }

    setAdminEmail(email || '')
    fetchStats(token)
  }, [])

  const fetchStats = async (token) => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      
      const [promptsRes, blogsRes, packsRes, leadsRes, ordersRes] = await Promise.all([
        fetch('/api/prompts', { headers }),
        fetch('/api/blogs?published=false', { headers }),
        fetch('/api/premium-packs?enabled=false', { headers }),
        fetch('/api/admin/email-leads', { headers }),
        fetch('/api/admin/orders', { headers })
      ])

      const prompts = await promptsRes.json()
      const blogs = await blogsRes.json()
      const packs = await packsRes.json()
      const leads = await leadsRes.json()
      const orders = await ordersRes.json()

      setStats({
        prompts: Array.isArray(prompts) ? prompts.length : 0,
        blogs: Array.isArray(blogs) ? blogs.length : 0,
        packs: Array.isArray(packs) ? packs.length : 0,
        leads: Array.isArray(leads) ? leads.length : 0,
        orders: Array.isArray(orders) ? orders.length : 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-purple-200 dark:border-purple-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">SackNest Admin</span>
                <p className="text-xs text-gray-500">{adminEmail}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.prompts}</div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Blog Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.blogs}</div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Premium Packs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.packs}</div>
                <Package className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Email Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.leads}</div>
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/prompts">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <FileText className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Manage Prompts</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Create, edit, and delete prompts</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/blogs">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <FileText className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Manage Blogs</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Write and publish blog posts</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/premium-packs">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-amber-200 dark:border-amber-800">
              <CardContent className="p-6">
                <Package className="w-12 h-12 text-amber-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Premium Packs</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Manage premium offerings</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/email-leads">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <Mail className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Leads</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">View and export email subscribers</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-indigo-200 dark:border-indigo-800">
              <CardContent className="p-6">
                <DollarSign className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Orders</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">View payment history</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/email-leads">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <Mail className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Email Leads</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">View and export subscribers</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-indigo-200 dark:border-indigo-800">
              <CardContent className="p-6">
                <DollarSign className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">Orders</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">View payment history</p>
              </CardContent>
            </Card>
          </Link>

          <a href="/" target="_blank">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-gray-600 mb-4" />
                <h3 className="text-xl font-bold mb-2">View Live Site</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Open public website</p>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </div>
  )
}
