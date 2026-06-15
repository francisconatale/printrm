import React, { createContext, useContext, useState, useEffect } from 'react';
import { Perfil } from '../types/perfiles.types';

interface PerfilActivoContextType {
  perfilActivo: Perfil | null;
  setPerfilActivo: (perfil: Perfil | null) => void;
}

const PerfilActivoContext = createContext<PerfilActivoContextType | undefined>(undefined);

export const PerfilActivoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [perfilActivo, setPerfilActivoInternal] = useState<Perfil | null>(() => {
    const saved = localStorage.getItem('perfilActivoId');
    return null; // Initialized as null, will be hydrated if needed or handled by component
  });

  const setPerfilActivo = (perfil: Perfil | null) => {
    setPerfilActivoInternal(perfil);
    if (perfil) {
      localStorage.setItem('perfilActivoId', perfil.id.toString());
    } else {
      localStorage.removeItem('perfilActivoId');
    }
  };

  return (
    <PerfilActivoContext.Provider value={{ perfilActivo, setPerfilActivo }}>
      {children}
    </PerfilActivoContext.Provider>
  );
};

export const usePerfilActivo = () => {
  const context = useContext(PerfilActivoContext);
  if (context === undefined) {
    throw new Error('usePerfilActivo must be used within a PerfilActivoProvider');
  }
  return context;
};
