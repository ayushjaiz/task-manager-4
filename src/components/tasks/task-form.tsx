'use client';

import { useState, useEffect } from 'react';
import { useCreateTask, useUpdateTask } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'done';
    createdAt: string;
    updatedAt: string;
}

interface TaskFormProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null;
}

export default function TaskForm({ isOpen, onClose, task }: TaskFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending' as 'pending' | 'done',
    });
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                status: task.status,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'pending',
            });
        }
        setError('');
    }, [task, isOpen]);

    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();

    useEffect(() => {
        if (createMutation.isSuccess || updateMutation.isSuccess) {
            onClose();
        }
    }, [createMutation.isSuccess, updateMutation.isSuccess, onClose]);

    useEffect(() => {
        if (createMutation.error) {
            setError(createMutation.error.message);
        } else if (updateMutation.error) {
            setError(updateMutation.error.message);
        }
    }, [createMutation.error, updateMutation.error]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim() || !formData.description.trim()) {
            setError('Title and description are required');
            return;
        }

        if (task) {
            updateMutation.mutate({ id: task._id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleStatusChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            status: value as 'pending' | 'done',
        }));
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                    <DialogDescription>
                        {task ? 'Update your task details below.' : 'Add a new task to your list.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter task title"
                            disabled={isLoading}
                            maxLength={100}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter task description"
                            disabled={isLoading}
                            maxLength={500}
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={handleStatusChange} disabled={isLoading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
