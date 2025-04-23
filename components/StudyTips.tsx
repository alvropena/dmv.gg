import { studyTips } from "@/data/study-tips";
import { StudyTipCard } from "./StudyTipCard";

export function StudyTips() {
	return (
		<div className="w-full px-4">
			<div className="container mx-auto px-2 md:px-6">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-xl font-semibold">Study Tips</h2>
				</div>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{studyTips.map((tip) => (
						<StudyTipCard
							key={tip.title}
							icon={tip.icon}
							title={tip.title}
							description={tip.description}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
