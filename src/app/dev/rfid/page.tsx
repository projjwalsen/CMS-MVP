'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Wifi, Clock, User, Hash } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface RFIDEvent {
  id: number
  rfidTag: string
  readerId: string
  timestamp: Date
  studentName?: string
  status: 'success' | 'error'
}

const mockReaders = [
  { id: 'READER_001', location: 'Main Entrance' },
  { id: 'READER_002', location: 'CS Department' },
  { id: 'READER_003', location: 'Library' },
  { id: 'READER_004', location: 'Cafeteria' },
]

const mockStudentTags = [
  { tag: 'RFID001234', name: 'Alice Johnson' },
  { tag: 'RFID001235', name: 'Bob Smith' },
  { tag: 'RFID001236', name: 'Carol Davis' },
  { tag: 'RFID001237', name: 'David Wilson' },
  { tag: 'RFID001238', name: 'Emma Brown' },
]

export default function RFIDSimulator() {
  const [rfidTag, setRfidTag] = useState('')
  const [readerId, setReaderId] = useState('')
  const [events, setEvents] = useState<RFIDEvent[]>([])
  const [isSimulating, setIsSimulating] = useState(false)

  const handleSendEvent = async () => {
    if (!rfidTag || !readerId) {
      toast.error('Please fill in all fields')
      return
    }

    const studentInfo = mockStudentTags.find(s => s.tag === rfidTag)
    const newEvent: RFIDEvent = {
      id: Date.now(),
      rfidTag,
      readerId,
      timestamp: new Date(),
      studentName: studentInfo?.name,
      status: 'success',
    }

    // Simulate API call
    try {
      setEvents(prev => [newEvent, ...prev])
      toast.success(`RFID event sent: ${studentInfo?.name || 'Unknown'} at ${mockReaders.find(r => r.id === readerId)?.location}`)
      
      // Clear form
      setRfidTag('')
      setReaderId('')
    } catch (error) {
      toast.error('Failed to send RFID event')
    }
  }

  const handleQuickScan = (tag: string) => {
    setRfidTag(tag)
  }

  const startAutoSimulation = () => {
    setIsSimulating(true)
    const interval = setInterval(() => {
      const randomTag = mockStudentTags[Math.floor(Math.random() * mockStudentTags.length)]
      const randomReader = mockReaders[Math.floor(Math.random() * mockReaders.length)]
      
      const newEvent: RFIDEvent = {
        id: Date.now(),
        rfidTag: randomTag.tag,
        readerId: randomReader.id,
        timestamp: new Date(),
        studentName: randomTag.name,
        status: 'success',
      }
      
      setEvents(prev => [newEvent, ...prev.slice(0, 19)]) // Keep only last 20 events
    }, 3000)

    // Stop after 30 seconds
    setTimeout(() => {
      clearInterval(interval)
      setIsSimulating(false)
      toast.info('Auto simulation stopped')
    }, 30000)
  }

  const clearEvents = () => {
    setEvents([])
    toast.success('Events cleared')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Wifi className="w-5 h-5 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">RFID Simulator</h1>
            <Badge className="bg-orange-100 text-orange-800 rounded-full">Development Only</Badge>
          </div>
          <p className="text-gray-600">
            Simulate RFID tag scans for testing attendance system functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Simulator Controls */}
          <div className="space-y-6">
            {/* Manual Event Form */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Manual RFID Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rfidTag">RFID Tag</Label>
                  <Input
                    id="rfidTag"
                    value={rfidTag}
                    onChange={(e) => setRfidTag(e.target.value)}
                    placeholder="RFID001234"
                    className="rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="readerId">Reader ID</Label>
                  <Select value={readerId} onValueChange={setReaderId}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select RFID reader" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockReaders.map((reader) => (
                        <SelectItem key={reader.id} value={reader.id}>
                          {reader.id} - {reader.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleSendEvent}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  <Wifi className="w-4 h-4 mr-2" />
                  Send RFID Event
                </Button>
              </CardContent>
            </Card>

            {/* Quick Scan Options */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Quick Scan Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {mockStudentTags.map((student) => (
                    <Button
                      key={student.tag}
                      variant="outline"
                      onClick={() => handleQuickScan(student.tag)}
                      className="justify-start rounded-xl"
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span className="flex-1 text-left">{student.name}</span>
                      <span className="text-xs text-gray-500 font-mono">{student.tag}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Auto Simulation */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Auto Simulation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Automatically generate random RFID events every 3 seconds for 30 seconds
                </p>
                <Button
                  onClick={startAutoSimulation}
                  disabled={isSimulating}
                  className="w-full rounded-xl bg-green-600 hover:bg-green-700"
                >
                  {isSimulating ? 'Simulation Running...' : 'Start Auto Simulation'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Events */}
          <div>
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Recent RFID Events
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className="rounded-full">
                      {events.length} events
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearEvents}
                      className="rounded-lg"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {events.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Wifi className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No RFID events yet</p>
                      <p className="text-sm">Send an event to see it here</p>
                    </div>
                  ) : (
                    events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Hash className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {event.studentName || 'Unknown Student'}
                            </p>
                            <p className="text-xs text-gray-500 font-mono">
                              {event.rfidTag}
                            </p>
                            <p className="text-xs text-gray-500">
                              {mockReaders.find(r => r.id === event.readerId)?.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-xs text-gray-600 mb-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {format(event.timestamp, 'HH:mm:ss')}
                          </div>
                          <Badge
                            className={`text-xs rounded-full ${
                              event.status === 'success'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reader Status */}
            <Card className="rounded-2xl shadow-sm mt-6">
              <CardHeader>
                <CardTitle>RFID Readers Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReaders.map((reader) => (
                    <div
                      key={reader.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-sm">{reader.location}</p>
                        <p className="text-xs text-gray-500 font-mono">{reader.id}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 rounded-full text-xs">
                        Online
                      </Badge>
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