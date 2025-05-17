import { formatCurrency } from "@/lib/utils"

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

interface PlanSelectionProps {
	prices: Price[];
	selectedPlan: "weekly" | "monthly" | "annual";
	setSelectedPlan: (plan: "weekly" | "monthly" | "annual") => void;
}

export const PlanSelection = ({ prices, selectedPlan, setSelectedPlan }: PlanSelectionProps) => {
	const getPlanType = (price: Price): "weekly" | "monthly" | "annual" => {
		if (price.interval === "week") return "weekly";
		if (price.interval === "month") return "monthly";
		return "annual";
	};

	const getOriginalPrice = (price: Price) => {
		return price.unitAmount * 2;
	};

	return (
		<div className="grid grid-cols-3 gap-2 mb-4">
			{prices.filter(p => getPlanType(p) === "weekly").map(price => (
				<div
					key={price.id}
					className={`rounded-lg p-3 cursor-pointer transition-colors text-center ${
						selectedPlan === "weekly"
							? "bg-[#0000cc]/10 border-2 border-[#0000cc]"
							: "border border-gray-200 hover:border-[#0000cc] hover:bg-[#0000cc]/5"
					}`}
					onClick={() => setSelectedPlan("weekly")}
				>
					<div className="font-medium text-sm mb-1">Weekly</div>
					<div className="text-xs text-gray-500 line-through">
						{formatCurrency(getOriginalPrice(price), price.currency)}
					</div>
					<div className="text-lg font-bold text-[#0000cc]">
						{formatCurrency(price.unitAmount, price.currency)}
					</div>
				</div>
			))}

			{prices.filter(p => getPlanType(p) === "monthly").map(price => (
				<div
					key={price.id}
					className={`rounded-lg p-3 cursor-pointer transition-colors text-center relative ${
						selectedPlan === "monthly"
							? "bg-[#0000cc]/10 border-2 border-[#0000cc]"
							: "border border-gray-200 hover:border-[#0000cc] hover:bg-[#0000cc]/5"
					}`}
					onClick={() => setSelectedPlan("monthly")}
				>
					<div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#0000cc] text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
						BEST VALUE
					</div>
					<div className="font-medium text-sm mb-1 mt-1">Monthly</div>
					<div className="text-xs text-gray-500 line-through">
						{formatCurrency(getOriginalPrice(price), price.currency)}
					</div>
					<div className="text-lg font-bold text-[#0000cc]">
						{formatCurrency(price.unitAmount, price.currency)}
					</div>
				</div>
			))}

			{prices.filter(p => getPlanType(p) === "annual").map(price => (
				<div
					key={price.id}
					className={`rounded-lg p-3 cursor-pointer transition-colors text-center ${
						selectedPlan === "annual"
							? "bg-[#0000cc]/10 border-2 border-[#0000cc]"
							: "border border-gray-200 hover:border-[#0000cc] hover:bg-[#0000cc]/5"
					}`}
					onClick={() => setSelectedPlan("annual")}
				>
					<div className="font-medium text-sm mb-1">Annual</div>
					<div className="text-xs text-gray-500 line-through">
						{formatCurrency(getOriginalPrice(price), price.currency)}
					</div>
					<div className="text-lg font-bold text-[#0000cc]">
						{formatCurrency(price.unitAmount, price.currency)}
					</div>
				</div>
			))}
		</div>
	);
}; 