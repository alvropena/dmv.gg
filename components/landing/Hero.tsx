"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const router = useRouter();

  const handleStartPracticing = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/sign-up");
  };

  return (
    <section className="w-full py-2 pt-4 min-h-screen flex items-start md:items-center md:min-h-[85vh] md:py-8 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-start md:justify-center space-y-4 md:space-y-6 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tighter text-[#B6DBFF] md:text-6xl lg:text-7xl xl:text-8xl">
                Nervous about your Permit Test?
              </h1>
              <p className="text-[#B6DBFF] md:text-md/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find out if you'd pass with real DMV questions.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start gap-4">
              <Button
                className="rounded-full text-lg px-6 py-4 h-auto bg-[#FFF25F] text-[#3F3500] hover:bg-[#FFF25F]/90 hover:text-[#3F3500]"
                onClick={handleStartPracticing}
              >
                Start free test now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <ul className="text-[#B6DBFF] text-base md:text-lg space-y-1 mt-1">
                <li>✅ 36 real questions</li>
                <li>✅ Instant results + weak areas</li>
                <li>✅ Fast, free, no sign-up required</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-center md:mt-0">
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden">
              <Image
                src="/hero-image.png"
                alt="Happy driver showing DMV app and license"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Mobile scroll cue overlay */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 flex justify-center items-center z-30 pointer-events-none rounded-full bg-[#0A183D]/80">
        <ChevronDown className="text-[#B6DBFF] animate-bounce w-7 h-7" />
      </div>
    </section>
  );
}