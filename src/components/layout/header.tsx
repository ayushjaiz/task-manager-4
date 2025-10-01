'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export default function Header() {
    const router = useRouter();

    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const response = await fetch('/api/auth/me');
            if (!response.ok) {
                throw new Error('Not authenticated');
            }
            return response.json();
        },
        retry: false,
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Logout failed');
            }
            return response.json();
        },
        onSuccess: () => {
            router.push('/login');
        },
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <header className="border-b bg-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
                </div>

                <div className="flex items-center space-x-4">
                    {user && (
                        <>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <User className="h-4 w-4" />
                                <span>{user.user.email}</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                disabled={logoutMutation.isPending}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
