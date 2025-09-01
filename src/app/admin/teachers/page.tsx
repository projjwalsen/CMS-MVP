'use client'

import { useState } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Download, Upload, Search, Mail, Phone } from 'lucide-react'
import { toast } from 'sonner'

// Mock data
const mockTeachers = [
  {
    id: 1,
    name: 'Dr. Sarah Wilson',
    department: 'Computer Science',
    email: 'sarah.wilson@college.edu',
    phone: '+1234567800',
    employeeId: 'EMP001',
    specialization: 'Machine Learning',
  },
  {
    id: 2,
    name: 'Prof. Michael Chen',
    department: 'Electrical Engineering',
    email: 'michael.chen@college.edu',
    phone: '+1234567801',
    employeeId: 'EMP002',
    specialization: 'Power Systems',
  },
  {
    id: 3,
    name: 'Dr. Emily Rodriguez',
    department: 'Mechanical Engineering',
    email: 'emily.rodriguez@college.edu',
    phone: '+1234567802',
    employeeId: 'EMP003',
    specialization: 'Thermodynamics',
  },
]

interface Teacher {
  id?: number
  name: string
  department: string
  email: string
  phone: string
  employeeId: string
  specialization: string
}

const emptyTeacher: Teacher = {
  name: '',
  department: '',
  email: '',
  phone: '',
  employeeId: '',
  specialization: '',
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState(mockTeachers)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [formData, setFormData] = useState<Teacher>(emptyTeacher)

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddTeacher = () => {
    setFormData(emptyTeacher)
    setEditingTeacher(null)
    setIsAddModalOpen(true)
  }

  const handleEditTeacher = (teacher: Teacher) => {
    setFormData(teacher)
    setEditingTeacher(teacher)
    setIsAddModalOpen(true)
  }

  const handleSaveTeacher = () => {
    if (editingTeacher) {
      setTeachers(teachers.map(t => t.id === editingTeacher.id ? { ...formData, id: editingTeacher.id } : t))
      toast.success('Teacher updated successfully')
    } else {
      const newTeacher = { ...formData, id: Date.now() }
      setTeachers([...teachers, newTeacher])
      toast.success('Teacher added successfully')
    }
    setIsAddModalOpen(false)
    setFormData(emptyTeacher)
    setEditingTeacher(null)
  }

  const handleImportDemoData = () => {
    const demoData = [
      {
        id: Date.now() + 1,
        name: 'Dr. James Anderson',
        department: 'Biotechnology',
        email: 'james.anderson@college.edu',
        phone: '+1234567803',
        employeeId: 'EMP004',
        specialization: 'Genetics',
      },
      {
        id: Date.now() + 2,
        name: 'Prof. Lisa Thompson',
        department: 'Computer Science',
        email: 'lisa.thompson@college.edu',
        phone: '+1234567804',
        employeeId: 'EMP005',
        specialization: 'Database Systems',
      },
    ]
    setTeachers([...teachers, ...demoData])
    toast.success('Demo data imported successfully')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
            <p className="text-slate-600 dark:text-muted-foreground mt-1">Manage faculty and staff information</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleImportDemoData} className="rounded-xl border-border hover:bg-accent">
              <Upload className="w-4 h-4 mr-2" />
              Import Demo Data
            </Button>
            <Button onClick={handleAddTeacher} className="rounded-xl bg-gradient-to-r from-teal-500 to-mint-500 hover:from-teal-600 hover:to-mint-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Teacher
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
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <Button variant="outline" className="rounded-xl border-border hover:bg-accent">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Teachers Table */}
        <Card className="card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">All Teachers ({filteredTeachers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary text-white rounded-full border-transparent hover:bg-primary/90">
                        {teacher.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{teacher.employeeId}</TableCell>
                    <TableCell>{teacher.specialization}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {teacher.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-3 h-3 mr-1" />
                          {teacher.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTeacher(teacher)}
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

        {/* Add/Edit Teacher Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}
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
                  placeholder="Dr. John Doe"
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
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="rounded-xl font-mono"
                  placeholder="EMP001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="rounded-xl"
                  placeholder="Machine Learning, Data Structures, etc."
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
                  placeholder="teacher@college.edu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-xl"
                  placeholder="+1234567890"
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
              <Button onClick={handleSaveTeacher} className="rounded-xl bg-blue-600 hover:bg-blue-700">
                {editingTeacher ? 'Update' : 'Add'} Teacher
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}