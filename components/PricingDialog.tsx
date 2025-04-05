import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface Price {
  id: string;
  name: string;
  description: string;
  unitAmount: number;
  currency: string;
  type: "recurring" | "one_time";
  interval?: "day" | "week" | "month" | "year";
  features: string[];
  metadata: Record<string, string>;
}

interface PricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelect: (plan: "weekly" | "monthly" | "lifetime") => void;
}

export function PricingDialog({
  isOpen,
  onClose,
  onPlanSelect,
}: PricingDialogProps) {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<
    "weekly" | "monthly" | "lifetime" | null
  >(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/prices");
        if (!response.ok) throw new Error("Failed to fetch prices");
        const data = await response.json();
        setPrices(data);

        // Default to monthly plan if available
        const monthlyPlan = data.find((p: Price) => p.interval === "month");
        if (monthlyPlan) {
          setSelectedPlan("monthly");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load pricing data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPrices();
    }
  }, [isOpen]);

  const getPlanType = (price: Price): "weekly" | "monthly" | "lifetime" => {
    if (price.type === "one_time") return "lifetime";
    if (price.interval === "week") return "weekly";
    return "monthly";
  };

  const renderPriceCard = (price: Price) => {
    const planType = getPlanType(price);
    const isSelected = selectedPlan === planType;
    const isPopular = planType === "monthly";
    const amount = formatCurrency(price.unitAmount || 0, price.currency);
    const interval = price.interval
      ? `per ${price.interval}`
      : "one-time payment";

    return (
      <div
        key={price.id}
        className={`border rounded-lg p-6 flex flex-col relative ${
          isSelected ? "border-primary border-2" : ""
        }`}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge variant="default">Most Popular</Badge>
          </div>
        )}
        <h3 className="font-semibold text-3xl text-center">
          {price.name.replace("DMV.gg ", "")}
        </h3>
        <div className="flex items-baseline mt-4">
          <span className="text-3xl font-bold">{amount}</span>
          <span className="text-muted-foreground ml-1 text-xs">{interval}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {price.description}
        </p>
        <div className="flex-grow mt-6 space-y-4">
          {price.features && price.features.length > 0 ? (
            price.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No features specified
            </div>
          )}
        </div>
        <Button
          variant={
            isSelected
              ? "default"
              : planType === "monthly"
              ? "default"
              : "outline"
          }
          className="mt-6"
          onClick={() => {
            setSelectedPlan(planType);
            onPlanSelect(planType);
          }}
        >
          Get Started
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px]">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[900px]">
          <div className="flex flex-col items-center h-64 justify-center">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <p className="text-muted-foreground">
            Select the plan that works best for you. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prices.map(renderPriceCard)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
