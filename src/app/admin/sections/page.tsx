'use client'

import { useState } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Section {
  id: string
  name: string
  courseCode: string
  courseName: string
  capacity: number
  enrolled: number
  teacher: string
  room: string
  schedule: string
}

const mockSections: Section[] = [
  {
    id: '1',
    name: 'A',
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    capacity: 30,
    enrolled: 28,
    teacher: 'Dr. Smith',
    room: 'Room 101',
    schedule: 'Mon, Wed, Fri 9:00-10:00'
  },
  {
    id: '2',
    name: 'B',
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    capacity: 30,
    enrolled: 25,
    teacher: 'Dr. Johnson',
    room: 'Room 102',
    schedule: 'Tue, Thu 10:00-11:30'
  },
  {
    id: '3',
    name: 'A',
    courseCode: 'MATH201',
    courseName: 'Calculus II',
    capacity: 25,
    enrolled: 23,
    teacher: 'Prof. Davis',
    room: 'Room 201',
    schedule: 'Mon, Wed, Fri 11:00-12:00'
  },
  {
    id: '4',
    name: 'A',
    courseCode: 'PHY101',
    courseName: 'Physics I',
    capacity: 35,
    enrolled: 32,
    teacher: 'Dr. Wilson',
    room: 'Lab 301',
    schedule: 'Tue, Thu 2:00-3:30'
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

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>(mockSections)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    courseCode: '',
    courseName: '',
    capacity: 30,
    teacher: '',
    room: '',
    schedule: ''
  })

  const filteredSections = sections.filter(section =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingSection) {
      setSections(sections.map(section => 
        section.id === editingSection.id 
          ? { ...section, ...formData, enrolled: editingSection.enrolled }
          : section
      ))
      toast.success('Section updated successfully')
      setEditingSection(null)
    } else {
      const newSection: Section = {
        id: Date.now().toString(),
        ...formData,
        enrolled: 0
      }
      setSections([...sections, newSection])
      toast.success('Section added successfully')
      setIsAddModalOpen(false)
    }
    
    setFormData({
      name: '',
      courseCode: '',
      courseName: '',
      capacity: 30,
      teacher: '',
      room: '',
      schedule: ''
    })
  }

  const handleEdit = (section: Section) => {
    setEditingSection(section)
    setFormData({
      name: section.name,
      courseCode: section.courseCode,
      courseName: section.courseName,
      capacity: section.capacity,
      teacher: section.teacher,
      room: section.room,
      schedule: section.schedule
    })
  }

  const handleDelete = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId))
    toast.success('Section deleted successfully')
  }

  const handleCourseChange = (courseCode: string) => {
    const course = mockCourses.find(c => c.code === courseCode)
    setFormData({
      ...formData,
      courseCode,
      courseName: course?.name || ''
    })
  }

  const importDemoData = () => {
    const demoData: Section[] = [
      {
        id: Date.now().toString(),
        name: 'C',
        courseCode: 'CS101',
        courseName: 'Introduction to Computer Science',
        capacity: 30,
        enrolled: 15,
        teacher: 'Prof. Brown',
        room: 'Room 103',
        schedule: 'Mon, Wed, Fri 2:00-3:00'
      },
      {
        id: (Date.now() + 1).toString(),
        name: 'B',
        courseCode: 'MATH201',
        courseName: 'Calculus II',
        capacity: 25,
        enrolled: 20,
        teacher: 'Dr. Smith',
        room: 'Room 202',
        schedule: 'Tue, Thu 9:00-10:30'
      }
    ]
    setSections([...sections, ...demoData])
    toast.success('Demo data imported successfully')
  }

  const getEnrollmentStatus = (enrolled: number, capacity: number): { color: 'destructive' | 'default' | 'secondary' | 'outline', text: string } => {
    const percentage = (enrolled / capacity) * 100
    if (percentage >= 90) return { color: 'destructive', text: 'Full' }
    if (percentage >= 75) return { color: 'default', text: 'High' }
    if (percentage >= 50) return { color: 'secondary', text: 'Medium' }
    return { color: 'outline', text: 'Low' }
  }

  const SectionForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Section Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., A, B, C"
            required
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            max="100"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
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
      
      <div>
        <Label htmlFor="teacher">Teacher</Label>
        <Select value={formData.teacher} onValueChange={(value) => setFormData({ ...formData, teacher: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a teacher" />
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
      
      <div>
        <Label htmlFor="room">Room</Label>
        <Input
          id="room"
          value={formData.room}
          onChange={(e) => setFormData({ ...formData, room: e.target.value })}
          placeholder="e.g., Room 101, Lab 301"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="schedule">Schedule</Label>
        <Input
          id="schedule"
          value={formData.schedule}
          onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
          placeholder="e.g., Mon, Wed, Fri 9:00-10:00"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsAddModalOpen(false)
            setEditingSection(null)
            setFormData({
              name: '',
              courseCode: '',
              courseName: '',
              capacity: 30,
              teacher: '',
              room: '',
              schedule: ''
            })
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editingSection ? 'Update' : 'Add'} Section
        </Button>
      </div>
    </form>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sections</h1>
          <div className="flex space-x-2">
            <Button onClick={importDemoData} variant="outline">
              Import Demo Data
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Section</DialogTitle>
                </DialogHeader>
                <SectionForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Section Management</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Enrollment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSections.map((section) => {
                  const status = getEnrollmentStatus(section.enrolled, section.capacity)
                  return (
                    <TableRow key={section.id}>
                      <TableCell className="font-medium">{section.name}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{section.courseCode}</div>
                          <div className="text-sm text-gray-500">{section.courseName}</div>
                        </div>
                      </TableCell>
                      <TableCell>{section.teacher}</TableCell>
                      <TableCell>{section.room}</TableCell>
                      <TableCell className="text-sm">{section.schedule}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {section.enrolled}/{section.capacity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.color}>{status.text}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(section)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(section.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Section</DialogTitle>
            </DialogHeader>
            <SectionForm />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}