'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle, Download, Bell, Calendar, ArrowLeft, Sparkles, TrendingUp, Wifi } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

// Mock data for today&apos;s classes
const todaysClasses = [
  {
    id: 1,
    time: '09:00 - 10:30',
    course: 'Data Structures',
    section: 'CS-3A',
    room: 'Room 101',
    status: 'upcoming',
  },
  {
    id: 2,
    time: '11:00 - 12:30',
    course: 'Algorithms',
    section: 'CS-3B',
    room: 'Room 102',
    status: 'current',
  },
  {
    id: 3,
    time: '14:00 - 15:30',
    course: 'Database Systems',
    section: 'CS-2A',
    room: 'Room 103',
    status: 'upcoming',
  },
]

// Mock student roster for current class
const mockStudents: Student[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    rollNumber: 'CS2021001',
    rfidTag: 'RFID001234',
    status: 'present',
    checkInTime: new Date('2024-01-15T11:05:00'),
  },
  {
    id: 2,
    name: 'Bob Smith',
    rollNumber: 'CS2021002',
    rfidTag: 'RFID001235',
    status: 'late',
    checkInTime: new Date('2024-01-15T11:15:00'),
  },
  {
    id: 3,
    name: 'Carol Davis',
    rollNumber: 'CS2021003',
    rfidTag: 'RFID001236',
    status: 'absent',
    checkInTime: null,
  },
  {
    id: 4,
    name: 'David Wilson',
    rollNumber: 'CS2021004',
    rfidTag: 'RFID001237',
    status: 'present',
    checkInTime: new Date('2024-01-15T11:02:00'),
  },
]

interface Student {
  id: number
  name: string
  rollNumber: string
  rfidTag: string
  status: 'present' | 'late' | 'absent'
  checkInTime: Date | null
}

interface ClassItem {
  id: number
  time: string
  course: string
  section: string
  room: string
  status: string
}

export default function TeacherDashboard() {
  const [currentClass, setCurrentClass] = useState(todaysClasses.find(c => c.status === 'current'))
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false)

  // Simulate RFID arrivals
  useEffect(() => {
    if (!isAttendanceOpen) return

    const interval = setInterval(() => {
      // Simulate random RFID check-ins
      const absentStudents = students.filter(s => s.status === 'absent')
      if (absentStudents.length > 0 && Math.random() > 0.7) {
        const randomStudent = absentStudents[Math.floor(Math.random() * absentStudents.length)]
        const now = new Date()
        const isLate = now.getMinutes() > 5 // Assuming class starts at 11:00, late after 11:05
        
        setStudents(prev => prev.map(s => 
          s.id === randomStudent.id 
            ? { ...s, status: isLate ? 'late' : 'present', checkInTime: now }
            : s
        ))
        
        toast.success(`${randomStudent.name} checked in via RFID`)
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [isAttendanceOpen, students])

  const handleOpenAttendance = (classItem: ClassItem) => {
    setCurrentClass(classItem)
    setIsAttendanceOpen(true)
  }

  const handleMarkStatus = (studentId: number, status: 'present' | 'late' | 'absent') => {
    setStudents(prev => prev.map(s => 
      s.id === studentId 
        ? { ...s, status, checkInTime: status === 'absent' ? null : new Date() }
        : s
    ))
    toast.success('Attendance updated')
  }

  const handleSendClassNotice = () => {
    toast.success('Class notice sent to all students')
  }

  const handleExportCSV = () => {
    toast.success('Attendance exported as CSV')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border border-green-200/50'
      case 'late':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 border border-yellow-200/50'
      case 'absent':
        return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 border border-red-200/50'
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 border border-gray-200/50'
    }
  }



  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4" />
      case 'late':
        return <AlertCircle className="w-4 h-4" />
      case 'absent':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const presentCount = students.filter(s => s.status === 'present').length
  const lateCount = students.filter(s => s.status === 'late').length
  const absentCount = students.filter(s => s.status === 'absent').length

  if (isAttendanceOpen && currentClass) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 p-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-400/10 to-green-400/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => setIsAttendanceOpen(false)}
                className="mb-4 glass hover:bg-white/60 border border-white/20 rounded-2xl px-4 py-2 hover-lift"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-violet-500 rounded-full" />
                <h1 className="text-4xl font-semibold text-foreground">
                  {currentClass.course}
                </h1>
                <Sparkles className="w-6 h-6 text-violet-500 animate-pulse" />
              </div>
              <p className="text-slate-700 dark:text-muted-foreground font-light text-lg ml-5">
                {currentClass.section} • {currentClass.time} • {currentClass.room}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleSendClassNotice} className="glass-card border-white/20 hover:bg-white/60 rounded-2xl px-6 py-3 hover-lift hover-glow">
                <Bell className="w-4 h-4 mr-2" />
                Send Notice
              </Button>
              <Button onClick={handleExportCSV} className="gradient-primary rounded-2xl px-6 py-3 hover-lift hover-glow">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Student Roster */}
            <div className="lg:col-span-2">
              <Card className="glass-card border-white/20 shadow-xl animate-slide-up">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl mr-3 shadow-lg">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-2xl font-semibold text-foreground">Student Roster</span>
                    </div>
                    <div className="flex space-x-3">
                      <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border border-green-200/50 rounded-full px-3 py-1">
                        Present: {presentCount}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 border border-yellow-200/50 rounded-full px-3 py-1">
                        Late: {lateCount}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-700 border border-red-200/50 rounded-full px-3 py-1">
                        Absent: {absentCount}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Modern pill-style student list */}
                  <div className="space-y-4">
                    {students.map((student, index) => (
                      <div
                        key={student.id}
                        className="group p-5 bg-white/40 backdrop-blur-sm rounded-2xl hover:bg-white/60 transition-all duration-200 border border-white/20 hover-lift"
                        style={{animationDelay: `${index * 50}ms`}}
                      >
                        <div className="flex items-center justify-between">
                          {/* Student Info */}
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                                {student.name}
                              </h3>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-slate-600 dark:text-muted-foreground font-mono">{student.rollNumber}</span>
                                {student.checkInTime && (
                                  <div className="flex items-center text-sm text-slate-600 dark:text-muted-foreground">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {format(student.checkInTime, 'HH:mm')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Status and Actions */}
                          <div className="flex items-center space-x-4">
                            <Badge className={`rounded-full flex items-center px-3 py-1 ${getStatusColor(student.status)}`}>
                              {getStatusIcon(student.status)}
                              <span className="ml-1 capitalize font-medium">{student.status}</span>
                            </Badge>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant={student.status === 'present' ? 'default' : 'ghost'}
                                onClick={() => handleMarkStatus(student.id, 'present')}
                                className={`rounded-xl text-xs px-3 py-1 hover-lift ${
                                  student.status === 'present' 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                                    : 'hover:bg-green-100/80 hover:text-green-700'
                                }`}
                              >
                                Present
                              </Button>
                              <Button
                                size="sm"
                                variant={student.status === 'late' ? 'default' : 'ghost'}
                                onClick={() => handleMarkStatus(student.id, 'late')}
                                className={`rounded-xl text-xs px-3 py-1 hover-lift ${
                                  student.status === 'late' 
                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg' 
                                    : 'hover:bg-yellow-100/80 hover:text-yellow-700'
                                }`}
                              >
                                Late
                              </Button>
                              <Button
                                size="sm"
                                variant={student.status === 'absent' ? 'default' : 'ghost'}
                                onClick={() => handleMarkStatus(student.id, 'absent')}
                                className={`rounded-xl text-xs px-3 py-1 hover-lift ${
                                  student.status === 'absent' 
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                                    : 'hover:bg-red-100/80 hover:text-red-700'
                                }`}
                              >
                                Absent
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Live RFID Arrivals & Summary */}
            <div className="space-y-8">
              {/* Live RFID Arrivals */}
              <Card className="glass-card border-white/20 shadow-xl animate-slide-up" style={{animationDelay: '100ms'}}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <div className="p-2 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl mr-3 shadow-lg">
                      <Wifi className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-foreground">Live RFID Arrivals</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students
                      .filter(s => s.checkInTime)
                      .sort((a, b) => (b.checkInTime?.getTime() || 0) - (a.checkInTime?.getTime() || 0))
                      .slice(0, 10)
                      .map((student, index) => (
                        <div 
                          key={student.id} 
                          className="group p-4 bg-white/40 backdrop-blur-sm rounded-xl hover:bg-white/60 transition-all duration-200 border border-white/20 hover-lift"
                          style={{animationDelay: `${(index + 2) * 50}ms`}}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                                {student.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground group-hover:text-teal-600 transition-colors">{student.name}</p>
                                <p className="text-sm text-slate-600 dark:text-muted-foreground font-mono">{student.rollNumber}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center justify-end mb-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                <p className="text-sm font-semibold text-green-600">
                                  {student.checkInTime ? format(student.checkInTime, 'HH:mm:ss') : ''}
                                </p>
                              </div>
                              <Badge className={`text-xs rounded-full ${getStatusColor(student.status)}`}>
                                {student.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Class Summary */}
              <Card className="glass-card border-white/20 shadow-xl animate-slide-up" style={{animationDelay: '200ms'}}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl mr-3 shadow-lg">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-semibold text-foreground">Class Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div className="p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-muted-foreground font-medium">Total Students</span>
                        <span className="text-2xl font-bold text-foreground">{students.length}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-200/50">
                        <div className="flex justify-between items-center">
                          <span className="text-green-700 font-medium">Present</span>
                          <span className="text-xl font-bold text-green-600">{presentCount}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-200/50">
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-700 font-medium">Late</span>
                          <span className="text-xl font-bold text-yellow-600">{lateCount}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl border border-red-200/50">
                        <div className="flex justify-between items-center">
                          <span className="text-red-700 font-medium">Absent</span>
                          <span className="text-xl font-bold text-red-600">{absentCount}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5 bg-gradient-to-br from-blue-500/10 to-violet-500/10 rounded-xl border border-blue-200/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-700 font-medium">Attendance Rate</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {Math.round(((presentCount + lateCount) / students.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200/50 rounded-full h-2 mt-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-500"
                          style={{width: `${((presentCount + lateCount) / students.length) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here are your classes for today.
          </p>
        </div>

        {/* Today&apos;s Classes */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Today&rsquo;s Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{classItem.course}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-3 h-3 mr-1" />
                          {classItem.time}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-3 h-3 mr-1" />
                          {classItem.section}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {classItem.room}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      className={`rounded-full ${
                        classItem.status === 'current' ? 'bg-green-100 text-green-800' :
                        classItem.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {classItem.status === 'current' ? 'In Progress' : 'Upcoming'}
                    </Badge>
                    <Button
                      onClick={() => handleOpenAttendance(classItem)}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700"
                      disabled={classItem.status !== 'current'}
                    >
                      Open Attendance
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}