"use client";

import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";

const faqItems = [
	{
		question: "Is DMV.gg free to use?",
		answer:
			"Yes, DMV.gg offers one free practice test. After that, you can upgrade to a premium plan for full access to all questions and features.",
	},
	{
		question: "Are these the actual questions from the California DMV test?",
		answer:
			"Yes, all our questions are based on the official California DMV handbook and are similar to those you'll encounter on the actual test. Many users report seeing identical questions.",
	},
	{
		question: "How often is the content updated?",
		answer:
			"We regularly update our question bank to reflect the latest DMV test content and rule changes for each state.",
	},
	{
		question: "Can I use DMV.gg on my phone?",
		answer:
			"Yes, DMV.gg is fully responsive and works on all devices including smartphones, tablets, and computers.",
	},
	{
		question: "How many practice tests can I take?",
		answer:
			"With our premium plan, you can take unlimited practice tests until you feel confident and ready for the real exam.",
	},
	{
		question: "Do you offer a pass guarantee?",
		answer:
			"While we can't guarantee everyone will pass, our statistics show that users who complete at least 5 practice tests have a 95% pass rate on their first attempt.",
	},
];

export default function FAQ() {
	return (
		<section id="faq" className="w-full py-16 md:py-20 lg:py-24 bg-[#540B0E]">
			<div className="container mx-auto px-6">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<h2 className="text-3xl font-bold tracking-tighter md:text-6xl/tight text-white">
							Got questions?
						</h2>
					</div>
				</div>
				<div className="mx-auto max-w-3xl mt-8">
					<div className="border-t border-r border-l border-white/20 shadow-sm rounded-md bg-[#540B0E]">
						<div className="pt-1 px-0">
							<Accordion
								type="single"
								collapsible
								className="w-full border-b-0"
							>
								{faqItems.map((item) => (
									<AccordionItem key={item.question} value={item.question} className="border-b border-white/20">
										<AccordionTrigger className="text-left text-xl font-semibold px-6 text-white hover:text-white/90">
											{item.question}
										</AccordionTrigger>
										<AccordionContent className="text-white/90 px-6">
											{item.answer}
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
