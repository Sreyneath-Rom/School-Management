import { prisma } from "../src/config/database";
import type { Role, Permission, GradePeriod, AttendanceStatus } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const MODULES = [
  "dashboard",
  "school",
  "academicYears",
  "rooms",
  "gradeLevels",
  "terms",
  "users",
  "roles",
  "permissions",
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
  "exams",
];
const ACTIONS = ["view", "create", "edit", "delete"] as const;
const REMOVED_MODULES = ["fees", "library", "transport", "hostel", "inventory"];

const ROLE_DEFS = [
  { name: "admin", description: "Admin" },
  { name: "teacher", description: "Teacher" },
  { name: "student", description: "Student" },
  { name: "parent", description: "Parent" },
];

async function main() {
  const removedPermissionKeys = REMOVED_MODULES.flatMap((moduleId) =>
    ACTIONS.map((action) => `${moduleId}.${action}`),
  );
  await prisma.rolePermission.deleteMany({
    where: { permission: { key: { in: removedPermissionKeys } } },
  });
  await prisma.permission.deleteMany({ where: { key: { in: removedPermissionKeys } } });

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
    "lessons",
    "schedules",
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

  console.log("Seeding demo users...");
  const demoPasswordHash = await bcrypt.hash("password", 12);
  const demoUsers = [
    { email: "admin@example.com", firstName: "Sarah", lastName: "Admin", roleId: adminRole.id },
    { email: "teacher@example.com", firstName: "John", lastName: "Teacher", roleId: teacherRole.id },
    { email: "student@example.com", firstName: "Emily", lastName: "Student", roleId: studentRole.id },
    { email: "parent@example.com", firstName: "Robert", lastName: "Parent", roleId: parentRole?.id },
  ];

  const seededUsers = new Map<string, { id: string }>();
  for (const demoUser of demoUsers) {
    if (!demoUser.roleId) continue;
    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {},
      create: { ...demoUser, passwordHash: demoPasswordHash },
    });
    seededUsers.set(demoUser.email, user);
  }

  const teacherUser = seededUsers.get("teacher@example.com");
  const studentUser = seededUsers.get("student@example.com");
  if (teacherUser && studentUser) {
    const teacher = await prisma.teacher.upsert({
      where: { userId: teacherUser.id },
      update: {},
      create: { userId: teacherUser.id, teacherCode: "TCH-1001" },
    });
    const classRecord =
      (await prisma.class.findFirst({ where: { name: "Grade 10 - A" } })) ??
      (await prisma.class.create({ data: { name: "Grade 10 - A", gradeLevel: 10, homeroomTeacherId: teacher.id } }));
    if (classRecord.homeroomTeacherId !== teacher.id) {
      await prisma.class.update({ where: { id: classRecord.id }, data: { homeroomTeacherId: teacher.id } });
    }

    const student = await prisma.student.upsert({
      where: { userId: studentUser.id },
      update: { classId: classRecord.id },
      create: {
        userId: studentUser.id,
        studentCode: "STU-2026-0001",
        gender: "female",
        dateOfBirth: new Date("2010-04-12"),
        classId: classRecord.id,
      },
    });

    const subjects = await Promise.all([
      prisma.subject.upsert({ where: { code: "MATH-10" }, update: {}, create: { name: "Mathematics", code: "MATH-10", department: "Science", teacherNames: [] } }),
      prisma.subject.upsert({ where: { code: "PHY-10" }, update: {}, create: { name: "Physics", code: "PHY-10", department: "Science", teacherNames: [] } }),
      prisma.subject.upsert({ where: { code: "ENG-10" }, update: {}, create: { name: "English Literature", code: "ENG-10", department: "Humanities", teacherNames: [] } }),
    ]);
    await Promise.all(subjects.map((subject) => prisma.teacherSubject.upsert({
      where: { teacherId_subjectId: { teacherId: teacher.id, subjectId: subject.id } },
      update: {},
      create: { teacherId: teacher.id, subjectId: subject.id },
    })));

    const math = subjects[0];
    const existingSchedule = await prisma.schedule.findFirst({ where: { classId: classRecord.id, subjectId: math.id, teacherId: teacher.id } });
    if (!existingSchedule) {
      await prisma.schedule.create({ data: { classId: classRecord.id, subjectId: math.id, teacherId: teacher.id, dayOfWeek: 1, startTime: "08:30", endTime: "09:45", room: "Room 101" } });
    }

    const existingLesson = await prisma.lesson.findFirst({ where: { title: "Quadratic Equations & Parabolic Trajectories", teacherId: teacher.id } });
    if (!existingLesson) {
      await prisma.lesson.create({ data: { title: "Quadratic Equations & Parabolic Trajectories", description: "Solve quadratic equations by factoring and completing the square.", subjectId: math.id, teacherId: teacher.id } });
    }

    const homework = (await prisma.homework.findFirst({ where: { title: "Chapter 4 Problem Set: Quadratic Roots", teacherId: teacher.id } })) ?? (await prisma.homework.create({
      data: { title: "Chapter 4 Problem Set: Quadratic Roots", description: "Complete the quadratic roots problem set.", subjectId: math.id, teacherId: teacher.id, dueDate: new Date("2026-09-30"), maxScore: 100 },
    }));
    const quiz = (await prisma.quiz.findFirst({ where: { title: "Algebra II: Quadratics & Polynomial Functions", teacherId: teacher.id } })) ?? (await prisma.quiz.create({
      data: { title: "Algebra II: Quadratics & Polynomial Functions", subjectId: math.id, teacherId: teacher.id, timeLimitMin: 30 },
    }));
    const existingQuestion = await prisma.quizQuestion.findFirst({ where: { quizId: quiz.id } });
    if (!existingQuestion) {
      await prisma.quizQuestion.create({ data: { quizId: quiz.id, questionText: "What is the vertex of y = x²?", options: ["(0, 0)", "(1, 1)", "(-1, 0)", "(0, 1)"], correctAnswer: "(0, 0)", points: 10 } });
    }
    await prisma.grade.upsert({
      where: { studentId_subjectId_period_periodLabel: { studentId: student.id, subjectId: math.id, period: "SEMESTER" as GradePeriod, periodLabel: "Semester 1" } },
      update: { score: 92, teacherId: teacher.id },
      create: { studentId: student.id, subjectId: math.id, teacherId: teacher.id, period: "SEMESTER" as GradePeriod, periodLabel: "Semester 1", score: 92, maxScore: 100 },
    });
    await prisma.attendance.upsert({
      where: { studentId_date: { studentId: student.id, date: new Date("2026-09-16") } },
      update: { status: "PRESENT" as AttendanceStatus },
      create: { studentId: student.id, date: new Date("2026-09-16"), status: "PRESENT" as AttendanceStatus },
    });
    const existingSubmission = await prisma.homeworkSubmission.findUnique({ where: { homeworkId_studentId: { homeworkId: homework.id, studentId: student.id } } });
    if (!existingSubmission) {
      await prisma.homeworkSubmission.create({ data: { homeworkId: homework.id, studentId: student.id, score: 96, feedback: "Excellent work." } });
    }
  }

  console.log("  Demo accounts use password: password");
  console.log("  Change demo passwords before deploying to production");

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
