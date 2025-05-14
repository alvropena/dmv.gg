export interface Price {
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

export const prices: Price[] = [
	{
		id: "weekly",
		name: "Weekly",
		description: "Perfect for short-term test preparation",
		unitAmount: 399, // $3.99
		currency: "USD",
		type: "recurring",
		interval: "week",
		features: [
			"Access to all practice tests",
			"Basic study materials",
			"Progress tracking",
			"Email support"
		],
		metadata: {
			variation: "weekly"
		}
	},
	{
		id: "monthly",
		name: "Monthly",
		description: "Most popular choice for serious learners",
		unitAmount: 999, // $9.99
		currency: "USD",
		type: "recurring",
		interval: "month",
		features: [
			"Everything in Weekly",
			"Priority support",
			"Advanced analytics",
			"Custom study plans",
			"Mobile app access"
		],
		metadata: {
			variation: "monthly"
		}
	},
	{
		id: "lifetime",
		name: "Lifetime",
		description: "One-time payment for unlimited access",
		unitAmount: 3999, // $39.99
		currency: "USD",
		type: "one_time",
		features: [
			"Everything in Monthly",
			"Lifetime access",
			"Future updates included",
			"Premium support",
			"Offline access",
			"Family sharing"
		],
		metadata: {
			variation: "lifetime"
		}
	}
]; 