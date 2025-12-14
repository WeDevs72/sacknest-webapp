'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchOrders(token)
  }, [])

  const fetchOrders = async (token) => {
    try {
      const response = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      'paid': 'default',
      'created': 'secondary',
      'failed': 'destructive'
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const totalRevenue = orders
    .filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + parseFloat(o.amount), 0)

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
              <span className="font-bold">Orders</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Orders</h1>
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
                <div className="text-3xl font-bold">{orders.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">Paid Orders</div>
                <div className="text-3xl font-bold">{orders.filter(o => o.status === 'paid').length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
                <div className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No orders yet. Orders will appear here when customers make purchases.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold">Order ID</th>
                      <th className="text-left p-4 font-semibold">Customer</th>
                      <th className="text-left p-4 font-semibold">Amount</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}>
                        <td className="p-4 font-mono text-xs">{order.razorpayOrderId}</td>
                        <td className="p-4 text-sm">{order.customerEmail}</td>
                        <td className="p-4 font-semibold">
                          {order.currency === 'INR' ? '₹' : '$'}{parseFloat(order.amount).toFixed(2)}
                        </td>
                        <td className="p-4">{getStatusBadge(order.status)}</td>
                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
