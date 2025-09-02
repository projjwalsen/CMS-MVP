'use client'

import React, { useState } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface TimeSlot {
  id: string
  day: string
  period: number
  startTime: string
  endTime: string
  courseCode: string
  courseName: string
  section: string
  teacher: string
  room: string
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const timeSlots = [
  { period: 1, start: '08:00', end: '09:00' },
  { period: 2, start: '09:00', end: '10:00' },
  { period: 3, start: '10:00', end: '11:00' },
  { period: 4, start: '11:00', end: '12:00' },
  { period: 5, start: '12:00', end: '13:00' },
  { period: 6, start: '13:00', end: '14:00' },
  { period: 7, start: '14:00', end: '15:00' },
  { period: 8, start: '15:00', end: '16:00' }
]

const mockTimetable: TimeSlot[] = [
  {
    id: '1',
    day: 'Monday',
    period: 1,
    startTime: '08:00',
    endTime: '09:00',
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    section: 'A',
    teacher: 'Dr. Smith',
    room: 'Room 101'
  },
  {
    id: '2',
    day: 'Monday',
    period: 2,
    startTime: '09:00',
    endTime: '10:00',
    courseCode: 'MATH201',
    courseName: 'Calculus II',
    section: 'A',
    teacher: 'Prof. Davis',
    room: 'Room 201'
  },
  {
    id: '3',
    day: 'Tuesday',
    period: 1,
    startTime: '08:00',
    endTime: '09:00',
    courseCode: 'PHY101',
    courseName: 'Physics I',
    section: 'A',
    teacher: 'Dr. Wilson',
    room: 'Lab 301'
  },
  {
    id: '4',
    day: 'Wednesday',
    period: 1,
    startTime: '08:00',
    endTime: '09:00',
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    section: 'B',
    teacher: 'Dr. Johnson',
    room: 'Room 102'
  },
  {
    id: '5',
    day: 'Friday',
    period: 3,
    startTime: '10:00',
    endTime: '11:00',
    courseCode: 'ENG101',
    courseName: 'English Composition',
    section: 'A',
    teacher: 'Prof. Brown',
    room: 'Room 301'
  }
]

const mockCourses = [
  { code: 'CS101', name: 'Introduction to Computer Science' },
  { code: 'MATH201', name: 'Calculus II' },
  { code: 'PHY101', name: 'Physics I' },
  { code: 'ENG101', name: 'English Composition' }
]

const mockTeachers = [
  'Dr. Smith',
  'Dr. Johnson', 
  'Prof. Davis',
  'Dr. Wilson',
  'Prof. Brown'
]

const mockSections = ['A', 'B', 'C']
const mockRooms = ['Room 101', 'Room 102', 'Room 201', 'Room 202', 'Lab 301', 'Lab 302']

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimeSlot[]>(mockTimetable)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)

  const [formData, setFormData] = useState({
    day: '',
    period: 1,
    startTime: '',
    endTime: '',
    courseCode: '',
    courseName: '',
    section: '',
    teacher: '',
    room: ''
  })

  const getSlotForDayPeriod = (day: string, period: number) => {
    return timetable.find(slot => slot.day === day && slot.period === period)
  }

  const handleCellClick = (day: string, period: number) => {
    const existingSlot = getSlotForDayPeriod(day, period)
    if (existingSlot) {
      handleEdit(existingSlot)
    } else {
      const timeSlot = timeSlots.find(t => t.period === period)
      setFormData({
        day,
        period,
        startTime: timeSlot?.start || '',
        endTime: timeSlot?.end || '',
        courseCode: '',
        courseName: '',
        section: '',
        teacher: '',
        room: ''
      })
      setIsAddModalOpen(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check for conflicts
    const conflict = timetable.find(slot => 
      slot.id !== editingSlot?.id &&
      slot.day === formData.day &&
      slot.period === formData.period
    )
    
    if (conflict) {
      toast.error('Time slot already occupied')
      return
    }
    
    if (editingSlot) {
      setTimetable(timetable.map(slot => 
        slot.id === editingSlot.id 
          ? { ...slot, ...formData }
          : slot
      ))
      toast.success('Time slot updated successfully')
      setEditingSlot(null)
    } else {
      const newSlot: TimeSlot = {
        id: Date.now().toString(),
        ...formData
      }
      setTimetable([...timetable, newSlot])
      toast.success('Time slot added successfully')
      setIsAddModalOpen(false)
    }
    
    resetForm()
  }

  const handleEdit = (slot: TimeSlot) => {
    setEditingSlot(slot)
    setFormData({
      day: slot.day,
      period: slot.period,
      startTime: slot.startTime,
      endTime: slot.endTime,
      courseCode: slot.courseCode,
      courseName: slot.courseName,
      section: slot.section,
      teacher: slot.teacher,
      room: slot.room
    })
  }

  const handleDelete = (slotId: string) => {
    setTimetable(timetable.filter(slot => slot.id !== slotId))
    toast.success('Time slot deleted successfully')
  }

  const handleCourseChange = (courseCode: string) => {
    const course = mockCourses.find(c => c.code === courseCode)
    setFormData({
      ...formData,
      courseCode,
      courseName: course?.name || ''
    })
  }

  const handlePeriodChange = (period: string) => {
    const periodNum = parseInt(period)
    const timeSlot = timeSlots.find(t => t.period === periodNum)
    setFormData({
      ...formData,
      period: periodNum,
      startTime: timeSlot?.start || '',
      endTime: timeSlot?.end || ''
    })
  }

  const resetForm = () => {
    setFormData({
      day: '',
      period: 1,
      startTime: '',
      endTime: '',
      courseCode: '',
      courseName: '',
      section: '',
      teacher: '',
      room: ''
    })
  }

  const TimeSlotForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="day">Day</Label>
          <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="period">Period</Label>
          <Select value={formData.period.toString()} onValueChange={handlePeriodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot.period} value={slot.period.toString()}>
                  Period {slot.period} ({slot.start} - {slot.end})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="course">Course</Label>
        <Select value={formData.courseCode} onValueChange={handleCourseChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {mockCourses.map((course) => (
              <SelectItem key={course.code} value={course.code}>
                {course.code} - {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="section">Section</Label>
          <Select value={formData.section} onValueChange={(value) => setFormData({ ...formData, section: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {mockSections.map((section) => (
                <SelectItem key={section} value={section}>
                  Section {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="teacher">Teacher</Label>
          <Select value={formData.teacher} onValueChange={(value) => setFormData({ ...formData, teacher: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {mockTeachers.map((teacher) => (
                <SelectItem key={teacher} value={teacher}>
                  {teacher}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="room">Room</Label>
        <Select value={formData.room} onValueChange={(value) => setFormData({ ...formData, room: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select room" />
          </SelectTrigger>
          <SelectContent>
            {mockRooms.map((room) => (
              <SelectItem key={room} value={room}>
                {room}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsAddModalOpen(false)
            setEditingSlot(null)
            resetForm()
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editingSlot ? 'Update' : 'Add'} Time Slot
        </Button>
      </div>
    </form>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Timetable</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Time Slot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Time Slot</DialogTitle>
              </DialogHeader>
              <TimeSlotForm />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Weekly Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-7 gap-1 min-w-[800px]">
                {/* Header */}
                <div className="p-3 bg-gray-50 font-semibold text-center border rounded">
                  Time
                </div>
                {days.map((day) => (
                  <div key={day} className="p-3 bg-gray-50 font-semibold text-center border rounded">
                    {day}
                  </div>
                ))}
                
                {/* Time slots */}
                {timeSlots.map((timeSlot) => (
                  <React.Fragment key={`timeslot-${timeSlot.period}`}>
                    <div key={`time-${timeSlot.period}`} className="p-3 bg-gray-50 text-center border rounded text-sm">
                      <div className="font-medium">Period {timeSlot.period}</div>
                      <div className="text-xs text-gray-500">
                        {timeSlot.start} - {timeSlot.end}
                      </div>
                    </div>
                    {days.map((day) => {
                      const slot = getSlotForDayPeriod(day, timeSlot.period)
                      return (
                        <div
                          key={`${day}-${timeSlot.period}`}
                          className={`p-2 border rounded min-h-[80px] cursor-pointer transition-colors ${
                            slot 
                              ? 'bg-primary-tint hover:bg-primary-tint/80' 
                              : 'bg-white hover:bg-gray-50'
                          }`}
                          onClick={() => handleCellClick(day, timeSlot.period)}
                        >
                          {slot ? (
                            <div className="space-y-1">
                              <div className="font-medium text-sm text-primary">
                                {slot.courseCode}
                              </div>
                              <div className="text-xs text-gray-600">
                                Section {slot.section}
                              </div>
                              <div className="text-xs text-gray-500">
                                {slot.teacher}
                              </div>
                              <div className="text-xs text-gray-500">
                                {slot.room}
                              </div>
                              <div className="flex space-x-1 mt-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(slot)
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(slot.id)
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                              Click to add
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={!!editingSlot} onOpenChange={() => setEditingSlot(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Time Slot</DialogTitle>
            </DialogHeader>
            <TimeSlotForm />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}