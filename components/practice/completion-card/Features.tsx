import { CheckCircle } from "lucide-react"

interface FeaturesProps {
	selectedPlan: "weekly" | "monthly" | "annual";
}

export const Features = ({ selectedPlan }: FeaturesProps) => {
	const features = {
		weekly: [
			{ text: "Unlimited practice tests", included: true },
			{ text: "Basic performance tracking", included: true },
			{ text: "Personalized study plan", included: false },
			{ text: "Weak Areas Focus Mode", included: false },
		],
		monthly: [
			{ text: "Unlimited practice tests", included: true },
			{ text: "Advanced performance tracking", included: true },
			{ text: "Personalized study plan", included: true },
			{ text: "Weak Areas Focus Mode", included: true },
			{ text: "1-on-1 coaching session", included: false },
		],
		annual: [
			{ text: "Unlimited practice tests", included: true },
			{ text: "Advanced performance tracking", included: true },
			{ text: "Personalized study plan", included: true },
			{ text: "Weak Areas Focus Mode", included: true },
			{ text: "1-on-1 coaching session", included: true },
			{ text: "Offline access to all materials", included: true },
			{ text: "Priority support", included: true },
		],
	};

	return (
		<div className="border rounded-lg p-4 bg-white mb-4">
			<h4 className="font-medium mb-3">
				{selectedPlan === "weekly" && "Basic Access"}
				{selectedPlan === "monthly" && "Complete Access"}
				{selectedPlan === "annual" && "Premium Access"}
			</h4>

			<div className="space-y-2">
				{features[selectedPlan].map((feature, index) => (
					<div key={index} className={`flex items-center gap-2 ${!feature.included ? "text-gray-400" : ""}`}>
						<CheckCircle className={`h-4 w-4 flex-shrink-0 ${feature.included ? "text-green-500" : ""}`} />
						<span className={`text-sm ${feature.included ? "text-gray-700" : ""}`}>{feature.text}</span>
					</div>
				))}
			</div>

			<div className="mt-4 pt-3 border-t border-gray-100">
				<div className="flex items-center gap-2 text-[#0000cc]">
					<div className="text-xs font-medium">
						{selectedPlan === "weekly" && "Billed weekly"}
						{selectedPlan === "monthly" && "Billed monthly - Save 50%"}
						{selectedPlan === "annual" && "Billed annually - Save 60%"}
					</div>
				</div>
			</div>
		</div>
	);
}; 