'use client'

import { useState } from 'react'
import AdminLayout from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Send, MessageCircle, MoreVertical, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isRead: boolean
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantRole: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  messages: Message[]
}

const mockStaff = [
  { id: 'admin1', name: 'John Admin', role: 'System Administrator' },
  { id: 'admin2', name: 'Sarah Manager', role: 'Academic Manager' },
  { id: 'staff1', name: 'Mike Support', role: 'IT Support' },
  { id: 'staff2', name: 'Lisa Coordinator', role: 'Student Coordinator' },
  { id: 'staff3', name: 'David Clerk', role: 'Administrative Clerk' }
]

const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'teacher1',
    participantName: 'Dr. Smith',
    participantRole: 'Computer Science Professor',
    lastMessage: 'The assignment deadline has been extended to next Friday.',
    lastMessageTime: '2024-03-10T14:30:00Z',
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        senderId: 'admin',
        senderName: 'Admin',
        content: 'Hi Dr. Smith, I wanted to discuss the upcoming exam schedule.',
        timestamp: '2024-03-10T10:00:00Z',
        isRead: true
      },
      {
        id: 'm2',
        senderId: 'teacher1',
        senderName: 'Dr. Smith',
        content: 'Hello! Yes, I have some concerns about the timing.',
        timestamp: '2024-03-10T10:15:00Z',
        isRead: true
      },
      {
        id: 'm3',
        senderId: 'admin',
        senderName: 'Admin',
        content: 'What would be a better time for your students?',
        timestamp: '2024-03-10T10:30:00Z',
        isRead: true
      },
      {
        id: 'm4',
        senderId: 'teacher1',
        senderName: 'Dr. Smith',
        content: 'I think next week would be better. Students need more preparation time.',
        timestamp: '2024-03-10T14:00:00Z',
        isRead: true
      },
      {
        id: 'm5',
        senderId: 'teacher1',
        senderName: 'Dr. Smith',
        content: 'The assignment deadline has been extended to next Friday.',
        timestamp: '2024-03-10T14:30:00Z',
        isRead: false
      }
    ]
  },
  {
    id: '2',
    participantId: 'teacher2',
    participantName: 'Prof. Davis',
    participantRole: 'Mathematics Professor',
    lastMessage: 'I\'ll send the grade reports by tomorrow.',
    lastMessageTime: '2024-03-09T16:45:00Z',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'm6',
        senderId: 'admin',
        senderName: 'Admin',
        content: 'Hi Prof. Davis, when can we expect the grade reports?',
        timestamp: '2024-03-09T15:00:00Z',
        isRead: true
      },
      {
        id: 'm7',
        senderId: 'teacher2',
        senderName: 'Prof. Davis',
        content: 'I\'ll send the grade reports by tomorrow.',
        timestamp: '2024-03-09T16:45:00Z',
        isRead: true
      }
    ]
  },
  {
    id: '3',
    participantId: 'teacher3',
    participantName: 'Dr. Wilson',
    participantRole: 'Physics Professor',
    lastMessage: 'The lab equipment has been ordered.',
    lastMessageTime: '2024-03-08T11:20:00Z',
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: 'm8',
        senderId: 'teacher3',
        senderName: 'Dr. Wilson',
        content: 'The lab equipment has been ordered.',
        timestamp: '2024-03-08T11:20:00Z',
        isRead: false
      }
    ]
  },
  {
    id: '4',
    participantId: 'teacher4',
    participantName: 'Dr. Johnson',
    participantRole: 'Computer Science Professor',
    lastMessage: 'Thanks for the update on the new curriculum.',
    lastMessageTime: '2024-03-07T09:30:00Z',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'm9',
        senderId: 'admin',
        senderName: 'Admin',
        content: 'We\'ve updated the curriculum for next semester.',
        timestamp: '2024-03-07T09:00:00Z',
        isRead: true
      },
      {
        id: 'm10',
        senderId: 'teacher4',
        senderName: 'Dr. Johnson',
        content: 'Thanks for the update on the new curriculum.',
        timestamp: '2024-03-07T09:30:00Z',
        isRead: true
      }
    ]
  }
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [showNewConversation, setShowNewConversation] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState('')

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !selectedConversation) return
    
    const message: Message = {
      id: Date.now().toString(),
      senderId: 'admin',
      senderName: 'Admin',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: true
    }
    
    setConversations(conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          lastMessage: message.content,
          lastMessageTime: message.timestamp
        }
      }
      return conv
    }))
    
    setSelectedConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: message.content,
      lastMessageTime: message.timestamp
    } : null)
    
    setNewMessage('')
    toast.success('Message sent')
  }

  const markAsRead = (conversationId: string) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, isRead: true }))
        }
      }
      return conv
    }))
  }

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    if (conversation.unreadCount > 0) {
      markAsRead(conversation.id)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleStartNewConversation = () => {
    if (!selectedStaff) {
      toast.error('Please select a staff member')
      return
    }

    const staff = mockStaff.find(s => s.id === selectedStaff)
    if (!staff) return

    // Check if conversation already exists
    const existingConversation = conversations.find(conv => conv.participantId === selectedStaff)
    if (existingConversation) {
      setSelectedConversation(existingConversation)
      setShowNewConversation(false)
      setSelectedStaff('')
      toast.info('Conversation already exists')
      return
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: Date.now().toString(),
      participantId: staff.id,
      participantName: staff.name,
      participantRole: staff.role,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      isOnline: Math.random() > 0.5, // Random online status
      messages: []
    }

    setConversations([newConversation, ...conversations])
    setSelectedConversation(newConversation)
    setShowNewConversation(false)
    setSelectedStaff('')
    toast.success('New conversation started')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="col-span-4">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Conversations
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewConversation(!showNewConversation)}
                    className="rounded-xl"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
                
                {showNewConversation && (
                  <div className="space-y-3 p-3 bg-gray-50 rounded-lg border">
                    <h4 className="font-medium text-sm">Start New Conversation</h4>
                    <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                      <SelectTrigger className="input h-12">
                        <SelectValue placeholder="Select admin or staff member" />
                      </SelectTrigger>
                      <SelectContent className="card border-stroke">
                        {mockStaff.map((staff) => (
                          <SelectItem key={staff.id} value={staff.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{staff.name}</span>
                              <span className="text-xs text-gray-500">{staff.role}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleStartNewConversation}
                        disabled={!selectedStaff}
                        className="flex-1 rounded-xl bg-gradient-to-r from-teal-500 to-mint-500 hover:from-teal-600 hover:to-mint-600 text-white"
                        size="sm"
                      >
                        Start Conversation
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowNewConversation(false)
                          setSelectedStaff('')
                        }}
                        className="rounded-xl"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => selectConversation(conversation)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getInitials(conversation.participantName)}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm truncate">
                              {conversation.participantName}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {formatTime(conversation.lastMessageTime)}
                              </span>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">
                            {conversation.participantRole}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages Pane */}
          <div className="col-span-8">
            <Card className="h-full flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getInitials(selectedConversation.participantName)}
                            </AvatarFallback>
                          </Avatar>
                          {selectedConversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{selectedConversation.participantName}</h3>
                          <p className="text-sm text-gray-500">
                            {selectedConversation.isOnline ? 'Online' : 'Offline'} • {selectedConversation.participantRole}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === 'admin' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === 'admin'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === 'admin'
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  {/* Message Composer */}
                  <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage(e)
                          }
                        }}
                      />
                      <Button type="submit" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}