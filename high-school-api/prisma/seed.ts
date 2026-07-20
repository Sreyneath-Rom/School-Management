import { PrismaClient } from '../src/generated/prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const MODULES = ['dashboard', 'school', 'users', 'roles', 'classes', 'students', 'teachers', 'subjects', 'schedules', 'lessons', 'homework', 'quizzes', 'grades', 'attendance', 'leaveRequests', 'announcements', 'notifications', 'reports']
const ACTIONS = ['view', 'create', 'edit', 'delete'] as const

const ROLE_DEFS = [
  { name: 'admin', description: 'Admin' },
  { name: 'teacher', description: 'Teacher' },
  { name: 'student', description: 'Student' },
  { name: 'parent', description: 'Parent' },
]

async function main() {
  console.log('Seeding permission catalog...')
  const permissions = await Promise.all(
    MODULES.flatMap((moduleId) =>
      ACTIONS.map((action) =>
        prisma.permission.upsert({
          where: { key: `${moduleId}.${action}` },
          update: {},
          create: { key: `${moduleId}.${action}`, description: `${action} ${moduleId}` },
        })
      )
    )
  )
  console.log(`  ${permissions.length} permissions ready`)

  console.log('Seeding roles...')
  const roles = await Promise.all(
    ROLE_DEFS.map((r) => prisma.role.upsert({ where: { name: r.name }, update: {}, create: r }))
  )

  const adminRole = roles.find((r) => r.name === 'admin')!
  const teacherRole = roles.find((r) => r.name === 'teacher')!
  const studentRole = roles.find((r) => r.name === 'student')!

  // Admin: full access to everything.
  await grantAll(adminRole.id, permissions.map((p) => p.id))

  // Teacher: view everything academic, edit their own classroom-facing modules,
  // no access to users/roles/school settings.
  const teacherModules = ['dashboard', 'classes', 'students', 'subjects', 'schedules', 'lessons', 'homework', 'quizzes', 'grades', 'attendance', 'leaveRequests', 'announcements', 'notifications', 'reports']
  const teacherPermissionIds = permissions
    .filter((p) => teacherModules.some((m) => p.key.startsWith(`${m}.`)))
    .map((p) => p.id)
  await grantAll(teacherRole.id, teacherPermissionIds)

  // Student: view-only on their own academic data.
  const studentModules = ['dashboard', 'classes', 'homework', 'quizzes', 'grades', 'attendance', 'leaveRequests', 'announcements', 'notifications']
  const studentPermissionIds = permissions
    .filter((p) => studentModules.some((m) => p.key === `${m}.view`) || p.key === 'homework.create' || p.key === 'quizzes.create' || p.key === 'leaveRequests.create')
    .map((p) => p.id)
  await grantAll(studentRole.id, studentPermissionIds)

  console.log('Seeding default school...')
  await prisma.school.upsert({
    where: { id: (await prisma.school.findFirst())?.id ?? '__none__' },
    update: {},
    create: { name: 'Sample High School', academicYear: '2026-2027' },
  })

  console.log('Seeding admin user...')
  const adminEmail = 'admin@school.local'
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('ChangeMe123!', 12)
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: 'System',
        lastName: 'Admin',
        roleId: adminRole.id,
      },
    })
    console.log(`  Created admin user: ${adminEmail} / ChangeMe123!  <-- change this immediately`)
  } else {
    console.log('  Admin user already exists, skipping')
  }

  console.log('Seed complete.')
}

async function grantAll(roleId: string, permissionIds: string[]) {
  await prisma.rolePermission.deleteMany({ where: { roleId } })
  await prisma.rolePermission.createMany({
    data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
    skipDuplicates: true,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
