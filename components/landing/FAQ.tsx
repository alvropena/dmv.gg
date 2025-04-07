"use client";

import { Badge } from "@/components/ui/badge";
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
			"Yes, DMV.gg offers a free version with limited questions. For full access to all questions and features, we offer affordable premium plans.",
	},
	{
		question: "Are these the actual questions from the California DMV test?",
		answer:
			"Our questions are based on the official California DMV handbook and are similar to those you'll encounter on the actual test. Many users report seeing identical questions.",
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
		<section id="faq" className="w-full py-16 md:py-20 lg:py-24">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="space-y-2">
						<Badge
							variant="outline"
							className="w-fit mx-auto border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100"
						>
							FAQ
						</Badge>
						<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
							Frequently Asked Questions
						</h2>
						<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Find answers to common questions about our platform and the DMV
							knowledge test.
						</p>
					</div>
				</div>
				<div className="mx-auto max-w-xl mt-8">
					<div className="border-t border-r border-l shadow-sm rounded-md">
						<div className="pt-1 px-0">
							<Accordion
								type="single"
								collapsible
								className="w-full border-b-0"
							>
								{faqItems.map((item) => (
									<AccordionItem key={item.question} value={item.question}>
										<AccordionTrigger className="text-left text-md font-semibold px-6">
											{item.question}
										</AccordionTrigger>
										<AccordionContent className="text-muted-foreground px-6">
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
