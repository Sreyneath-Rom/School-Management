import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuthInitialization } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/components/common/ToastProvider'
import { AppLoadingSkeleton } from '@/features'
import AppRoutes from './routes/AppRoutes'

function AppWithAuth() {
  const isInitialized = useAuthInitialization()

  if (!isInitialized) {
    return <AppLoadingSkeleton />
  }

  return <AppRoutes />
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
           <ToastProvider>          
            <AppWithAuth />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
