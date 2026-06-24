import { useState, useEffect } from 'react'
import { LoadingScreen } from './components/loading-screen'
import { CalculadoraView } from './features/calculo/components/CalculadoraView'
import { PerfilesDashboardView } from './features/perfiles/components/PerfilesDashboardView'
import { PiezasGalleryView } from './features/biblioteca/components/PiezasGalleryView'
import { ClientesListView } from './features/clientes/components/ClientesListView'
import { PedidosListView } from './features/pedidos/components/PedidosListView'
import { ProductosGalleryView } from './features/stock/components/ProductosGalleryView'
import { FinanzasDashboardView } from './features/finanzas/components/FinanzasDashboardView'
import { TransaccionesView } from './features/finanzas/components/TransaccionesView'
import { AgendaProduccionView } from './features/produccion/components/AgendaProduccionView'
import { AppShell } from './components/layout/app-shell'
import { Sidebar, ViewType } from './components/layout/sidebar'
import { useBackendHealthCheck } from './hooks/useBackendHealthCheck'
import { useOnboardingStatus } from './features/onboarding/hooks/useOnboarding'
import { OnboardingWizard } from './features/onboarding/components/OnboardingWizard'
import { Toaster } from 'sonner'

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('calculator')
  const [selectedPieza, setSelectedPieza] = useState<any | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { isReady: isBackendReady, retryCount, error } = useBackendHealthCheck()
  const { data: onboarding, isFetched } = useOnboardingStatus()

  useEffect(() => {
    if (isFetched && onboarding && !onboarding.completado) {
      setShowOnboarding(true)
    }
  }, [isFetched, onboarding])

  if (!isBackendReady) {
    return <LoadingScreen retryCount={retryCount} error={error} />
  }

  const renderView = () => {
    switch (currentView) {
      case 'calculator':
        return (
          <CalculadoraView 
            initialData={selectedPieza ? {
              horas: 0,
              minutosAdicionales: 0,
              gramos: selectedPieza.pesoGramos || 0,
              insumosExtra: 0,
              perfilId: '',
              perfilNombre: selectedPieza.perfilImpresoraNombre || '',
              costoEnergia: selectedPieza.costoEnergia || 0,
              costoFilamento: selectedPieza.costoMaterial || 0,
              costoDesgaste: 0,
              subtotal: selectedPieza.costoBase || 0,
              costoBase: selectedPieza.costoBase || 0,
              precioVenta: (selectedPieza.costoBase || 0) * 3,
            } : null}
            initialFile={selectedPieza ? new File([], selectedPieza.filePath) : null}
            onResetFile={() => setSelectedPieza(null)}
            onGoToLibrary={() => setCurrentView('inventory')}
          />
        )
      case 'profiles':
        return <PerfilesDashboardView />
      case 'inventory':
        return (
          <PiezasGalleryView />
        )
      case 'stock':
        return <ProductosGalleryView />
      case 'customers':
        return <ClientesListView />
      case 'orders':
        return <PedidosListView />
      case 'production':
        return <AgendaProduccionView />
      case 'finance':
      case 'dashboard':
        return <FinanzasDashboardView />
      case 'transactions':
        return <TransaccionesView />
      default:
        return <div className="p-12"><h1 className="studio-display-lg">Dashboard Finanzas</h1><p className="studio-lead text-muted-foreground">Próximamente...</p></div>
    }
  }

  return (
    <>
      <AppShell>
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </AppShell>
      <Toaster richColors position="top-right" className="printrm-toaster" />
      {showOnboarding && (
        <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
      )}
    </>
  )
}

export default App

