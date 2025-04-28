import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Features() {
	const router = useRouter();

	const handleGetStarted = () => {
		router.push("/sign-up");
	};

	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container px-4 md:px-6">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
							Everything you need to pass your test
						</h2>
						<p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
							We provide all the tools and resources you need to pass your test on
							the first try.
						</p>
				</div>
					<div className="mx-auto w-full max-w-full space-y-4">
						<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
							<div className="flex flex-col items-center space-y-2 border-gray-800 p-4">
								<div className="p-2">
									<svg
										className=" h-12 w-12 fill-current"
										height="24"
										width="24"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
										<path d="M11 11h2v6h-2zm0-4h2v2h-2z" />
									</svg>
			</div>
								<h3 className="text-xl font-bold">Practice Tests</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Access hundreds of practice questions to prepare for your test.
			</p>
		</div>
							<div className="flex flex-col items-center space-y-2 border-gray-800 p-4">
								<div className="p-2">
									<svg
										className=" h-12 w-12 fill-current"
										height="24"
										width="24"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
										<path d="m9 17 8-5-8-5z" />
									</svg>
								</div>
								<h3 className="text-xl font-bold">Video Lessons</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Watch comprehensive video lessons on every topic.
								</p>
							</div>
							<div className="flex flex-col items-center space-y-2 border-gray-800 p-4">
								<div className="p-2">
									<svg
										className=" h-12 w-12 fill-current"
										height="24"
										width="24"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z" />
										<path d="M6 7h12v2H6zm0 4h12v2H6zm0 4h6v2H6z" />
									</svg>
								</div>
								<h3 className="text-xl font-bold">Study Guides</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Get detailed study guides for each section of the test.
								</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-2 min-[400px]:flex-row">
						<Button
							onClick={handleGetStarted}
							className="rounded-full text-lg px-6 py-4 h-auto bg-[#000099] text-white hover:bg-[#000099]/90 hover:text-white"
						>
							Get started for free
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
