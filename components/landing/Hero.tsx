"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const router = useRouter();

  const handleStartPracticing = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/sign-up");
  };

  return (
    <section className="w-full py-2 pt-4 min-h-screen flex items-start md:items-center md:min-h-[85vh] md:py-8 lg:py-16">
      <div className="container mx-auto px-6">
        <div className="grid gap-4 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-start md:justify-center space-y-4 md:space-y-6 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tighter text-[#B6DBFF] md:text-6xl lg:text-7xl xl:text-8xl">
                Ace your DMV Knowledge Test
              </h1>
              <p className="text-[#B6DBFF] md:text-md/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Practice with real questions from the California DMV, track your
                progress, and ace your test.
              </p>
            </div>
            <div className="flex gap-2 justify-center md:justify-start">
              <Button
                className="rounded-full text-lg px-6 py-4 h-auto bg-[#FFF25F] text-[#3F3500] hover:bg-[#FFF25F]/90 hover:text-[#3F3500]"
                onClick={handleStartPracticing}
              >
                Get the app
                <Download className="w-4 h-4 ml-2" />
              </Button>
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
    </section>
  );
}
