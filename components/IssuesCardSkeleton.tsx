import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function IssuesCardSkeleton() {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center">
					<div className="h-5 w-5 rounded-full bg-muted animate-pulse mr-2" />
					<div className="h-6 w-48 bg-muted rounded animate-pulse" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-start gap-3 pb-3 border-b">
						<div className="h-5 w-5 rounded-full bg-muted animate-pulse mt-0.5" />
						<div className="space-y-2 flex-1">
							<div className="h-5 w-32 bg-muted rounded animate-pulse" />
							<div className="h-4 w-48 bg-muted rounded animate-pulse" />
							<div className="h-4 w-24 bg-muted rounded animate-pulse" />
						</div>
					</div>
					<div className="flex items-start gap-3 pb-3 border-b">
						<div className="h-5 w-5 rounded-full bg-muted animate-pulse mt-0.5" />
						<div className="space-y-2 flex-1">
							<div className="h-5 w-32 bg-muted rounded animate-pulse" />
							<div className="h-4 w-48 bg-muted rounded animate-pulse" />
							<div className="h-4 w-24 bg-muted rounded animate-pulse" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
