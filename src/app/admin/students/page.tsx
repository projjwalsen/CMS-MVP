'use client'

import { useState } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Download, Upload, Search } from 'lucide-react'
import { toast } from 'sonner'

// Mock data
const mockStudents = [
  {
    id: 1,
    name: 'Alice Johnson',
    rollNumber: 'CS2021001',
    department: 'Computer Science',
    year: '3rd Year',
    section: 'A',
    rfidTag: 'RFID001234',
    email: 'alice.johnson@college.edu',
    phone: '+1234567890',
  },
  {
    id: 2,
    name: 'Bob Smith',
    rollNumber: 'EE2021002',
    department: 'Electrical Engineering',
    year: '2nd Year',
    section: 'B',
    rfidTag: 'RFID001235',
    email: 'bob.smith@college.edu',
    phone: '+1234567891',
  },
  {
    id: 3,
    name: 'Carol Davis',
    rollNumber: 'ME2021003',
    department: 'Mechanical Engineering',
    year: '1st Year',
    section: 'A',
    rfidTag: 'RFID001236',
    email: 'carol.davis@college.edu',
    phone: '+1234567892',
  },
]

interface Student {
  id?: number
  name: string
  rollNumber: string
  department: string
  year: string
  section: string
  rfidTag: string
  email: string
  phone: string
}

const emptyStudent: Student = {
  name: '',
  rollNumber: '',
  department: '',
  year: '',
  section: '',
  rfidTag: '',
  email: '',
  phone: '',
}

export default function StudentsPage() {
  const [students, setStudents] = useState(mockStudents)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState<Student>(emptyStudent)

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddStudent = () => {
    setFormData(emptyStudent)
    setEditingStudent(null)
    setIsAddModalOpen(true)
  }

  const handleEditStudent = (student: Student) => {
    setFormData(student)
    setEditingStudent(student)
    setIsAddModalOpen(true)
  }

  const handleSaveStudent = () => {
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id ? { ...formData, id: editingStudent.id } : s))
      toast.success('Student updated successfully')
    } else {
      const newStudent = { ...formData, id: Date.now() }
      setStudents([...students, newStudent])
      toast.success('Student added successfully')
    }
    setIsAddModalOpen(false)
    setFormData(emptyStudent)
    setEditingStudent(null)
  }

  const handleImportDemoData = () => {
    const demoData = [
      {
        id: Date.now() + 1,
        name: 'David Wilson',
        rollNumber: 'CS2022004',
        department: 'Computer Science',
        year: '2nd Year',
        section: 'B',
        rfidTag: 'RFID001237',
        email: 'david.wilson@college.edu',
        phone: '+1234567893',
      },
      {
        id: Date.now() + 2,
        name: 'Emma Brown',
        rollNumber: 'BT2022005',
        department: 'Biotechnology',
        year: '1st Year',
        section: 'A',
        rfidTag: 'RFID001238',
        email: 'emma.brown@college.edu',
        phone: '+1234567894',
      },
    ]
    setStudents([...students, ...demoData])
    toast.success('Demo data imported successfully')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Students</h1>
            <p className="text-slate-600 dark:text-muted-foreground mt-1">Manage student records and information</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleImportDemoData} className="rounded-xl border-primary hover:bg-accent">
              <Upload className="w-4 h-4 mr-2" />
              Import Demo Data
            </Button>
            <Button onClick={handleAddStudent} className="rounded-xl bg-gradient-to-r from-teal-500 to-mint-500 hover:from-teal-600 hover:to-mint-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="card border-border/50 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <Button variant="outline" className="rounded-xl border-primary hover:bg-accent">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">All Students ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>RFID Tag</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary text-white rounded-full border-transparent hover:bg-primary/90">
                        {student.year}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full">
                        Section {student.section}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{student.rfidTag}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditStudent(student)}
                        className="rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Student Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => setFormData({ ...formData, year: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) => setFormData({ ...formData, section: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rfidTag">RFID Tag</Label>
                <Input
                  id="rfidTag"
                  value={formData.rfidTag}
                  onChange={(e) => setFormData({ ...formData, rfidTag: e.target.value })}
                  className="rounded-xl font-mono"
                  placeholder="RFID001234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveStudent} className="rounded-xl bg-blue-600 hover:bg-blue-700">
                {editingStudent ? 'Update' : 'Add'} Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}