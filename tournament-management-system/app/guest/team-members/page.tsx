"use client"

import { useState } from "react"
import { useAppContext } from "@/contexts/app-context"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function TeamMembersPage() {
  const { teamMembers } = useAppContext()
  const { selectedTeam, setSelectedTeam } = useAppContext()
  const [activeTab, setActiveTab] = useState("all")

  // In a real app, we would filter by team ID, but for this demo we'll just simulate it
  const filteredMembers = teamMembers.filter((member) => {
    if (activeTab === "all") return true
    return member.role.toLowerCase() === activeTab.toLowerCase()
  })

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Team Members" userRole="guest" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CCM">CCM</SelectItem>
                <SelectItem value="CCP">CCP</SelectItem>
                <SelectItem value="CPG">CPG</SelectItem>
                <SelectItem value="KBS">KBS</SelectItem>
                <SelectItem value="CEP">CEP</SelectItem>
                <SelectItem value="CDB">CDB</SelectItem>
                <SelectItem value="CDB">CDB</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Browse all members of a selected team including manager, coach, captain and players.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="Manager">Manager</TabsTrigger>
                <TabsTrigger value="ASST COACH">ASST COACH</TabsTrigger>
                <TabsTrigger value="COACH">COACH</TabsTrigger>
                <TabsTrigger value="Player">Players</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab} className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMembers.map((member) => (
                    <MemberCard
                      key={member.id}
                      name={member.name}
                      role={member.role}
                      position={member.position}
                      number={member.number}
                      experience={member.experience}
                      joined={member.joined}
                    />
                  ))}
                  {filteredMembers.length === 0 && (
                    <div className="col-span-3 text-center py-4">No team members found in this category.</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

interface MemberCardProps {
  name: string
  role: string
  position?: string
  number?: string
  experience?: string
  joined: string
}

function MemberCard({ name, role, position, number, experience, joined }: MemberCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarFallback className="text-lg">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-bold">{name}</h3>
        <p
          className={`text-sm px-2 py-1 rounded-full mt-1 ${
            role === "Manager"
              ? "bg-purple-100 text-purple-800"
              : role === "Head Coach"
                ? "bg-blue-100 text-blue-800"
                : role === "Captain"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-800"
          }`}
        >
          {role}
        </p>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          {position && <p>Position: {position}</p>}
          {number && <p>Jersey Number: {number}</p>}
          {experience && <p>Experience: {experience}</p>}
          <p>Joined: {joined}</p>
        </div>
      </div>
    </div>
  )
}