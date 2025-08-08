

'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { getUsers, setUsers } from '@/lib/localStorage';
import { useAuth } from '@/lib/auth';
import type { User } from '@/lib/types';
import { useToast } from "@/lib/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';


function UserTableSkeleton() {
    return (
        <div className="bg-card border border-border rounded-lg shadow-lg">
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]"><Skeleton className="h-5 w-full" /></TableHead>
                        <TableHead><Skeleton className="h-5 w-1/2" /></TableHead>
                        <TableHead className="w-[150px]"><Skeleton className="h-5 w-full" /></TableHead>
                        <TableHead className="w-[100px] text-right"><Skeleton className="h-5 w-full" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Skeleton className="h-10 w-10 rounded-full" />
                            </TableCell>
                            <TableCell>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-10 w-full" />
                            </TableCell>
                             <TableCell className="text-right">
                                <Skeleton className="h-8 w-8 ml-auto" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default function ManageUsersPage() {
    const { currentUser: adminUser } = useAuth();
    const { toast } = useToast();
    const [users, setLocalUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, startUpdateTransition] = useTransition();

    const fetchUsers = useCallback(() => {
        setLoading(true);
        const usersData = getUsers().sort((a,b) => a.name.localeCompare(b.name));
        setLocalUsers(usersData);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    
    const handleRoleChange = (userId: string, newRole: 'user' | 'admin') => {
        if (userId === adminUser?.id) {
            toast({
                title: "Action Forbidden",
                description: "You cannot change your own role.",
                variant: "destructive",
            });
            return;
        }

        startUpdateTransition(() => {
            try {
                const currentUsers = getUsers();
                const updatedUsers = currentUsers.map(u => u.id === userId ? { ...u, role: newRole } : u);
                setUsers(updatedUsers); // Persist changes to localStorage
                
                const sortedUsers = updatedUsers.sort((a,b) => a.name.localeCompare(b.name));
                setLocalUsers(sortedUsers);
                
                toast({
                    title: "Role Updated",
                    description: "The user's role has been successfully changed.",
                });

            } catch (error) {
                console.error("Error updating user role:", error);
                toast({
                    title: "Update Failed",
                    description: "Could not update the user's role.",
                    variant: "destructive",
                });
                fetchUsers();
            }
        });
    };

    const handleDeleteUser = (userId: string, userEmail: string) => {
        if (userId === adminUser?.id) {
            toast({ title: "Action Forbidden", description: "You cannot delete your own account.", variant: "destructive" });
            return;
        }

        startUpdateTransition(() => {
            try {
                const currentUsers = getUsers();
                const updatedUsers = currentUsers.filter(u => u.id !== userId);
                setUsers(updatedUsers);
                toast({ title: "User Deleted", description: `User ${userEmail} has been permanently deleted.` });
                fetchUsers(); // Refresh the user list
            } catch (error: any) {
                toast({ title: "Deletion Failed", description: "Could not delete user", variant: "destructive" });
            }
        });
    };
    
    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-8">User Management</h1>
            {loading ? <UserTableSkeleton /> : (
                <div className="bg-card border border-border rounded-lg shadow-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Avatar</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="w-[150px]">Role</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={user.image} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-muted-foreground">{user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={user.role}
                                            onValueChange={(newRole: 'user' | 'admin') => handleRoleChange(user.id, newRole)}
                                            disabled={isUpdating || user.id === adminUser?.id}
                                        >
                                            <SelectTrigger className={cn("w-full", user.role === 'admin' ? 'font-bold' : '')}>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         {user.id !== adminUser?.id && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" disabled={isUpdating}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="bg-card border-border">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the user account for <span className="font-bold">{user.email}</span>.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteUser(user.id, user.email)} className="bg-destructive hover:bg-destructive/90">Delete User</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                         )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
