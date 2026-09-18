import swaggerJsdoc from 'swagger-jsdoc'
import { env, swaggerEnabled, swaggerServerUrl } from './env'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'High School Management System API',
      version: '1.0.0',
      description:
        'REST API for managing school operations: users, classes, grades, attendance, and more.',
    },
    servers: [
      // Single server entry, resolved from env. In dev this ends up as
      // http://localhost:{PORT}/api/v1; in prod it should be set explicitly
      // via SWAGGER_SERVER_URL so "Try it out" hits the right host.
      { url: swaggerServerUrl },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    // Every operation requires a Bearer token by default. Individual routes
    // that are public (login, health) should override with `security: []`.
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication, tokens, sessions' },
      { name: 'Users', description: 'User account management' },
      { name: 'Roles', description: 'Role-based access control' },
      { name: 'Permissions', description: 'Permission registry' },
      { name: 'School', description: 'School profile and settings' },
      { name: 'Academics', description: 'Classes, subjects, schedules, lessons' },
      { name: 'Homework', description: 'Homework assignments and submissions' },
      { name: 'Quizzes', description: 'Quizzes and auto-grading' },
      { name: 'Grades', description: 'Gradebook records and transcripts' },
      { name: 'Attendance', description: 'Daily attendance and leave requests' },
      { name: 'Communication', description: 'Announcements and notifications' },
      { name: 'Reports', description: 'Analytics and reporting' },
    ],
  },
  // JSDoc blocks in route files are the source of truth for the spec.
  apis: ['./src/modules/**/*.routes.ts'],
}

// Build the spec once at import time. `swaggerJsdoc` walks the filesystem for
// JSDoc blocks — doing that on every /api-docs request would be wasteful.
export const swaggerSpec = swaggerEnabled ? swaggerJsdoc(options) : null