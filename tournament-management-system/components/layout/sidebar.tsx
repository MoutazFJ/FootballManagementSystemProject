"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Trophy, Users, Calendar, Shield, User, LogOut, Menu, Database } from "lucide-react"

interface SidebarProps {
  isAdmin?: boolean
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const adminRoutes = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <Trophy className="mr-2 h-4 w-4" />,
    },
    {
      name: "Tournaments",
      href: "/admin/tournaments",
      icon: <Trophy className="mr-2 h-4 w-4" />,
    },
    {
      name: "Teams",
      href: "/admin/teams",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      name: "Players",
      href: "/admin/players",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      name: "Matches",
      href: "/admin/matches",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      name: "Database Status",
      href: "/admin/database-status",
      icon: <Database className="mr-2 h-4 w-4" />,
    },
  ]

  const guestRoutes = [
    {
      name: "Dashboard",
      href: "/guest/dashboard",
      icon: <Trophy className="mr-2 h-4 w-4" />,
    },
    {
      name: "Match Results",
      href: "/guest/match-results",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      name: "Top Scorers",
      href: "/guest/top-scorers",
      icon: <Shield className="mr-2 h-4 w-4" />,
    },
    {
      name: "Red Cards",
      href: "/guest/red-cards",
      icon: <Shield className="mr-2 h-4 w-4" />,
    },
    {
      name: "Team Members",
      href: "/guest/team-members",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
  ]

  const routes = isAdmin ? adminRoutes : guestRoutes

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] pr-0">
          <MobileSidebar routes={routes} pathname={pathname} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
      <aside className="hidden md:flex w-[240px] flex-col border-r bg-slate-50">
        <DesktopSidebar routes={routes} pathname={pathname} />
      </aside>
    </>
  )
}

interface SidebarNavProps {
  routes: {
    name: string
    href: string
    icon: React.ReactNode
  }[]
  pathname: string
  setOpen?: (open: boolean) => void
}

function MobileSidebar({ routes, pathname, setOpen }: SidebarNavProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-3 py-4">
        <h2 className="mb-2 px-4 text-lg font-semibold">Tournament System</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen?.(false)}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                pathname === route.href
                  ? "bg-slate-200 text-slate-900"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {route.icon}
              {route.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto p-4">
        <Link href="/">
          <Button variant="outline" className="w-full" onClick={() => setOpen?.(false)}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )
}

function DesktopSidebar({ routes, pathname }: SidebarNavProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Trophy className="h-5 w-5" />
          <span>Tournament System</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                pathname === route.href
                  ? "bg-slate-200 text-slate-900"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {route.icon}
              {route.name}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <Link href="/">
          <Button variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  )
}
