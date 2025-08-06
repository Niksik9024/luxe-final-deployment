
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <p className="text-center text-muted-foreground mb-8">
          Have a question or a collaboration proposal? We would love to hear from you.
      </p>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Send a Message</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What is this regarding?" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message..." rows={6} />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
