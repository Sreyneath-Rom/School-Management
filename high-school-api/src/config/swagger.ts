import swaggerJsdoc from 'swagger-jsdoc'
import { env } from './env'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'High School Management System API',
      version: '1.0.0',
      description: 'REST API for managing school operations: users, classes, grades, attendance, and more.',
    },
    servers: [{ url: `http://localhost:${env.PORT}/api/v1` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // JSDoc comments in route files (@swagger blocks) get picked up from here
  apis: ['./src/modules/**/*.routes.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
