import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_IDS = [
	"skeleton-card-1",
	"skeleton-card-2",
	"skeleton-card-3",
	"skeleton-card-4",
	"skeleton-card-5",
	"skeleton-card-6",
];

export function EmailCampaignsSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			{SKELETON_IDS.map((id) => (
				<div key={id} className="border rounded-lg p-4 space-y-4 bg-white">
					<div className="space-y-2">
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="h-4 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-4 w-2/3" />
					</div>
					<div className="flex justify-between items-center pt-4">
						<Skeleton className="h-8 w-24" />
						<Skeleton className="h-8 w-24" />
					</div>
				</div>
			))}
		</div>
	);
}
