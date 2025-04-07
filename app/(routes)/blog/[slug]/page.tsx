import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Hardcoded blog posts data with full content
const blogPosts = {
	"dmv-test-tips": {
		title: "10 Essential Tips to Pass Your DMV Knowledge Test",
		date: "April 10, 2025",
		readTime: "5 min read",
		sections: [
			{
				title: "Introduction",
				content:
					"Passing your DMV knowledge test doesn't have to be stressful. With the right preparation and mindset, you can ace it on your first try. Here are 10 essential tips to help you succeed:",
			},
			{
				title: "1. Start Early",
				content:
					"Don't wait until the last minute to begin studying. Give yourself at least 2-3 weeks to thoroughly review the driver's manual and practice tests.",
			},
			{
				title: "2. Read the Official Manual",
				content:
					"The DMV driver's manual contains all the information you need to know. Read it cover to cover at least once, then focus on sections you find challenging.",
			},
			{
				title: "3. Take Practice Tests",
				content:
					"Practice tests are invaluable for familiarizing yourself with the question format and identifying knowledge gaps. Aim to take at least 10 different practice tests.",
			},
			{
				title: "4. Focus on Road Signs",
				content:
					"Road signs and their meanings are frequently tested. Make sure you can recognize and understand all traffic signs, signals, and pavement markings.",
			},
			{
				title: "5. Study Traffic Laws",
				content:
					"Pay special attention to traffic laws, right-of-way rules, and speed limits. These are common areas where test-takers make mistakes.",
			},
			{
				title: "6. Understand DUI Laws",
				content:
					"Questions about DUI laws and penalties are common on the test. Know the legal blood alcohol content limits and consequences of driving under the influence.",
			},
			{
				title: "7. Review Parking Rules",
				content:
					"Parking regulations, including parallel parking and parking restrictions, are frequently tested. Make sure you understand all parking-related rules.",
			},
			{
				title: "8. Get a Good Night's Sleep",
				content:
					"Before the test, ensure you're well-rested. A clear mind will help you recall information and make better decisions during the test.",
			},
			{
				title: "9. Arrive Early",
				content:
					"Plan to arrive at least 15 minutes before your appointment. This gives you time to check in and calm your nerves before the test begins.",
			},
			{
				title: "10. Read Questions Carefully",
				content:
					'During the test, read each question thoroughly before answering. Look for keywords like "not," "always," or "never" that can change the meaning of the question.',
			},
			{
				title: "Conclusion",
				content:
					"By following these tips and dedicating time to proper preparation, you'll significantly increase your chances of passing the DMV knowledge test on your first attempt.",
			},
		],
	},
	"common-mistakes": {
		title: "Common Mistakes to Avoid on Your DMV Test",
		date: "April 15, 2025",
		readTime: "4 min read",
		sections: [
			{
				title: "Introduction",
				content:
					"Many people fail their DMV knowledge test due to preventable mistakes. By understanding these common errors, you can avoid them and increase your chances of passing. Here are the most frequent mistakes test-takers make:",
			},
			{
				title: "1. Rushing Through Questions",
				content:
					"One of the biggest mistakes is rushing through questions without reading them carefully. Take your time to understand what's being asked before selecting an answer.",
			},
			{
				title: "2. Overlooking Key Words",
				content:
					'Words like "not," "always," or "never" can completely change the meaning of a question. Many test-takers miss these important qualifiers and select incorrect answers.',
			},
			{
				title: "3. Second-Guessing Yourself",
				content:
					"It's common to second-guess your initial answer, especially when you're nervous. Trust your preparation and stick with your first instinct unless you're absolutely certain it's wrong.",
			},
			{
				title: "4. Focusing Too Much on Memorization",
				content:
					"While memorizing facts is important, understanding concepts is crucial. The DMV test often presents scenarios that require you to apply knowledge, not just recall facts.",
			},
			{
				title: "5. Ignoring Road Signs and Signals",
				content:
					"Many test-takers underestimate the importance of knowing traffic signs and signals. These are frequently tested and can be the difference between passing and failing.",
			},
			{
				title: "6. Not Understanding Right-of-Way Rules",
				content:
					"Right-of-way rules are complex and commonly tested. Make sure you thoroughly understand who has the right of way in various traffic situations.",
			},
			{
				title: "7. Neglecting to Review the Manual",
				content:
					"Some people rely solely on practice tests without reading the official DMV manual. The manual contains essential information that might not be covered in practice tests.",
			},
			{
				title: "8. Arriving Unprepared",
				content:
					"Showing up without proper identification, arriving late, or being unfamiliar with the testing process can create unnecessary stress and affect your performance.",
			},
			{
				title: "Conclusion",
				content:
					"By avoiding these common mistakes and focusing on thorough preparation, you'll be well-equipped to pass your DMV knowledge test with confidence.",
			},
		],
	},
	"study-strategies": {
		title: "Effective Study Strategies for DMV Knowledge Tests",
		date: "April 20, 2025",
		readTime: "6 min read",
		sections: [
			{
				title: "Introduction",
				content:
					"Preparing for your DMV knowledge test requires more than just memorizing facts. Effective study strategies can help you retain information better and perform well on the test. Here are proven techniques to enhance your learning:",
			},
			{
				title: "1. Create a Study Schedule",
				content:
					"Develop a structured study plan that breaks down the material into manageable chunks. Allocate specific times each day for studying and stick to your schedule.",
			},
			{
				title: "2. Use Active Recall",
				content:
					"Instead of passively reading the manual, test yourself regularly. Cover up answers and try to recall information before checking if you're correct. This strengthens memory retention.",
			},
			{
				title: "3. Apply the Feynman Technique",
				content:
					"Explain concepts in your own words as if teaching someone else. This helps identify gaps in your understanding and reinforces learning.",
			},
			{
				title: "4. Use Visual Aids",
				content:
					"Create flashcards with traffic signs, or draw diagrams of traffic scenarios. Visual learning can be more effective than text alone for understanding road rules.",
			},
			{
				title: "5. Take Regular Practice Tests",
				content:
					"Practice tests not only familiarize you with the question format but also help identify areas where you need more study. Aim to take at least one practice test daily.",
			},
			{
				title: "6. Study in Short Sessions",
				content:
					"Research shows that shorter, focused study sessions are more effective than long cramming sessions. Aim for 25-30 minute study blocks with short breaks in between.",
			},
			{
				title: "7. Use Mnemonics",
				content:
					'Create memory aids for complex rules or lists. For example, "SMOG" can help remember the steps for changing lanes: Signal, Mirror, Over-the-shoulder, Go.',
			},
			{
				title: "8. Join Study Groups",
				content:
					"Studying with others can provide different perspectives and help reinforce learning through discussion and explanation.",
			},
			{
				title: "9. Apply Real-World Examples",
				content:
					"Connect what you're learning to real-world situations. When you're a passenger in a car, observe traffic signs and rules being applied.",
			},
			{
				title: "10. Review Regularly",
				content:
					"Spaced repetition is key to long-term retention. Review material regularly, focusing more on areas you find challenging.",
			},
			{
				title: "Conclusion",
				content:
					"By incorporating these effective study strategies into your preparation, you'll not only perform better on the DMV knowledge test but also develop a deeper understanding of traffic laws that will serve you well as a driver.",
			},
		],
	},
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
	const post = blogPosts[params.slug as keyof typeof blogPosts];

	if (!post) {
		notFound();
	}

	return (
		<div className="container mx-auto px-4 py-12 max-w-4xl">
			<Link
				href="/blog"
				className="text-blue-600 hover:underline mb-6 inline-block"
			>
				← Back to Blog
			</Link>

			<article className="prose prose-lg max-w-none">
				<h1 className="text-3xl font-bold mb-4">{post.title}</h1>
				<div className="flex items-center text-sm text-muted-foreground mb-8">
					<span>{post.date}</span>
					<span className="mx-2">•</span>
					<span>{post.readTime}</span>
				</div>

				{post.sections.map((section) => (
					<div
						key={`${section.title}-${section.content.substring(0, 20)}`}
						className="mb-6"
					>
						<h2 className="text-xl font-semibold mb-2">{section.title}</h2>
						<p className="mb-4">{section.content}</p>
					</div>
				))}
			</article>
		</div>
	);
}
