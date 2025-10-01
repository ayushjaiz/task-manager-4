'use client';

import { useState, useEffect } from 'react';
import { useUpdateTask, useDeleteTask } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Check, Clock } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'done';
    createdAt: string;
    updatedAt: string;
}

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onEdit }: TaskItemProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const updateStatusMutation = useUpdateTask();
    const deleteMutation = useDeleteTask();

    useEffect(() => {
        if (deleteMutation.isSuccess) {
            setShowDeleteDialog(false);
        }
    }, [deleteMutation.isSuccess]);

    const handleStatusToggle = () => {
        const newStatus = task.status === 'pending' ? 'done' : 'pending';
        updateStatusMutation.mutate({ id: task._id, data: { status: newStatus } });
    };

    const handleDelete = () => {
        deleteMutation.mutate(task._id);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Card className={`transition-all duration-200 hover:shadow-md ${task.status === 'done' ? 'opacity-75' : ''}`}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className={`text-lg ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                                {task.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge variant={task.status === 'done' ? 'default' : 'secondary'}>
                                    {task.status === 'done' ? (
                                        <>
                                            <Check className="h-3 w-3 mr-1" />
                                            Done
                                        </>
                                    ) : (
                                        <>
                                            <Clock className="h-3 w-3 mr-1" />
                                            Pending
                                        </>
                                    )}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                    {formatDate(task.createdAt)}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleStatusToggle}
                                disabled={updateStatusMutation.isPending}
                                className="h-8 w-8 p-0"
                            >
                                {task.status === 'pending' ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(task)}
                                className="h-8 w-8 p-0"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDeleteDialog(true)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <p className={`text-sm text-gray-600 ${task.status === 'done' ? 'line-through' : ''}`}>
                        {task.description}
                    </p>
                </CardContent>
            </Card>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
