'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface TaskFiltersProps {
    search: string;
    status: string;
    onSearchChange: (search: string) => void;
    onStatusChange: (status: string) => void;
}

export default function TaskFilters({ search, status, onSearchChange, onStatusChange }: TaskFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search tasks by title or description..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>
            <div className="sm:w-48">
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Select value={status} onValueChange={onStatusChange}>
                        <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tasks</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
