"use client"

import { useAppContext } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"

export function NotificationsMenu() {
  const { notifications, clearNotifications } = useAppContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-600" />}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearNotifications} className="h-auto p-1 text-xs">
              Clear all
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-auto">
          {notifications.length === 0 ? (
            <DropdownMenuItem disabled>No notifications</DropdownMenuItem>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start">
                <span>{notification.message}</span>
                <span className="text-xs text-muted-foreground">Just now</span>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
