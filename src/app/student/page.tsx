'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, Clock, BookOpen, Users, Bell, CheckCircle, XCircle, AlertCircle, GraduationCap, TrendingUp, Award } from 'lucide-react'

interface Class {
  id: string
  subject: string
  teacher: string
  time: string
  room: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'missed'
}

interface Notice {
  id: string
  title: string
  content: string
  date: string
  priority: 'high' | 'medium' | 'low'
  read: boolean
}

const mockClasses: Class[] = [
  {
    id: '1',
    subject: 'Computer Science 101',
    teacher: 'Dr. Smith',
    time: '09:00 - 10:30',
    room: 'Room 201',
    status: 'completed'
  },
  {
    id: '2',
    subject: 'Mathematics',
    teacher: 'Prof. Davis',
    time: '11:00 - 12:30',
    room: 'Room 105',
    status: 'ongoing'
  },
  {
    id: '3',
    subject: 'Physics Lab',
    teacher: 'Dr. Wilson',
    time: '14:00 - 16:00',
    room: 'Lab 301',
    status: 'upcoming'
  },
  {
    id: '4',
    subject: 'English Literature',
    teacher: 'Ms. Johnson',
    time: '16:30 - 18:00',
    room: 'Room 150',
    status: 'upcoming'
  }
]

const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Assignment Deadline Extended',
    content: 'The Computer Science assignment deadline has been extended to next Friday.',
    date: '2024-03-10',
    priority: 'high',
    read: false
  },
  {
    id: '2',
    title: 'Library Hours Update',
    content: 'Library will be open until 10 PM starting next week.',
    date: '2024-03-09',
    priority: 'medium',
    read: true
  },
  {
    id: '3',
    title: 'Campus Event: Tech Talk',
    content: 'Join us for an exciting tech talk by industry experts this Friday.',
    date: '2024-03-08',
    priority: 'low',
    read: true
  }
]

export default function StudentDashboard() {
  const [notices, setNotices] = useState<Notice[]>(mockNotices)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'ongoing':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'upcoming':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'missed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border border-green-200/50'
      case 'ongoing':
        return 'bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-700 border border-blue-200/50'
      case 'upcoming':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 border border-yellow-200/50'
      case 'missed':
        return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 border border-red-200/50'
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 border border-gray-200/50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 border border-red-200/50'
      case 'medium':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 border border-yellow-200/50'
      case 'low':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border border-green-200/50'
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 border border-gray-200/50'
    }
  }

  const markNoticeAsRead = (noticeId: string) => {
    setNotices(notices.map(notice => 
      notice.id === noticeId ? { ...notice, read: true } : notice
    ))
  }

  const unreadNotices = notices.filter(notice => !notice.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50">
      {/* Header */}
      <div className="glass-card border-white/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white font-semibold">
                  JS
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Welcome, John Student
                </h1>
                <p className="text-sm text-slate-600 dark:text-muted-foreground font-mono">Student ID: STU2024001</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative p-2 glass-card border-white/20 rounded-xl hover-lift">
                <Bell className="h-5 w-5 text-slate-600 dark:text-muted-foreground" />
                {unreadNotices > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                    {unreadNotices}
                  </span>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="glass-card border-white/20 hover:bg-white/60 hover-lift"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-white/20 shadow-xl animate-slide-up">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl mr-3 shadow-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-2xl font-semibold text-foreground">Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClasses.map((classItem, index) => (
                    <div
                      key={classItem.id}
                      className="group p-5 bg-white/40 backdrop-blur-sm rounded-2xl hover:bg-white/60 transition-all duration-200 border border-white/20 hover-lift"
                      style={{animationDelay: `${index * 100}ms`}}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl shadow-lg">
                            {getStatusIcon(classItem.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors text-lg">
                              {classItem.subject}
                            </h3>
                            <p className="text-slate-600 dark:text-muted-foreground font-medium">{classItem.teacher}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm text-slate-600 dark:text-muted-foreground flex items-center bg-white/50 px-2 py-1 rounded-lg">
                                <Clock className="h-3 w-3 mr-1" />
                                {classItem.time}
                              </span>
                              <span className="text-sm text-slate-600 dark:text-muted-foreground bg-white/50 px-2 py-1 rounded-lg">
                                {classItem.room}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(classItem.status)} px-3 py-1 rounded-full font-medium`}>
                          {classItem.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="glass-card border-white/20 shadow-xl hover-lift animate-slide-up" style={{animationDelay: '100ms'}}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl shadow-lg">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-muted-foreground">Total Courses</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">6</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20 shadow-xl hover-lift animate-slide-up" style={{animationDelay: '200ms'}}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-muted-foreground">Attendance Rate</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">94%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/20 shadow-xl hover-lift animate-slide-up" style={{animationDelay: '300ms'}}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-600 dark:text-muted-foreground">Class Rank</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">12/45</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Notices & Announcements */}
          <div>
            <Card className="glass-card border-white/20 shadow-xl animate-slide-up" style={{animationDelay: '400ms'}}>
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mr-3 shadow-lg">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-foreground">Notices</span>
                  </div>
                  {unreadNotices > 0 && (
                    <Badge className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 border border-red-200/50 px-3 py-1 rounded-full">
                      {unreadNotices} new
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notices.map((notice, index) => (
                    <div
                      key={notice.id}
                      className={`group p-5 rounded-2xl cursor-pointer transition-all duration-200 hover-lift ${
                        !notice.read 
                          ? 'bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-200/50 hover:from-blue-500/20 hover:to-violet-500/20' 
                          : 'bg-white/40 backdrop-blur-sm border border-white/20 hover:bg-white/60'
                      }`}
                      onClick={() => markNoticeAsRead(notice.id)}
                      style={{animationDelay: `${(index + 5) * 100}ms`}}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className={`font-semibold text-lg group-hover:text-blue-600 transition-colors ${
                              !notice.read ? 'text-blue-700' : 'text-foreground'
                            }`}>
                              {notice.title}
                            </h4>
                            {!notice.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-slate-600 dark:text-muted-foreground leading-relaxed mb-3">
                            {notice.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-600 dark:text-muted-foreground bg-white/50 px-2 py-1 rounded-lg">
                              {new Date(notice.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <Badge className={`${getPriorityColor(notice.priority)} text-xs px-2 py-1 rounded-full font-medium`}>
                              {notice.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}