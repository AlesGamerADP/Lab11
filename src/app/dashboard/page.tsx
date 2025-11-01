"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProjectForm } from "@/components/ProjectForm"
import { TasksTable } from "@/components/TaskTable"
import { TeamManagement } from "@/components/TeamManagement"
import { useDashboard } from "@/contexts/DashboardContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, Eye, Trash2, Edit } from "lucide-react"
import { useState } from "react"
import { SettingsForm } from "@/components/SettingsForm"

export default function DashboardPage() {
    const { projects, teamMembers, tasks, getMetrics, deleteProject, getProject } = useDashboard()
    const [projectDetailsOpen, setProjectDetailsOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<number | null>(null)
    const metrics = getMetrics()
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        Dashboard de Proyectos
                    </h1>
                    <p className="text-slate-600">
                        Gestiona tus proyectos y tareas con shadcn/ui
                    </p>
                    <div className="pt-4">
                        <ProjectForm />
                    </div>
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Resumen</TabsTrigger>
                        <TabsTrigger value="projects">Proyectos</TabsTrigger>
                        <TabsTrigger value="team">Equipo</TabsTrigger>
                        <TabsTrigger value="settings">Configuración</TabsTrigger>
                        <TabsTrigger value="tasks">Tareas</TabsTrigger>
                    </TabsList>

                    {/* // Agregar nuevo TabsContent: */}
                    <TabsContent value="tasks" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Gestión de Tareas</CardTitle>
                                <CardDescription>
                                    Administra todas las tareas de tus proyectos
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TasksTable />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab: Overview */}
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {/* Stat Cards */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Total Proyectos
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.totalProjects}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Proyectos activos
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Tareas Completadas
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.completedTasks}</div>
                                    <p className="text-xs text-muted-foreground">
                                        De {tasks.length} tareas totales
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Horas Trabajadas
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <path d="M2 10h20" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.hoursWorked}h</div>
                                    <p className="text-xs text-muted-foreground">
                                        Estimadas
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Miembros Activos
                                    </CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metrics.activeMembers}</div>
                                    <p className="text-xs text-muted-foreground">
                                        De {teamMembers.length} miembros totales
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Actividad Reciente</CardTitle>
                                <CardDescription>
                                    Últimas actualizaciones de tus proyectos
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { user: "María García", action: "completó la tarea", task: "Diseño de UI", time: "Hace 5 min" },
                                        { user: "Juan Pérez", action: "comentó en", task: "API Backend", time: "Hace 1 hora" },
                                        { user: "Ana López", action: "creó un nuevo", task: "Proyecto Mobile", time: "Hace 2 horas" },
                                        { user: "Carlos Ruiz", action: "actualizó", task: "Documentación", time: "Hace 3 horas" },
                                    ].map((activity, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarFallback>{activity.user[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {activity.user}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {activity.action} <span className="font-medium">{activity.task}</span>
                                                </p>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {activity.time}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tab: Projects */}
                    <TabsContent value="projects" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <Card key={project.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">{project.title}</CardTitle>
                                                <CardDescription>{project.description}</CardDescription>
                                            </div>
                                            <Badge
                                                variant={
                                                    project.status === "Completado"
                                                        ? "default"
                                                        : project.status === "En revisión"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                            >
                                                {project.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-muted-foreground">Progreso</span>
                                                    <span className="font-medium">{project.progress}%</span>
                                                </div>
                                                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all"
                                                        style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="h-4 w-4"
                                                    >
                                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                        <circle cx="9" cy="7" r="4" />
                                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                                    </svg>
                                                    {project.team.length} miembros
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setSelectedProject(project.id)
                                                            setProjectDetailsOpen(true)
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Ver
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="destructive"
                                                        onClick={() => {
                                                            if (confirm("¿Estás seguro de eliminar este proyecto?")) {
                                                                deleteProject(project.id)
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Dialog open={projectDetailsOpen} onOpenChange={setProjectDetailsOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Detalles del Proyecto</DialogTitle>
                                    <DialogDescription>
                                        Información completa del proyecto
                                    </DialogDescription>
                                </DialogHeader>
                                {selectedProject && (() => {
                                    const project = getProject(selectedProject)
                                    if (!project) return null
                                    return (
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Título</Label>
                                                <p className="font-medium">{project.title}</p>
                                            </div>
                                            <div>
                                                <Label>Descripción</Label>
                                                <p>{project.description}</p>
                                            </div>
                                            <div>
                                                <Label>Estado</Label>
                                                <Badge variant={project.status === "Completado" ? "default" : "outline"}>
                                                    {project.status}
                                                </Badge>
                                            </div>
                                            <div>
                                                <Label>Progreso</Label>
                                                <p>{project.progress}%</p>
                                            </div>
                                            <div>
                                                <Label>Prioridad</Label>
                                                <Badge>{project.priority}</Badge>
                                            </div>
                                            <div>
                                                <Label>Miembros del Equipo</Label>
                                                <div className="space-y-2 mt-2">
                                                    {project.members && project.members.length > 0 ? (
                                                        project.members.map((memberId) => {
                                                            const member = teamMembers.find((m) => m.userId === memberId)
                                                            return member ? (
                                                                <div key={memberId} className="flex items-center gap-2">
                                                                    <Avatar>
                                                                        <AvatarFallback>
                                                                            {member.name.split(' ').map(n => n[0]).join('')}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="text-sm font-medium">{member.name}</p>
                                                                        <p className="text-xs text-muted-foreground">{member.role}</p>
                                                                    </div>
                                                                </div>
                                                            ) : null
                                                        })
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">No hay miembros asignados</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })()}
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Tab: Team */}
                    <TabsContent value="team" className="space-y-4">
                        <TeamManagement />
                    </TabsContent>

                    {/* Tab: Settings */}
                    <TabsContent value="settings" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Configuración</CardTitle>
                                <CardDescription>
                                    Administra las preferencias de tu cuenta y del sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SettingsForm />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

