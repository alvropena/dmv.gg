import type React from "react";

interface WelcomeEmailProps {
	firstName: string | null;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ firstName }) => {
	return (
		<div>
			<h1>Welcome, {firstName || "User"}!</h1>
			{/* eslint-disable-next-line react/no-unescaped-entities */}
			<p>
				Thanks for signing up for DMV.gg. We&apos;re excited to help you ace
				your driving test!
			</p>
			<p>Get started by checking out our practice tests.</p>
			{/* You could add a link like this: */}
			{/* <a href="https://yourdomain.com/home">Go to Dashboard</a> */}
		</div>
	);
};
