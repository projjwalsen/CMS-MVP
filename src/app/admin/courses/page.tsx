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
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Course {
  id: string
  code: string
  name: string
  credits: number
  department: string
  semester: number
  description: string
}

const mockCourses: Course[] = [
  {
    id: '1',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    credits: 3,
    department: 'Computer Science',
    semester: 1,
    description: 'Basic concepts of programming and computer science'
  },
  {
    id: '2',
    code: 'MATH201',
    name: 'Calculus II',
    credits: 4,
    department: 'Mathematics',
    semester: 2,
    description: 'Advanced calculus concepts and applications'
  },
  {
    id: '3',
    code: 'PHY101',
    name: 'Physics I',
    credits: 3,
    department: 'Physics',
    semester: 1,
    description: 'Mechanics and thermodynamics'
  },
  {
    id: '4',
    code: 'ENG101',
    name: 'English Composition',
    credits: 2,
    department: 'English',
    semester: 1,
    description: 'Academic writing and communication skills'
  }
]

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    credits: 0,
    department: '',
    semester: 1,
    description: ''
  })

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCourse) {
      setCourses(courses.map(course => 
        course.id === editingCourse.id 
          ? { ...course, ...formData }
          : course
      ))
      toast.success('Course updated successfully')
      setEditingCourse(null)
    } else {
      const newCourse: Course = {
        id: Date.now().toString(),
        ...formData
      }
      setCourses([...courses, newCourse])
      toast.success('Course added successfully')
      setIsAddModalOpen(false)
    }
    
    setFormData({
      code: '',
      name: '',
      credits: 0,
      department: '',
      semester: 1,
      description: ''
    })
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      code: course.code,
      name: course.name,
      credits: course.credits,
      department: course.department,
      semester: course.semester,
      description: course.description
    })
  }

  const handleDelete = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId))
    toast.success('Course deleted successfully')
  }

  const importDemoData = () => {
    const demoData: Course[] = [
      {
        id: Date.now().toString(),
        code: 'CS201',
        name: 'Data Structures',
        credits: 4,
        department: 'Computer Science',
        semester: 2,
        description: 'Advanced data structures and algorithms'
      },
      {
        id: (Date.now() + 1).toString(),
        code: 'CHEM101',
        name: 'General Chemistry',
        credits: 3,
        department: 'Chemistry',
        semester: 1,
        description: 'Basic principles of chemistry'
      }
    ]
    setCourses([...courses, ...demoData])
    toast.success('Demo data imported successfully')
  }

  const CourseForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">Course Code</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g., CS101"
            required
          />
        </div>
        <div>
          <Label htmlFor="credits">Credits</Label>
          <Input
            id="credits"
            type="number"
            min="1"
            max="6"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="name">Course Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Course name"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="Department"
            required
          />
        </div>
        <div>
          <Label htmlFor="semester">Semester</Label>
          <Input
            id="semester"
            type="number"
            min="1"
            max="8"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Course description"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsAddModalOpen(false)
            setEditingCourse(null)
            setFormData({
              code: '',
              name: '',
              credits: 0,
              department: '',
              semester: 1,
              description: ''
            })
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editingCourse ? 'Update' : 'Add'} Course
        </Button>
      </div>
    </form>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Courses</h1>
          <div className="flex space-x-2">
            <Button onClick={importDemoData} variant="outline">
              Import Demo Data
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-gradient-to-r from-teal-500 to-mint-500 hover:from-teal-600 hover:to-mint-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                </DialogHeader>
                <CourseForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Management</CardTitle>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary text-white rounded-full border-transparent hover:bg-primary/90">{course.credits} credits</Badge>
                    </TableCell>
                    <TableCell>{course.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Sem {course.semester}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{course.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
            </DialogHeader>
            <CourseForm />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}