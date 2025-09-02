'use client'

import { useState } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  type: 'Academic' | 'Holiday' | 'Exam' | 'Event' | 'Meeting'
  location?: string
  isAllDay: boolean
}

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Mid-term Examinations Begin',
    description: 'Start of mid-term examination period for all departments',
    date: '2024-03-15',
    startTime: '09:00',
    endTime: '17:00',
    type: 'Exam',
    location: 'All Examination Halls',
    isAllDay: false
  },
  {
    id: '2',
    title: 'Faculty Meeting',
    description: 'Monthly faculty meeting to discuss curriculum updates',
    date: '2024-03-20',
    startTime: '14:00',
    endTime: '16:00',
    type: 'Meeting',
    location: 'Conference Room A',
    isAllDay: false
  },
  {
    id: '3',
    title: 'Spring Break',
    description: 'College closed for spring break',
    date: '2024-03-25',
    startTime: '',
    endTime: '',
    type: 'Holiday',
    isAllDay: true
  },
  {
    id: '4',
    title: 'Science Fair',
    description: 'Annual science fair and project exhibition',
    date: '2024-03-28',
    startTime: '10:00',
    endTime: '16:00',
    type: 'Event',
    location: 'Main Auditorium',
    isAllDay: false
  },
  {
    id: '5',
    title: 'Registration Deadline',
    description: 'Last date for course registration for next semester',
    date: '2024-03-30',
    startTime: '17:00',
    endTime: '17:00',
    type: 'Academic',
    isAllDay: false
  }
]

const eventTypes = ['Academic', 'Holiday', 'Exam', 'Event', 'Meeting']

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'Academic': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Holiday': return 'bg-green-100 text-green-800 border-green-200'
    case 'Exam': return 'bg-red-100 text-red-800 border-red-200'
    case 'Event': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'Meeting': return 'bg-orange-100 text-orange-800 border-orange-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'Academic' as CalendarEvent['type'],
    location: '',
    isAllDay: false
  })

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (dateString: string) => {
    return events.filter(event => event.date === dateString)
  }

  const formatDateString = (date: Date, day: number) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${month}-${dayStr}`
  }

  const handleDateClick = (dateString: string) => {
    setFormData({ ...formData, date: dateString })
    setIsAddModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...formData }
          : event
      ))
      toast.success('Event updated successfully')
      setEditingEvent(null)
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        ...formData
      }
      setEvents([...events, newEvent])
      toast.success('Event added successfully')
      setIsAddModalOpen(false)
    }
    
    resetForm()
  }

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      type: event.type,
      location: event.location || '',
      isAllDay: event.isAllDay
    })
  }

  const handleDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
    toast.success('Event deleted successfully')
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'Academic',
      location: '',
      isAllDay: false
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }



  const EventForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Event title"
          className="input h-12"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Event description"
          className="input"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="input h-12"
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value: CalendarEvent['type']) => setFormData({ ...formData, type: value })}>
            <SelectTrigger className="input h-12">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="card border-stroke">
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isAllDay"
          checked={formData.isAllDay}
          onChange={(e) => setFormData({ ...formData, isAllDay: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="isAllDay">All Day Event</Label>
      </div>
      
      {!formData.isAllDay && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="input h-12"
              required={!formData.isAllDay}
            />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="input h-12"
              required={!formData.isAllDay}
            />
          </div>
        </div>
      )}
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Event location (optional)"
          className="input h-12"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsAddModalOpen(false)
            setEditingEvent(null)
            resetForm()
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editingEvent ? 'Update' : 'Add'} Event
        </Button>
      </div>
    </form>
  )

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(currentDate, day)
      const dayEvents = getEventsForDate(dateString)
      const isToday = dateString === new Date().toISOString().split('T')[0]
      
      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 ${
            isToday ? 'bg-blue-50 border-blue-300' : ''
          }`}
          onClick={() => handleDateClick(dateString)}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-blue-600' : 'text-gray-900'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleEdit(event)
                }}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      )
    }
    
    return days
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <EventForm />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-0">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="h-10 border border-gray-200 bg-gray-50 flex items-center justify-center font-medium text-sm">
                  {day}
                </div>
              ))}
              {/* Calendar days */}
              {renderCalendar()}
            </div>
          </CardContent>
        </Card>

        {/* Event Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {eventTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded border ${getEventTypeColor(type)}`}></div>
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Edit Event
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (editingEvent) {
                      handleDelete(editingEvent.id)
                      setEditingEvent(null)
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            <EventForm />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}