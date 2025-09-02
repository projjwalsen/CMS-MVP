'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/layout/admin-layout'
import { Users, GraduationCap, Calendar, MessageSquare, Bell, Clock, TrendingUp, TrendingDown, Minus, ArrowRight, Sparkles } from 'lucide-react'
import { format } from 'date-fns'

// Mock data
const kpiData = [
  {
    title: 'Total Students',
    value: '1,247',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Users,
  },
  {
    title: 'Total Teachers',
    value: '89',
    change: '+3%',
    changeType: 'positive' as const,
    icon: GraduationCap,
  },
  {
    title: "Today&apos;s Classes",
    value: '24',
    change: '0%',
    changeType: 'neutral' as const,
    icon: Calendar,
  },
  {
    title: 'Unread Messages',
    value: '7',
    change: '-2',
    changeType: 'negative' as const,
    icon: MessageSquare,
  },
]

const recentNotices = [
  {
    id: 1,
    title: 'Mid-term Examination Schedule Released',
    scope: 'Global',
    createdAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: 2,
    title: 'Library Hours Extended During Exam Period',
    scope: 'Global',
    createdAt: new Date('2024-01-14T14:20:00'),
  },
  {
    id: 3,
    title: 'Computer Science Department Meeting',
    scope: 'Section',
    createdAt: new Date('2024-01-14T09:15:00'),
  },
  {
    id: 4,
    title: 'Student Council Elections Announcement',
    scope: 'Global',
    createdAt: new Date('2024-01-13T16:45:00'),
  },
  {
    id: 5,
    title: 'Mathematics Workshop for First Years',
    scope: 'Student',
    createdAt: new Date('2024-01-13T11:30:00'),
  },
]

function getScopeColor(scope: string) {
  switch (scope) {
    case 'Global':
      return 'bg-primary text-white border border-primary'
    case 'Section':
      return 'bg-secondary text-white border border-secondary'
    case 'Student':
      return 'bg-gradient-to-r from-teal-600/20 to-teal-400/20 text-teal-700 border border-teal-200/50'
    default:
      return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 border border-gray-200/50'
  }
}

function getKpiGradient(index: number) {
  const gradients = [
    'from-teal-500 to-mint-500',
    'from-mint-500 to-emerald-500', 
    'from-teal-600 to-teal-400',
    'from-emerald-500 to-teal-500'
  ]
  return gradients[index % gradients.length]
}

function getTrendIcon(changeType: string) {
  switch (changeType) {
    case 'positive':
      return TrendingUp
    case 'negative':
      return TrendingDown
    default:
      return Minus
  }
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="relative">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-teal-500 to-mint-500 rounded-full" />
            <h1 className="text-4xl font-semibold text-foreground">Dashboard</h1>
            <Sparkles className="w-6 h-6 text-teal-500 animate-pulse" />
          </div>
          <p className="text-slate-700 dark:text-muted-foreground font-light text-lg ml-5">
            Welcome back! Here&apos;s what&apos;s happening at your college today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            const TrendIcon = getTrendIcon(kpi.changeType)
            const gradient = getKpiGradient(index)
            
            return (
              <Card key={kpi.title} className="card border-border/50 shadow-card hover:shadow-card-hover group cursor-pointer animate-slide-up transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
                <CardContent className="p-6 relative overflow-hidden">
                  {/* Background gradient accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-600 dark:text-muted-foreground mb-2">{kpi.title}</p>
                      <p className="text-3xl font-bold text-foreground mb-3">{kpi.value}</p>
                      <div className="flex items-center space-x-2">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          kpi.changeType === 'positive' ? 'bg-green-100/80 text-green-700' :
                          kpi.changeType === 'negative' ? 'bg-red-100/80 text-red-700' :
                          'bg-gray-100/80 text-gray-700'
                        }`}>
                          <TrendIcon className="w-3 h-3" />
                          <span>{kpi.change}</span>
                        </div>
                        <span className="text-xs text-slate-600 dark:text-muted-foreground">vs last month</span>
                      </div>
                    </div>
                    <div className="p-4 bg-primary rounded-2xl shadow-lg drop-shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:drop-shadow-xl transition-all duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Notices */}
        <Card className="card border-border/50 shadow-card animate-slide-up">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold flex items-center text-foreground">
                <div className="p-2 bg-gradient-to-br from-teal-500 to-mint-500 rounded-xl mr-3 shadow-card">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                Recent Notices
              </CardTitle>
              <div className="flex items-center space-x-3">
                <Badge className="bg-gradient-to-r from-teal-500/20 to-mint-500/20 text-teal-700 border border-teal-200/50 rounded-full px-3 py-1">
                  {recentNotices.length} notices
                </Badge>
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-muted-foreground hover:text-foreground">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotices.map((notice, index) => (
                <div
                  key={notice.id}
                  className="group p-5 bg-card/50 backdrop-blur-sm rounded-2xl hover:bg-card/80 transition-all duration-200 cursor-pointer border border-border/30 hover:shadow-card-hover"
                  style={{animationDelay: `${index * 50}ms`}}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-teal-600 transition-colors duration-200 mb-3">
                        {notice.title}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <Badge className={`text-xs rounded-full px-3 py-1 ${getScopeColor(notice.scope)}`}>
                          {notice.scope}
                        </Badge>
                        <div className="flex items-center text-sm text-slate-600 dark:text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          {format(notice.createdAt, 'MMM dd, yyyy • HH:mm')}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600 dark:text-muted-foreground group-hover:text-teal-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}