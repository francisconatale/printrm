import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { PerfilSelector } from '../../features/perfiles/components/PerfilSelector'
import { Perfil } from '../../features/perfiles/types/perfiles.types'

interface StudioSubNavProps {
  onToggleTheme?: () => void
  isDark?: boolean
  showPerfilSelector?: boolean
  onAddPerfil?: () => void
  onEditPerfil?: (perfil: Perfil) => void
}

export function StudioSubNav({
  onToggleTheme,
  isDark = false,
  showPerfilSelector = false,
  onAddPerfil,
  onEditPerfil,
}: StudioSubNavProps) {
  return (
    <nav className="studio-sub-nav-frosted px-8 md:px-12 h-16 shrink-0">
      <div className="flex items-center gap-6">
        {showPerfilSelector && onAddPerfil && onEditPerfil && (
          <PerfilSelector onAddNew={onAddPerfil} onEdit={onEditPerfil} />
        )}
      </div>

      <div className="flex items-center gap-6">
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors p-2"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
      </div>
    </nav>
  )
}
