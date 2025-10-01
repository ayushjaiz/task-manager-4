'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/header';
import TaskForm from '@/components/tasks/task-form';
import TaskItem from '@/components/tasks/task-item';
import TaskFilters from '@/components/tasks/task-filters';
import TaskPagination from '@/components/tasks/task-pagination';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'done';
    createdAt: string;
    updatedAt: string;
}

interface TasksResponse {
    tasks: Task[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [page, setPage] = useState(1);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1); // Reset to first page when search changes
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Reset page when status changes
    useEffect(() => {
        setPage(1);
    }, [status]);

    const { data, isLoading, error } = useQuery<TasksResponse>({
        queryKey: ['tasks', page, search, status],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(search && { search }),
                ...(status !== 'all' && { status }),
            });

            const response = await fetch(`/api/tasks?${params}`);
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    throw new Error('Unauthorized');
                }
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        },
        retry: false,
    });

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsTaskFormOpen(true);
    };

    const handleCloseTaskForm = () => {
        setIsTaskFormOpen(false);
        setEditingTask(null);
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setIsTaskFormOpen(true);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error.message === 'Unauthorized' ? 'Please log in to access your tasks.' : 'Failed to load tasks. Please try again.'}
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
                        <p className="text-gray-600 mt-1">
                            {data ? `${data.pagination.total} task${data.pagination.total !== 1 ? 's' : ''} total` : 'Manage your tasks'}
                        </p>
                    </div>
                    <Button onClick={handleCreateTask} className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>New Task</span>
                    </Button>
                </div>

                <TaskFilters
                    search={search}
                    status={status}
                    onSearchChange={setSearch}
                    onStatusChange={setStatus}
                />

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-600">Loading tasks...</span>
                    </div>
                ) : data && data.tasks.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {data.tasks.map((task) => (
                                <TaskItem
                                    key={task._id}
                                    task={task}
                                    onEdit={handleEditTask}
                                />
                            ))}
                        </div>
                        <TaskPagination
                            currentPage={data.pagination.page}
                            totalPages={data.pagination.pages}
                            onPageChange={setPage}
                        />
                    </>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                                <p className="text-gray-600 mb-4">
                                    {search || status !== 'all'
                                        ? 'No tasks match your current filters. Try adjusting your search or filter criteria.'
                                        : 'Get started by creating your first task.'
                                    }
                                </p>
                                <Button onClick={handleCreateTask} className="flex items-center space-x-2">
                                    <Plus className="h-4 w-4" />
                                    <span>Create Task</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <TaskForm
                    isOpen={isTaskFormOpen}
                    onClose={handleCloseTaskForm}
                    task={editingTask}
                />
            </div>
        </div>
    );
}
