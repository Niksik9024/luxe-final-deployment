import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Agreement to our Legal Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>This is a placeholder for your Terms of Service. In a real application, this page would constitute a legally binding agreement between you and your users. It should be drafted by a legal professional.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">1. User Accounts</h2>
          <p>You would define the rules for account creation, user responsibilities for account security, and conditions for account termination.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. Prohibited Activities</h2>
          <p>Clearly list activities that are forbidden on your platform, such as uploading illegal content, harassment, spamming, and attempting to breach security measures.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. Intellectual Property Rights</h2>
          <p>Clarify ownership of the content on your site. Detail the license users grant you for the content they upload, and how you respect the intellectual property of others.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">4. Limitation of Liability</h2>
          <p>Include disclaimers to limit your legal liability for any damages that may arise from the use of your service.</p>

           <h2 className="text-xl font-semibold text-foreground pt-4">5. Governing Law</h2>
          <p>Specify the jurisdiction whose laws will govern the agreement.</p>
        </CardContent>
      </Card>
    </div>
  )
}
