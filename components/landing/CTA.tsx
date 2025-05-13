"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/sign-up");
  };

  return (
    <section className="w-full pt-12 md:pt-16 lg:pt-24 text-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="rounded-[40px] bg-[#3FA7D6]/90 py-12 md:py-32 px-4 md:px-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 w-full">
              <h2 className="text-5xl font-extrabold tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl">
                Want to pass your permit test?
              </h2>
              <p className="w-full text-white text-base md:text-2xl lg:text-3xl xl:text-4xl">
                Take your free 36-question DMV-style test right now. No payment needed.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                onClick={handleGetStarted}
                className="rounded-full text-lg md:text-2xl px-6 py-4 md:px-10 md:py-6 h-auto bg-[#000099] text-white hover:bg-[#000099]/90 hover:text-white font-bold"
              >
                Start 36-question free test
                <ArrowRight className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}