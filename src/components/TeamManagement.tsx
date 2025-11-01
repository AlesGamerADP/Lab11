"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Switch } from "@/components/ui/switch"
import { useDashboard } from "@/contexts/DashboardContext"
import { Plus, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"

export function TeamManagement() {
  const { teamMembers, projects, addTeamMember, updateTeamMember, deleteTeamMember } = useDashboard()
  const [open, setOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    role: "",
    name: "",
    email: "",
    position: "",
    birthdate: "",
    phone: "",
    projectId: "",
    isActive: true,
  })

  const handleOpen = (memberId?: number) => {
    if (memberId) {
      const member = teamMembers.find((m) => m.userId === memberId)
      if (member) {
        setEditingMember(memberId)
        setFormData({
          role: member.role,
          name: member.name,
          email: member.email,
          position: member.position,
          birthdate: member.birthdate,
          phone: member.phone,
          projectId: member.projectId?.toString() || "",
          isActive: member.isActive,
        })
        setSelectedDate(new Date(member.birthdate))
      }
    } else {
      setEditingMember(null)
      setFormData({
        role: "",
        name: "",
        email: "",
        position: "",
        birthdate: "",
        phone: "",
        projectId: "",
        isActive: true,
      })
      setSelectedDate(undefined)
    }
    setError("")
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim() || !formData.email.trim() || !formData.role.trim()) {
      setError("Nombre, email y rol son campos requeridos")
      return
    }

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (editingMember) {
      updateTeamMember(editingMember, {
        role: formData.role,
        name: formData.name,
        email: formData.email,
        position: formData.position,
        birthdate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : formData.birthdate,
        phone: formData.phone,
        projectId: formData.projectId ? parseInt(formData.projectId) : null,
        isActive: formData.isActive,
      })
    } else {
      addTeamMember({
        role: formData.role,
        name: formData.name,
        email: formData.email,
        position: formData.position,
        birthdate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
        phone: formData.phone,
        projectId: formData.projectId ? parseInt(formData.projectId) : null,
        isActive: formData.isActive,
      })
    }

    setLoading(false)
    setOpen(false)
    setFormData({
      role: "",
      name: "",
      email: "",
      position: "",
      birthdate: "",
      phone: "",
      projectId: "",
      isActive: true,
    })
    setSelectedDate(undefined)
  }

  const handleDelete = async (userId: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este miembro del equipo?")) {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      deleteTeamMember(userId)
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Miembros del Equipo</CardTitle>
            <CardDescription>Gestiona los miembros de tu equipo y sus roles</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpen()}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Miembro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingMember ? "Editar Miembro" : "Nuevo Miembro del Equipo"}
                  </DialogTitle>
                  <DialogDescription>
                    Completa la información del miembro del equipo
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="role">
                      Rol <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="position">Posición</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Fecha de Nacimiento</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="projectId">Proyecto Asignado</Label>
                    <Select
                      value={formData.projectId}
                      onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Sin proyecto</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">Estado Activo</Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
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
                    ) : editingMember ? (
                      "Guardar Cambios"
                    ) : (
                      "Crear Miembro"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                  <p className="text-xs text-muted-foreground">{member.phone}</p>
                  {member.projectId && (
                    <p className="text-xs text-muted-foreground">
                      Proyecto: {projects.find((p) => p.id === member.projectId)?.title || "N/A"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.isActive ? "default" : "secondary"}>
                  {member.isActive ? "Activo" : "Inactivo"}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => handleOpen(member.userId)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(member.userId)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

