"use client";

import type React from "react";

import { useState } from "react";
import {
	Calendar,
	Clock,
	Filter,
	Instagram,
	MoreVertical,
	Search,
	TwitterIcon as TikTok,
	Twitter,
	Youtube,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import AddNewDialog from "@/components/dialogs/AddNewCreatorDialog";
import { creators, platformMetrics, plannedPosts } from "@/data/creators";

const getPlatformIcon = (platform: string) => {
	switch (platform) {
		case "instagram":
			return <Instagram className="h-4 w-4" />;
		case "tiktok":
			return <TikTok className="h-4 w-4" />;
		case "youtube":
			return <Youtube className="h-4 w-4" />;
		case "twitter":
			return <Twitter className="h-4 w-4" />;
		default:
			return null;
	}
};

const getStatusColor = (status: string) => {
	switch (status) {
		case "Active":
			return "bg-green-500";
		case "Inactive":
			return "bg-gray-400";
		case "In Progress":
			return "bg-blue-500";
		case "Pending Approval":
			return "bg-yellow-500";
		case "Scheduled":
			return "bg-purple-500";
		case "Not Started":
			return "bg-gray-400";
		default:
			return "bg-gray-400";
	}
};

export default function CreatorsDashboard() {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredCreators = creators.filter(
		(creator) =>
			creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			creator.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
			creator.category.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className="flex min-h-screen bg-background">
			{/* Main content */}
			<div className="flex flex-1 flex-col">
				{/* Dashboard content */}
				<main className="flex-1 overflow-auto p-4 sm:p-6">
					<div className="grid gap-6">
						{/* Metrics section */}
						<section>
							<h2 className="mb-4 text-xl font-semibold">Key Metrics</h2>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-medium">
											Total Creators
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{creators.length}</div>
										<p className="text-xs text-muted-foreground">
											<span className="text-green-500">↑ 12%</span> from last
											month
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-medium">
											Active Campaigns
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">8</div>
										<p className="text-xs text-muted-foreground">
											<span className="text-green-500">↑ 5%</span> from last
											month
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-medium">
											Content Pieces
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">42</div>
										<p className="text-xs text-muted-foreground">
											<span className="text-green-500">↑ 18%</span> from last
											month
										</p>
									</CardContent>
								</Card>
								<Card>
									<CardHeader className="pb-2">
										<CardTitle className="text-sm font-medium">
											Total Reach
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">8.4M</div>
										<p className="text-xs text-muted-foreground">
											<span className="text-green-500">↑ 24%</span> from last
											month
										</p>
									</CardContent>
								</Card>
							</div>
						</section>

						{/* Platform metrics */}
						<section>
							<h2 className="mb-4 text-xl font-semibold">
								Platform Performance
							</h2>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{platformMetrics.map((metric, index) => (
									<Card key={index}>
										<CardHeader className="flex flex-row items-center justify-between pb-2">
											<CardTitle className="text-sm font-medium capitalize">
												{metric.platform}
											</CardTitle>
											<div className="rounded-full p-1">
												{getPlatformIcon(metric.platform)}
											</div>
										</CardHeader>
										<CardContent>
											<div className="text-2xl font-bold">
												{(metric.views / 1000000).toFixed(1)}M
											</div>
											<div className="mt-1 flex items-center text-xs">
												<span className="text-green-500">
													↑ {metric.growth}%
												</span>
												<span className="ml-1 text-muted-foreground">
													views
												</span>
											</div>
											<div className="mt-3">
												<div className="flex items-center justify-between text-xs">
													<span>Content pieces: {metric.content}</span>
													<span className="text-muted-foreground">
														{Math.round((metric.content / 170) * 100)}%
													</span>
												</div>
												<Progress
													className="mt-1"
													value={(metric.content / 170) * 100}
												/>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</section>

						{/* Creators and content tabs */}
						<Tabs defaultValue="creators">
							<div className="flex items-center justify-between">
								<TabsList>
									<TabsTrigger value="creators">Creators</TabsTrigger>
									<TabsTrigger value="content">Planned Content</TabsTrigger>
								</TabsList>
								<div className="flex items-center gap-2">
									<div className="relative">
										<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											type="search"
											placeholder="Search..."
											className="w-[200px] pl-8 md:w-[260px]"
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" size="sm" className="h-9 gap-1">
												<Filter className="h-3.5 w-3.5" />
												<span>Filter</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Filter by</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem>Status</DropdownMenuItem>
											<DropdownMenuItem>Category</DropdownMenuItem>
											<DropdownMenuItem>Platform</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
									<AddNewDialog />
								</div>
							</div>

							{/* Creators tab content */}
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
													{filteredCreators.map((creator) => (
														<tr key={creator.id} className="border-b">
															<td className="sticky left-0 bg-background px-4 py-3 font-medium">
																<div className="flex items-center gap-3">
																	<Image
																		src={creator.avatar || "/placeholder.svg"}
																		width={40}
																		height={40}
																		alt={creator.name}
																		className="rounded-full"
																	/>
																	<div>
																		<div>{creator.name}</div>
																		<div className="text-xs text-muted-foreground">
																			{creator.handle}
																		</div>
																	</div>
																</div>
															</td>
															<td className="px-4 py-3">{creator.category}</td>
															<td className="px-4 py-3">{creator.followers}</td>
															<td className="px-4 py-3">
																{creator.engagement}
															</td>
															<td className="px-4 py-3">
																<div className="flex gap-1">
																	{creator.platforms.map((platform) => (
																		<TooltipProvider key={platform}>
																			<Tooltip>
																				<TooltipTrigger asChild>
																					<div className="rounded-full p-1">
																						{getPlatformIcon(platform)}
																					</div>
																				</TooltipTrigger>
																				<TooltipContent>
																					<p className="capitalize">
																						{platform}
																					</p>
																				</TooltipContent>
																			</Tooltip>
																		</TooltipProvider>
																	))}
																</div>
															</td>
															<td className="px-4 py-3">
																<div className="flex items-center gap-2">
																	<div
																		className={`h-2 w-2 rounded-full ${getStatusColor(creator.status)}`}
																	/>
																	<span>{creator.status}</span>
																</div>
															</td>
															<td className="px-4 py-3">{creator.lastPost}</td>
															<td className="px-4 py-3">
																<div className="flex flex-col gap-1">
																	<div className="flex items-center justify-between text-xs">
																		<span>
																			{creator.completedContent}/
																			{creator.plannedContent} completed
																		</span>
																		<span className="text-muted-foreground">
																			{Math.round(
																				(creator.completedContent /
																					creator.plannedContent) *
																					100,
																			)}
																			%
																		</span>
																	</div>
																	<Progress
																		value={
																			(creator.completedContent /
																				creator.plannedContent) *
																			100
																		}
																	/>
																</div>
															</td>
															<td className="px-4 py-3 text-right">
																<DropdownMenu>
																	<DropdownMenuTrigger asChild>
																		<Button variant="ghost" size="icon">
																			<MoreVertical className="h-4 w-4" />
																			<span className="sr-only">Actions</span>
																		</Button>
																	</DropdownMenuTrigger>
																	<DropdownMenuContent align="end">
																		<DropdownMenuItem>
																			View Profile
																		</DropdownMenuItem>
																		<DropdownMenuItem>
																			Edit Details
																		</DropdownMenuItem>
																		<DropdownMenuItem>Message</DropdownMenuItem>
																		<DropdownMenuSeparator />
																		<DropdownMenuItem className="text-destructive">
																			Remove Creator
																		</DropdownMenuItem>
																	</DropdownMenuContent>
																</DropdownMenu>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Planned Content tab content */}
							<TabsContent value="content" className="mt-4">
								<Card>
									<CardContent className="p-0">
										<div className="overflow-auto">
											<table className="w-full">
												<thead>
													<tr className="border-b text-left text-xs font-medium text-muted-foreground">
														<th className="sticky left-0 bg-background px-4 py-3">
															Content
														</th>
														<th className="px-4 py-3">Creator</th>
														<th className="px-4 py-3">Platform</th>
														<th className="px-4 py-3">Due Date</th>
														<th className="px-4 py-3">Status</th>
														<th className="px-4 py-3">Brief</th>
														<th className="px-4 py-3 text-right">Actions</th>
													</tr>
												</thead>
												<tbody>
													{plannedPosts.map((post) => (
														<tr key={post.id} className="border-b">
															<td className="sticky left-0 bg-background px-4 py-3 font-medium">
																{post.title}
															</td>
															<td className="px-4 py-3">{post.creator}</td>
															<td className="px-4 py-3">
																<div className="flex items-center gap-2">
																	{getPlatformIcon(post.platform)}
																	<span className="capitalize">
																		{post.platform}
																	</span>
																</div>
															</td>
															<td className="px-4 py-3">
																<div className="flex items-center gap-1">
																	<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
																	<span>
																		{new Date(
																			post.dueDate,
																		).toLocaleDateString()}
																	</span>
																</div>
															</td>
															<td className="px-4 py-3">
																<div className="flex items-center gap-2">
																	<div
																		className={`h-2 w-2 rounded-full ${getStatusColor(post.status)}`}
																	/>
																	<span>{post.status}</span>
																</div>
															</td>
															<td className="max-w-[300px] px-4 py-3 text-sm text-muted-foreground">
																<div className="truncate">{post.brief}</div>
															</td>
															<td className="px-4 py-3 text-right">
																<DropdownMenu>
																	<DropdownMenuTrigger asChild>
																		<Button variant="ghost" size="icon">
																			<MoreVertical className="h-4 w-4" />
																			<span className="sr-only">Actions</span>
																		</Button>
																	</DropdownMenuTrigger>
																	<DropdownMenuContent align="end">
																		<DropdownMenuItem>
																			View Details
																		</DropdownMenuItem>
																		<DropdownMenuItem>
																			Edit Content
																		</DropdownMenuItem>
																		<DropdownMenuItem>
																			Change Status
																		</DropdownMenuItem>
																		<DropdownMenuSeparator />
																		<DropdownMenuItem className="text-destructive">
																			Delete Content
																		</DropdownMenuItem>
																	</DropdownMenuContent>
																</DropdownMenu>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>

						{/* Content planning section */}
						<section>
							<div className="flex items-center justify-between">
								<h2 className="text-xl font-semibold">Content Planning</h2>
								<Button variant="outline" size="sm">
									<Calendar className="mr-1 h-4 w-4" />
									View Calendar
								</Button>
							</div>
							<div className="mt-4 grid gap-4 md:grid-cols-3">
								<Card>
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between">
											<CardTitle>Upcoming Content</CardTitle>
											<Badge
												variant="outline"
												className="flex items-center gap-1"
											>
												<Clock className="h-3 w-3" />
												Next 7 days
											</Badge>
										</div>
									</CardHeader>
									<CardContent className="grid gap-4">
										{plannedPosts
											.filter(
												(post) =>
													new Date(post.dueDate) > new Date() &&
													new Date(post.dueDate) <
														new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
											)
											.map((post, index) => (
												<div key={index} className="flex items-start gap-3">
													<div
														className={`mt-0.5 h-2 w-2 rounded-full ${getStatusColor(post.status)}`}
													/>
													<div className="grid gap-1">
														<div className="font-medium">{post.title}</div>
														<div className="flex items-center gap-2 text-xs text-muted-foreground">
															<span>{post.creator}</span>
															<span>•</span>
															<div className="flex items-center gap-1">
																{getPlatformIcon(post.platform)}
																<span className="capitalize">
																	{post.platform}
																</span>
															</div>
															<span>•</span>
															<span>
																{new Date(post.dueDate).toLocaleDateString()}
															</span>
														</div>
													</div>
												</div>
											))}
									</CardContent>
									<CardFooter>
										<Button variant="ghost" size="sm" className="w-full">
											View All Upcoming
										</Button>
									</CardFooter>
								</Card>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle>Content Ideas</CardTitle>
									</CardHeader>
									<CardContent className="grid gap-4">
										<div className="rounded-md border p-3">
											<div className="font-medium">Summer Fashion Lookbook</div>
											<div className="mt-1 text-sm text-muted-foreground">
												Showcase our summer collection with beach and city
												settings
											</div>
											<div className="mt-2 flex flex-wrap gap-1">
												<Badge variant="secondary" className="text-xs">
													Fashion
												</Badge>
												<Badge variant="secondary" className="text-xs">
													Summer
												</Badge>
												<Badge variant="secondary" className="text-xs">
													Lookbook
												</Badge>
											</div>
										</div>
										<div className="rounded-md border p-3">
											<div className="font-medium">Product Unboxing Series</div>
											<div className="mt-1 text-sm text-muted-foreground">
												Create excitement with unboxing videos of our premium
												product line
											</div>
											<div className="mt-2 flex flex-wrap gap-1">
												<Badge variant="secondary" className="text-xs">
													Unboxing
												</Badge>
												<Badge variant="secondary" className="text-xs">
													Products
												</Badge>
												<Badge variant="secondary" className="text-xs">
													Review
												</Badge>
											</div>
										</div>
										<div className="rounded-md border p-3">
											<div className="font-medium">
												Behind-the-Scenes Campaign
											</div>
											<div className="mt-1 text-sm text-muted-foreground">
												Show the creative process and team behind our latest
												campaign
											</div>
											<div className="mt-2 flex flex-wrap gap-1">
												<Badge variant="secondary" className="text-xs">
													BTS
												</Badge>
												<Badge variant="secondary" className="text-xs">
													Campaign
												</Badge>
												<Badge variant="secondary" className="text-xs">
													Team
												</Badge>
											</div>
										</div>
									</CardContent>
									<CardFooter>
										<Button variant="ghost" size="sm" className="w-full">
											Add New Idea
										</Button>
									</CardFooter>
								</Card>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle>Content Performance</CardTitle>
									</CardHeader>
									<CardContent className="grid gap-4">
										<div>
											<div className="mb-1 flex items-center justify-between text-sm">
												<span>Engagement Rate</span>
												<span className="font-medium">4.8%</span>
											</div>
											<Progress value={48} className="h-2" />
											<div className="mt-1 text-xs text-muted-foreground">
												<span className="text-green-500">↑ 0.5%</span> from last
												month
											</div>
										</div>
										<div>
											<div className="mb-1 flex items-center justify-between text-sm">
												<span>Conversion Rate</span>
												<span className="font-medium">2.3%</span>
											</div>
											<Progress value={23} className="h-2" />
											<div className="mt-1 text-xs text-muted-foreground">
												<span className="text-green-500">↑ 0.2%</span> from last
												month
											</div>
										</div>
										<div>
											<div className="mb-1 flex items-center justify-between text-sm">
												<span>Content Completion</span>
												<span className="font-medium">68%</span>
											</div>
											<Progress value={68} className="h-2" />
											<div className="mt-1 text-xs text-muted-foreground">
												17 of 25 pieces completed
											</div>
										</div>
										<Separator />
										<div>
											<div className="mb-2 text-sm font-medium">
												Top Performing Content
											</div>
											<div className="grid gap-2">
												<div className="flex items-center justify-between text-sm">
													<div className="flex items-center gap-2">
														<Instagram className="h-3.5 w-3.5" />
														<span>Summer Collection Reel</span>
													</div>
													<span>245K views</span>
												</div>
												<div className="flex items-center justify-between text-sm">
													<div className="flex items-center gap-2">
														<TikTok className="h-3.5 w-3.5" />
														<span>Product Tutorial</span>
													</div>
													<span>189K views</span>
												</div>
												<div className="flex items-center justify-between text-sm">
													<div className="flex items-center gap-2">
														<Youtube className="h-3.5 w-3.5" />
														<span>Brand Story Video</span>
													</div>
													<span>132K views</span>
												</div>
											</div>
										</div>
									</CardContent>
									<CardFooter>
										<Button variant="ghost" size="sm" className="w-full">
											View Detailed Analytics
										</Button>
									</CardFooter>
								</Card>
							</div>
						</section>
					</div>
				</main>
			</div>
		</div>
	);
}
