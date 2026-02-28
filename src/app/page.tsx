import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-2rem)] flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center justify-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Welcome to Demo
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Guardian RF — Drone monitoring and geofence management platform.
        </p>
        <Button asChild size="lg">
          <Link href="/drones">Go to Drones</Link>
        </Button>
      </main>
    </div>
  )
}
