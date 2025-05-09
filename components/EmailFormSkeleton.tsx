import { Skeleton } from "@/components/ui/skeleton";

export function EmailFormSkeleton() {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-6">
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
			</div>

			<div className="space-y-2">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-[100px] w-full" />
			</div>

			<div className="grid grid-cols-2 gap-6">
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="space-y-2">
					<div className="flex items-center mb-2">
						<Skeleton className="h-4 w-32" />
					</div>
					<div className="grid grid-cols-2 gap-4">
						<Skeleton className="h-[600px] w-full" />
						<Skeleton className="h-[600px] w-full" />
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-6">
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-10 w-full" />
				</div>
			</div>

			<div className="flex justify-end space-x-4 pt-6">
				<Skeleton className="h-10 w-24" />
				<Skeleton className="h-10 w-32" />
			</div>
		</div>
	);
}
