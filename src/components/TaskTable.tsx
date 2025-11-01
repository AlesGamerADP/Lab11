"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Calendar } from "@/components/ui/calendar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { useDashboard } from "@/contexts/DashboardContext"
import { Plus, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    case "Pendiente":
      return "outline"
    default:
      return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "destructive"
    case "Alta":
      return "default"
    case "Media":
      return "secondary"
    case "Baja":
      return "outline"
    default:
      return "outline"
  }
}

export function TasksTable() {
  const { tasks, projects, teamMembers, addTask, updateTask, deleteTask } = useDashboard()
  const [open, setOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [formData, setFormData] = useState({
    description: "",
    projectId: "",
    status: "",
    priority: "",
    userId: "",
    dateline: "",
  })

  const totalPages = Math.ceil(tasks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTasks = tasks.slice(startIndex, endIndex)

  const handleOpen = (taskId?: number) => {
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        setEditingTask(taskId)
        setFormData({
          description: task.description,
          projectId: task.projectId.toString(),
          status: task.status,
          priority: task.priority,
          userId: task.userId.toString(),
          dateline: task.dateline,
        })
        setSelectedDate(new Date(task.dateline))
      }
    } else {
      setEditingTask(null)
      setFormData({
        description: "",
        projectId: "",
        status: "",
        priority: "",
        userId: "",
        dateline: "",
      })
      setSelectedDate(undefined)
    }
    setError("")
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.description.trim() || !formData.projectId || !formData.status || !formData.priority || !formData.userId) {
      setError("Todos los campos son requeridos")
      return
    }

    if (!selectedDate && !formData.dateline) {
      setError("La fecha límite es requerida")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const taskData = {
      description: formData.description,
      projectId: parseInt(formData.projectId),
      status: formData.status as "Pendiente" | "En progreso" | "Completado",
      priority: formData.priority as "Baja" | "Media" | "Alta" | "Urgente",
      userId: parseInt(formData.userId),
      dateline: selectedDate ? format(selectedDate, "yyyy-MM-dd") : formData.dateline,
      title: formData.description,
    }

    if (editingTask) {
      updateTask(editingTask, taskData)
    } else {
      addTask(taskData)
    }

    setLoading(false)
    setOpen(false)
    setFormData({
      description: "",
      projectId: "",
      status: "",
      priority: "",
      userId: "",
      dateline: "",
    })
    setSelectedDate(undefined)
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      deleteTask(id)
      setLoading(false)
    }
  }

  const getProjectName = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId)
    return project?.title || "N/A"
  }

  const getMemberName = (userId: number) => {
    const member = teamMembers.find((m) => m.userId === userId)
    return member?.name || "N/A"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tareas</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
                <DialogDescription>
                  Completa la información de la tarea
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="description">
                    Descripción <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="projectId">
                    Proyecto <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.projectId}
                    onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">
                    Estado <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="En progreso">En progreso</SelectItem>
                      <SelectItem value="Completado">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">
                    Prioridad <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baja">Baja</SelectItem>
                      <SelectItem value="Media">Media</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="userId">
                    Asignado a <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.userId}
                    onValueChange={(value) => setFormData({ ...formData, userId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un miembro" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.filter((m) => m.isActive).map((member) => (
                        <SelectItem key={member.userId} value={member.userId.toString()}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Fecha límite <span className="text-red-500">*</span></Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Guardando...
                    </>
                  ) : editingTask ? (
                    "Guardar Cambios"
                  ) : (
                    "Crear Tarea"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de todas las tareas del proyecto</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tarea</TableHead>
              <TableHead>Proyecto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha límite</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay tareas disponibles
                </TableCell>
              </TableRow>
            ) : (
              currentTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.description}</TableCell>
                  <TableCell>{getProjectName(task.projectId)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell>{getMemberName(task.userId)}</TableCell>
                  <TableCell>{task.dateline}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleOpen(task.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                size="default"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  size="default"
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                size="default"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={
                  currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
