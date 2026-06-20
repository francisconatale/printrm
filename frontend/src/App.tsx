import { useState } from 'react'
import { LoadingScreen } from './components/loading-screen'
import { CalculadoraView } from './features/calculo/components/CalculadoraView'
import { PerfilesDashboardView } from './features/perfiles/components/PerfilesDashboardView'
import { PiezasGalleryView } from './features/biblioteca/components/PiezasGalleryView'
import { ClientesListView } from './features/clientes/components/ClientesListView'
import { PedidosListView } from './features/pedidos/components/PedidosListView'
import { ProductosGalleryView } from './features/stock/components/ProductosGalleryView'
import { LibroDiarioView } from './features/finanzas/components/LibroDiarioView'
import { AgendaProduccionView } from './features/produccion/components/AgendaProduccionView'
import { AppShell } from './components/layout/app-shell'
import { Sidebar, ViewType } from './components/layout/sidebar'
import { ThemeProvider } from './providers/ThemeProvider'
import { useBackendHealthCheck } from './hooks/useBackendHealthCheck'
import { Toaster } from 'sonner'


function App() {
  const [currentView, setCurrentView] = useState<ViewType>('calculator')
  const { isReady: isBackendReady, retryCount, error } = useBackendHealthCheck()

  if (!isBackendReady) {
    return <LoadingScreen retryCount={retryCount} error={error} />
  }

  const renderView = () => {
    switch (currentView) {
      case 'calculator':
        return <CalculadoraView />
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
      case 'production':
        return <AgendaProduccionView />
      case 'finance':
      case 'dashboard':
        return <LibroDiarioView />
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
      <Toaster richColors position="top-right" closeButton />
    </ThemeProvider>
  )
}

export default App

