"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { useDashboard } from "@/contexts/DashboardContext"

export function SettingsForm() {
  const { simulateLoad } = useDashboard()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    notifications: true,
    emailNotifications: true,
    darkMode: false,
    language: "es",
    timezone: "UTC-5",
    autoSave: true,
    theme: "blue",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    await simulateLoad()
    
    // Simular guardado de configuración
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <Alert>
          <AlertDescription>Configuración guardada exitosamente</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Notificaciones</Label>
            <p className="text-sm text-muted-foreground">
              Recibe notificaciones sobre actualizaciones
            </p>
          </div>
          <Switch
            id="notifications"
            checked={formData.notifications}
            onCheckedChange={(checked) => setFormData({ ...formData, notifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
            <p className="text-sm text-muted-foreground">
              Recibe notificaciones importantes por correo
            </p>
          </div>
          <Switch
            id="emailNotifications"
            checked={formData.emailNotifications}
            onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="darkMode">Modo Oscuro</Label>
            <p className="text-sm text-muted-foreground">
              Activa el tema oscuro de la aplicación
            </p>
          </div>
          <Switch
            id="darkMode"
            checked={formData.darkMode}
            onCheckedChange={(checked) => setFormData({ ...formData, darkMode: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoSave">Guardado Automático</Label>
            <p className="text-sm text-muted-foreground">
              Guarda automáticamente los cambios
            </p>
          </div>
          <Switch
            id="autoSave"
            checked={formData.autoSave}
            onCheckedChange={(checked) => setFormData({ ...formData, autoSave: checked })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="language">Idioma</Label>
          <Select
            value={formData.language}
            onValueChange={(value) => setFormData({ ...formData, language: value })}
          >
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="timezone">Zona Horaria</Label>
          <Select
            value={formData.timezone}
            onValueChange={(value) => setFormData({ ...formData, timezone: value })}
          >
            <SelectTrigger id="timezone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC-5">UTC-5 (Colombia, Perú)</SelectItem>
              <SelectItem value="UTC-6">UTC-6 (México, Centroamérica)</SelectItem>
              <SelectItem value="UTC-3">UTC-3 (Argentina, Chile)</SelectItem>
              <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="theme">Tema de Color</Label>
          <Select
            value={formData.theme}
            onValueChange={(value) => setFormData({ ...formData, theme: value })}
          >
            <SelectTrigger id="theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blue">Azul</SelectItem>
              <SelectItem value="green">Verde</SelectItem>
              <SelectItem value="purple">Morado</SelectItem>
              <SelectItem value="red">Rojo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Guardando...
            </>
          ) : (
            "Guardar Configuración"
          )}
        </Button>
      </div>
    </form>
  )
}

