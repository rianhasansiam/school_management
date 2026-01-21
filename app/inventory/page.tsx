'use client';

import * as React from 'react';
import { DashboardLayout, PageHeader } from '@/components/layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Input,
  Select,
  Modal,
  Pagination,
  EmptyState,
} from '@/components/ui';
import { formatDate, cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Package,
  Lightbulb,
  Fan,
  Armchair,
  Table2,
  Monitor,
  Laptop,
  Printer,
  Projector,
  BookOpen,
  FolderPlus,
  Check,
  AlertCircle,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface InventoryCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  isCustom: boolean;
  createdAt: Date;
}

interface InventoryItem {
  id: string;
  name: string;
  categoryId: string;
  quantity: number;
  workingQuantity: number;
  damagedQuantity: number;
  location: string;
  lastUpdated: Date;
  notes?: string;
}

// ============================================
// DEMO DATA
// ============================================

const DEMO_CATEGORIES: InventoryCategory[] = [
  { id: 'cat-1', name: 'Lights', icon: 'Lightbulb', description: 'All lighting equipment', isCustom: false, createdAt: new Date('2024-01-01') },
  { id: 'cat-2', name: 'Fans', icon: 'Fan', description: 'Ceiling and standing fans', isCustom: false, createdAt: new Date('2024-01-01') },
  { id: 'cat-3', name: 'Chairs', icon: 'Armchair', description: 'Student and office chairs', isCustom: false, createdAt: new Date('2024-01-01') },
  { id: 'cat-4', name: 'Tables', icon: 'Table2', description: 'Desks and tables', isCustom: false, createdAt: new Date('2024-01-01') },
  { id: 'cat-5', name: 'Computers', icon: 'Monitor', description: 'Desktop computers', isCustom: false, createdAt: new Date('2024-01-01') },
  { id: 'cat-6', name: 'Laptops', icon: 'Laptop', description: 'Portable computers', isCustom: false, createdAt: new Date('2024-01-01') },
  { id: 'cat-7', name: 'Printers', icon: 'Printer', description: 'Printers and scanners', isCustom: false, createdAt: new Date('2024-01-01') },
  { id: 'cat-8', name: 'Projectors', icon: 'Projector', description: 'Projectors and screens', isCustom: false, createdAt: new Date('2024-01-01') },
  { id: 'cat-9', name: 'Books', icon: 'BookOpen', description: 'Library and textbooks', isCustom: false, createdAt: new Date('2024-01-01') },
  { id: 'cat-10', name: 'Lab Equipment', icon: 'Package', description: 'Science lab equipment', isCustom: true, createdAt: new Date('2024-06-15') },
  { id: 'cat-11', name: 'Sports Equipment', icon: 'Package', description: 'Sports and games items', isCustom: true, createdAt: new Date('2024-07-20') },
];

const DEMO_ITEMS: InventoryItem[] = [
  // Lights
  { id: 'item-1', name: 'LED Tube Light', categoryId: 'cat-1', quantity: 250, workingQuantity: 235, damagedQuantity: 15, location: 'All Classrooms', lastUpdated: new Date('2024-12-01'), notes: 'Regular maintenance scheduled' },
  { id: 'item-2', name: 'CFL Bulbs', categoryId: 'cat-1', quantity: 100, workingQuantity: 92, damagedQuantity: 8, location: 'Corridors & Offices', lastUpdated: new Date('2024-11-15') },
  { id: 'item-3', name: 'Emergency Lights', categoryId: 'cat-1', quantity: 30, workingQuantity: 28, damagedQuantity: 2, location: 'All Buildings', lastUpdated: new Date('2024-12-10') },
  
  // Fans
  { id: 'item-4', name: 'Ceiling Fans', categoryId: 'cat-2', quantity: 180, workingQuantity: 172, damagedQuantity: 8, location: 'All Classrooms', lastUpdated: new Date('2024-11-20') },
  { id: 'item-5', name: 'Standing Fans', categoryId: 'cat-2', quantity: 25, workingQuantity: 23, damagedQuantity: 2, location: 'Staff Rooms', lastUpdated: new Date('2024-10-05') },
  { id: 'item-6', name: 'Exhaust Fans', categoryId: 'cat-2', quantity: 40, workingQuantity: 38, damagedQuantity: 2, location: 'Labs & Canteen', lastUpdated: new Date('2024-09-28') },
  
  // Chairs
  { id: 'item-7', name: 'Student Chairs (Wooden)', categoryId: 'cat-3', quantity: 800, workingQuantity: 750, damagedQuantity: 50, location: 'All Classrooms', lastUpdated: new Date('2024-12-05'), notes: '50 chairs need repair' },
  { id: 'item-8', name: 'Student Chairs (Plastic)', categoryId: 'cat-3', quantity: 200, workingQuantity: 190, damagedQuantity: 10, location: 'Assembly Hall', lastUpdated: new Date('2024-11-10') },
  { id: 'item-9', name: 'Office Chairs', categoryId: 'cat-3', quantity: 50, workingQuantity: 48, damagedQuantity: 2, location: 'Admin Building', lastUpdated: new Date('2024-10-20') },
  { id: 'item-10', name: 'Teacher Chairs', categoryId: 'cat-3', quantity: 60, workingQuantity: 58, damagedQuantity: 2, location: 'All Classrooms', lastUpdated: new Date('2024-11-25') },
  
  // Tables
  { id: 'item-11', name: 'Student Desks', categoryId: 'cat-4', quantity: 400, workingQuantity: 385, damagedQuantity: 15, location: 'All Classrooms', lastUpdated: new Date('2024-12-01') },
  { id: 'item-12', name: 'Teacher Desks', categoryId: 'cat-4', quantity: 40, workingQuantity: 40, damagedQuantity: 0, location: 'All Classrooms', lastUpdated: new Date('2024-10-15') },
  { id: 'item-13', name: 'Lab Tables', categoryId: 'cat-4', quantity: 30, workingQuantity: 28, damagedQuantity: 2, location: 'Science Labs', lastUpdated: new Date('2024-09-10') },
  { id: 'item-14', name: 'Office Tables', categoryId: 'cat-4', quantity: 25, workingQuantity: 25, damagedQuantity: 0, location: 'Admin Building', lastUpdated: new Date('2024-08-20') },
  
  // Computers
  { id: 'item-15', name: 'Desktop Computers', categoryId: 'cat-5', quantity: 45, workingQuantity: 42, damagedQuantity: 3, location: 'Computer Lab', lastUpdated: new Date('2024-12-08'), notes: '3 units under repair' },
  { id: 'item-16', name: 'Monitors', categoryId: 'cat-5', quantity: 50, workingQuantity: 47, damagedQuantity: 3, location: 'Computer Lab & Offices', lastUpdated: new Date('2024-11-30') },
  
  // Laptops
  { id: 'item-17', name: 'Admin Laptops', categoryId: 'cat-6', quantity: 15, workingQuantity: 15, damagedQuantity: 0, location: 'Admin Building', lastUpdated: new Date('2024-12-10') },
  { id: 'item-18', name: 'Teacher Laptops', categoryId: 'cat-6', quantity: 20, workingQuantity: 19, damagedQuantity: 1, location: 'Staff Room', lastUpdated: new Date('2024-11-28') },
  
  // Printers
  { id: 'item-19', name: 'Laser Printers', categoryId: 'cat-7', quantity: 8, workingQuantity: 7, damagedQuantity: 1, location: 'Admin & Staff Rooms', lastUpdated: new Date('2024-12-05') },
  { id: 'item-20', name: 'Inkjet Printers', categoryId: 'cat-7', quantity: 5, workingQuantity: 5, damagedQuantity: 0, location: 'Computer Lab', lastUpdated: new Date('2024-10-25') },
  
  // Projectors
  { id: 'item-21', name: 'LCD Projectors', categoryId: 'cat-8', quantity: 12, workingQuantity: 11, damagedQuantity: 1, location: 'Conference & Smart Classes', lastUpdated: new Date('2024-11-15') },
  { id: 'item-22', name: 'Projector Screens', categoryId: 'cat-8', quantity: 15, workingQuantity: 14, damagedQuantity: 1, location: 'Conference & Smart Classes', lastUpdated: new Date('2024-10-10') },
  
  // Books
  { id: 'item-23', name: 'Textbooks', categoryId: 'cat-9', quantity: 2500, workingQuantity: 2350, damagedQuantity: 150, location: 'Library', lastUpdated: new Date('2024-12-01') },
  { id: 'item-24', name: 'Reference Books', categoryId: 'cat-9', quantity: 800, workingQuantity: 780, damagedQuantity: 20, location: 'Library', lastUpdated: new Date('2024-11-20') },
  
  // Lab Equipment
  { id: 'item-25', name: 'Microscopes', categoryId: 'cat-10', quantity: 25, workingQuantity: 23, damagedQuantity: 2, location: 'Biology Lab', lastUpdated: new Date('2024-12-03') },
  { id: 'item-26', name: 'Beakers & Test Tubes', categoryId: 'cat-10', quantity: 200, workingQuantity: 180, damagedQuantity: 20, location: 'Chemistry Lab', lastUpdated: new Date('2024-11-28') },
  
  // Sports Equipment
  { id: 'item-27', name: 'Footballs', categoryId: 'cat-11', quantity: 20, workingQuantity: 18, damagedQuantity: 2, location: 'Sports Room', lastUpdated: new Date('2024-12-08') },
  { id: 'item-28', name: 'Cricket Bats', categoryId: 'cat-11', quantity: 15, workingQuantity: 14, damagedQuantity: 1, location: 'Sports Room', lastUpdated: new Date('2024-11-15') },
  { id: 'item-29', name: 'Badminton Rackets', categoryId: 'cat-11', quantity: 30, workingQuantity: 28, damagedQuantity: 2, location: 'Sports Room', lastUpdated: new Date('2024-10-20') },
];

// Icon mapping for categories
const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Fan,
  Armchair,
  Table2,
  Monitor,
  Laptop,
  Printer,
  Projector,
  BookOpen,
  Package,
};

const ITEMS_PER_PAGE = 10;

// ============================================
// MAIN COMPONENT
// ============================================

export default function InventoryPage() {
  const [categories, setCategories] = React.useState<InventoryCategory[]>(DEMO_CATEGORIES);
  const [items, setItems] = React.useState<InventoryItem[]>(DEMO_ITEMS);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<'items' | 'categories'>('items');
  
  // Modals
  const [isAddItemModalOpen, setIsAddItemModalOpen] = React.useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = React.useState(false);
  const [isViewItemModalOpen, setIsViewItemModalOpen] = React.useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null);
  
  // Form states
  const [newItem, setNewItem] = React.useState({
    name: '',
    categoryId: '',
    quantity: 0,
    workingQuantity: 0,
    damagedQuantity: 0,
    location: '',
    notes: '',
  });
  
  const [newCategory, setNewCategory] = React.useState({
    name: '',
    description: '',
  });

  // Filter items
  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Stats
  const stats = React.useMemo(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const workingItems = items.reduce((acc, item) => acc + item.workingQuantity, 0);
    const damagedItems = items.reduce((acc, item) => acc + item.damagedQuantity, 0);
    return { totalItems, workingItems, damagedItems, categories: categories.length };
  }, [items, categories]);

  // Get category by ID
  const getCategoryById = (id: string) => categories.find(c => c.id === id);

  // Get category icon component
  const getCategoryIcon = (iconName: string) => {
    return categoryIconMap[iconName] || Package;
  };

  // Get items count by category
  const getItemsCountByCategory = (categoryId: string) => {
    return items.filter(item => item.categoryId === categoryId).reduce((acc, item) => acc + item.quantity, 0);
  };

  // Handle add item
  const handleAddItem = () => {
    const item: InventoryItem = {
      id: `item-${Date.now()}`,
      name: newItem.name,
      categoryId: newItem.categoryId,
      quantity: newItem.quantity,
      workingQuantity: newItem.workingQuantity,
      damagedQuantity: newItem.damagedQuantity,
      location: newItem.location,
      lastUpdated: new Date(),
      notes: newItem.notes || undefined,
    };
    setItems([...items, item]);
    setIsAddItemModalOpen(false);
    setNewItem({ name: '', categoryId: '', quantity: 0, workingQuantity: 0, damagedQuantity: 0, location: '', notes: '' });
  };

  // Handle add category
  const handleAddCategory = () => {
    const category: InventoryCategory = {
      id: `cat-${Date.now()}`,
      name: newCategory.name,
      icon: 'Package',
      description: newCategory.description,
      isCustom: true,
      createdAt: new Date(),
    };
    setCategories([...categories, category]);
    setIsAddCategoryModalOpen(false);
    setNewCategory({ name: '', description: '' });
  };

  // Handle edit item
  const handleEditItem = () => {
    if (!selectedItem) return;
    setItems(items.map(item => 
      item.id === selectedItem.id 
        ? { ...selectedItem, lastUpdated: new Date() }
        : item
    ));
    setIsEditItemModalOpen(false);
    setSelectedItem(null);
  };

  // Handle delete item
  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Handle delete category
  const handleDeleteCategory = (id: string) => {
    const itemsInCategory = items.filter(item => item.categoryId === id).length;
    if (itemsInCategory > 0) {
      alert(`Cannot delete category. ${itemsInCategory} items are using this category.`);
      return;
    }
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Inventory Management"
        description="Track and manage school inventory items"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Inventory' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAddCategoryModalOpen(true)}>
              <FolderPlus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">New Category</span>
            </Button>
            <Button onClick={() => setIsAddItemModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Item</span>
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-gray-800" />
              <div>
                <p className="text-xs md:text-sm text-gray-600">Total Items</p>
                <p className="text-lg md:text-2xl font-bold text-gray-800">{stats.totalItems.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Check className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              <div>
                <p className="text-xs md:text-sm text-green-600">Working</p>
                <p className="text-lg md:text-2xl font-bold text-green-800">{stats.workingItems.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              <div>
                <p className="text-xs md:text-sm text-red-600">Damaged</p>
                <p className="text-lg md:text-2xl font-bold text-red-800">{stats.damagedItems.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <FolderPlus className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              <div>
                <p className="text-xs md:text-sm text-purple-600">Categories</p>
                <p className="text-lg md:text-2xl font-bold text-purple-800">{stats.categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('items')}
          className={cn(
            'px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors whitespace-nowrap',
            activeTab === 'items'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Inventory Items
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={cn(
            'px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition-colors whitespace-nowrap',
            activeTab === 'categories'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          Categories
        </button>
      </div>

      {/* Items Tab */}
      {activeTab === 'items' && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
              <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                <Package className="w-4 h-4 md:w-5 md:h-5" />
                Inventory Items
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            {filteredItems.length === 0 ? (
              <EmptyState
                icon={<Package className="w-12 h-12" />}
                title="No items found"
                description="No inventory items match your search criteria."
              />
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {paginatedItems.map((item) => {
                    const category = getCategoryById(item.categoryId);
                    const CategoryIcon = category ? getCategoryIcon(category.icon) : Package;
                    return (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border">
                              <CategoryIcon className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-900">{item.name}</p>
                              <Badge variant="default" className="text-xs mt-0.5">{category?.name || 'Unknown'}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                setSelectedItem(item);
                                setIsViewItemModalOpen(true);
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                setSelectedItem(item);
                                setIsEditItemModalOpen(true);
                              }}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3">
                          <div className="text-center p-2 bg-white rounded border">
                            <p className="text-lg font-bold text-gray-800">{item.quantity}</p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded border border-green-100">
                            <p className="text-lg font-bold text-green-600">{item.workingQuantity}</p>
                            <p className="text-xs text-green-600">Working</p>
                          </div>
                          <div className="text-center p-2 bg-red-50 rounded border border-red-100">
                            <p className={cn("text-lg font-bold", item.damagedQuantity > 0 ? "text-red-600" : "text-gray-400")}>{item.damagedQuantity}</p>
                            <p className="text-xs text-red-600">Damaged</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t text-xs text-gray-500">
                          <span className="truncate">{item.location}</span>
                          <span>{formatDate(item.lastUpdated)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-center">Working</TableHead>
                        <TableHead className="text-center">Damaged</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedItems.map((item) => {
                        const category = getCategoryById(item.categoryId);
                        const CategoryIcon = category ? getCategoryIcon(category.icon) : Package;
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                  <CategoryIcon className="w-4 h-4 text-gray-600" />
                                </div>
                                <span className="font-medium">{item.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="default">{category?.name || 'Unknown'}</Badge>
                            </TableCell>
                            <TableCell className="text-center font-semibold">{item.quantity}</TableCell>
                            <TableCell className="text-center">
                              <span className="text-green-600 font-medium">{item.workingQuantity}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={cn(
                                "font-medium",
                                item.damagedQuantity > 0 ? "text-red-600" : "text-gray-400"
                              )}>
                                {item.damagedQuantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-gray-600">{item.location}</TableCell>
                            <TableCell className="text-gray-500 text-sm">
                              {formatDate(item.lastUpdated)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setIsViewItemModalOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setIsEditItemModalOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteItem(item.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {categories.map((category) => {
            const CategoryIcon = getCategoryIcon(category.icon);
            const itemCount = getItemsCountByCategory(category.id);
            return (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <CategoryIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{category.name}</h3>
                        <p className="text-xs md:text-sm text-gray-500 truncate">{category.description}</p>
                      </div>
                    </div>
                    {category.isCustom && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-gray-400 hover:text-red-500 shrink-0 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="mt-3 md:mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-xs md:text-sm text-gray-600">{itemCount.toLocaleString()} items</span>
                    </div>
                    {category.isCustom && (
                      <Badge variant="info" className="text-xs">Custom</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        title="Add New Item"
      >
        <div className="space-y-4">
          <Input
            label="Item Name"
            placeholder="Enter item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
          <Select
            label="Category"
            options={categories.map(c => ({ label: c.name, value: c.id }))}
            value={newItem.categoryId}
            onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
            placeholder="Select category"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Total Qty"
              type="number"
              min={0}
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
              required
            />
            <Input
              label="Working"
              type="number"
              min={0}
              value={newItem.workingQuantity}
              onChange={(e) => setNewItem({ ...newItem, workingQuantity: parseInt(e.target.value) || 0 })}
              required
            />
            <Input
              label="Damaged"
              type="number"
              min={0}
              value={newItem.damagedQuantity}
              onChange={(e) => setNewItem({ ...newItem, damagedQuantity: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <Input
            label="Location"
            placeholder="Enter location"
            value={newItem.location}
            onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
            required
          />
          <Input
            label="Notes (Optional)"
            placeholder="Enter any notes"
            value={newItem.notes}
            onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
          />
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={handleAddItem}
              disabled={!newItem.name || !newItem.categoryId || !newItem.location}
              className="w-full sm:w-auto"
            >
              Add Item
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="Create New Category"
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            placeholder="Enter category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            placeholder="Enter category description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            required
          />
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsAddCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="w-full sm:w-auto"
              onClick={handleAddCategory}
              disabled={!newCategory.name || !newCategory.description}
            >
              Create Category
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Item Modal */}
      <Modal
        isOpen={isViewItemModalOpen}
        onClose={() => {
          setIsViewItemModalOpen(false);
          setSelectedItem(null);
        }}
        title="Item Details"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                {(() => {
                  const category = getCategoryById(selectedItem.categoryId);
                  const CategoryIcon = category ? getCategoryIcon(category.icon) : Package;
                  return <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />;
                })()}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-base sm:text-lg truncate">{selectedItem.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{getCategoryById(selectedItem.categoryId)?.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-lg sm:text-2xl font-bold text-gray-800">{selectedItem.quantity}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-50 rounded-lg text-center">
                <p className="text-lg sm:text-2xl font-bold text-green-700">{selectedItem.workingQuantity}</p>
                <p className="text-xs text-green-600">Working</p>
              </div>
              <div className="p-2 sm:p-3 bg-red-50 rounded-lg text-center">
                <p className="text-lg sm:text-2xl font-bold text-red-700">{selectedItem.damagedQuantity}</p>
                <p className="text-xs text-red-600">Damaged</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                <span className="text-gray-600">Location</span>
                <span className="font-medium text-right">{selectedItem.location}</span>
              </div>
              <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium text-right">{formatDate(selectedItem.lastUpdated)}</span>
              </div>
              {selectedItem.notes && (
                <div className="py-2">
                  <span className="text-gray-600 text-sm sm:text-base">Notes</span>
                  <p className="mt-1 text-xs sm:text-sm bg-gray-50 p-2 rounded">{selectedItem.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-4">
              <Button className="w-full sm:w-auto" onClick={() => {
                setIsViewItemModalOpen(false);
                setSelectedItem(null);
              }}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditItemModalOpen}
        onClose={() => {
          setIsEditItemModalOpen(false);
          setSelectedItem(null);
        }}
        title="Edit Item"
      >
        {selectedItem && (
          <div className="space-y-4">
            <Input
              label="Item Name"
              placeholder="Enter item name"
              value={selectedItem.name}
              onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
              required
            />
            <Select
              label="Category"
              options={categories.map(c => ({ label: c.name, value: c.id }))}
              value={selectedItem.categoryId}
              onChange={(e) => setSelectedItem({ ...selectedItem, categoryId: e.target.value })}
              placeholder="Select category"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Total Quantity"
                type="number"
                min={0}
                value={selectedItem.quantity}
                onChange={(e) => setSelectedItem({ ...selectedItem, quantity: parseInt(e.target.value) || 0 })}
                required
              />
              <Input
                label="Working"
                type="number"
                min={0}
                value={selectedItem.workingQuantity}
                onChange={(e) => setSelectedItem({ ...selectedItem, workingQuantity: parseInt(e.target.value) || 0 })}
                required
              />
              <Input
                label="Damaged"
                type="number"
                min={0}
                value={selectedItem.damagedQuantity}
                onChange={(e) => setSelectedItem({ ...selectedItem, damagedQuantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <Input
              label="Location"
              placeholder="Enter location"
              value={selectedItem.location}
              onChange={(e) => setSelectedItem({ ...selectedItem, location: e.target.value })}
              required
            />
            <Input
              label="Notes (Optional)"
              placeholder="Enter any notes"
              value={selectedItem.notes || ''}
              onChange={(e) => setSelectedItem({ ...selectedItem, notes: e.target.value })}
            />
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => {
                setIsEditItemModalOpen(false);
                setSelectedItem(null);
              }}>
                Cancel
              </Button>
              <Button className="w-full sm:w-auto" onClick={handleEditItem}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
