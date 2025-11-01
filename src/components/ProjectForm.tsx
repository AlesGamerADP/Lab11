"use client"

import { useState } from "react"
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
import { useDashboard } from "@/contexts/DashboardContext"
import { Plus } from "lucide-react"

export function ProjectForm() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { addProject, simulateLoad, teamMembers } = useDashboard()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    priority: "",
    members: [] as number[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name.trim()) {
      setError("El nombre del proyecto es requerido")
      return
    }

    if (!formData.category) {
      setError("La categoría es requerida")
      return
    }

    if (!formData.priority) {
      setError("La prioridad es requerida")
      return
    }

    setLoading(true)
    await simulateLoad()

    const priorityMap: Record<string, "Baja" | "Media" | "Alta" | "Urgente"> = {
      low: "Baja",
      medium: "Media",
      high: "Alta",
      urgent: "Urgente",
    }

    addProject({
      title: formData.name,
      description: formData.description || "",
      status: "Planificado",
      progress: 0,
      team: formData.members,
      priority: priorityMap[formData.priority as keyof typeof priorityMap] || "Media",
      category: formData.category,
      members: formData.members,
    })

    setLoading(false)
    setFormData({ name: "", description: "", category: "", priority: "", members: [] })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Click en guardar cuando termines.
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
                Nombre del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Mi Proyecto Increíble"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Breve descripción del proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Desarrollo Web</SelectItem>
                  <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
                  <SelectItem value="design">Diseño</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
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
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="members">Miembros del Equipo</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  const memberId = parseInt(value)
                  if (!formData.members.includes(memberId)) {
                    setFormData({
                      ...formData,
                      members: [...formData.members, memberId],
                    })
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona miembros del equipo" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers
                    .filter((m) => m.isActive && !formData.members.includes(m.userId))
                    .map((member) => (
                      <SelectItem key={member.userId} value={member.userId.toString()}>
                        {member.name} - {member.role}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formData.members.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.members.map((memberId) => {
                    const member = teamMembers.find((m) => m.userId === memberId)
                    return member ? (
                      <div
                        key={memberId}
                        className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm"
                      >
                        <span>{member.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              members: formData.members.filter((id) => id !== memberId),
                            })
                          }
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ) : null
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Creando...
                </>
              ) : (
                "Crear Proyecto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

