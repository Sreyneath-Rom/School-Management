import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuthInitialization } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/components/common/ToastProvider' 
import AppRoutes from './routes/AppRoutes'

function AppWithAuth() {
  const isInitialized = useAuthInitialization()

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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