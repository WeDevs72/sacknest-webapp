'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Lock, Mail } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminEmail', data.admin.email)
        
        toast({
          title: "Login Successful",
          description: "Redirecting to dashboard..."
        })

        setTimeout(() => {
          router.push('/admin/dashboard')
        }, 1000)
      } else {
        // Check if it's a database configuration issue
        if (data.message && data.message.includes('Database not configured')) {
          toast({
            title: "⚠️ Database Not Configured",
            description: "Please configure Supabase credentials in .env file. See SUPABASE_SETUP.md for instructions.",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Login Failed",
            description: data.error || 'Invalid credentials',
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      toast({
        title: "⚠️ Database Not Configured",
        description: "Please configure Supabase credentials. See SUPABASE_SETUP.md for setup instructions.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">SackNest</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Admin Panel</p>
        </div>

        <Card className="border-purple-200 dark:border-purple-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                size="lg"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            {/* <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                <strong>Default Credentials:</strong><br />
                Email: admin@sacknest.com<br />
                Password: admin123<br />
                <span className="text-xs text-red-600 dark:text-red-400">Change these immediately!</span>
              </p>
            </div> */}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
