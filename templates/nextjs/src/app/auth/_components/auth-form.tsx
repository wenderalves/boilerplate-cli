'use client'

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardContent, Card } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"

export function AuthForm() {
    const form = useForm()

    const handleSubmit = form.handleSubmit(async (data) => {
        try {
            await signIn('email', { email: data.email, redirect: false })
            toast({
                title: 'Magic Link Sent',
                description: 'Check your email for the magic link to login'
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'An error ocurred. Please try again.'
            })
        }
    })

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Authentication</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enter your email to receive a magic link</p>
            </div>
            <form onSubmit={handleSubmit}>
                <Card className="w-full max-w-sm">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="m@example.com" required type="email" {...form.register('email')} />
                        </div>
                        <Button className="w-full">Send Magic Link</Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
