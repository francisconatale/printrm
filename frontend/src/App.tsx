import { useState, useEffect } from 'react'
import { LoadingScreen } from './components/loading-screen'
import { Dashboard } from './components/dashboard'

function App() {
  const [isBackendReady, setIsBackendReady] = useState<boolean>(false)
  const [retryCount, setRetryCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

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
        // Si después de 30 intentos (aprox 30 seg) no levanta, mostramos un error
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

  return <Dashboard />
}

export default App
