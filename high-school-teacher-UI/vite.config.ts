import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/v1')) {
          return next()
        }

        const url = req.url.split('?')[0]
        const method = req.method || 'GET'

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })

        req.on('end', () => {
          let parsedBody: any = {}
          try {
            if (body) parsedBody = JSON.parse(body)
          } catch {
            parsedBody = {}
          }

          res.setHeader('Content-Type', 'application/json')

          // Auth routes
          if (url === '/api/v1/auth/login' && method === 'POST') {
            const { email } = parsedBody
            const role =
              email?.includes('teacher') || email?.startsWith('TCH-')
                ? 'teacher'
                : email?.includes('student') || email?.startsWith('STU')
                ? 'student'
                : email?.includes('parent') || email?.startsWith('PAR-')
                ? 'parent'
                : 'admin'
            const firstName = role.charAt(0).toUpperCase() + role.slice(1)
            return res.end(
              JSON.stringify({
                success: true,
                data: {
                  accessToken: `mock-token-${role}-${Date.now()}`,
                  refreshToken: `mock-refresh-${role}-${Date.now()}`,
                  user: {
                    id: `user-${role}`,
                    email: email?.includes('@') ? email : `${role}@example.com`,
                    firstName,
                    lastName: 'User',
                    role,
                  },
                },
              })
            )
          }

          if (url === '/api/v1/auth/logout' && method === 'POST') {
            return res.end(JSON.stringify({ success: true, data: null }))
          }

          if (url === '/api/v1/auth/refresh-token' && method === 'POST') {
            const refreshToken = parsedBody.refreshToken || ''
            const role = /mock-refresh-(admin|teacher|student|parent)-/.exec(refreshToken)?.[1] || 'admin'
            return res.end(
              JSON.stringify({
                success: true,
                data: {
                  accessToken: `mock-token-${role}-${Date.now()}`,
                  refreshToken: `mock-refresh-${role}-${Date.now()}`,
                },
              })
            )
          }

          if (url === '/api/v1/auth/me' && method === 'GET') {
            const role = /Bearer mock-token-(admin|teacher|student|parent)-/.exec(req.headers.authorization || '')?.[1] || 'admin'
            return res.end(
              JSON.stringify({
                success: true,
                data: {
                  id: `user-${role}`,
                  email: `${role}@example.com`,
                  firstName: role.charAt(0).toUpperCase() + role.slice(1),
                  lastName: 'User',
                  role,
                },
              })
            )
          }

          // Languages routes
          if (url === '/api/v1/languages' && method === 'GET') {
            return res.end(
              JSON.stringify({
                success: true,
                data: [
                  { id: '1', code: 'en', name: 'English', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
                  { id: '2', code: 'es', name: 'Español', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
                  { id: '3', code: 'fr', name: 'Français', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
                  { id: '4', code: 'de', name: 'Deutsch', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
                ],
              })
            )
          }

          if (url === '/api/v1/languages' && method === 'POST') {
            return res.end(
              JSON.stringify({
                success: true,
                data: {
                  id: `lang-${Date.now()}`,
                  code: (parsedBody.code || 'custom').toLowerCase(),
                  name: parsedBody.name || 'Custom Language',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              })
            )
          }

          if (url.startsWith('/api/v1/languages/') && (method === 'PATCH' || method === 'DELETE')) {
            return res.end(JSON.stringify({ success: true, data: null }))
          }

          // Translations routes
          if (url.startsWith('/api/v1/translations/') && method === 'GET') {
            return res.end(JSON.stringify({ success: true, data: {} }))
          }

          if (url.startsWith('/api/v1/translations/') && (method === 'PATCH' || method === 'POST' || method === 'DELETE')) {
            return res.end(JSON.stringify({ success: true, data: parsedBody.translations || {} }))
          }

          // Schools routes
          if (url === '/api/v1/schools' && method === 'GET') {
            return res.end(
              JSON.stringify({
                success: true,
                data: {
                  id: 'school-1',
                  name: 'Oakridge International High School',
                  logoUrl: null,
                  address: '100 Academic Way, Metro City',
                  phone: '+1 (555) 019-2834',
                  email: 'admin@oakridge.edu',
                  academicYear: '2025 - 2026',
                  settings: {
                    schoolCode: 'OIS-2026',
                    academicTerm: 'Semester 1',
                    motto: 'Excellence in Education & Character',
                    description: 'Premier secondary academy committed to academic distinction.',
                    website: 'https://oakridge.edu',
                    language: 'en',
                    timeZone: 'America/New_York',
                    dateFormat: 'YYYY-MM-DD',
                  },
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              })
            )
          }

          if (url === '/api/v1/schools' && method === 'PATCH') {
            return res.end(
              JSON.stringify({
                success: true,
                data: {
                  id: 'school-1',
                  name: parsedBody.name || 'Oakridge International High School',
                  academicYear: parsedBody.academicYear || '2025 - 2026',
                  ...parsedBody,
                  updatedAt: new Date().toISOString(),
                },
              })
            )
          }

          if (url.startsWith('/api/v1/schools/logo')) {
            return res.end(JSON.stringify({ success: true, data: null }))
          }

          // Permissions & Roles routes
          if (url === '/api/v1/permissions' && method === 'GET') {
            const modules = ['dashboard', 'users', 'classes', 'subjects', 'schedules', 'attendance', 'grades', 'reports']
            const actions = ['view', 'create', 'edit', 'delete']
            const permissions: any[] = []
            let id = 1
            modules.forEach((m) => {
              actions.forEach((a) => {
                permissions.push({ id: `perm-${id++}`, key: `${m}.${a}`, moduleId: m, action: a })
              })
            })
            return res.end(JSON.stringify({ success: true, data: permissions }))
          }

          if (url === '/api/v1/roles' && method === 'GET') {
            return res.end(
              JSON.stringify({
                success: true,
                data: [
                  { id: 'role-1', name: 'Super Admin', label: 'Super Admin', initial: 'SA', isSystem: true, permissionIds: [] },
                  { id: 'role-2', name: 'Teacher', label: 'Teacher', initial: 'T', isSystem: true, permissionIds: [] },
                  { id: 'role-3', name: 'Student', label: 'Student', initial: 'S', isSystem: true, permissionIds: [] },
                  { id: 'role-4', name: 'Parent', label: 'Parent', initial: 'P', isSystem: true, permissionIds: [] },
                ],
              })
            )
          }

          if (url === '/api/v1/roles' && method === 'POST') {
            return res.end(
              JSON.stringify({
                success: true,
                data: {
                  id: `role-${Date.now()}`,
                  name: parsedBody.name || 'New Role',
                  label: parsedBody.label || parsedBody.name || 'New Role',
                  initial: (parsedBody.name || 'NR').substring(0, 2).toUpperCase(),
                  isSystem: false,
                  permissionIds: [],
                },
              })
            )
          }

          if (url.startsWith('/api/v1/roles/') && method === 'PATCH') {
            return res.end(JSON.stringify({ success: true, data: null }))
          }

          // Stats routes
          if (url === '/api/v1/dashboard/stats' && method === 'GET') {
            return res.end(
              JSON.stringify({
                success: true,
                data: {
                  studentCount: 1284,
                  teacherCount: 86,
                  classCount: 48,
                  pendingLeaveRequests: 12,
                },
              })
            )
          }

          if (url.startsWith('/api/v1/dashboard/attendance-summary') && method === 'GET') {
            return res.end(
              JSON.stringify({
                success: true,
                data: [
                  { status: 'Present', _count: 1210 },
                  { status: 'Late', _count: 45 },
                  { status: 'Absent', _count: 29 },
                ],
              })
            )
          }

          // Generic fallback: return 404 so apiClient falls back to mockApiHandler
          res.statusCode = 404
          return res.end(
            JSON.stringify({
              success: false,
              message: `Endpoint ${url} not handled by Vite dev server mock; delegating to client mockApiHandler`,
            })
          )
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(process.env.VITE_USE_MOCK_API === 'true' ? [mockApiPlugin()] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist/teacher',
    emptyOutDir: true,
  },
})