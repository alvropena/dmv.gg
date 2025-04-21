import React from "react";
import Link from "next/link";

// Hardcoded blog posts data
const blogPosts = [
	{
		id: "dmv-test-tips",
		title: "10 Essential Tips to Pass Your DMV Knowledge Test",
		excerpt:
			"Learn the most effective strategies to prepare for and pass your DMV knowledge test on the first try.",
		date: "April 10, 2025",
		readTime: "5 min read",
	},
	{
		id: "common-mistakes",
		title: "Common Mistakes to Avoid on Your DMV Test",
		excerpt:
			"Discover the most frequent errors test-takers make and how to avoid them during your DMV knowledge test.",
		date: "April 15, 2025",
		readTime: "4 min read",
	},
	{
		id: "study-strategies",
		title: "Effective Study Strategies for DMV Knowledge Tests",
		excerpt:
			"Explore proven study techniques that will help you retain information and perform better on your DMV test.",
		date: "April 20, 2025",
		readTime: "6 min read",
	},
];

export default function BlogPage() {
	return (
		<div className="container mx-auto px-4 py-12 max-w-4xl">
			<h1 className="text-3xl font-bold mb-8 text-white">DMV Knowledge Test Blog</h1>
			<p className="text-lg text-white mb-8">
				Insights, tips, and strategies to help you prepare for and pass your DMV
				knowledge test.
			</p>

			<div className="grid gap-8">
				{blogPosts.map((post) => (
					<article
						key={post.id}
						className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
					>
						<Link href={`/blog/${post.id}`} className="block">
							<h2 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
								{post.title}
							</h2>
							<p className="text-muted-foreground mb-4">{post.excerpt}</p>
							<div className="flex items-center text-sm text-muted-foreground">
								<span>{post.date}</span>
								<span className="mx-2">•</span>
								<span>{post.readTime}</span>
							</div>
						</Link>
					</article>
				))}
			</div>
		</div>
	);
}
