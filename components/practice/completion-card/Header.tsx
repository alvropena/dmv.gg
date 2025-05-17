import { Badge } from "@/components/ui/badge"
import { Timer } from "./Timer"

interface HeaderProps {
	minutes: number;
	seconds: number;
	score: number;
	totalQuestions: number;
	isPass: boolean;
}

export const Header = ({ minutes, seconds, score, totalQuestions, isPass }: HeaderProps) => (
	<div className="bg-[#0000cc] p-6 text-white">
		<div className="flex justify-between items-center">
			<Badge variant="outline" className="bg-white/10 text-white border-white/20 px-3 py-1">
				Test Results
			</Badge>
			<Timer minutes={minutes} seconds={seconds} />
		</div>
		<div className="flex items-center justify-between mt-4">
			<div>
				<h2 className="text-2xl font-bold mb-1">
					{isPass ? "Congratulations! 🎉" : "Almost There!"}
				</h2>
				<p className="text-white/80 text-sm">
					{isPass ? "You've passed the test!" : "Your score needs improvement to pass"}
				</p>
			</div>
			<div className="relative">
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-lg font-bold text-white">{score}/{totalQuestions}</span>
				</div>
				<svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
					<circle
						className="text-white/20"
						strokeWidth="8"
						stroke="currentColor"
						fill="transparent"
						r="40"
						cx="50"
						cy="50"
					/>
					<circle
						className="text-amber-500"
						strokeWidth="8"
						strokeDasharray={251.2}
						strokeDashoffset={251.2 - (251.2 * score) / totalQuestions}
						strokeLinecap="round"
						stroke="currentColor"
						fill="transparent"
						r="40"
						cx="50"
						cy="50"
					/>
				</svg>
			</div>
		</div>
	</div>
); 