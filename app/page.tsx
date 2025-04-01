import { DmvStudyDashboard } from "@/components/dmv-study-dashboard"

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">DMV Knowledge Test Study Dashboard</h1>
      <DmvStudyDashboard />
    </div>
  )
}

