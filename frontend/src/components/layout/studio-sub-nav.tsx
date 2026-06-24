import React from 'react'
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
  return (
    <nav className="studio-sub-nav-frosted px-8 md:px-12 h-16 shrink-0">
      <div className="flex items-center gap-6">
        {showPerfilSelector && onAddPerfil && onEditPerfil && (
          <PerfilSelector onAddNew={onAddPerfil} onEdit={onEditPerfil} />
        )}
      </div>

      <div className="flex items-center gap-6" />
    </nav>
  )
}
