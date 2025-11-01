"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"

// Tipos
export interface Project {
  id: number
  title: string
  description: string
  status: "Planificado" | "En progreso" | "En revisión" | "Completado"
  progress: number
  team: number[]
  priority: "Baja" | "Media" | "Alta" | "Urgente"
  category: string
  members?: number[]
}

export interface TeamMember {
  userId: number
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: number | null
  isActive: boolean
}

export interface Task {
  id: number
  description: string
  projectId: number
  status: "Pendiente" | "En progreso" | "Completado"
  priority: "Baja" | "Media" | "Alta" | "Urgente"
  userId: number
  dateline: string
  title?: string
}

interface DashboardContextType {
  projects: Project[]
  teamMembers: TeamMember[]
  tasks: Task[]
  loading: boolean
  
  // Proyectos
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (id: number, project: Partial<Project>) => void
  deleteProject: (id: number) => void
  getProject: (id: number) => Project | undefined
  
  // Equipo
  addTeamMember: (member: Omit<TeamMember, "userId">) => void
  updateTeamMember: (userId: number, member: Partial<TeamMember>) => void
  deleteTeamMember: (userId: number) => void
  getTeamMember: (userId: number) => TeamMember | undefined
  
  // Tareas
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (id: number, task: Partial<Task>) => void
  deleteTask: (id: number) => void
  getTask: (id: number) => Task | undefined
  
  // Métricas
  getMetrics: () => {
    totalProjects: number
    completedTasks: number
    hoursWorked: number
    activeMembers: number
  }
  
  // Simular carga
  simulateLoad: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Plataforma de comercio electrónico con Next.js",
      status: "En progreso",
      progress: 65,
      team: [1, 2],
      priority: "Alta",
      category: "web",
      members: [1, 2],
    },
    {
      id: 2,
      title: "Mobile App",
      description: "Aplicación móvil con React Native",
      status: "En revisión",
      progress: 90,
      team: [3, 4],
      priority: "Media",
      category: "mobile",
      members: [3, 4],
    },
    {
      id: 3,
      title: "Dashboard Analytics",
      description: "Panel de análisis con visualizaciones",
      status: "Planificado",
      progress: 20,
      team: [5],
      priority: "Baja",
      category: "web",
      members: [5],
    },
  ])

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      userId: 1,
      role: "Frontend Developer",
      name: "María García",
      email: "maria@example.com",
      position: "Desarrollador Senior",
      birthdate: "1990-05-15",
      phone: "+34 600 123 456",
      projectId: 1,
      isActive: true,
    },
    {
      userId: 2,
      role: "Backend Developer",
      name: "Juan Pérez",
      email: "juan@example.com",
      position: "Desarrollador Senior",
      birthdate: "1988-08-20",
      phone: "+34 600 234 567",
      projectId: 1,
      isActive: true,
    },
    {
      userId: 3,
      role: "UI/UX Designer",
      name: "Ana López",
      email: "ana@example.com",
      position: "Diseñadora",
      birthdate: "1992-03-10",
      phone: "+34 600 345 678",
      projectId: 2,
      isActive: true,
    },
    {
      userId: 4,
      role: "DevOps Engineer",
      name: "Carlos Ruiz",
      email: "carlos@example.com",
      position: "Ingeniero DevOps",
      birthdate: "1985-11-30",
      phone: "+34 600 456 789",
      projectId: 2,
      isActive: true,
    },
    {
      userId: 5,
      role: "Project Manager",
      name: "Laura Martínez",
      email: "laura@example.com",
      position: "Project Manager",
      birthdate: "1991-07-22",
      phone: "+34 600 567 890",
      projectId: 3,
      isActive: true,
    },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      description: "Implementar autenticación",
      projectId: 1,
      status: "En progreso",
      priority: "Alta",
      userId: 1,
      dateline: "2025-11-15",
      title: "Implementar autenticación",
    },
    {
      id: 2,
      description: "Diseñar pantalla de perfil",
      projectId: 2,
      status: "Pendiente",
      priority: "Media",
      userId: 3,
      dateline: "2025-11-20",
      title: "Diseñar pantalla de perfil",
    },
    {
      id: 3,
      description: "Configurar CI/CD",
      projectId: 2,
      status: "Completado",
      priority: "Alta",
      userId: 4,
      dateline: "2025-11-10",
      title: "Configurar CI/CD",
    },
    {
      id: 4,
      description: "Optimizar queries SQL",
      projectId: 1,
      status: "En progreso",
      priority: "Urgente",
      userId: 2,
      dateline: "2025-11-12",
      title: "Optimizar queries SQL",
    },
    {
      id: 5,
      description: "Documentar API endpoints",
      projectId: 2,
      status: "Pendiente",
      priority: "Baja",
      userId: 5,
      dateline: "2025-11-25",
      title: "Documentar API endpoints",
    },
  ])

  const [loading, setLoading] = useState(false)

  // Proyectos
  const addProject = useCallback((project: Omit<Project, "id">) => {
    setProjects((prev) => [
      ...prev,
      {
        ...project,
        id: Math.max(...prev.map((p) => p.id), 0) + 1,
      },
    ])
  }, [])

  const updateProject = useCallback((id: number, project: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...project } : p))
    )
  }, [])

  const deleteProject = useCallback((id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    // Eliminar tareas y desasignar miembros del proyecto eliminado
    setTasks((prev) => prev.filter((t) => t.projectId !== id))
    setTeamMembers((prev) =>
      prev.map((m) => (m.projectId === id ? { ...m, projectId: null } : m))
    )
  }, [])

  const getProject = useCallback(
    (id: number) => projects.find((p) => p.id === id),
    [projects]
  )

  // Equipo
  const addTeamMember = useCallback((member: Omit<TeamMember, "userId">) => {
    setTeamMembers((prev) => [
      ...prev,
      {
        ...member,
        userId: Math.max(...prev.map((m) => m.userId), 0) + 1,
      },
    ])
  }, [])

  const updateTeamMember = useCallback(
    (userId: number, member: Partial<TeamMember>) => {
      setTeamMembers((prev) =>
        prev.map((m) => (m.userId === userId ? { ...m, ...member } : m))
      )
    },
    []
  )

  const deleteTeamMember = useCallback((userId: number) => {
    setTeamMembers((prev) => prev.filter((m) => m.userId !== userId))
    // Desasignar tareas del miembro eliminado
    setTasks((prev) =>
      prev.map((t) => (t.userId === userId ? { ...t, userId: 0 } : t))
    )
  }, [])

  const getTeamMember = useCallback(
    (userId: number) => teamMembers.find((m) => m.userId === userId),
    [teamMembers]
  )

  // Tareas
  const addTask = useCallback((task: Omit<Task, "id">) => {
    setTasks((prev) => [
      ...prev,
      {
        ...task,
        id: Math.max(...prev.map((t) => t.id), 0) + 1,
      },
    ])
  }, [])

  const updateTask = useCallback((id: number, task: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...task } : t))
    )
  }, [])

  const deleteTask = useCallback((id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getTask = useCallback(
    (id: number) => tasks.find((t) => t.id === id),
    [tasks]
  )

  // Métricas
  const getMetrics = useCallback(() => {
    const totalProjects = projects.length
    const completedTasks = tasks.filter((t) => t.status === "Completado").length
    const hoursWorked = Math.floor(totalProjects * 27) // Simulado
    const activeMembers = teamMembers.filter((m) => m.isActive).length

    return {
      totalProjects,
      completedTasks,
      hoursWorked,
      activeMembers,
    }
  }, [projects, tasks, teamMembers])

  // Simular carga
  const simulateLoad = useCallback(async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
  }, [])

  return (
    <DashboardContext.Provider
      value={{
        projects,
        teamMembers,
        tasks,
        loading,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        getTeamMember,
        addTask,
        updateTask,
        deleteTask,
        getTask,
        getMetrics,
        simulateLoad,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}

