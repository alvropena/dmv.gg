import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface PricingDialogProps {
  isOpen: boolean
  onClose: () => void
  onPlanSelect: (plan: 'monthly' | 'annually' | 'lifetime') => void
}

export function PricingDialog({ isOpen, onClose, onPlanSelect }: PricingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <p className="text-muted-foreground">Select the plan that works best for you. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Plan */}
          <div className="border rounded-lg p-6 flex flex-col">
            <h3 className="font-semibold text-xl">Monthly</h3>
            <div className="flex items-baseline mt-2">
              <span className="text-3xl font-bold">$4.99</span>
              <span className="text-muted-foreground ml-1">per month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Perfect for short-term projects</p>
            <div className="flex-grow mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>All basic features</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Up to 5 projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>1GB storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Email support</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-muted-foreground">Advanced analytics</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => onPlanSelect('monthly')}
            >
              Select Plan
            </Button>
          </div>

          {/* Annual Plan */}
          <div className="border rounded-lg p-6 flex flex-col relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-sm">
              Most Popular
            </div>
            <h3 className="font-semibold text-xl">Annually</h3>
            <div className="flex items-baseline mt-2">
              <span className="text-3xl font-bold">$39.99</span>
              <span className="text-muted-foreground ml-1">per year</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Save 33% compared to monthly</p>
            <div className="flex-grow mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>All basic features</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Unlimited projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>5GB storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Advanced analytics</span>
              </div>
            </div>
            <Button 
              className="mt-6"
              onClick={() => onPlanSelect('annually')}
            >
              Selected
            </Button>
          </div>

          {/* Lifetime Plan */}
          <div className="border rounded-lg p-6 flex flex-col">
            <h3 className="font-semibold text-xl">Lifetime</h3>
            <div className="flex items-baseline mt-2">
              <span className="text-3xl font-bold">$99.99</span>
              <span className="text-muted-foreground ml-1">one-time payment</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Pay once, use forever</p>
            <div className="flex-grow mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>All premium features</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Unlimited projects</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>10GB storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Advanced analytics</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => onPlanSelect('lifetime')}
            >
              Select Plan
            </Button>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            size="lg"
            onClick={() => onPlanSelect('annually')}
          >
            Continue with Annually Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 