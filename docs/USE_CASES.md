# High School Management System

# Split CRUD Use Cases

## CRUD Use Case Convention

For master-data modules, CRUD operations are documented as separate use cases:

```text
View/List
View Details
Create
Edit
Delete
```

Each use case has:

* Actor
* Description
* Preconditions
* Main Flow
* Postconditions
* Alternative Flow where applicable

The backend must enforce the corresponding permission:

```text
<module>.view
<module>.create
<module>.edit
<module>.delete
```

---

# 1. School Profile

## UC-SCHOOL-01 — View School Profile

**Actor:** Administrator

### Description

Allows the administrator to view the school's information.

### Preconditions

* Administrator is authenticated.
* Administrator has `school.view` permission.
* School record exists.
* API and database are available.

### Main Flow

1. Administrator opens School Profile.
2. Frontend requests school information.
3. API authenticates the request.
4. API checks `school.view`.
5. API retrieves the school record.
6. Frontend displays the information.

### Postconditions

* School information is displayed.
* No school data is modified.

---

## UC-SCHOOL-02 — Update School Profile

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `school.edit` permission.
* School record exists.
* Submitted information is valid.

### Main Flow

1. Administrator opens School Profile.
2. Administrator edits school information.
3. Administrator submits the form.
4. Frontend validates the input.
5. API validates the request.
6. API updates the school record.
7. System returns the updated information.

### Postconditions

* School information is updated.
* Updated information is stored in PostgreSQL.
* Frontend displays the updated information.

---

# 2. Academic Year

## UC-ACADEMIC-01 — View Academic Years

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `academicYears.view` permission.
* API is available.

### Main Flow

1. Administrator opens Academic Years.
2. Frontend requests academic years.
3. API validates authorization.
4. API retrieves academic years.
5. System displays the list.

### Postconditions

* Academic years are displayed.
* No data is modified.

---

## UC-ACADEMIC-02 — View Academic Year Details

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `academicYears.view` permission.
* Academic year exists.

### Main Flow

1. Administrator selects an academic year.
2. System requests its details.
3. API retrieves the record.
4. System displays the details.

### Postconditions

* Selected academic year details are displayed.
* No data is modified.

---

## UC-ACADEMIC-03 — Create Academic Year

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `academicYears.create` permission.
* Required information is provided.
* Academic year does not already exist.
* Dates are valid.

### Main Flow

1. Administrator clicks Create Academic Year.
2. Administrator enters:

   * Name
   * Start date
   * End date
   * Status
3. System validates the form.
4. API validates authorization.
5. API creates the academic year.
6. System displays success.
7. Academic year list is refreshed.

### Postconditions

* New academic year exists.
* Academic year is stored in PostgreSQL.
* New record appears in the list.

---

## UC-ACADEMIC-04 — Edit Academic Year

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `academicYears.edit` permission.
* Academic year exists.
* Submitted data is valid.

### Main Flow

1. Administrator selects an academic year.
2. Administrator clicks Edit.
3. System loads existing data.
4. Administrator changes the information.
5. Administrator submits the form.
6. API validates the request.
7. API updates the academic year.
8. System displays success.

### Postconditions

* Academic year information is updated.
* Updated data is stored.
* Frontend displays the latest information.

---

## UC-ACADEMIC-05 — Delete Academic Year

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `academicYears.delete` permission.
* Academic year exists.
* Academic year is not protected by dependent records, or deletion rules permit the operation.

### Main Flow

1. Administrator selects an academic year.
2. Administrator clicks Delete.
3. System displays confirmation.
4. Administrator confirms.
5. API validates authorization and dependencies.
6. API deletes or deactivates the record.
7. System refreshes the list.

### Postconditions

* Academic year is deleted or deactivated.
* It is no longer available as an active academic year.
* Related data remains consistent.

---

# 3. Terms

## UC-TERM-01 — View Terms

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `terms.view` permission.
* API is available.

### Postconditions

* Terms are displayed.
* No term data is modified.

---

## UC-TERM-02 — View Term Details

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `terms.view` permission.
* Term exists.

### Postconditions

* Selected term information is displayed.
* No data is modified.

---

## UC-TERM-03 — Create Term

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `terms.create` permission.
* Academic year exists.
* Term information is valid.
* Start date is before end date.

### Main Flow

1. Administrator clicks Create Term.
2. Selects academic year.
3. Enters term name.
4. Sets start and end dates.
5. Selects status.
6. Submits the form.
7. API validates the data.
8. API creates the term.

### Postconditions

* Term is created.
* Term belongs to the selected academic year.
* Term appears in the term list.

---

## UC-TERM-04 — Edit Term

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `terms.edit` permission.
* Term exists.
* Submitted data is valid.

### Postconditions

* Term information is updated.
* Updated term is stored in PostgreSQL.

---

## UC-TERM-05 — Delete Term

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `terms.delete` permission.
* Term exists.
* No business rule prevents deletion.

### Main Flow

1. Administrator selects the term.
2. Clicks Delete.
3. Confirms deletion.
4. API validates dependencies.
5. API deletes or deactivates the term.

### Postconditions

* Term is removed or deactivated.
* Academic year remains consistent.

---

# 4. Users

## UC-USER-01 — View Users

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `users.view` permission.
* API is available.

### Main Flow

1. Administrator opens Users.
2. System requests users.
3. API validates authorization.
4. API retrieves users.
5. System displays the user list.

### Postconditions

* Authorized users are displayed.
* No user data is modified.

---

## UC-USER-02 — View User Details

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `users.view` permission.
* Target user exists.

### Postconditions

* User details are displayed.
* Sensitive information such as password hashes is never exposed.

---

## UC-USER-03 — Create User

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `users.create` permission.
* Required information is valid.
* Email/identifier is unique.
* Selected role exists.

### Main Flow

1. Administrator clicks Create User.
2. Administrator enters user information.
3. Administrator selects a role.
4. System validates the form.
5. API validates the request.
6. API hashes the password.
7. API creates the user.
8. System displays success.

### Postconditions

* User account is created.
* Password is securely hashed.
* User is assigned the selected role.
* User can authenticate if active.

---

## UC-USER-04 — Edit User

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `users.edit` permission.
* Target user exists.
* Submitted information is valid.

### Main Flow

1. Administrator selects a user.
2. Clicks Edit.
3. System loads user information.
4. Administrator changes permitted fields.
5. Administrator submits.
6. API validates the request.
7. API updates the user.
8. System displays success.

### Postconditions

* User information is updated.
* Role/status changes are stored if permitted.
* Updated user information is displayed.

---

## UC-USER-05 — Delete User

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `users.delete` permission.
* Target user exists.
* User is allowed to be deleted/deactivated.

### Main Flow

1. Administrator selects a user.
2. Clicks Delete.
3. System requests confirmation.
4. Administrator confirms.
5. API validates authorization.
6. API deletes or deactivates the user.
7. System refreshes the user list.

### Postconditions

* User is deleted or deactivated.
* Deactivated users can no longer authenticate.
* Related records remain consistent.

---

# 5. Teachers

## UC-TEACHER-01 — View Teachers

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `teachers.view` permission.

### Postconditions

* Teacher list is displayed.
* No teacher data is modified.

---

## UC-TEACHER-02 — View Teacher Details

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `teachers.view` permission.
* Teacher exists.

### Postconditions

* Teacher details are displayed.
* Assigned classes and subjects may be displayed when authorized.

---

## UC-TEACHER-03 — Create Teacher

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `teachers.create` permission.
* Teacher information is valid.
* Required user account information is unique.

### Main Flow

1. Administrator clicks Create Teacher.
2. Enters teacher information.
3. Assigns required subjects/classes if applicable.
4. System validates information.
5. API creates the teacher record/account.
6. System displays success.

### Postconditions

* Teacher record exists.
* Teacher account is available if an account was created.
* Teacher can be assigned to classes and subjects.

---

## UC-TEACHER-04 — Edit Teacher

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `teachers.edit` permission.
* Teacher exists.
* Submitted data is valid.

### Postconditions

* Teacher information is updated.
* Updated assignments are stored if changed.

---

## UC-TEACHER-05 — Delete Teacher

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `teachers.delete` permission.
* Teacher exists.
* Teacher can be deleted/deactivated according to business rules.

### Postconditions

* Teacher is deleted or deactivated.
* Active teaching assignments are handled according to business rules.
* Teacher cannot access the system if their account is deactivated.

---

# 6. Students

## UC-STUDENT-01 — View Students

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `students.view` permission.

### Postconditions

* Student list is displayed.
* No student data is modified.

---

## UC-STUDENT-02 — View Student Details

**Actors:** Administrator, Teacher

### Preconditions

* User is authenticated.
* User has student view permission.
* User has access to the student record.
* Student exists.

### Postconditions

* Authorized student information is displayed.
* Sensitive information remains protected.

---

## UC-STUDENT-03 — Create Student

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `students.create` permission.
* Student information is valid.
* Student identifier is unique.
* Required class/academic information exists when enrollment is required.

### Main Flow

1. Administrator clicks Create Student.
2. Enters student information.
3. Selects academic year/class where applicable.
4. System validates the information.
5. API creates the student.
6. System displays success.

### Postconditions

* Student record is created.
* Student can be enrolled in a class.
* Student account can be created where applicable.

---

## UC-STUDENT-04 — Edit Student

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `students.edit` permission.
* Student exists.
* Submitted data is valid.

### Postconditions

* Student information is updated.
* Class/enrollment information is updated if permitted.
* Changes are stored in PostgreSQL.

---

## UC-STUDENT-05 — Delete Student

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `students.delete` permission.
* Student exists.
* Student is allowed to be deleted/deactivated.

### Main Flow

1. Administrator selects a student.
2. Clicks Delete.
3. System requests confirmation.
4. Administrator confirms.
5. API validates dependencies.
6. API deletes or deactivates the student.

### Postconditions

* Student is deleted or deactivated.
* Student cannot access the system if deactivated.
* Historical academic records remain consistent.

---

# 7. Roles

## UC-RBAC-01 — View Roles

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `roles.view` permission.

### Postconditions

* Available roles are displayed.
* No role is modified.

---

## UC-RBAC-02 — View Role Details

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `roles.view` permission.
* Role exists.

### Postconditions

* Role information and assigned permissions are displayed.

---

## UC-RBAC-03 — Create Role

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `roles.create` permission.
* Role name is valid.
* Role name is unique.

### Postconditions

* New role is created.
* Role is available for permission assignment.

---

## UC-RBAC-04 — Edit Role

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `roles.edit` permission.
* Role exists.
* New role information is valid.

### Postconditions

* Role information is updated.
* Updated role is stored.

---

## UC-RBAC-05 — Delete Role

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `roles.delete` permission.
* Role exists.
* Role is not a protected system role.
* No business rule prevents deletion.

### Postconditions

* Role is deleted.
* User-role relationships remain consistent.

---

# 8. Role Permissions

## UC-PERMISSION-01 — View Role Permissions

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `roles.view` permission.
* Role exists.

### Postconditions

* Assigned permissions are displayed.

---

## UC-PERMISSION-02 — Assign Permissions

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `roles.edit` permission.
* Role exists.
* Selected permissions exist.

### Main Flow

1. Administrator selects a role.
2. System loads available permissions.
3. Administrator selects permissions.
4. Administrator saves.
5. API validates the request.
6. API updates role permissions.

### Postconditions

* Selected permissions are assigned.
* Removed permissions are no longer assigned.
* Updated permissions become effective for future requests.

---

# 9. Grades / Levels

## UC-GRADELEVEL-01 — View Grades / Levels

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `grades.view` permission.

### Postconditions

* Grade/level list is displayed.

---

## UC-GRADELEVEL-02 — View Grade / Level Details

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `grades.view` permission.
* Grade/level exists.

### Postconditions

* Grade/level details are displayed.

---

## UC-GRADELEVEL-03 — Create Grade / Level

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `grades.create` permission.
* Grade/level information is valid.
* Grade/level does not already exist.

### Postconditions

* Grade/level is created.
* Grade/level can be used by classes.

---

## UC-GRADELEVEL-04 — Edit Grade / Level

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `grades.edit` permission.
* Grade/level exists.
* Submitted information is valid.

### Postconditions

* Grade/level information is updated.

---

## UC-GRADELEVEL-05 — Delete Grade / Level

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `grades.delete` permission.
* Grade/level exists.
* No active class depends on it, or deletion rules allow the operation.

### Postconditions

* Grade/level is deleted or deactivated.
* Dependent academic data remains consistent.

---

# 10. Classes

## UC-CLASS-01 — View Classes

**Actors:** Administrator, Teacher, Student

### Preconditions

* User is authenticated.
* User has `classes.view` permission.
* User is authorized to view the requested classes.

### Postconditions

* Authorized classes are displayed.

---

## UC-CLASS-02 — View Class Details

**Actors:** Administrator, Teacher, Student

### Preconditions

* User is authenticated.
* User has class view permission.
* Class exists.
* User is authorized to access the class.

### Postconditions

* Class details are displayed.
* Authorized students/teachers may be displayed.

---

## UC-CLASS-03 — Create Class

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `classes.create` permission.
* Academic year exists.
* Grade/level exists.
* Class information is valid.

### Postconditions

* Class is created.
* Class belongs to the selected academic structure.
* Class can receive students, teachers, subjects, and schedules.

---

## UC-CLASS-04 — Edit Class

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `classes.edit` permission.
* Class exists.
* Submitted data is valid.

### Postconditions

* Class information is updated.
* Updated class information is stored.

---

## UC-CLASS-05 — Delete Class

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `classes.delete` permission.
* Class exists.
* Class can be deleted according to dependency rules.

### Postconditions

* Class is deleted or deactivated.
* Student/teacher assignments are handled consistently.

---

# 11. Subjects

## UC-SUBJECT-01 — View Subjects

**Actors:** Administrator, Teacher, Student

### Preconditions

* User is authenticated.
* User has `subjects.view` permission.

### Postconditions

* Authorized subjects are displayed.

---

## UC-SUBJECT-02 — View Subject Details

**Actors:** Administrator, Teacher

### Preconditions

* User is authenticated.
* User has `subjects.view` permission.
* Subject exists.

### Postconditions

* Subject details are displayed.

---

## UC-SUBJECT-03 — Create Subject

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `subjects.create` permission.
* Subject information is valid.
* Subject code/name is unique where required.

### Postconditions

* Subject is created.
* Subject can be assigned to classes and teachers.

---

## UC-SUBJECT-04 — Edit Subject

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `subjects.edit` permission.
* Subject exists.
* Submitted information is valid.

### Postconditions

* Subject information is updated.

---

## UC-SUBJECT-05 — Delete Subject

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `subjects.delete` permission.
* Subject exists.
* Subject can be deleted according to dependency rules.

### Postconditions

* Subject is deleted or deactivated.
* Related academic data remains consistent.

---

# 12. Schedules

## UC-SCHEDULE-01 — View Schedules

**Actors:** Administrator, Teacher, Student

### Preconditions

* User is authenticated.
* User has `schedules.view` permission.

### Postconditions

* Authorized schedules are displayed.

---

## UC-SCHEDULE-02 — View Schedule Details

**Actors:** Administrator, Teacher, Student

### Preconditions

* User is authenticated.
* User has schedule view permission.
* Schedule exists.
* User is authorized to access it.

### Postconditions

* Schedule details are displayed.

---

## UC-SCHEDULE-03 — Create Schedule

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `schedules.create` permission.
* Class exists.
* Subject exists.
* Teacher exists if required.
* Schedule information is valid.
* No conflicting schedule exists.

### Postconditions

* Schedule is created.
* Class timetable is updated.
* Teacher timetable is updated where applicable.

---

## UC-SCHEDULE-04 — Edit Schedule

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `schedules.edit` permission.
* Schedule exists.
* Updated schedule does not create an invalid conflict.

### Postconditions

* Schedule information is updated.
* Updated timetable is available to authorized users.

---

## UC-SCHEDULE-05 — Delete Schedule

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `schedules.delete` permission.
* Schedule exists.

### Postconditions

* Schedule is removed.
* Related timetable views are updated.

---

# 13. CRUD Permission Mapping

The standard CRUD mapping is:

| Operation    | Permission        |
| ------------ | ----------------- |
| View/List    | `<module>.view`   |
| View Details | `<module>.view`   |
| Create       | `<module>.create` |
| Edit         | `<module>.edit`   |
| Delete       | `<module>.delete` |

Example for Classes:

```text
classes.view
classes.create
classes.edit
classes.delete
```

Example for Subjects:

```text
subjects.view
subjects.create
subjects.edit
subjects.delete
```

Example for Users:

```text
users.view
users.create
users.edit
users.delete
```

---

# 14. CRUD Use Case Pattern

Every CRUD module should follow this pattern:

```text
                ┌──────────────────┐
                │      View        │
                │  List / Details  │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │      Create      │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │       Edit       │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │      Delete      │
                └──────────────────┘
```

For every operation:

```text
User
  ↓
Frontend
  ↓
API Route
  ↓
Authentication
  ↓
Permission Check
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

---

# 15. CRUD Security Rule

A CRUD operation must never rely only on the frontend.

Example:

```text
Administrator clicks Delete
          ↓
Frontend checks users.delete
          ↓
DELETE /api/v1/users/:id
          ↓
Backend authenticates user
          ↓
Backend checks users.delete
          ↓
Backend validates dependencies
          ↓
Service deletes/deactivates user
          ↓
PostgreSQL
```

If the permission check fails:

```text
403 Forbidden
```

No database modification is performed.

---

# 16. CRUD Error Conditions

## Create

Possible failures:

```text
400 Bad Request
409 Conflict
401 Unauthorized
403 Forbidden
500 Internal Server Error
```

Examples:

* Invalid data
* Duplicate email
* Duplicate code
* Missing required field
* Unauthorized operation

---

## View

Possible failures:

```text
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

---

## Edit

Possible failures:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

---

## Delete

Possible failures:

```text
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

A `409 Conflict` should be used when a record cannot be deleted because of active dependent records or business rules.

---

# 17. Important Design Rule

Do **not** use vague CRUD use case names such as:

```text
Manage Users
Manage Students
Manage Teachers
Manage Classes
Manage Subjects
Manage Schedules
```

Instead, document each operation separately:

```text
View Users
View User Details
Create User
Edit User
Delete User
```

This makes the Use Case Document:

* Easier to test
* Easier to map to API endpoints
* Easier to map to frontend pages
* Easier to map to permissions
* Easier to create acceptance criteria
* Easier to create test cases
* More suitable for software documentation

---

# 18. Recommended CRUD Documentation Structure

For all future CRUD modules, use:

```text
UC-[MODULE]-01 — View [Entity]
UC-[MODULE]-02 — View [Entity] Details
UC-[MODULE]-03 — Create [Entity]
UC-[MODULE]-04 — Edit [Entity]
UC-[MODULE]-05 — Delete [Entity]
```

For example:

```text
UC-USER-01 — View Users
UC-USER-02 — View User Details
UC-USER-03 — Create User
UC-USER-04 — Edit User
UC-USER-05 — Delete User

UC-CLASS-01 — View Classes
UC-CLASS-02 — View Class Details
UC-CLASS-03 — Create Class
UC-CLASS-04 — Edit Class
UC-CLASS-05 — Delete Class

UC-SUBJECT-01 — View Subjects
UC-SUBJECT-02 — View Subject Details
UC-SUBJECT-03 — Create Subject
UC-SUBJECT-04 — Edit Subject
UC-SUBJECT-05 — Delete Subject
```

This convention should be applied consistently to every CRUD-based module in the system.
