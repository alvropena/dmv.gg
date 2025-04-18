import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-transparent">
			<div className="container mx-auto px-4">
				<div className="flex flex-col gap-6 py-12 md:flex-row md:justify-between">
					<div className="flex flex-col gap-2">
						<Link href="/" className="flex items-center gap-2">
							<div className="bg-[#3FA7D6] text-[#000099] font-bold py-1 px-3 rounded text-lg">
								DMV.gg
							</div>
						</Link>
						<p className="text-base text-[#3FA7D6]">
							Helping drivers pass their DMV knowledge test since 2025.
						</p>
						<p className="text-base text-[#3FA7D6]">
							© {new Date().getFullYear()} Latino Excellence. All rights
							reserved.
						</p>
					</div>
					<div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
						<div className="space-y-3">
							<h3 className="text-base font-medium text-[#3FA7D6]">Platform</h3>
							<ul className="space-y-2">
								<li>
									<Link
										href="#features"
										className="text-base text-[#3FA7D6] hover:underline"
									>
										Features
									</Link>
								</li>
								<li>
									<Link
										href="#pricing"
										className="text-base text-[#3FA7D6] hover:underline"
									>
										Pricing
									</Link>
								</li>
							</ul>
						</div>
						<div className="space-y-3">
							<h3 className="text-base font-medium text-[#3FA7D6]">Resources</h3>
							<ul className="space-y-2">
								<li>
									<Link
										href="/blog"
										className="text-base text-[#3FA7D6] hover:underline"
									>
										Blog
									</Link>
								</li>
								<li>
									<Link
										href="https://www.dmv.ca.gov/portal/locations/"
										className="text-base text-[#3FA7D6] hover:underline"
										target="_blank"
										rel="noopener noreferrer"
									>
										DMV Locations
									</Link>
								</li>
								<li>
									<Link
										href="https://www.dmv.ca.gov/portal/file/california-driver-handbook-pdf/"
										className="text-base text-[#3FA7D6] hover:underline"
										target="_blank"
										rel="noopener noreferrer"
									>
										Handbook
									</Link>
								</li>
							</ul>
						</div>
						<div className="space-y-3">
							<h3 className="text-base font-medium text-[#3FA7D6]">Company</h3>
							<ul className="space-y-2">
								<li>
									<Link
										href="https://excellence.lat/about"
										className="text-base text-[#3FA7D6] hover:underline"
										target="_blank"
										rel="noopener noreferrer"
									>
										About
									</Link>
								</li>
								<li>
									<Link
										href="https://excellence.lat/careers"
										className="text-base text-[#3FA7D6] hover:underline"
										target="_blank"
										rel="noopener noreferrer"
									>
										Careers
									</Link>
								</li>
								<li>
									<Link
										href="mailto:support@dmv.gg"
										className="text-base text-[#3FA7D6] hover:underline"
									>
										Contact
									</Link>
								</li>
							</ul>
						</div>
						<div className="space-y-3">
							<h3 className="text-base font-medium text-[#3FA7D6]">Legal</h3>
							<ul className="space-y-2">
								<li>
									<Link
										href="/privacy"
										className="text-base text-[#3FA7D6] hover:underline"
									>
										Privacy Policy
									</Link>
								</li>
								<li>
									<Link
										href="/terms"
										className="text-base text-[#3FA7D6] hover:underline"
									>
										Terms of Service
									</Link>
								</li>
								<li>
									<Link
										href="/cookies"
										className="text-base text-[#3FA7D6] hover:underline"
									>
										Cookie Policy
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
