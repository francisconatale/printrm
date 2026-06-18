import { useState } from 'react'
import { LoadingScreen } from './components/loading-screen'
import { CalculadoraView } from './features/calculo/components/CalculadoraView'
import { HistorialView } from './features/calculo/components/HistorialView'
import { StudioOverview } from './components/studio-overview'
import { PerfilesDashboardView } from './features/perfiles/components/PerfilesDashboardView'
import { PiezasGalleryView } from './features/biblioteca/components/PiezasGalleryView'
import { ClientesListView } from './features/clientes/components/ClientesListView'
import { PedidosListView } from './features/pedidos/components/PedidosListView'
import { ProductosGalleryView } from './features/stock/components/ProductosGalleryView'
import { LibroDiarioView } from './features/finanzas/components/LibroDiarioView'
import { AppShell } from './components/layout/app-shell'
import { Sidebar, ViewType } from './components/layout/sidebar'
import { ThemeProvider } from './providers/ThemeProvider'
import { useBackendHealthCheck } from './hooks/useBackendHealthCheck'
import { CalculoSnapshot } from './features/calculo/types/calculo.types'


function App() {
  const [currentView, setCurrentView] = useState<ViewType>('calculator')
  const [historyData, setHistoryData] = useState<CalculoSnapshot | null>(null)
  const { isReady: isBackendReady, retryCount, error } = useBackendHealthCheck()

  if (!isBackendReady) {
    return <LoadingScreen retryCount={retryCount} error={error} />
  }

  const handleSelectFromHistory = (data: CalculoSnapshot) => {
    setHistoryData(data)
    setCurrentView('calculator')
  }

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <StudioOverview />
      case 'calculator':
        return <CalculadoraView initialData={historyData} />
      case 'history':
        return <HistorialView onSelect={handleSelectFromHistory} />
      case 'profiles':
        return <PerfilesDashboardView />
      case 'inventory':
        return <PiezasGalleryView />
      case 'stock':
        return <ProductosGalleryView />
      case 'customers':
        return <ClientesListView />
      case 'orders':
        return <PedidosListView />
      case 'finance':
        return <LibroDiarioView />
      case 'dashboard':
      default:
        return <div className="p-12"><h1 className="studio-display-lg">Dashboard Finanzas</h1><p className="studio-lead text-muted-foreground">Próximamente...</p></div>
    }
  }

  return (
    <ThemeProvider>
      <AppShell>
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </AppShell>
    </ThemeProvider>
  )
}

export default App

