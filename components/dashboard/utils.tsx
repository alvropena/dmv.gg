import React from "react";
import { CheckCircle2, Circle, Ban, Flag } from "lucide-react";

export const getStatusIcon = (status: string) => {
	switch (status) {
		case "Active":
			return <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />;
		case "Inactive":
			return <Circle className="h-4 w-4 text-gray-400 mr-1" />;
		case "Suspended":
			return <Ban className="h-4 w-4 text-red-500 mr-1" />;
		case "Flagged":
			return <Flag className="h-4 w-4 text-red-500 mr-1" />;
		default:
			return null;
	}
};

export const getDifficultyBadge = (difficulty: string) => {
	switch (difficulty) {
		case "Easy":
			return (
				<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
					{difficulty}
				</div>
			);
		case "Medium":
			return (
				<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
					{difficulty}
				</div>
			);
		case "Hard":
			return (
				<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
					{difficulty}
				</div>
			);
		default:
			return null;
	}
};

export const getCategoryBadge = (category: string) => {
	return (
		<div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
			{category}
		</div>
	);
};
