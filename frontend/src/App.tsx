import { useState, useEffect } from 'react'
import './App.css'

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
    return (
      <div className="loading-screen">
        <div className="loader-container">
          <div className="spinner"></div>
          <h2>Iniciando Motor de PrusaSlicer...</h2>
          <p>{error ? error : `Conectando con el servidor (intento ${retryCount})...`}</p>
          {error && <button onClick={() => window.location.reload()}>Reintentar</button>}
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>PrusaSlicer Cost Calculator</h1>
        <div className="status-badge ready">Motor Activo</div>
      </header>
      
      <main className="app-content">
        <div className="card">
          <h2>¡Bienvenido!</h2>
          <p>El sistema está listo para procesar tus archivos STL.</p>
          <div className="actions">
            <button className="primary-btn">Nuevo Cálculo</button>
          </div>
        </div>
      </main>

      <footer>
        <p className="read-the-docs">
          Versión Portable 1.0.0
        </p>
      </footer>
    </div>
  )
}

export default App
