import Hero from "./Hero"
import Features from "./Features"
import Pricing from "./Pricing"
import HowItWorks from "./HowItWorks"
import Testimonials from "./Testimonials"
import FAQ from "./FAQ"
import CTA from "./CTA"
import Footer from "./Footer"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Hero />
        <Features />
        <Pricing />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

