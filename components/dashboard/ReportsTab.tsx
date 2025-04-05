import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox as UICheckbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BarChart3, PieChart, UserRound } from "lucide-react";

export function ReportsTab() {
	return (
		<div className="mb-6 space-y-6">
			{/* Pre-defined Reports */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* User Performance Report */}
				<Card>
					<CardContent className="pt-4 flex flex-col items-center">
						<div className="w-full mb-3">
							<h3 className="text-base font-bold">User Performance</h3>
							<p className="text-xs text-gray-500">
								Test scores and completion rates
							</p>
						</div>
						<div className="flex items-center justify-center py-8">
							<BarChart3 className="h-16 w-16 text-gray-300" />
						</div>
						<Button variant="outline" size="sm" className="mt-2">
							Generate Report
						</Button>
					</CardContent>
				</Card>

				{/* Content Effectiveness Report */}
				<Card>
					<CardContent className="pt-4 flex flex-col items-center">
						<div className="w-full mb-3">
							<h3 className="text-base font-bold">Content Effectiveness</h3>
							<p className="text-xs text-gray-500">
								Question difficulty and success rates
							</p>
						</div>
						<div className="flex items-center justify-center py-8">
							<PieChart className="h-16 w-16 text-gray-300" />
						</div>
						<Button variant="outline" size="sm" className="mt-2">
							Generate Report
						</Button>
					</CardContent>
				</Card>

				{/* User Engagement Report */}
				<Card>
					<CardContent className="pt-4 flex flex-col items-center">
						<div className="w-full mb-3">
							<h3 className="text-base font-bold">User Engagement</h3>
							<p className="text-xs text-gray-500">
								Activity and retention metrics
							</p>
						</div>
						<div className="flex items-center justify-center py-8">
							<UserRound className="h-16 w-16 text-gray-300" />
						</div>
						<Button variant="outline" size="sm" className="mt-2">
							Generate Report
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Custom Reports Section */}
			<Card>
				<CardContent className="pt-4">
					<div className="mb-4">
						<h3 className="text-base font-bold">Custom Reports</h3>
						<p className="text-xs text-gray-500">
							Create custom reports with specific metrics and date ranges
						</p>
					</div>

					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Report Type */}
							<div>
								<Label htmlFor="report-type" className="text-sm mb-1">
									Report Type
								</Label>
								<Select defaultValue="user-performance">
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select report type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="user-performance">
											User Performance
										</SelectItem>
										<SelectItem value="content-effectiveness">
											Content Effectiveness
										</SelectItem>
										<SelectItem value="user-engagement">
											User Engagement
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Date Range */}
							<div>
								<Label htmlFor="date-range" className="text-sm mb-1">
									Date Range
								</Label>
								<Select defaultValue="last-7-days">
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select date range" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="last-7-days">Last 7 days</SelectItem>
										<SelectItem value="last-30-days">Last 30 days</SelectItem>
										<SelectItem value="last-90-days">Last 90 days</SelectItem>
										<SelectItem value="custom">Custom range</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Additional Metrics */}
						<div>
							<Label className="text-sm mb-2">Additional Metrics</Label>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								<div className="flex items-center space-x-2">
									<UICheckbox id="pass-rate" />
									<Label htmlFor="pass-rate" className="text-sm font-normal">
										Pass Rate
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<UICheckbox id="time-spent" />
									<Label htmlFor="time-spent" className="text-sm font-normal">
										Time Spent
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<UICheckbox id="question-difficulty" />
									<Label
										htmlFor="question-difficulty"
										className="text-sm font-normal"
									>
										Question Difficulty
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<UICheckbox id="user-demographics" />
									<Label
										htmlFor="user-demographics"
										className="text-sm font-normal"
									>
										User Demographics
									</Label>
								</div>
							</div>
						</div>

						{/* Generate Button */}
						<div>
							<Button>Generate Custom Report</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
