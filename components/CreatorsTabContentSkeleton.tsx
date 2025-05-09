"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar } from "lucide-react";

const METRIC_KEYS = [
	"total-creators",
	"active-campaigns",
	"content-pieces",
	"total-reach",
];
const PLATFORM_KEYS = ["instagram", "tiktok", "youtube", "twitter"];
const CREATOR_KEYS = [
	"creator-1",
	"creator-2",
	"creator-3",
	"creator-4",
	"creator-5",
];
const PLANNING_KEYS = ["upcoming", "ideas", "performance"];

export function CreatorsTabContentSkeleton() {
	return (
		<div className="flex min-h-screen bg-background">
			<div className="flex flex-1 flex-col">
				<main className="flex-1 overflow-auto p-4 sm:p-6">
					<div className="grid gap-6">
						{/* Metrics section skeleton */}
						<section>
							<h2 className="mb-4 text-xl font-semibold">Key Metrics</h2>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{METRIC_KEYS.map((key) => (
									<Card key={key}>
										<CardHeader className="pb-2">
											<CardTitle className="text-sm font-medium">
												<Skeleton className="h-4 w-24" />
											</CardTitle>
										</CardHeader>
										<CardContent>
											<Skeleton className="h-8 w-16" />
											<Skeleton className="mt-2 h-4 w-32" />
										</CardContent>
									</Card>
								))}
							</div>
						</section>

						{/* Platform metrics skeleton */}
						<section>
							<h2 className="mb-4 text-xl font-semibold">
								Platform Performance
							</h2>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{PLATFORM_KEYS.map((key) => (
									<Card key={key}>
										<CardHeader className="flex flex-row items-center justify-between pb-2">
											<CardTitle className="text-sm font-medium">
												<Skeleton className="h-4 w-20" />
											</CardTitle>
											<Skeleton className="h-6 w-6 rounded-full" />
										</CardHeader>
										<CardContent>
											<Skeleton className="h-8 w-16" />
											<Skeleton className="mt-2 h-4 w-24" />
											<div className="mt-4">
												<Skeleton className="h-4 w-full" />
												<Skeleton className="mt-2 h-2 w-full" />
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</section>

						{/* Creators and content tabs skeleton */}
						<Tabs defaultValue="creators">
							<div className="flex items-center justify-between">
								<TabsList>
									<TabsTrigger value="creators">Creators</TabsTrigger>
									<TabsTrigger value="content">Planned Content</TabsTrigger>
								</TabsList>
								<div className="flex items-center gap-2">
									<div className="relative">
										<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
										<Skeleton className="h-9 w-[200px] md:w-[260px]" />
									</div>
									<Button
										variant="outline"
										size="sm"
										className="h-9 gap-1"
										disabled
									>
										<Filter className="h-3.5 w-3.5" />
										<span>Filter</span>
									</Button>
									<Button variant="outline" size="sm" className="h-9" disabled>
										Add New
									</Button>
								</div>
							</div>

							{/* Creators tab content skeleton */}
							<TabsContent value="creators" className="mt-4">
								<Card>
									<CardContent className="p-0">
										<div className="overflow-auto">
											<table className="w-full">
												<thead>
													<tr className="border-b text-left text-xs font-medium text-muted-foreground">
														<th className="sticky left-0 bg-background px-4 py-3">
															Creator
														</th>
														<th className="px-4 py-3">Category</th>
														<th className="px-4 py-3">Followers</th>
														<th className="px-4 py-3">Engagement</th>
														<th className="px-4 py-3">Platforms</th>
														<th className="px-4 py-3">Status</th>
														<th className="px-4 py-3">Last Post</th>
														<th className="px-4 py-3">Content</th>
														<th className="px-4 py-3 text-right">Actions</th>
													</tr>
												</thead>
												<tbody>
													{CREATOR_KEYS.map((key) => (
														<tr key={key} className="border-b">
															<td className="sticky left-0 bg-background px-4 py-3">
																<div className="flex items-center gap-3">
																	<Skeleton className="h-10 w-10 rounded-full" />
																	<div>
																		<Skeleton className="h-4 w-32" />
																		<Skeleton className="mt-1 h-3 w-24" />
																	</div>
																</div>
															</td>
															<td className="px-4 py-3">
																<Skeleton className="h-4 w-20" />
															</td>
															<td className="px-4 py-3">
																<Skeleton className="h-4 w-16" />
															</td>
															<td className="px-4 py-3">
																<Skeleton className="h-4 w-16" />
															</td>
															<td className="px-4 py-3">
																<div className="flex gap-1">
																	{["platform-1", "platform-2"].map(
																		(platformKey) => (
																			<Skeleton
																				key={`${key}-${platformKey}`}
																				className="h-6 w-6 rounded-full"
																			/>
																		),
																	)}
																</div>
															</td>
															<td className="px-4 py-3">
																<div className="flex items-center gap-2">
																	<Skeleton className="h-2 w-2 rounded-full" />
																	<Skeleton className="h-4 w-20" />
																</div>
															</td>
															<td className="px-4 py-3">
																<Skeleton className="h-4 w-24" />
															</td>
															<td className="px-4 py-3">
																<div className="space-y-2">
																	<Skeleton className="h-4 w-32" />
																	<Skeleton className="h-2 w-full" />
																</div>
															</td>
															<td className="px-4 py-3 text-right">
																<Skeleton className="h-8 w-8 rounded-md" />
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Content planning section skeleton */}
							<section>
								<div className="flex items-center justify-between">
									<h2 className="text-xl font-semibold">Content Planning</h2>
									<Button variant="outline" size="sm" disabled>
										<Calendar className="mr-1 h-4 w-4" />
										View Calendar
									</Button>
								</div>
								<div className="mt-4 grid gap-4 md:grid-cols-3">
									{PLANNING_KEYS.map((key) => (
										<Card key={key}>
											<CardHeader className="pb-3">
												<CardTitle>
													<Skeleton className="h-5 w-32" />
												</CardTitle>
											</CardHeader>
											<CardContent className="grid gap-4">
												{["item-1", "item-2", "item-3"].map((itemKey) => (
													<div key={`${key}-${itemKey}`} className="space-y-2">
														<Skeleton className="h-4 w-full" />
														<Skeleton className="h-3 w-3/4" />
													</div>
												))}
											</CardContent>
											<CardFooter>
												<Skeleton className="h-9 w-full" />
											</CardFooter>
										</Card>
									))}
								</div>
							</section>
						</Tabs>
					</div>
				</main>
			</div>
		</div>
	);
}
