
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, Target, Diamond } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About LUXE</h1>
      <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
        LUXE is the premier destination for exclusive, high-fashion visual content. We connect top-tier models with iconic photographers and videographers to create art that inspires.
      </p>
      <div className="grid md:grid-cols-3 gap-8 text-center">
          <Card className="bg-card border-border">
            <CardHeader className="items-center">
              <div className="p-3 bg-muted rounded-full mb-2"><Eye className="h-8 w-8 text-accent" /></div>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">To redefine luxury content by focusing on artistic expression, unparalleled quality, and creative storytelling.</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="items-center">
               <div className="p-3 bg-muted rounded-full mb-2"><Target className="h-8 w-8 text-accent" /></div>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">To provide a curated platform that showcases the world's most captivating models and visual artists, setting new standards for elegance and sophistication.</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="items-center">
                <div className="p-3 bg-muted rounded-full mb-2"><Diamond className="h-8 w-8 text-accent" /></div>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Quality, Exclusivity, and Creativity are the pillars that support every piece of content we feature.</p>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
