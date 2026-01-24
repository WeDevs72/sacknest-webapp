'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, FileText, DollarSign, Mail, Package, LogOut, Users, Image } from 'lucide-react'


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
    <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-yellow-300 selection:text-black">
      {/* Header */}
      <header className="bg-white dark:bg-black border-b-2 border-black sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-lg flex items-center justify-center border-2 border-transparent">
                <Sparkles className="w-6 h-6 text-white dark:text-black" />
              </div>
              <div>
                <span className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">SackNest Admin</span>
                <p className="text-xs font-bold text-gray-500">{adminEmail}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-2 border-black font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter text-black dark:text-white">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <CardHeader className="pb-3 border-b-2 border-black bg-gray-50 dark:bg-gray-900 rounded-t-[1.3rem]">
              <CardTitle className="text-sm font-black uppercase text-gray-600 dark:text-gray-400 tracking-wide">Total Prompts</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-4xl font-black">{stats.prompts}</div>
                <FileText className="w-8 h-8 text-black" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <CardHeader className="pb-3 border-b-2 border-black bg-gray-50 dark:bg-gray-900 rounded-t-[1.3rem]">
              <CardTitle className="text-sm font-black uppercase text-gray-600 dark:text-gray-400 tracking-wide">Blog Posts</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-4xl font-black">{stats.blogs}</div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <CardHeader className="pb-3 border-b-2 border-black bg-gray-50 dark:bg-gray-900 rounded-t-[1.3rem]">
              <CardTitle className="text-sm font-black uppercase text-gray-600 dark:text-gray-400 tracking-wide">Premium Packs</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-4xl font-black">{stats.packs}</div>
                <Package className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <CardHeader className="pb-3 border-b-2 border-black bg-gray-50 dark:bg-gray-900 rounded-t-[1.3rem]">
              <CardTitle className="text-sm font-black uppercase text-gray-600 dark:text-gray-400 tracking-wide">Email Leads</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-4xl font-black">{stats.leads}</div>
                <Mail className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-black mb-6 uppercase tracking-tight text-black dark:text-white">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/prompts">
            <Card className="hover:bg-yellow-50 dark:hover:bg-gray-900 cursor-pointer border-2 border-black group transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-black text-white p-3 rounded-xl border-2 border-black group-hover:bg-yellow-400 group-hover:text-black transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-1">Manage Prompts</h3>
                  <p className="text-sm font-bold text-gray-500">Create, edit, and delete prompts</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/blogs">
            <Card className="hover:bg-blue-50 dark:hover:bg-gray-900 cursor-pointer border-2 border-black group transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-black text-white p-3 rounded-xl border-2 border-black group-hover:bg-blue-400 group-hover:text-black transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-1">Manage Blogs</h3>
                  <p className="text-sm font-bold text-gray-500">Write and publish blog posts</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/premium-packs">
            <Card className="hover:bg-amber-50 dark:hover:bg-gray-900 cursor-pointer border-2 border-black group transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-black text-white p-3 rounded-xl border-2 border-black group-hover:bg-amber-400 group-hover:text-black transition-colors">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-1">Premium Packs</h3>
                  <p className="text-sm font-bold text-gray-500">Manage premium offerings</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/trending-images">
            <Card className="hover:bg-pink-50 dark:hover:bg-gray-900 cursor-pointer border-2 border-black group transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-black text-white p-3 rounded-xl border-2 border-black group-hover:bg-pink-400 group-hover:text-black transition-colors">
                  <Image className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-1">Trending Images</h3>
                  <p className="text-sm font-bold text-gray-500">Manage viral AI images</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/email-leads">
            <Card className="hover:bg-green-50 dark:hover:bg-gray-900 cursor-pointer border-2 border-black group transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-black text-white p-3 rounded-xl border-2 border-black group-hover:bg-green-400 group-hover:text-black transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-1">Email Leads</h3>
                  <p className="text-sm font-bold text-gray-500">View and export subscribers</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="hover:bg-indigo-50 dark:hover:bg-gray-900 cursor-pointer border-2 border-black group transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-black text-white p-3 rounded-xl border-2 border-black group-hover:bg-indigo-400 group-hover:text-black transition-colors">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-1">Orders</h3>
                  <p className="text-sm font-bold text-gray-500">View payment history</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <a href="/" target="_blank">
            <Card className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer border-2 border-black group transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-white text-black p-3 rounded-xl border-2 border-black group-hover:bg-black group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase mb-1">View Live Site</h3>
                  <p className="text-sm font-bold text-gray-500">Open public website</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </div>
  )
}
