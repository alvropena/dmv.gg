import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function FAQ() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="w-fit mx-auto border-blue-200 bg-blue-100 text-blue-800 hover:bg-blue-100"
            >
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Find answers to common questions about our platform and the DMV knowledge test.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12 mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">Is DMV.gg free to use?</h3>
              <p className="text-muted-foreground">
                Yes, DMV.gg offers a free version with limited questions. For full access to all questions and
                features, we offer affordable premium plans.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">
                Are these the actual questions from the California DMV test?
              </h3>
              <p className="text-muted-foreground">
                Our questions are based on the official California DMV handbook and are similar to those you'll
                encounter on the actual test. Many users report seeing identical questions.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">How often is the content updated?</h3>
              <p className="text-muted-foreground">
                We regularly update our question bank to reflect the latest DMV test content and rule changes for
                each state.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">Can I use DMV.gg on my phone?</h3>
              <p className="text-muted-foreground">
                Yes, DMV.gg is fully responsive and works on all devices including smartphones, tablets, and
                computers.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">How many practice tests can I take?</h3>
              <p className="text-muted-foreground">
                With our premium plan, you can take unlimited practice tests until you feel confident and ready for
                the real exam.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-2">Do you offer a pass guarantee?</h3>
              <p className="text-muted-foreground">
                While we can't guarantee everyone will pass, our statistics show that users who complete at least 5
                practice tests have a 95% pass rate on their first attempt.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 