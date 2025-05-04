import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const TIME_HORIZONS = [
	{ label: "Today", value: "1d" },
	{ label: "Yesterday", value: "yesterday" },
	{ label: "Last 7 days", value: "7d" },
	{ label: "Last 30 days", value: "30d" },
	{ label: "Last 90 days", value: "90d" },
	{ label: "All time", value: "all" },
];

export function TimeHorizonDropdown() {
	const searchParams = useSearchParams();
	const timeHorizon = searchParams.get("timeHorizon") || "30d";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					{TIME_HORIZONS.find((t) => t.value === timeHorizon)?.label ||
						"Last 30 days"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{TIME_HORIZONS.map((option) => (
					<DropdownMenuItem key={option.value} asChild>
						<Link
							href={{
								pathname: "/admin",
								query: {
									...Object.fromEntries(searchParams.entries()),
									timeHorizon: option.value,
								},
							}}
							scroll={false}
						>
							{option.label}
						</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
