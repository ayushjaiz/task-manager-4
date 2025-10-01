'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthFormProps {
    mode: 'login' | 'register';
}

interface AuthData {
    email: string;
    password: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
    const [formData, setFormData] = useState<AuthData>({ email: '', password: '' });
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const authMutation = useMutation({
        mutationFn: async (data: AuthData) => {
            const response = await fetch(`/api/auth/${mode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Authentication failed');
            }

            return response.json();
        },
        onSuccess: () => {
            router.push('/dashboard');
        },
        onError: (error: Error) => {
            setError(error.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        authMutation.mutate(formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>{mode === 'login' ? 'Sign In' : 'Sign Up'}</CardTitle>
                <CardDescription>
                    {mode === 'login'
                        ? 'Enter your credentials to access your tasks'
                        : 'Create an account to start managing your tasks'
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            disabled={authMutation.isPending}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            disabled={authMutation.isPending}
                            minLength={6}
                        />
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={authMutation.isPending}
                    >
                        {authMutation.isPending ? 'Loading...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    {mode === 'login' ? (
                        <>
                            Don&apos;t have an account?{' '}
                            <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/register')}>
                                Sign up
                            </Button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <Button variant="link" className="p-0 h-auto" onClick={() => router.push('/login')}>
                                Sign in
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
