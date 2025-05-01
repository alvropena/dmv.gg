import type React from "react";
import Image from "next/image";

interface WelcomeEmailProps {
	firstName: string | null;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ firstName }) => {
	return (
		<div style={{
			maxWidth: '600px',
			margin: '0 auto',
			fontFamily: 'Arial, sans-serif',
			lineHeight: '1.6',
			color: '#333333'
		}}>
			{/* Header */}
			<div style={{
				textAlign: 'center',
				padding: '20px 0',
				backgroundColor: '#f8f9fa'
			}}>
				<Image 
					src="https://dmv.gg/logo.png" 
					alt="DMV.gg Logo" 
					width={150}
					height={50}
					style={{ 
						width: '150px',
						height: 'auto'
					}} 
				/>
			</div>

			{/* Main Content */}
			<div style={{
				padding: '30px 20px',
				backgroundColor: '#ffffff'
			}}>
				<h1 style={{
					fontSize: '24px',
					marginBottom: '20px',
					color: '#1a1a1a'
				}}>
					{firstName ? `Welcome to DMV.gg, ${firstName}!` : "Welcome to DMV.gg!"}
				</h1>

				<p style={{ marginBottom: '20px' }}>
					We&apos;re thrilled to have you join our community of future drivers. At DMV.gg, we&apos;re excited to help you ace
					your driving test!
				</p>

				<p style={{ marginBottom: '20px' }}>
					Here&apos;s what you can do to get started:
				</p>

				<ul style={{ 
					marginBottom: '20px',
					paddingLeft: '20px'
				}}>
					<li>Take practice tests to prepare for your exam</li>
					<li>Access our comprehensive study materials</li>
					<li>Track your progress and identify areas for improvement</li>
				</ul>

				{/* Call to Action Button */}
				<div style={{ textAlign: 'center', margin: '30px 0' }}>
					<a 
						href="https://dmv.gg/home" 
						style={{
							display: 'inline-block',
							padding: '12px 24px',
							backgroundColor: '#2563eb',
							color: '#ffffff',
							textDecoration: 'none',
							borderRadius: '4px',
							fontWeight: 'bold'
						}}
					>
						Get Started
					</a>
				</div>

				<p style={{ marginBottom: '20px' }}>
					If you have any questions, our support team is here to help. Just reply to this email or contact us at support@dmv.gg.
				</p>

				<p style={{ marginBottom: '20px' }}>
					Best regards,<br />
					The DMV.gg Team
				</p>
			</div>

			{/* Footer */}
			<div style={{
				padding: '20px',
				backgroundColor: '#f8f9fa',
				textAlign: 'center',
				fontSize: '12px',
				color: '#666666'
			}}>
				<p style={{ marginBottom: '10px' }}>
					© {new Date().getFullYear()} DMV.gg. All rights reserved.
				</p>
				<p style={{ marginBottom: '10px' }}>
					Made with ❤️ in San Francisco
				</p>
				<p>
					<a 
						href="https://dmv.gg/privacy" 
						style={{ 
							color: '#666666',
							textDecoration: 'none',
							margin: '0 10px'
						}}
					>
						Privacy Policy
					</a>
					|
					<a 
						href="https://dmv.gg/terms" 
						style={{ 
							color: '#666666',
							textDecoration: 'none',
							margin: '0 10px'
						}}
					>
						Terms of Service
					</a>
				</p>
				<p style={{ marginTop: '10px', fontSize: '11px' }}>
					<a 
						href="https://dmv.gg/unsubscribe" 
						style={{ 
							color: '#666666',
							textDecoration: 'none'
						}}
					>
						Unsubscribe from these emails
					</a>
				</p>
			</div>
		</div>
	);
};
