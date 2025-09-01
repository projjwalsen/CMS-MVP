'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Loader2, GraduationCap, Shield, BookOpen, Users } from 'lucide-react'
import { toast } from 'sonner'

// Demo credentials
const demoCredentials = {
  admin: { username: 'admin', password: 'admin123', role: 'admin' },
  teacher: { username: 'teacher', password: 'teacher123', role: 'teacher' },
  student: { username: 'student', password: 'student123', role: 'student' }
}

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password || !selectedRole) {
      toast.error('Please fill in all fields')
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const credentials = demoCredentials[selectedRole as keyof typeof demoCredentials]
      
      if (credentials && username === credentials.username && password === credentials.password) {
        toast.success(`Welcome ${selectedRole}!`)
        
        // Redirect based on role
        if (selectedRole === 'admin') {
          router.push('/admin')
        } else if (selectedRole === 'teacher') {
          router.push('/teacher')
        } else {
          router.push('/student')
        }
      } else {
        toast.error('Invalid credentials')
      }
      
      setIsLoading(false)
    }, 1500)
  }

  const fillDemoCredentials = (role: string) => {
    const credentials = demoCredentials[role as keyof typeof demoCredentials]
    if (credentials) {
      setUsername(credentials.username)
      setPassword(credentials.password)
      setSelectedRole(role)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-2xl mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-text mb-2">Welcome Back</h1>
          <p className="text-muted font-light">Sign in to College MVP</p>
        </div>

        {/* Main Login Card */}
        <Card className="card border-stroke shadow-2xl">
          <CardHeader className="space-y-4 pb-6">
            <CardTitle className="text-xl font-medium text-center text-text">Choose Your Role</CardTitle>
            <CardDescription className="text-center text-muted font-light">
              Select your role and enter demo credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { role: 'admin', icon: Shield, label: 'Admin' },
                { role: 'teacher', icon: Users, label: 'Teacher' },
                { role: 'student', icon: BookOpen, label: 'Student' }
              ].map(({ role, icon: Icon, label }) => (
                <button
                  key={role}
                  onClick={() => fillDemoCredentials(role)}
                  className={`p-4 rounded-md border-2 transition-all duration-200 ${
                    selectedRole === role
                      ? 'border-primary bg-primary-tint text-primary shadow-lg'
                      : 'border-stroke bg-panel hover:bg-primary-tint text-muted hover:text-primary'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs font-medium">{label}</p>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="role" className="text-sm font-medium text-text">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="input h-12">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="card border-stroke">
                    <SelectItem value="admin" className="rounded-md">👑 Admin</SelectItem>
                    <SelectItem value="teacher" className="rounded-md">👨‍🏫 Teacher</SelectItem>
                    <SelectItem value="student" className="rounded-md">🎓 Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-medium text-text">Username</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input pl-12 h-12"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-text">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input h-12"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary text-white rounded-md py-3 h-12 font-medium shadow-lg transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Info */}
        <Card className="card border-stroke">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-text text-center mb-3">Demo Credentials</p>
            <div className="space-y-2 text-xs text-muted">
              <div className="flex justify-between items-center p-2 rounded-md bg-panel">
                <span className="font-medium">👑 Admin:</span>
                <span className="font-mono">admin / admin123</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-panel">
                <span className="font-medium">👨‍🏫 Teacher:</span>
                <span className="font-mono">teacher / teacher123</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-md bg-panel">
                <span className="font-medium">🎓 Student:</span>
                <span className="font-mono">student / student123</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}