import Image from "next/image";

export default function Logo() {
	return (
		<div className="flex items-center gap-2">
			<Image
				src="/logo.png"
				alt="DMV Logo"
				width={60}
				height={20}
				className="h-auto w-auto rounded-full"
				priority
			/>
		</div>
	);
}
