'use client'

import { useState } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, Bell, Filter } from 'lucide-react'
import { toast } from 'sonner'

interface Notice {
  id: string
  title: string
  body: string
  scope: 'Global' | 'Section' | 'Student'
  targetId?: string
  targetName?: string
  author: string
  createdAt: string
  priority: 'High' | 'Medium' | 'Low'
  isActive: boolean
}

const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Mid-term Examination Schedule',
    body: 'Mid-term examinations will be conducted from March 15-22, 2024. Please check your individual timetables for specific dates and timings.',
    scope: 'Global',
    author: 'Admin',
    createdAt: '2024-03-01T10:00:00Z',
    priority: 'High',
    isActive: true
  },
  {
    id: '2',
    title: 'CS101 Lab Session Rescheduled',
    body: 'The lab session for CS101 Section A scheduled for March 10 has been moved to March 12 at the same time.',
    scope: 'Section',
    targetId: 'CS101-A',
    targetName: 'CS101 Section A',
    author: 'Dr. Smith',
    createdAt: '2024-03-08T14:30:00Z',
    priority: 'Medium',
    isActive: true
  },
  {
    id: '3',
    title: 'Library Hours Extended',
    body: 'Library hours have been extended during exam period. New timings: 7:00 AM - 11:00 PM on weekdays.',
    scope: 'Global',
    author: 'Librarian',
    createdAt: '2024-03-05T09:15:00Z',
    priority: 'Medium',
    isActive: true
  },
  {
    id: '4',
    title: 'Assignment Submission Reminder',
    body: 'Your Physics assignment is due tomorrow. Please submit it before 5:00 PM.',
    scope: 'Student',
    targetId: 'STU001',
    targetName: 'John Doe',
    author: 'Dr. Wilson',
    createdAt: '2024-03-07T16:45:00Z',
    priority: 'High',
    isActive: true
  },
  {
    id: '5',
    title: 'Holiday Notice',
    body: 'College will remain closed on March 20, 2024 due to public holiday.',
    scope: 'Global',
    author: 'Admin',
    createdAt: '2024-02-28T11:00:00Z',
    priority: 'Low',
    isActive: false
  }
]

const mockSections = [
  { id: 'CS101-A', name: 'CS101 Section A' },
  { id: 'CS101-B', name: 'CS101 Section B' },
  { id: 'MATH201-A', name: 'MATH201 Section A' },
  { id: 'PHY101-A', name: 'PHY101 Section A' }
]

const mockStudents = [
  { id: 'STU001', name: 'John Doe', roll: 'CS2021001' },
  { id: 'STU002', name: 'Jane Smith', roll: 'CS2021002' },
  { id: 'STU003', name: 'Mike Johnson', roll: 'CS2021003' }
]

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(mockNotices)
  const [searchTerm, setSearchTerm] = useState('')
  const [scopeFilter, setScopeFilter] = useState<string>('All')
  const [priorityFilter, setPriorityFilter] = useState<string>('All')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    scope: 'Global' as 'Global' | 'Section' | 'Student',
    targetId: '',
    targetName: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    isActive: true
  })

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesScope = scopeFilter === 'All' || notice.scope === scopeFilter
    const matchesPriority = priorityFilter === 'All' || notice.priority === priorityFilter
    
    return matchesSearch && matchesScope && matchesPriority
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingNotice) {
      setNotices(notices.map(notice => 
        notice.id === editingNotice.id 
          ? { 
              ...notice, 
              ...formData,
              author: editingNotice.author,
              createdAt: editingNotice.createdAt
            }
          : notice
      ))
      toast.success('Notice updated successfully')
      setEditingNotice(null)
    } else {
      const newNotice: Notice = {
        id: Date.now().toString(),
        ...formData,
        author: 'Current User',
        createdAt: new Date().toISOString()
      }
      setNotices([newNotice, ...notices])
      toast.success('Notice created successfully')
      setIsAddModalOpen(false)
    }
    
    resetForm()
  }

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      body: notice.body,
      scope: notice.scope,
      targetId: notice.targetId || '',
      targetName: notice.targetName || '',
      priority: notice.priority,
      isActive: notice.isActive
    })
  }

  const handleDelete = (noticeId: string) => {
    setNotices(notices.filter(notice => notice.id !== noticeId))
    toast.success('Notice deleted successfully')
  }

  const toggleNoticeStatus = (noticeId: string) => {
    setNotices(notices.map(notice => 
      notice.id === noticeId 
        ? { ...notice, isActive: !notice.isActive }
        : notice
    ))
    toast.success('Notice status updated')
  }

  const handleScopeChange = (scope: 'Global' | 'Section' | 'Student') => {
    setFormData({
      ...formData,
      scope,
      targetId: '',
      targetName: ''
    })
  }

  const handleTargetChange = (targetId: string) => {
    let targetName = ''
    if (formData.scope === 'Section') {
      const section = mockSections.find(s => s.id === targetId)
      targetName = section?.name || ''
    } else if (formData.scope === 'Student') {
      const student = mockStudents.find(s => s.id === targetId)
      targetName = student?.name || ''
    }
    
    setFormData({
      ...formData,
      targetId,
      targetName
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      scope: 'Global',
      targetId: '',
      targetName: '',
      priority: 'Medium',
      isActive: true
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive'
      case 'Medium': return 'default'
      case 'Low': return 'secondary'
      default: return 'outline'
    }
  }

  const getScopeColor = (scope: string) => {
    switch (scope) {
      case 'Global': return 'default'
      case 'Section': return 'secondary'
      case 'Student': return 'outline'
      default: return 'outline'
    }
  }

  const NoticeForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Notice title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="body">Body</Label>
        <Textarea
          id="body"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          placeholder="Notice content"
          rows={4}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="scope">Scope</Label>
          <Select value={formData.scope} onValueChange={handleScopeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Global">Global</SelectItem>
              <SelectItem value="Section">Section</SelectItem>
              <SelectItem value="Student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {formData.scope !== 'Global' && (
        <div>
          <Label htmlFor="target">Target {formData.scope}</Label>
          <Select value={formData.targetId} onValueChange={handleTargetChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${formData.scope.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {formData.scope === 'Section' && mockSections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  {section.name}
                </SelectItem>
              ))}
              {formData.scope === 'Student' && mockStudents.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.roll})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="isActive">Active</Label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsAddModalOpen(false)
            setEditingNotice(null)
            resetForm()
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editingNotice ? 'Update' : 'Create'} Notice
        </Button>
      </div>
    </form>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notices</h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Notice</DialogTitle>
              </DialogHeader>
              <NoticeForm />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notice Management
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={scopeFilter} onValueChange={setScopeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Scopes</SelectItem>
                    <SelectItem value="Global">Global</SelectItem>
                    <SelectItem value="Section">Section</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotices.map((notice) => (
                  <TableRow key={notice.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{notice.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {notice.body}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getScopeColor(notice.scope) as any}>
                        {notice.scope}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {notice.targetName || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={notice.priority === 'High' ? undefined : getPriorityColor(notice.priority) as any} className={notice.priority === 'High' ? 'bg-primary text-white rounded-full border-transparent hover:bg-primary/90 !text-white' : ''}>
                        {notice.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{notice.author}</TableCell>
                    <TableCell className="text-sm">
                      {formatDate(notice.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleNoticeStatus(notice.id)}
                        className={notice.isActive ? 'text-green-600' : 'text-gray-400'}
                      >
                        {notice.isActive ? 'Active' : 'Inactive'}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(notice)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(notice.id)}
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
        <Dialog open={!!editingNotice} onOpenChange={() => setEditingNotice(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Notice</DialogTitle>
            </DialogHeader>
            <NoticeForm />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}