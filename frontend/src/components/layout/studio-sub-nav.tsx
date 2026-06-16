import React from 'react'
import { PerfilSelector } from '../../features/perfiles/components/PerfilSelector'
import { Perfil } from '../../features/perfiles/types/perfiles.types'
import { ThemeToggle } from '../ui/theme-toggle'

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
  return (
    <nav className="studio-sub-nav-frosted px-8 md:px-12 h-16 shrink-0">
      <div className="flex items-center gap-6">
        {showPerfilSelector && onAddPerfil && onEditPerfil && (
          <PerfilSelector onAddNew={onAddPerfil} onEdit={onEditPerfil} />
        )}
      </div>

      <div className="flex items-center gap-6">
        <ThemeToggle 
          className="text-muted-foreground hover:text-foreground transition-colors p-2" 
          iconSize={20} 
        />
      </div>
    </nav>
  )
}
