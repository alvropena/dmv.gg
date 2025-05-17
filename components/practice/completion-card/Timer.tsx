import { Clock } from "lucide-react"

interface TimerProps {
	minutes: number;
	seconds: number;
}

export const Timer = ({ minutes, seconds }: TimerProps) => (
	<div className="flex items-center gap-1.5 text-amber-200 font-medium text-sm">
		<Clock className="h-4 w-4" />
		<span>
			{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
		</span>
	</div>
); 