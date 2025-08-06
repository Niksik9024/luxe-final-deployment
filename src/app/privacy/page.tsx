import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Our Commitment to Your Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>This is a placeholder for your Privacy Policy. In a real application, this page would detail how you collect, use, and protect your users' personal data. It is a legal requirement in many jurisdictions.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">1. Information We Collect</h2>
          <p>You would describe the types of data you collect, such as names, email addresses, IP addresses, browsing history, etc.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. How We Use Your Information</h2>
          <p>Explain the purposes for collecting data, like account management, personalization, marketing, and analytics.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. Data Sharing and Disclosure</h2>
          <p>Disclose if and with whom you share user data, such as third-party service providers (e.g., for analytics or payments).</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">4. Your Rights</h2>
          <p>Inform users of their rights regarding their data, such as the right to access, correct, or delete their personal information.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">5. Contact Us</h2>
          <p>Provide contact information for users who have questions about your privacy practices.</p>
        </CardContent>
      </Card>
    </div>
  )
}
