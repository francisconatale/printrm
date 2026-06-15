import { useState, useEffect } from 'react'
import { LoadingScreen } from './components/loading-screen'
import { CalculadoraView } from './features/calculo/components/CalculadoraView'
import { StudioOverview } from './components/studio-overview'
import { PerfilesDashboardView } from './features/perfiles/components/PerfilesDashboardView'
import { AppShell } from './components/layout/app-shell'
import { Sidebar, ViewType } from './components/layout/sidebar'
import { ThemeProvider } from './providers/ThemeProvider'


function App() {
  const [isBackendReady, setIsBackendReady] = useState<boolean>(false)
  const [retryCount, setRetryCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>('calculator')

  useEffect(() => {
    let interval: number;

    const checkHealth = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/health')
        if (response.ok) {
          const data = await response.json()
          if (data.status === 'UP') {
            setIsBackendReady(true)
            setError(null)
            return true
          }
        }
      } catch (err) {
        console.log('Backend not ready yet, retrying...')
      }
      return false
    }

    const poll = async () => {
      const ready = await checkHealth()
      if (!ready) {
        setRetryCount(prev => prev + 1)
        if (retryCount > 30) {
          setError("El servidor está tardando demasiado en iniciar. Por favor, reinicia la aplicación.")
        } else {
          interval = window.setTimeout(poll, 1000)
        }
      }
    }

    poll()

    return () => {
      if (interval) clearTimeout(interval)
    }
  }, [retryCount])

  if (!isBackendReady) {
    return <LoadingScreen retryCount={retryCount} error={error} />
  }

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <StudioOverview />
      case 'calculator':
        return <CalculadoraView />
      case 'profiles':
        return <PerfilesDashboardView />
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

