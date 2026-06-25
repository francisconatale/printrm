import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  error: string | null
}

export function LoadingScreen({ error }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="text-center space-y-6 max-w-sm px-6">
        <div className="relative flex items-center justify-center">
          {/* iOS-style animated spinner */}
          <Loader2 className="h-12 w-12 text-primary animate-spin transition-all duration-300 ease-in-out" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Printly
          </h2>
          <p className="text-sm text-muted-foreground">
            {error ? (
              <span className="text-destructive font-medium">{error}</span>
            ) : (
              `Iniciando el motor de cálculo...`
            )}
          </p>
        </div>

        {error && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-full font-medium active:scale-95 transition-transform shadow-lg shadow-indigo-500/20"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  )
}
