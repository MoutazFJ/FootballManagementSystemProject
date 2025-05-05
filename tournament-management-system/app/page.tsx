import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Trophy, Users, Calendar, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-slate-800 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Tournament Management System</h1>
          <Link href="/login">
            <Button variant="outline" className="text-white border-white hover:bg-slate-700">
              Login
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Welcome to the Tournament Management System</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              A comprehensive platform for managing sports tournaments, teams, and players. Browse match results, team
              information, and player statistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-slate-600" />
                  Tournaments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create and manage tournaments with customizable settings and schedules.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-slate-600" />
                  Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Register teams, assign captains, and approve players for participation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-slate-600" />
                  Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Schedule matches, record results, and track team performance.</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-slate-600" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>View detailed statistics for teams and players across tournaments.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Get Started</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link href="/login?role=admin">
              <Button className="w-full md:w-auto" size="lg">
                Login as Tournament Admin
              </Button>
            </Link>
            <Link href="/login?role=guest">
              <Button variant="outline" className="w-full md:w-auto" size="lg">
                Continue as Guest
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>ICS 321-242 Database Systems Project</p>
          <p className="text-sm mt-2">© 2025 Tournament Management System</p>
        </div>
      </footer>
    </div>
  )
}
