"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/useIsMobile";

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

export default function Pricing() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"weekly" | "monthly" | "lifetime" | null>(null);
  const isMobile = useIsMobile();

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
        setError(err instanceof Error ? err.message : "Failed to load pricing data");
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

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
    const interval = price.interval ? `per ${price.interval}` : "one-time payment";

    return (
      <Card
        key={price.id}
        className={`flex flex-col overflow-hidden border-2 ${
          isSelected ? "border-primary" : isPopular ? "border-blue-600" : "border-border"
        } relative`}
      >
        {isPopular && (
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl">
            POPULAR
          </div>
        )}
        <div className="p-6">
          <h3 className="text-2xl font-bold">
            {price.name.replace("DMV.gg ", "")}
          </h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold">{amount}</span>
            <span className="text-muted-foreground ml-1 text-xs">{interval}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{price.description}</p>
        </div>
        <CardContent
          className={`flex flex-col justify-between gap-6 p-6 ${
            isPopular ? "bg-blue-50" : ""
          }`}
        >
          <div className="flex-grow space-y-4">
            {price.features && price.features.length > 0 ? (
              price.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No features specified</div>
            )}
          </div>
          <Button
            variant={isSelected ? "default" : planType === "monthly" ? "default" : "outline"}
            className="w-full"
            onClick={() => setSelectedPlan(planType)}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderMobileContent = () => {
    return (
      <div className="space-y-6">
        {/* Plan selection cards */}
        <div className="grid grid-cols-3 gap-2">
          {prices.filter(p => getPlanType(p) === "weekly").length > 0 && (
            <Card 
              className={`flex flex-col items-center justify-center py-2 px-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow rounded-md ${
                selectedPlan === "weekly" ? "border-primary border-2" : ""
              }`}
              onClick={() => setSelectedPlan("weekly")}
            >
              <div className="text-xs text-center">Weekly</div>
              {prices.find(p => getPlanType(p) === "weekly") && (
                <div className="font-bold text-sm text-center">
                  {formatCurrency(
                    prices.find(p => getPlanType(p) === "weekly")?.unitAmount || 0,
                    prices.find(p => getPlanType(p) === "weekly")?.currency || "usd"
                  )}/wk
                </div>
              )}
            </Card>
          )}
          
          <Card 
            className={`flex flex-col items-center justify-center py-2 px-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow rounded-md ${
              selectedPlan === "monthly" ? "border-primary border-2" : ""
            }`}
            onClick={() => setSelectedPlan("monthly")}
          >
            <div className="text-xs text-center">Monthly</div>
            {prices.find(p => getPlanType(p) === "monthly") && (
              <div className="font-bold text-sm text-center">
                {formatCurrency(
                  prices.find(p => getPlanType(p) === "monthly")?.unitAmount || 0,
                  prices.find(p => getPlanType(p) === "monthly")?.currency || "usd"
                )}/mo
              </div>
            )}
          </Card>
          
          <Card 
            className={`flex flex-col items-center justify-center py-2 px-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow rounded-md ${
              selectedPlan === "lifetime" ? "border-primary border-2" : ""
            }`}
            onClick={() => setSelectedPlan("lifetime")}
          >
            <div className="text-xs text-center">Lifetime</div>
            {prices.find(p => getPlanType(p) === "lifetime") && (
              <div className="font-bold text-sm text-center">
                {formatCurrency(
                  prices.find(p => getPlanType(p) === "lifetime")?.unitAmount || 0,
                  prices.find(p => getPlanType(p) === "lifetime")?.currency || "usd"
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Selected plan features */}
        {selectedPlan && prices.length > 0 && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Included Features:</h3>
            <div className="space-y-2">
              {prices
                .find(p => getPlanType(p) === selectedPlan)
                ?.features
                ?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
            </div>
            <Button className="w-full mt-6">Get Started</Button>
          </Card>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center h-64 justify-center">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="w-fit mx-auto border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100"
            >
              Pricing
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Choose Your Plan
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Select the plan that works best for you. Cancel anytime.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-5xl mt-8">
          {isMobile ? renderMobileContent() : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prices.map(renderPriceCard)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 