'use client';

import * as React from 'react';
import { DashboardLayout, PageHeader } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  Modal,
  EmptyState,
  Badge,
} from '@/components/ui';
import { useNoticeStore, Notice } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  Bell,
  Plus,
  Search,
  Trash2,
  AlertCircle,
  AlertTriangle,
  Info,
  Megaphone,
  Users,
  GraduationCap,
  Clock,
  X,
  Eye,
  Send,
  CheckCircle,
} from 'lucide-react';

// ============================================
// NOTICES PAGE
// ============================================

export default function NoticesPage() {
  const { notices, addNotice, deleteNotice, markAsRead } = useNoticeStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [priorityFilter, setPriorityFilter] = React.useState('');
  const [targetFilter, setTargetFilter] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedNotice, setSelectedNotice] = React.useState<Notice | null>(null);

  // Filter notices
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = !priorityFilter || notice.priority === priorityFilter;
    const matchesTarget = !targetFilter || notice.targetRole === targetFilter;
    return matchesSearch && matchesPriority && matchesTarget;
  });

  // Stats
  const stats = {
    total: notices.length,
    unread: notices.filter((n) => !n.isRead).length,
    high: notices.filter((n) => n.priority === 'high').length,
    forTeachers: notices.filter((n) => n.targetRole === 'teachers').length,
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotice(id);
  };

  const clearSearch = () => setSearchQuery('');

  const clearAllFilters = () => {
    setSearchQuery('');
    setPriorityFilter('');
    setTargetFilter('');
  };

  const hasActiveFilters = searchQuery || priorityFilter || targetFilter;

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ];

  const targetOptions = [
    { value: '', label: 'All Targets' },
    { value: 'teachers', label: 'Teachers Only' },
    { value: 'students', label: 'Students Only' },
    { value: 'all', label: 'Everyone' },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Notice Management"
        description="Create and manage notices for teachers and students"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Notices' },
        ]}
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Notice
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Notices</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unread Notices</p>
                <p className="text-3xl font-bold text-gray-900">{stats.unread}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">High Priority</p>
                <p className="text-3xl font-bold text-gray-900">{stats.high}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">For Teachers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.forTeachers}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            Notice List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search & Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-6 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-3 h-3 text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="flex gap-3 ">
              <Select
                options={priorityOptions}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-40"
              />
              <Select
                options={targetOptions}
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
                className="w-40"
              />
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters} className="gap-2">
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Notices List */}
          {filteredNotices.length === 0 ? (
            <EmptyState
              icon={<Bell className="w-12 h-12" />}
              title="No notices found"
              description={hasActiveFilters 
                ? "Try adjusting your search or filters" 
                : "Create your first notice to get started"
              }
              action={
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Notice
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {filteredNotices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onClick={() => {
                    setSelectedNotice(notice);
                    markAsRead(notice.id);
                  }}
                  onDelete={(e) => handleDelete(notice.id, e)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Notice Modal */}
      <AddNoticeModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={(data) => {
          addNotice(data);
          setShowAddModal(false);
        }}
      />

      {/* View Notice Modal */}
      {selectedNotice && (
        <ViewNoticeModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
          onDelete={() => {
            deleteNotice(selectedNotice.id);
            setSelectedNotice(null);
          }}
        />
      )}
    </DashboardLayout>
  );
}

// ============================================
// NOTICE CARD COMPONENT
// ============================================

interface NoticeCardProps {
  notice: Notice;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

function NoticeCard({ notice, onClick, onDelete }: NoticeCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-l-red-500',
          badgeVariant: 'danger' as const,
        };
      case 'medium':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-l-amber-500',
          badgeVariant: 'warning' as const,
        };
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-l-blue-500',
          badgeVariant: 'info' as const,
        };
    }
  };

  const getTargetConfig = (target: string) => {
    switch (target) {
      case 'teachers':
        return { icon: <GraduationCap className="w-3.5 h-3.5" />, label: 'Teachers', variant: 'info' as const };
      case 'students':
        return { icon: <Users className="w-3.5 h-3.5" />, label: 'Students', variant: 'success' as const };
      default:
        return { icon: <Users className="w-3.5 h-3.5" />, label: 'Everyone', variant: 'default' as const };
    }
  };

  const priorityConfig = getPriorityConfig(notice.priority);
  const targetConfig = getTargetConfig(notice.targetRole);

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative p-4 rounded-xl border bg-white cursor-pointer',
        'transition-all duration-200 hover:shadow-lg hover:border-gray-300',
        'border-l-4',
        priorityConfig.borderColor,
        !notice.isRead && 'bg-blue-50/30'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Priority Icon */}
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
          priorityConfig.bgColor,
          priorityConfig.color
        )}>
          {priorityConfig.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {notice.title}
              </h3>
              {!notice.isRead && (
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 mt-1 line-clamp-2 text-sm">{notice.message}</p>
          
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <Badge variant={priorityConfig.badgeVariant}>
              {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
            </Badge>
            <Badge variant={targetConfig.variant} className="gap-1">
              {targetConfig.icon}
              {targetConfig.label}
            </Badge>
            <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
              <Clock className="w-3.5 h-3.5" />
              {formatDate(notice.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ADD NOTICE MODAL
// ============================================

interface AddNoticeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Notice, 'id' | 'createdAt' | 'isRead'>) => void;
}

function AddNoticeModal({ open, onClose, onSubmit }: AddNoticeModalProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetRole: 'all' as 'all' | 'teachers' | 'students',
    createdBy: 'Admin',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) return;
    onSubmit(formData);
    setFormData({
      title: '',
      message: '',
      priority: 'medium',
      targetRole: 'all',
      createdBy: 'Admin',
    });
  };

  const priorityFormOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  const targetFormOptions = [
    { value: 'all', label: 'Everyone' },
    { value: 'teachers', label: 'Teachers Only' },
    { value: 'students', label: 'Students Only' },
  ];

  return (
    <Modal isOpen={open} onClose={onClose} title="Create New Notice" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter notice title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Enter notice message..."
            rows={4}
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            options={priorityFormOptions}
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
          />
          <Select
            label="Target Audience"
            options={targetFormOptions}
            value={formData.targetRole}
            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value as 'all' | 'teachers' | 'students' })}
          />
        </div>

        {/* Priority Preview */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Preview</p>
          <div className="flex items-center gap-2">
            {formData.priority === 'high' && <AlertCircle className="w-4 h-4 text-red-500" />}
            {formData.priority === 'medium' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
            {formData.priority === 'low' && <Info className="w-4 h-4 text-blue-500" />}
            <span className="text-sm font-medium text-gray-900">
              {formData.title || 'Notice Title'}
            </span>
            <Badge variant={formData.priority === 'high' ? 'danger' : formData.priority === 'medium' ? 'warning' : 'info'}>
              {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Send className="w-4 h-4 mr-2" />
            Send Notice
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ============================================
// VIEW NOTICE MODAL
// ============================================

interface ViewNoticeModalProps {
  notice: Notice;
  onClose: () => void;
  onDelete: () => void;
}

function ViewNoticeModal({ notice, onClose, onDelete }: ViewNoticeModalProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-500', bg: 'bg-red-50', variant: 'danger' as const };
      case 'medium':
        return { icon: <AlertTriangle className="w-5 h-5" />, color: 'text-amber-500', bg: 'bg-amber-50', variant: 'warning' as const };
      default:
        return { icon: <Info className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-50', variant: 'info' as const };
    }
  };

  const priorityConfig = getPriorityConfig(notice.priority);

  return (
    <Modal isOpen={true} onClose={onClose} title="Notice Details" size="md">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
            priorityConfig.bg,
            priorityConfig.color
          )}>
            {priorityConfig.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{notice.title}</h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant={priorityConfig.variant}>
                {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)} Priority
              </Badge>
              <Badge variant="info">
                {notice.targetRole === 'all' ? 'Everyone' : notice.targetRole.charAt(0).toUpperCase() + notice.targetRole.slice(1)}
              </Badge>
              {notice.isRead ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Read
                </Badge>
              ) : (
                <Badge variant="warning" className="gap-1">
                  <Clock className="w-3 h-3" />
                  Unread
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{notice.message}</p>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-xs mb-1">Created By</p>
            <p className="font-medium text-gray-900">{notice.createdBy}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-xs mb-1">Date & Time</p>
            <p className="font-medium text-gray-900 text-xs">{formatDate(notice.createdAt)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="ghost" onClick={onDelete} className="text-red-600 hover:bg-red-50 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Notice
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
