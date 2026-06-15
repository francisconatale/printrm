import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../providers/ThemeProvider'
import { PerfilSelector } from '../../features/perfiles/components/PerfilSelector'
import { Perfil } from '../../features/perfiles/types/perfiles.types'

interface StudioSubNavProps {
  showPerfilSelector?: boolean
  onAddPerfil?: () => void
  onEditPerfil?: (perfil: Perfil) => void
}

export function StudioSubNav({
  showPerfilSelector = false,
  onAddPerfil,
  onEditPerfil,
}: StudioSubNavProps) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <nav className="studio-sub-nav-frosted px-8 md:px-12 h-16 shrink-0">
      <div className="flex items-center gap-6">
        {showPerfilSelector && onAddPerfil && onEditPerfil && (
          <PerfilSelector onAddNew={onAddPerfil} onEdit={onEditPerfil} />
        )}
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground transition-colors p-2"
          title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  )
}
