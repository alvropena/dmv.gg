import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-[#F1F1EF]">
			<SignIn />
		</div>
	);
}
