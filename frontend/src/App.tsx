import React, { useState, useEffect, useRef } from 'react'
import { LoadingScreen } from './components/loading-screen'
import { CalculadoraView } from './features/calculo/components/CalculadoraView'
import { PerfilesDashboardView } from './features/perfiles/components/PerfilesDashboardView'
import { PiezasGalleryView } from './features/biblioteca/components/PiezasGalleryView'
import { ClientesListView } from './features/clientes/components/ClientesListView'
import { PedidosListView } from './features/pedidos/components/PedidosListView'
import { VentasListView } from './features/ventas/components/VentasListView'
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
  const params = new URLSearchParams(window.location.search)
  const isDesignLab = params.get('design_lab') === 'true'

  if (isDesignLab) {
    const DesignLabPage = React.lazy(() => import('../../.claude-design/lab/page').then(m => ({ default: m.DesignLabPage })))
    return (
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-background"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>}>
        <DesignLabPage />
      </React.Suspense>
    )
  }
  const [currentView, setCurrentView] = useState<ViewType>('calculator')
  const [selectedPieza, setSelectedPieza] = useState<any | null>(null)
  const navigateToPedidoRef = useRef<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  const handleNavigateToPedido = (pedidoId: string) => {
    navigateToPedidoRef.current = pedidoId
    setCurrentView('orders')
  }
  const { isReady: isBackendReady, retryCount, error } = useBackendHealthCheck()
  const { data: onboarding, isFetched } = useOnboardingStatus()

  useEffect(() => {
    if (isFetched && onboarding && !onboarding.completado) {
      setShowOnboarding(true)
    }
  }, [isFetched, onboarding])

  // Clear pending pedido navigation when leaving orders view
  useEffect(() => {
    if (currentView !== 'orders') navigateToPedidoRef.current = null
  }, [currentView])

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
        return <ClientesListView onNavigateToPedido={handleNavigateToPedido} />
      case 'orders': {
        const pid = navigateToPedidoRef.current
        return <PedidosListView key={pid || 'list'} initialPedidoId={pid} />
      }
      case 'sales':
        return <VentasListView />
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

