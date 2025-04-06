import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="w-fit mx-auto border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100"
            >
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Choose the Plan That Works for You
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Affordable options to help you pass your California DMV knowledge test.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
          <Card className="flex flex-col overflow-hidden border-2 border-border">
            <div className="p-6">
              <h3 className="text-2xl font-bold">Weekly</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight">$4.99</span>
                <span className="ml-1 text-xl font-semibold">/week</span>
              </div>
              <p className="mt-4 text-muted-foreground">Perfect for quick test preparation.</p>
            </div>
            <CardContent className="flex flex-col justify-between gap-6 p-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Full access to all CA questions</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Unlimited practice tests</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Progress tracking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Detailed explanations</span>
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>
          <Card className="flex flex-col overflow-hidden border-2 border-blue-600 relative">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl">
              POPULAR
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold">Monthly</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight">$9.99</span>
                <span className="ml-1 text-xl font-semibold">/month</span>
              </div>
              <p className="mt-4 text-muted-foreground">Best value for most users.</p>
            </div>
            <CardContent className="flex flex-col justify-between gap-6 p-6 bg-blue-50">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Everything in Weekly</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Study schedule planner</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Mistake analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Mobile app access</span>
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>
          <Card className="flex flex-col overflow-hidden border-2 border-border">
            <div className="p-6">
              <h3 className="text-2xl font-bold">Lifetime</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight">$29.99</span>
                <span className="ml-1 text-xl font-semibold">/lifetime</span>
              </div>
              <p className="mt-4 text-muted-foreground">One-time payment, lifetime access.</p>
            </div>
            <CardContent className="flex flex-col justify-between gap-6 p-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Everything in Monthly</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Free updates for life</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span>Renewal test prep included</span>
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 