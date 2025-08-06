

'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import type { User } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { deleteUser } from '@/ai/flows/delete-user';

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
        <div className="bg-card border border-border rounded-lg shadow-lg p-4">
            <div className="space-y-4">
                 {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ManageUsersPage() {
    const { currentUser: adminUser } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, startUpdateTransition] = useTransition();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const usersQuery = query(collection(db, "users"), orderBy("name"));
        const querySnapshot = await getDocs(usersQuery);
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setUsers(usersData);
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

        startUpdateTransition(async () => {
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, { role: newRole });
                
                // Update local state for immediate feedback
                setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
                
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
                // Optional: Re-fetch to revert optimistic update on failure
                fetchUsers();
            }
        });
    };

    const handleDeleteUser = async (userId: string, userEmail: string) => {
        if (userId === adminUser?.id) {
            toast({ title: "Action Forbidden", description: "You cannot delete your own account.", variant: "destructive" });
            return;
        }

        startUpdateTransition(async () => {
            try {
                const result = await deleteUser({ userId });
                if (result.success) {
                    toast({ title: "User Deleted", description: `User ${userEmail} has been permanently deleted.` });
                    fetchUsers(); // Refresh the user list
                } else {
                    throw new Error(result.message);
                }
            } catch (error: any) {
                toast({ title: "Deletion Failed", description: error.message, variant: "destructive" });
            }
        });
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">User Management</h1>
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
                                                            This action cannot be undone. This will permanently delete the user account for <span className="font-bold">{user.email}</span> and all associated data from the authentication system and database.
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
