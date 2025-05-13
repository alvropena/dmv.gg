"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowDown, CreditCard, AlarmClock, Users, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, RefObject } from "react";

interface HeroProps {
  footerRef?: RefObject<HTMLDivElement>;
}

const FeatureList = () => {
  return (
    <div className="flex flex-col w-full gap-4">
      <p className="flex items-center justify-center md:justify-start gap-2 text-[#B6DBFF] text-base md:text-xl lg:text-2xl leading-tight">
        <CreditCard className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
        No credit card required.
      </p>
      <p className="flex items-center justify-center md:justify-start gap-2 text-[#B6DBFF] text-base md:text-xl lg:text-2xl leading-tight">
        <AlarmClock className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
        1 in 4 students fail. Don&apos;t risk it.
      </p>
      <p className="flex items-center justify-center md:justify-start gap-2 text-[#B6DBFF] text-base md:text-xl lg:text-2xl leading-tight">
        <Users className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
        As seen by 65,000+ on TikTok
      </p>
    </div>
  );
};

const HeroContent = () => {
  const router = useRouter();

  const handleStartPracticing = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/sign-up");
  };

  return (
    <div className="flex flex-col justify-start md:justify-center space-y-4 md:space-y-4 text-center md:text-left">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tighter text-[#B6DBFF] md:text-6xl lg:text-7xl xl:text-8xl">
          Nervous about your Permit Test?
        </h1>
        <p className="text-[#B6DBFF] text-base md:text-2xl lg:text-3xl xl:text-4xl">
          Find out if you&apos;d pass with real DMV questions.
        </p>
      </div>

      <div className="flex flex-col items-center md:items-start gap-4">
        <Button
          className="rounded-full text-lg md:text-2xl px-6 py-4 md:px-10 md:py-6 h-auto bg-[#FFF25F] text-[#3F3500] hover:bg-[#FFF25F]/90 hover:text-[#3F3500] font-bold"
          onClick={handleStartPracticing}
        >
          Start 36-question free test
          <svg
            className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <FeatureList />
      </div>
    </div>
  );
};

const HeroImage = () => {
  return (
    <div className="flex items-center justify-center md:mt-0 relative">
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
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-2/3 max-w-[320px] bg-white/90 rounded-full px-3 py-2 flex items-center justify-center gap-2 shadow-lg">
        <Star className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" fill="currentColor" />
        <span className="font-semibold text-gray-800 text-lg md:text-xl text-center">4.9/5 from 1,200+ users</span>
      </div>
    </div>
  );
};

const ScrollIndicator = ({ atBottom, footerVisible }: { atBottom: boolean; footerVisible: boolean }) => {
  if (atBottom || footerVisible) return null;
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center z-30 pointer-events-none rounded-full bg-white/90 animate-bounce">
      <div className="flex items-center justify-center w-full h-full">
        <svg
          className="w-7 h-7 md:w-8 md:h-8 text-neutral-700"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3L12 21M12 21L5 14M12 21L19 14"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default function Hero({ footerRef }: HeroProps) {
  const [atBottom, setAtBottom] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    if (!footerRef?.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [footerRef]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) return;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const bodyHeight = document.body.offsetHeight;
      setAtBottom(scrollY + windowHeight >= bodyHeight - 8);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section className="w-full py-2 pt-4 min-h-screen flex items-start md:items-center md:min-h-[85vh] md:py-8 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2 md:gap-12 items-center">
          <HeroContent />
          <HeroImage />
        </div>
      </div>
      <ScrollIndicator atBottom={atBottom} footerVisible={footerVisible} />
    </section>
  );
}
