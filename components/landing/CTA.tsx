"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignInDialog } from "@/components/SignInDialog";

export default function CTA() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const handleGetStarted = () => {
    setIsSignInOpen(true);
  };

  return (
    <section className="w-full py-16 md:py-20 lg:py-24 bg-[#3FA7D6] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto rounded-lg bg-[#3FA7D6]/90 p-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2 w-full">
              <h2 className="text-5xl font-extrabold tracking-tighter text-white sm:text-5xl md:text-5xl lg:text-7xl xl:text-8xl">
                Ready to get your license?
              </h2>
              <p className="w-full text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join 10,000+ California drivers who passed with DMV.gg
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                onClick={handleGetStarted}
                className="rounded-full text-lg px-6 py-4 h-auto bg-[#000099] text-white hover:bg-[#000099]/90 hover:text-white"
              >
                Get started for free
              </Button>
            </div>
          </div>
        </div>
      </div>
      <SignInDialog
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </section>
  );
}
