import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { NotificationsMenu } from "@/components/notifications"

interface DashboardHeaderProps {
  title: string
  userRole: string
}

export function DashboardHeader({ title, userRole }: DashboardHeaderProps) {
  return (
    <div className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <NotificationsMenu />
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userRole === "admin" ? "A" : "G"}</AvatarFallback>
          </Avatar>
          <div className="hidden text-sm md:block">
            <div className="font-medium">{userRole === "admin" ? "Admin User" : "Guest User"}</div>
            <div className="text-xs text-muted-foreground">{userRole === "admin" ? "Tournament Admin" : "Guest"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
