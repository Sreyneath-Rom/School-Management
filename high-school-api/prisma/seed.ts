import { prisma } from "../src/config/database";
import type {
  Role,
  Permission,
  User,
  GradePeriod,
  AttendanceStatus,
} from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MODULES: readonly string[] = [
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
const REMOVED_MODULES: readonly string[] = [
  "fees",
  "library",
  "transport",
  "hostel",
  "inventory",
];

const ROLE_DEFS: readonly { name: string; description: string }[] = [
  { name: "admin", description: "Admin" },
  { name: "teacher", description: "Teacher" },
  { name: "student", description: "Student" },
  { name: "parent", description: "Parent" },
];

/**
 * The password every demo account is seeded with. Documented in the console
 * output at the end. Change it — or delete the demo users entirely — before
 * deploying to production.
 */
const DEMO_PASSWORD = "password";

/**
 * English is reserved by the frontend (never a stored Language row). Any
 * language you seed must not collide with this.
 */
const RESERVED_LANGUAGE_CODE = "en";

// -----------------------------------------------------------------------------
// Types used by the split seed functions
// -----------------------------------------------------------------------------

interface SeededRoles {
  adminRole: Role;
  teacherRole: Role;
  studentRole: Role;
  parentRole: Role | undefined;
}

/** Minimal shape of a Subject row needed after seeding. */
interface SeededSubject {
  id: string;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  const permissions = await seedPermissions();
  void permissions; // reserved: referenced by nothing downstream today

  const roles = await seedRoles();

  await seedLanguages();
  await seedSchool();
  await seedAcademicYearAndTerms();
  await seedGradeLevels();
  await seedRooms();

  await seedDemoData(roles);

  console.log("\n✅ Seed complete.");
}

// -----------------------------------------------------------------------------
// Permissions
// -----------------------------------------------------------------------------

async function seedPermissions(): Promise<Permission[]> {
  // Remove permissions for modules that have been retired from the codebase.
  // Without this, a permission key deleted from MODULES would linger in the
  // DB and keep appearing in the admin UI's permission matrix.
  const removedKeys: string[] = REMOVED_MODULES.flatMap((moduleId) =>
    ACTIONS.map((action) => `${moduleId}.${action}`)
  );
  await prisma.rolePermission.deleteMany({
    where: { permission: { key: { in: removedKeys } } },
  });
  await prisma.permission.deleteMany({ where: { key: { in: removedKeys } } });

  console.log("Seeding permission catalog…");
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
        })
      )
    )
  );
  console.log(`  ${permissions.length} permissions ready`);
  return permissions;
}

// -----------------------------------------------------------------------------
// Roles + grants
// -----------------------------------------------------------------------------

async function seedRoles(): Promise<SeededRoles> {
  console.log("Seeding roles…");
  const roles: Role[] = await Promise.all(
    ROLE_DEFS.map((r) =>
      prisma.role.upsert({ where: { name: r.name }, update: {}, create: r })
    )
  );

  // Look up permissions once for all grant blocks below.
  const allPermissions: Permission[] = await prisma.permission.findMany();

  const byName = new Map<string, Role>(roles.map((r) => [r.name, r]));
  const adminRole = byName.get("admin");
  const teacherRole = byName.get("teacher");
  const studentRole = byName.get("student");
  const parentRole = byName.get("parent");

  // These roles are created by the upsert loop above, so their presence is
  // guaranteed. Asserting with `!` would work, but throwing a clear error
  // is more useful if the DB state is ever corrupted.
  if (!adminRole || !teacherRole || !studentRole) {
    throw new Error(
      "Seed failure: one or more built-in roles were not created (admin/teacher/student)"
    );
  }

  // ---- Admin: full access to everything.
  await grantAll(
    adminRole.id,
    allPermissions.map((p: Permission) => p.id)
  );

  // ---- Teacher: view and edit classroom-facing modules.
  //
  // `translations` is deliberately NOT in this list. Including it would grant
  // teacher.create/edit/delete on translations too (the filter matches by
  // module prefix across all actions). Content management stays admin-only;
  // teachers just need to *view* translated UI strings like every other role,
  // so `translations.view` is added explicitly below.
  const teacherModules: readonly string[] = [
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
  await grantAll(
    teacherRole.id,
    allPermissions
      .filter(
        (p: Permission) =>
          teacherModules.some((m) => p.key.startsWith(`${m}.`)) ||
          p.key === "translations.view"
      )
      .map((p: Permission) => p.id)
  );

  // ---- Student: view-only on their own academic data, plus the specific
  // create actions they need (submit homework, take quiz, file a leave
  // request).
  const studentModules: readonly string[] = [
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
  await grantAll(
    studentRole.id,
    allPermissions
      .filter(
        (p: Permission) =>
          studentModules.some((m) => p.key === `${m}.view`) ||
          p.key === "homework.create" ||
          p.key === "quizzes.create" ||
          p.key === "leaveRequests.create" ||
          p.key === "translations.view"
      )
      .map((p: Permission) => p.id)
  );

  // ---- Parent: read-only on their children's data, plus the ability to
  // file a leave request on their child's behalf.
  if (parentRole) {
    const parentModules: readonly string[] = [
      "dashboard",
      "homework",
      "quizzes",
      "grades",
      "attendance",
      "leaveRequests",
      "announcements",
      "notifications",
    ];
    await grantAll(
      parentRole.id,
      allPermissions
        .filter(
          (p: Permission) =>
            parentModules.some((m) => p.key === `${m}.view`) ||
            p.key === "leaveRequests.create" ||
            p.key === "translations.view"
        )
        .map((p: Permission) => p.id)
    );
  }

  return { adminRole, teacherRole, studentRole, parentRole };
}

/**
 * Full replace of a role's permission set, in a single transaction. A crash
 * partway through a non-transactional version would leave the role with
 * zero permissions — every grant for that role silently gone.
 */
async function grantAll(
  roleId: string,
  permissionIds: string[]
): Promise<void> {
  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId } }),
    prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId: string) => ({
        roleId,
        permissionId,
      })),
      skipDuplicates: true,
    }),
  ]);
}

// -----------------------------------------------------------------------------
// Languages
// -----------------------------------------------------------------------------
//
// `en` is reserved by the frontend and is never stored as a Language row.
// The two seeded languages here are common in Cambodian secondary schools;
// adjust to match your deployment.

async function seedLanguages(): Promise<void> {
  console.log("Seeding languages…");
  const languages = [
    {
      code: "km",
      name: "Khmer",
      nativeName: "ខ្មែរ",
      rtl: false,
      isActive: true,
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      rtl: false,
      isActive: true,
    },
  ];

  for (const lang of languages) {
    if (lang.code === RESERVED_LANGUAGE_CODE) continue;
    await prisma.language.upsert({
      where: { code: lang.code },
      update: {}, // never overwrite an admin's edits to name/nativeName
      create: lang,
    });
  }
}

// -----------------------------------------------------------------------------
// School (singleton)
// -----------------------------------------------------------------------------

async function seedSchool(): Promise<void> {
  console.log("Seeding default school…");
  const existing = await prisma.school.findFirst({ select: { id: true } });
  if (existing) return;

  await prisma.school.create({
    data: {
      name: "Sample High School",
      academicYear: "2026-2027",
      address: "123 Main Street",
      phone: "+855 12 345 678",
      email: "office@school.local",
    },
  });
}

// -----------------------------------------------------------------------------
// Academic year + terms
// -----------------------------------------------------------------------------

async function seedAcademicYearAndTerms(): Promise<void> {
  console.log("Seeding academic year and terms…");

  const year = await prisma.academicYear.upsert({
    where: { name: "2026-2027" },
    update: {},
    create: {
      name: "2026-2027",
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-06-30"),
      status: "Active",
      isCurrent: true,
      termsCount: 2,
      description: "Current academic year",
    },
  });

  const terms = [
    {
      name: "Fall Term 1",
      startDate: "2026-09-01",
      endDate: "2026-12-15",
      gradingDeadline: "2026-12-20",
      weightPercentage: 50,
    },
    {
      name: "Spring Term 2",
      startDate: "2027-01-05",
      endDate: "2027-06-15",
      gradingDeadline: "2027-06-20",
      weightPercentage: 50,
    },
  ];

  for (const t of terms) {
    await prisma.term.upsert({
      where: {
        academicYearId_name: { academicYearId: year.id, name: t.name },
      },
      update: {},
      create: {
        academicYearId: year.id,
        name: t.name,
        startDate: new Date(t.startDate),
        endDate: new Date(t.endDate),
        gradingDeadline: new Date(t.gradingDeadline),
        weightPercentage: t.weightPercentage,
        status: "Upcoming",
      },
    });
  }
}

// -----------------------------------------------------------------------------
// Grade levels
// -----------------------------------------------------------------------------

async function seedGradeLevels(): Promise<void> {
  console.log("Seeding grade levels…");
  const levels = [
    { code: "G10", name: "Grade 10", alias: "Sophomore", levelOrder: 10 },
    { code: "G11", name: "Grade 11", alias: "Junior", levelOrder: 11 },
    { code: "G12", name: "Grade 12", alias: "Senior", levelOrder: 12 },
  ];

  for (const level of levels) {
    await prisma.gradeLevel.upsert({
      where: { code: level.code },
      update: {},
      create: {
        ...level,
        minPassingScore: 50,
        headCoordinator: "",
        description: "",
      },
    });
  }
}

// -----------------------------------------------------------------------------
// Rooms
// -----------------------------------------------------------------------------

async function seedRooms(): Promise<void> {
  console.log("Seeding rooms…");
  const rooms = [
    {
      code: "R-101",
      name: "Room 101",
      building: "Main",
      floor: "1",
      type: "Classroom",
      capacity: 30,
      amenities: ["Projector", "Whiteboard"],
    },
    {
      code: "R-102",
      name: "Room 102",
      building: "Main",
      floor: "1",
      type: "Classroom",
      capacity: 30,
      amenities: ["Projector", "Whiteboard"],
    },
    {
      code: "R-204",
      name: "Room 204",
      building: "Main",
      floor: "2",
      type: "Classroom",
      capacity: 28,
      amenities: ["Projector"],
    },
    {
      code: "SCI-1",
      name: "Science Lab 1",
      building: "Science Annex",
      floor: "1",
      type: "Science Lab",
      capacity: 24,
      amenities: ["Lab benches", "Fume hood", "Safety shower"],
    },
    {
      code: "COMP-1",
      name: "Computer Lab",
      building: "Main",
      floor: "3",
      type: "Computer Lab",
      capacity: 25,
      amenities: ["25 workstations", "Projector"],
    },
    {
      code: "LIB-1",
      name: "Library Wing A",
      building: "Library",
      floor: "1",
      type: "Library Wing",
      capacity: 60,
      amenities: ["Reading tables", "Wi-Fi"],
    },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { code: room.code },
      update: {},
      create: { ...room, status: "Available" },
    });
  }
}

// -----------------------------------------------------------------------------
// Demo users + profiles + sample academic data
// -----------------------------------------------------------------------------

async function seedDemoData(roles: SeededRoles): Promise<void> {
  console.log("Seeding demo users…");
  const demoPasswordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const demoUsers = [
    {
      email: "admin@example.com",
      firstName: "Sarah",
      lastName: "Admin",
      roleId: roles.adminRole.id,
    },
    {
      email: "teacher@example.com",
      firstName: "John",
      lastName: "Teacher",
      roleId: roles.teacherRole.id,
    },
    {
      email: "student@example.com",
      firstName: "Emily",
      lastName: "Student",
      roleId: roles.studentRole.id,
    },
    {
      email: "parent@example.com",
      firstName: "Robert",
      lastName: "Parent",
      roleId: roles.parentRole?.id,
    },
  ];

  // The map value is `User` (not `{ id: string }`) so callers below can
  // access firstName/lastName without a second lookup.
  const seededUsers = new Map<string, User>();
  for (const demoUser of demoUsers) {
    if (!demoUser.roleId) continue;

    // The `update` branch revives a soft-deleted demo account on re-run —
    // otherwise the seed stops being idempotent the moment someone deletes
    // a demo user (the email stays unique, but the row is invisible to
    // normal lookups).
    const user: User = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: { deletedAt: null, isActive: true },
      create: { ...demoUser, passwordHash: demoPasswordHash },
    });
    seededUsers.set(demoUser.email, user);
  }

  const teacherUser = seededUsers.get("teacher@example.com");
  const studentUser = seededUsers.get("student@example.com");
  const parentUser = seededUsers.get("parent@example.com");

  if (!teacherUser || !studentUser) {
    console.log("  Skipping profile seeding — demo users not created");
    return;
  }

  // ---- Teacher profile + homeroom class --------------------------------

  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: { deletedAt: null },
    create: { userId: teacherUser.id, teacherCode: "TCH-1001" },
  });

  const classRecord =
    (await prisma.class.findFirst({
      where: { name: "Grade 10 - A", deletedAt: null },
    })) ??
    (await prisma.class.create({
      data: {
        name: "Grade 10 - A",
        gradeLevel: 10,
        capacity: 30,
        homeroomTeacherId: teacher.id,
      },
    }));

  if (classRecord.homeroomTeacherId !== teacher.id) {
    await prisma.class.update({
      where: { id: classRecord.id },
      data: { homeroomTeacherId: teacher.id },
    });
  }

  // ---- Student profile, attached to that class -------------------------

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: { classId: classRecord.id, deletedAt: null },
    create: {
      userId: studentUser.id,
      studentCode: "STU-2026-0001",
      gender: "female",
      dateOfBirth: new Date("2010-04-12"),
      classId: classRecord.id,
    },
  });

  // ---- Parent link ----------------------------------------------------
  //
  // Parents share a StudentParent join row with the student. Without this,
  // the demo parent account can log in but every scoped read returns an
  // empty list.
  if (parentUser) {
    const parentRecord = await prisma.parent.upsert({
      where: { userId: parentUser.id },
      update: {},
      create: { userId: parentUser.id },
    });
    await prisma.studentParent.upsert({
      where: {
        studentId_parentId: {
          studentId: student.id,
          parentId: parentRecord.id,
        },
      },
      update: { relationship: "father" },
      create: {
        studentId: student.id,
        parentId: parentRecord.id,
        relationship: "father",
      },
    });
  }

  // ---- Subjects + TeacherSubject links --------------------------------

  const subjectSpecs = [
    {
      code: "MATH-10",
      name: "Mathematics",
      department: "Science",
      category: "Core",
    },
    {
      code: "PHY-10",
      name: "Physics",
      department: "Science",
      category: "Core",
    },
    {
      code: "ENG-10",
      name: "English Literature",
      department: "Humanities",
      category: "Core",
    },
  ];

  const subjects: SeededSubject[] = await Promise.all(
    subjectSpecs.map((s) =>
      prisma.subject.upsert({
        where: { code: s.code },
        update: {},
        create: {
          name: s.name,
          code: s.code,
          department: s.department,
          category: s.category,
          // Denormalized cache; the TeacherSubject relation below is the
          // source of truth. Populated here so a fresh install's subject
          // list shows the teacher without needing a join.
          teacherNames: [`${teacherUser.firstName} ${teacherUser.lastName}`],
        },
      })
    )
  );

  await Promise.all(
    subjects.map((subject: SeededSubject) =>
      prisma.teacherSubject.upsert({
        where: {
          teacherId_subjectId: {
            teacherId: teacher.id,
            subjectId: subject.id,
          },
        },
        update: {},
        create: { teacherId: teacher.id, subjectId: subject.id },
      })
    )
  );

  const math = subjects[0];

  // ---- Schedule --------------------------------------------------------

  const existingSchedule = await prisma.schedule.findFirst({
    where: {
      classId: classRecord.id,
      subjectId: math.id,
      teacherId: teacher.id,
    },
  });
  if (!existingSchedule) {
    await prisma.schedule.create({
      data: {
        classId: classRecord.id,
        subjectId: math.id,
        teacherId: teacher.id,
        dayOfWeek: 1,
        startTime: "08:30",
        endTime: "09:45",
        room: "Room 101",
      },
    });
  }

  // ---- Lesson ---------------------------------------------------------
  //
  // Class + scheduledAt are optional but we set them for the demo so the
  // lesson shows on the class's timeline.

  const existingLesson = await prisma.lesson.findFirst({
    where: {
      title: "Quadratic Equations & Parabolic Trajectories",
      teacherId: teacher.id,
    },
  });
  if (!existingLesson) {
    await prisma.lesson.create({
      data: {
        title: "Quadratic Equations & Parabolic Trajectories",
        description:
          "Solve quadratic equations by factoring and completing the square.",
        subjectId: math.id,
        teacherId: teacher.id,
        classId: classRecord.id,
        scheduledAt: new Date("2026-09-22T08:30:00Z"),
      },
    });
  }

  // ---- Homework + submission ------------------------------------------

  const homework =
    (await prisma.homework.findFirst({
      where: {
        title: "Chapter 4 Problem Set: Quadratic Roots",
        teacherId: teacher.id,
      },
    })) ??
    (await prisma.homework.create({
      data: {
        title: "Chapter 4 Problem Set: Quadratic Roots",
        description: "Complete the quadratic roots problem set.",
        subjectId: math.id,
        teacherId: teacher.id,
        classId: classRecord.id,
        dueDate: new Date("2026-09-30"),
        maxScore: 100,
        allowLateSubmissions: false,
      },
    }));

  await prisma.homeworkSubmission.upsert({
    where: {
      homeworkId_studentId: {
        homeworkId: homework.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      homeworkId: homework.id,
      studentId: student.id,
      content: "Answers attached.",
      score: 96,
      feedback: "Excellent work.",
      gradedAt: new Date(),
    },
  });

  // ---- Quiz + question ------------------------------------------------

  const quiz =
    (await prisma.quiz.findFirst({
      where: {
        title: "Algebra II: Quadratics & Polynomial Functions",
        teacherId: teacher.id,
      },
    })) ??
    (await prisma.quiz.create({
      data: {
        title: "Algebra II: Quadratics & Polynomial Functions",
        subjectId: math.id,
        teacherId: teacher.id,
        classId: classRecord.id,
        isAutoGrade: true,
        timeLimitMin: 30,
      },
    }));

  const existingQuestion = await prisma.quizQuestion.findFirst({
    where: { quizId: quiz.id },
  });
  if (!existingQuestion) {
    await prisma.quizQuestion.create({
      data: {
        quizId: quiz.id,
        questionText: "What is the vertex of y = x²?",
        options: ["(0, 0)", "(1, 1)", "(-1, 0)", "(0, 1)"],
        correctAnswer: "(0, 0)",
        points: 10,
      },
    });
  }

  // ---- Grade + attendance ---------------------------------------------

  await prisma.grade.upsert({
    where: {
      studentId_subjectId_period_periodLabel: {
        studentId: student.id,
        subjectId: math.id,
        period: "SEMESTER" as GradePeriod,
        periodLabel: "Semester 1",
      },
    },
    update: { score: 92, teacherId: teacher.id },
    create: {
      studentId: student.id,
      subjectId: math.id,
      teacherId: teacher.id,
      period: "SEMESTER" as GradePeriod,
      periodLabel: "Semester 1",
      score: 92,
      maxScore: 100,
    },
  });

  await prisma.attendance.upsert({
    where: {
      studentId_date: {
        studentId: student.id,
        date: new Date("2026-09-16"),
      },
    },
    update: { status: "PRESENT" as AttendanceStatus },
    create: {
      studentId: student.id,
      date: new Date("2026-09-16"),
      status: "PRESENT" as AttendanceStatus,
    },
  });

  // ---- Welcome notification for the teacher ---------------------------

  const existingNotif = await prisma.notification.findFirst({
    where: { userId: teacherUser.id, title: "Welcome to the platform" },
  });
  if (!existingNotif) {
    await prisma.notification.create({
      data: {
        userId: teacherUser.id,
        title: "Welcome to the platform",
        body: "Your teacher account is set up. You can start creating lessons and homework.",
        channel: "IN_APP",
      },
    });
  }

  console.log(`  Demo accounts use password: ${DEMO_PASSWORD}`);
  console.log("  Change demo passwords before deploying to production");
}

// -----------------------------------------------------------------------------
// Entry point
// -----------------------------------------------------------------------------

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });