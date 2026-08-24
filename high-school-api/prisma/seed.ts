import { prisma } from "../src/config/database";
import type { Role, Permission } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

const MODULES = [
  "dashboard",
  "school",
  "users",
  "roles",
  "classes",
  "students",
  "teachers",
  "subjects",
  "schedules",
  "lessons",
  "homework",
  "quizzes",
  "grades",
  "attendance",
  "leaveRequests",
  "announcements",
  "notifications",
  "reports",
  "translations",
];
const ACTIONS = ["view", "create", "edit", "delete"] as const;

const ROLE_DEFS = [
  { name: "admin", description: "Admin" },
  { name: "teacher", description: "Teacher" },
  { name: "student", description: "Student" },
  { name: "parent", description: "Parent" },
];

async function main() {
  console.log("Seeding permission catalog...");
  const permissions: Permission[] = await Promise.all(
    MODULES.flatMap((moduleId) =>
      ACTIONS.map((action) =>
        prisma.permission.upsert({
          where: { key: `${moduleId}.${action}` },
          update: {},
          create: {
            key: `${moduleId}.${action}`,
            description: `${action} ${moduleId}`,
          },
        }),
      ),
    ),
  );
  console.log(`  ${permissions.length} permissions ready`);

  console.log("Seeding roles...");
  const roles: Role[] = await Promise.all(
    ROLE_DEFS.map((r) =>
      prisma.role.upsert({ where: { name: r.name }, update: {}, create: r }),
    ),
  );

  const adminRole = roles.find((r: Role) => r.name === "admin")!;
  const teacherRole = roles.find((r: Role) => r.name === "teacher")!;
  const studentRole = roles.find((r: Role) => r.name === "student")!;

  // Admin: full access to everything.
  await grantAll(
    adminRole.id,
    permissions.map((p: Permission) => p.id),
  );

  // Teacher: view everything academic, edit their own classroom-facing modules,
  // no access to users/roles/school settings.
  //
  // `translations` is deliberately NOT in this module list — that would grant
  // teacher.create/edit/delete on translations too (the filter below matches
  // by module prefix across all actions). Content management should stay
  // admin-only; teachers just need to *view* translated UI strings like
  // every other role, so `translations.view` is added explicitly instead.
  const teacherModules = [
    "dashboard",
    "classes",
    "students",
    "subjects",
    "schedules",
    "lessons",
    "homework",
    "quizzes",
    "grades",
    "attendance",
    "leaveRequests",
    "announcements",
    "notifications",
    "reports",
  ];
  const teacherPermissionIds = permissions
    .filter(
      (p: Permission) =>
        teacherModules.some((m) => p.key.startsWith(`${m}.`)) ||
        p.key === "translations.view",
    )
    .map((p: Permission) => p.id);
  await grantAll(teacherRole.id, teacherPermissionIds);

  // Student: view-only on their own academic data.
  const studentModules = [
    "dashboard",
    "classes",
    "homework",
    "quizzes",
    "grades",
    "attendance",
    "leaveRequests",
    "announcements",
    "notifications",
  ];
  const studentPermissionIds = permissions
    .filter(
      (p: Permission) =>
        studentModules.some((m) => p.key === `${m}.view`) ||
        p.key === "homework.create" ||
        p.key === "quizzes.create" ||
        p.key === "leaveRequests.create" ||
        p.key === "translations.view",
    )
    .map((p: Permission) => p.id);
  await grantAll(studentRole.id, studentPermissionIds);

  // Parent: previously had no permissions granted at all — the role existed
  // in ROLE_DEFS but was never wired into a grant block below, so parent
  // accounts could log in but every permission-gated route (including this
  // one) would 403. Mirrors the student grant, since parents view the same
  // kind of read-only, own-family data.
  const parentRole = roles.find((r: Role) => r.name === "parent");
  if (parentRole) {
    const parentModules = [
      "dashboard",
      "homework",
      "quizzes",
      "grades",
      "attendance",
      "leaveRequests",
      "announcements",
      "notifications",
    ];
    const parentPermissionIds = permissions
      .filter(
        (p: Permission) =>
          parentModules.some((m) => p.key === `${m}.view`) ||
          p.key === "leaveRequests.create" ||
          p.key === "translations.view",
      )
      .map((p: Permission) => p.id);
    await grantAll(parentRole.id, parentPermissionIds);
  }

  console.log("Seeding default school...");
  await prisma.school.upsert({
    where: { id: (await prisma.school.findFirst())?.id ?? "__none__" },
    update: {},
    create: { name: "Sample High School", academicYear: "2026-2027" },
  });

  console.log("Seeding admin user...");
  const adminEmail = "admin@school.local";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: "System",
        lastName: "Admin",
        roleId: adminRole.id,
      },
    });
    console.log(
      `  Created admin user: ${adminEmail} / ChangeMe123!  <-- change this immediately`,
    );
  } else {
    console.log("  Admin user already exists, skipping");
  }

  console.log("Seed complete.");
}

async function grantAll(roleId: string, permissionIds: string[]) {
  await prisma.rolePermission.deleteMany({ where: { roleId } });
  await prisma.rolePermission.createMany({
    data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
