
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, Shield, User, Mail, Calendar, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

interface AdminUserTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
}

export const AdminUserTable: React.FC<AdminUserTableProps> = ({
  users,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block responsive-table-container">
        <Table className="responsive-table">
          <TableHeader>
            <TableRow className="border-primary/20 hover:bg-primary/5">
              <TableHead className="text-primary font-semibold">User</TableHead>
              <TableHead className="text-primary font-semibold">Email</TableHead>
              <TableHead className="text-primary font-semibold">Role</TableHead>
              <TableHead className="text-primary font-semibold">Status</TableHead>
              <TableHead className="text-primary font-semibold">Created</TableHead>
              <TableHead className="text-primary font-semibold">Last Login</TableHead>
              <TableHead className="text-primary font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-primary/10 hover:bg-primary/5 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-luxury-gradient rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-black" />
                    </div>
                    <span className="text-foreground">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge className={user.role === 'admin' ? 'badge-luxury' : 'bg-muted text-muted-foreground'}>
                    {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                    {user.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'} 
                         className={user.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                    {user.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(user.lastLogin)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-primary/20">
                      <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer hover:bg-primary/10">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleStatus(user.id)} className="cursor-pointer hover:bg-primary/10">
                        Toggle Status
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(user.id)} className="cursor-pointer text-destructive hover:bg-destructive/10">
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="mobile-card luxury-card">
            <div className="mobile-card-header">
              <div className="flex items-center gap-3 mobile-card-title">
                <div className="w-10 h-10 bg-luxury-gradient rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-black" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <div className="mobile-card-actions">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-primary/20">
                    <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer hover:bg-primary/10">
                      <Settings className="h-4 w-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(user.id)} className="cursor-pointer hover:bg-primary/10">
                      Toggle Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(user.id)} className="cursor-pointer text-destructive hover:bg-destructive/10">
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="mobile-card-content">
              <div className="mobile-card-row">
                <span className="mobile-card-label">Role:</span>
                <Badge className={user.role === 'admin' ? 'badge-luxury' : 'bg-muted text-muted-foreground'}>
                  {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                  {user.role.toUpperCase()}
                </Badge>
              </div>
              
              <div className="mobile-card-row">
                <span className="mobile-card-label">Status:</span>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'} 
                       className={user.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                  {user.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="mobile-card-row">
                <span className="mobile-card-label">Created:</span>
                <span className="mobile-card-value">{formatDate(user.createdAt)}</span>
              </div>
              
              <div className="mobile-card-row">
                <span className="mobile-card-label">Last Login:</span>
                <span className="mobile-card-value">{formatDate(user.lastLogin)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
