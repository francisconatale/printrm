import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  retryCount: number
  error: string | null
}

export function LoadingScreen({ retryCount, error }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black z-50">
      <div className="text-center space-y-6 max-w-sm px-6">
        <div className="relative flex items-center justify-center">
          {/* iOS-style animated spinner */}
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin transition-all duration-300 ease-in-out" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            PrusaSlicer
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {error ? (
              <span className="text-red-500 font-medium">{error}</span>
            ) : (
              `Iniciando el motor de cálculo...`
            )}
          </p>
        </div>

        {!error && (
          <div className="flex flex-col items-center space-y-1">
             <div className="w-48 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min((retryCount / 30) * 100, 100)}%` }}
                />
             </div>
             <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
               Intento {retryCount} de 30
             </p>
          </div>
        )}

        {error && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full font-medium active:scale-95 transition-transform"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  )
}
