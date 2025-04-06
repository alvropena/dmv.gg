import { Badge } from "@/components/ui/badge"

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="w-fit mx-auto border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100"
            >
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Three Simple Steps to Success</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our streamlined process makes it easy to prepare for your DMV knowledge test.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 