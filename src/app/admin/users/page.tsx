
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { MoreHorizontal, Search, UserPlus, Edit, Trash2, Shield, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  lastActive: string;
  joinedAt: string;
  totalContent: number;
  totalViews: number;
}

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          status: 'active',
          avatar: '/api/placeholder/40/40',
          lastActive: '2024-01-15T10:30:00Z',
          joinedAt: '2023-01-15T10:30:00Z',
          totalContent: 25,
          totalViews: 15420
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'moderator',
          status: 'active',
          lastActive: '2024-01-14T15:45:00Z',
          joinedAt: '2023-03-10T09:15:00Z',
          totalContent: 18,
          totalViews: 8930
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'user',
          status: 'inactive',
          lastActive: '2024-01-10T12:20:00Z',
          joinedAt: '2023-07-22T14:30:00Z',
          totalContent: 42,
          totalViews: 23150
        },
        {
          id: '4',
          name: 'Alice Williams',
          email: 'alice@example.com',
          role: 'user',
          status: 'suspended',
          lastActive: '2024-01-12T18:00:00Z',
          joinedAt: '2023-05-01T11:00:00Z',
          totalContent: 15,
          totalViews: 6780
        },
        {
          id: '5',
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          role: 'moderator',
          status: 'active',
          lastActive: '2024-01-16T09:00:00Z',
          joinedAt: '2023-09-18T16:45:00Z',
          totalContent: 30,
          totalViews: 19500
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as const }
        : user
    ));
  };

  const changeUserRole = (userId: string, newRole: 'admin' | 'moderator' | 'user') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'moderator': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'suspended': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full-safe max-w-screen-safe">
      <div className="responsive-padding">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">User Management</h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            <Button className="btn-luxury w-full sm:w-auto min-h-[44px] touch-manipulation">
              <UserPlus className="h-4 w-4 mr-2" />
              <span>Add User</span>
            </Button>
          </div>
        </div>

        <Card className="luxury-card w-full">
          <CardHeader className="responsive-padding">
            <div className="flex flex-col gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full min-h-[44px] text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-40 min-h-[44px] text-base">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 min-h-[44px] text-base">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="table-to-cards">
              <div className="responsive-table-container">
                <Table className="responsive-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base font-semibold">User</TableHead>
                      <TableHead className="hidden sm:table-cell text-base font-semibold">Role</TableHead>
                      <TableHead className="hidden md:table-cell text-base font-semibold">Status</TableHead>
                      <TableHead className="hidden lg:table-cell text-base font-semibold">Last Active</TableHead>
                      <TableHead className="hidden lg:table-cell text-base font-semibold">Content</TableHead>
                      <TableHead className="hidden xl:table-cell text-base font-semibold">Views</TableHead>
                      <TableHead className="w-12 text-base font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={7} className="py-4">
                            <div className="animate-pulse flex items-center gap-3">
                              <div className="h-12 w-12 bg-muted rounded-full"></div>
                              <div className="space-y-2 flex-1">
                                <div className="h-4 bg-muted rounded w-32"></div>
                                <div className="h-3 bg-muted rounded w-48"></div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50">
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium truncate text-base">{user.name}</div>
                                <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className={`${getRoleColor(user.role)} text-sm font-medium`}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge className={`${getStatusColor(user.status)} text-sm font-medium`}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">
                            {formatDate(user.lastActive)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">
                            {user.totalContent}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell text-sm">
                            {user.totalViews.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 min-h-[44px] min-w-[44px] touch-manipulation">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="min-h-[44px] text-base">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleUserStatus(user.id)} className="min-h-[44px] text-base">
                                  {user.status === 'active' ? (
                                    <>
                                      <EyeOff className="h-4 w-4 mr-2" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-4 w-4 mr-2" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => changeUserRole(user.id, 'admin')} className="min-h-[44px] text-base">
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => changeUserRole(user.id, 'moderator')} className="min-h-[44px] text-base">
                                  <ShieldCheck className="h-4 w-4 mr-2" />
                                  Make Moderator
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive min-h-[44px] text-base"
                                  onSelect={() => handleDeleteUser(user)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-base">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-cards responsive-padding">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="mobile-card animate-pulse">
                    <div className="mobile-card-header">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-14 w-14 bg-muted rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-5 bg-muted rounded w-3/4"></div>
                          <div className="h-4 bg-muted rounded w-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <div key={user.id} className="mobile-card">
                    <div className="mobile-card-header">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Avatar className="h-14 w-14 flex-shrink-0">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="mobile-card-title">{user.name}</div>
                          <div className="text-sm text-muted-foreground truncate mt-1">{user.email}</div>
                        </div>
                      </div>
                      <div className="mobile-card-actions">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-10 w-10 p-0 min-h-[44px] min-w-[44px] touch-manipulation">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="min-h-[44px] text-base">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleUserStatus(user.id)} className="min-h-[44px] text-base">
                              {user.status === 'active' ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => changeUserRole(user.id, 'admin')} className="min-h-[44px] text-base">
                              <Shield className="h-4 w-4 mr-2" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => changeUserRole(user.id, 'moderator')} className="min-h-[44px] text-base">
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Make Moderator
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive min-h-[44px] text-base"
                              onSelect={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="mobile-card-content">
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Role:</span>
                        <Badge className={`${getRoleColor(user.role)} text-sm font-medium`}>
                          {user.role}
                        </Badge>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Status:</span>
                        <Badge className={`${getStatusColor(user.status)} text-sm font-medium`}>
                          {user.status}
                        </Badge>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Last Active:</span>
                        <span className="mobile-card-value">{formatDate(user.lastActive)}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Content:</span>
                        <span className="mobile-card-value">{user.totalContent}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Views:</span>
                        <span className="mobile-card-value">{user.totalViews.toLocaleString()}</span>
                      </div>
                      <div className="mobile-card-row">
                        <span className="mobile-card-label">Joined:</span>
                        <span className="mobile-card-value">{formatDate(user.joinedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground text-base">
                  No users found
                </div>
              )}
            </div>

            {/* Enhanced Pagination for Mobile */}
            {totalPages > 1 && (
              <div className="responsive-padding border-t">
                <Pagination className="justify-center">
                  <PaginationContent className="flex-wrap gap-2">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={`min-h-[44px] min-w-[44px] touch-manipulation ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
                      />
                    </PaginationItem>

                    {/* Show limited pages on mobile */}
                    {Array.from({ length: Math.min(totalPages, typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 5) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else {
                        if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                      }
                      
                      if (pageNumber > 0 && pageNumber <= totalPages) {
                        return (
                          <PaginationItem key={pageNumber} className="hidden sm:block">
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="min-h-[44px] min-w-[44px] touch-manipulation"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    {/* Mobile page indicator */}
                    <PaginationItem className="sm:hidden">
                      <span className="px-4 py-2 text-sm text-muted-foreground">
                        {currentPage} / {totalPages}
                      </span>
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={`min-h-[44px] min-w-[44px] touch-manipulation ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="w-full max-w-md mx-4">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">Delete User</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-3">
              <AlertDialogCancel className="w-full sm:w-auto min-h-[44px] touch-manipulation">Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteUser}
                className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 min-h-[44px] touch-manipulation"
              >
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
