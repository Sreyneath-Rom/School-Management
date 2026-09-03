# High School Management System — Backend Use Cases

## 1. Authentication

### UC-AUTH-01 — Login

**Actor:** Administrator, Teacher, Student

**Description:**
Allows a registered user to authenticate and access the system.

#### Preconditions

* User has a registered account.
* Account is active.
* Login API is available.
* Valid login credentials are provided.
* Database is available.

#### Main Flow

1. User submits email/identifier and password.
2. Frontend sends `POST /api/v1/auth/login`.
3. API validates the credentials.
4. API retrieves the user's role.
5. API retrieves the user's permissions.
6. API generates an access token.
7. API creates/updates the refresh-token session.
8. Authentication response is returned.

#### Postconditions

* User is authenticated.
* Access token is issued.
* Refresh token/session is stored securely.
* User role is available.
* User permissions are available.

#### Alternative Flow

If credentials are invalid:

* Authentication fails.
* No authenticated session is created.
* API returns an authentication error.
* User remains unauthenticated.

---

### UC-AUTH-02 — Refresh Token

**Actor:** System

**Description:**
Allows an authenticated session to obtain a new access token after the current access token expires.

#### Preconditions

* User previously authenticated.
* Refresh token exists.
* Refresh token is valid.
* Refresh token has not expired.
* Refresh token has not been revoked.

#### Main Flow

1. Client sends refresh token.
2. API validates the refresh token.
3. API verifies the stored token hash/session.
4. API rotates the refresh token.
5. API generates a new access token.
6. API returns the new authentication credentials.

#### Postconditions

* New access token is issued.
* Previous refresh token is invalidated.
* New refresh token is stored securely.
* User remains authenticated.

#### Alternative Flow

If the refresh token is invalid, expired, or revoked:

* Refresh operation fails.
* Session is rejected.
* Client must authenticate again.

---

### UC-AUTH-03 — Logout

**Actor:** Administrator, Teacher, Student

#### Preconditions

* User is authenticated.
* Valid refresh-token session exists.

#### Main Flow

1. User requests logout.
2. Client sends logout request.
3. API identifies the refresh-token session.
4. API revokes the session/token.
5. API returns a successful response.

#### Postconditions

* Refresh session is revoked.
* User can no longer refresh the session using the revoked token.
* Client authentication state can be cleared.

---

### UC-AUTH-04 — Get Current User

**Actor:** Administrator, Teacher, Student

**Endpoint:**

```text
GET /api/v1/auth/me
```

#### Preconditions

* User is authenticated.
* Valid access token is provided.

#### Main Flow

1. Client sends access token.
2. Authentication middleware validates the token.
3. API identifies the user.
4. API retrieves the user profile.
5. API retrieves role/permission information.
6. API returns the authenticated user.

#### Postconditions

* Current user information is returned.
* Role information is available.
* Permission information is available.

---

# 2. School Management

### UC-SCHOOL-01 — View School Profile

**Actor:** Administrator

**Permission:** `school.view`

#### Preconditions

* Administrator is authenticated.
* `school.view` permission is granted.
* School record exists.

#### Main Flow

1. Administrator requests school information.
2. API authenticates the request.
3. API checks `school.view`.
4. API retrieves the school.
5. API returns the school profile.

#### Postconditions

* School profile is returned.
* No data is modified.

---

### UC-SCHOOL-02 — Edit School Profile

**Actor:** Administrator

**Permission:** `school.edit`

#### Preconditions

* Administrator is authenticated.
* `school.edit` permission is granted.
* School record exists.
* Submitted data is valid.

#### Main Flow

1. Administrator submits updated school information.
2. API authenticates the request.
3. API checks `school.edit`.
4. API validates the data.
5. API updates the school record.
6. API returns the updated record.

#### Postconditions

* School information is updated.
* Database contains the new information.

---

# 3. Academic Year Management

### UC-ACADEMIC-01 — View Academic Years

**Actor:** Administrator

**Permission:** `academicYears.view`

#### Preconditions

* Administrator is authenticated.
* Required permission is granted.

#### Postconditions

* Authorized academic years are returned.

---

### UC-ACADEMIC-02 — Create Academic Year

**Actor:** Administrator

**Permission:** `academicYears.create`

#### Preconditions

* Administrator is authenticated.
* `academicYears.create` permission is granted.
* Required fields are valid.
* Academic year does not violate uniqueness/business rules.

#### Main Flow

1. Administrator submits academic year information.
2. API validates the request.
3. API checks authorization.
4. API creates the academic year.
5. API returns the created record.

#### Postconditions

* Academic year exists in the database.

---

### UC-ACADEMIC-03 — Edit Academic Year

**Actor:** Administrator

**Permission:** `academicYears.edit`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.
* Academic year exists.
* Submitted data is valid.

#### Postconditions

* Academic year is updated.
* Updated record is returned.

---

### UC-ACADEMIC-04 — Delete Academic Year

**Actor:** Administrator

**Permission:** `academicYears.delete`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.
* Academic year exists.
* Deletion does not violate dependency rules.

#### Main Flow

1. Administrator selects an academic year.
2. API validates authorization.
3. API checks dependencies.
4. API deletes/deactivates the record according to business rules.

#### Postconditions

* Academic year is no longer active/available.
* Related data remains consistent.

---

# 4. Term Management

### UC-TERM-01 — View Terms

**Actor:** Administrator

**Permission:** `terms.view`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.

#### Postconditions

* Authorized terms are returned.

---

### UC-TERM-02 — Create Term

**Actor:** Administrator

**Permission:** `terms.create`

#### Preconditions

* Administrator is authenticated.
* `terms.create` permission is granted.
* Academic year exists.
* Term name is valid.
* Start and end dates are valid.

#### Main Flow

1. Administrator submits term information.
2. API validates the request.
3. API verifies the academic year.
4. API creates the term.
5. API returns the created term.

#### Postconditions

* Term is stored.
* Term belongs to the selected academic year.

---

### UC-TERM-03 — Edit Term

**Actor:** Administrator

**Permission:** `terms.edit`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.
* Term exists.
* Academic year exists.
* Submitted data is valid.

#### Postconditions

* Term information is updated.

---

### UC-TERM-04 — Delete Term

**Actor:** Administrator

**Permission:** `terms.delete`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.
* Term exists.
* Deletion is allowed by dependency rules.

#### Postconditions

* Term is deleted/deactivated.
* Related academic data remains consistent.

---

# 5. User Management

### UC-USER-01 — View Users

**Actor:** Administrator

**Permission:** `users.view`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.

#### Postconditions

* Authorized user list is returned.

---

### UC-USER-02 — View User Details

**Actor:** Administrator

**Permission:** `users.view`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.
* Target user exists.

#### Postconditions

* User information is returned.

---

### UC-USER-03 — Create User

**Actor:** Administrator

**Permission:** `users.create`

#### Preconditions

* Administrator is authenticated.
* `users.create` permission is granted.
* Required user information is valid.
* Email/identifier is not already used.
* Selected role exists.

#### Main Flow

1. Administrator submits user information.
2. API validates the request.
3. API checks email/identifier uniqueness.
4. API validates the selected role.
5. Password is securely hashed.
6. API creates the user.
7. API assigns the role.
8. API returns the created user.

#### Postconditions

* User account exists.
* Password is stored as a secure hash.
* Role is assigned.

---

### UC-USER-04 — Edit User

**Actor:** Administrator

**Permission:** `users.edit`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.
* Target user exists.
* Submitted data is valid.

#### Postconditions

* User information is updated.
* Role/status changes are stored when permitted.

---

### UC-USER-05 — Delete User

**Actor:** Administrator

**Permission:** `users.delete`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.
* Target user exists.
* User is allowed to be deleted/deactivated.

#### Postconditions

* User is deleted or deactivated.
* Deactivated user cannot authenticate.

---

# 6. Teacher Management

### UC-TEACHER-01 — View Teachers

**Actor:** Administrator

**Permission:** `teachers.view`

#### Postconditions

* Authorized teacher records are returned.

---

### UC-TEACHER-02 — View Teacher Details

**Actor:** Administrator

**Permission:** `teachers.view`

#### Preconditions

* Teacher exists.
* Administrator is authorized.

#### Postconditions

* Teacher information is returned.

---

### UC-TEACHER-03 — Create Teacher

**Actor:** Administrator

**Permission:** `teachers.create`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.
* Teacher information is valid.
* Required user account information is available.

#### Postconditions

* Teacher record is created.
* Teacher account is associated with the teacher.

---

### UC-TEACHER-04 — Edit Teacher

**Actor:** Administrator

**Permission:** `teachers.edit`

#### Preconditions

* Teacher exists.
* Permission is granted.
* Submitted information is valid.

#### Postconditions

* Teacher information is updated.

---

### UC-TEACHER-05 — Delete Teacher

**Actor:** Administrator

**Permission:** `teachers.delete`

#### Preconditions

* Teacher exists.
* Permission is granted.
* Deletion is allowed by business rules.

#### Postconditions

* Teacher is deleted/deactivated.
* Related assignments remain consistent.

---

# 7. Student Management

### UC-STUDENT-01 — View Students

**Actor:** Administrator, Teacher

**Permission:** `students.view`

#### Postconditions

* Authorized student records are returned.

---

### UC-STUDENT-02 — View Student Details

**Actor:** Administrator, Teacher

**Permission:** `students.view`

#### Preconditions

* Student exists.
* Requester has access to the student.

#### Postconditions

* Authorized student information is returned.

---

### UC-STUDENT-03 — Create Student

**Actor:** Administrator

**Permission:** `students.create`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.
* Student information is valid.

#### Postconditions

* Student record is created.
* Student can be enrolled/assigned to an appropriate class.

---

### UC-STUDENT-04 — Edit Student

**Actor:** Administrator

**Permission:** `students.edit`

#### Preconditions

* Student exists.
* Permission is granted.
* Submitted information is valid.

#### Postconditions

* Student information is updated.

---

### UC-STUDENT-05 — Delete Student

**Actor:** Administrator

**Permission:** `students.delete`

#### Preconditions

* Student exists.
* Permission is granted.
* Deletion/deactivation is allowed.

#### Postconditions

* Student is deleted/deactivated.
* Related records remain consistent.

---

# 8. Roles & Permissions

### UC-RBAC-01 — View Roles

**Actor:** Administrator

**Permission:** `roles.view`

#### Postconditions

* Roles are returned.

---

### UC-RBAC-02 — Create Role

**Actor:** Administrator

**Permission:** `roles.create`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.
* Role name is valid.
* Role does not already exist.

#### Postconditions

* Role is created.

---

### UC-RBAC-03 — Edit Role

**Actor:** Administrator

**Permission:** `roles.edit`

#### Preconditions

* Role exists.
* Permission is granted.

#### Postconditions

* Role information is updated.

---

### UC-RBAC-04 — Delete Role

**Actor:** Administrator

**Permission:** `roles.delete`

#### Preconditions

* Role exists.
* Permission is granted.
* Role can be deleted according to business rules.

#### Postconditions

* Role is deleted/deactivated.
* User-role relationships remain consistent.

---

### UC-RBAC-05 — Assign Permissions

**Actor:** Administrator

**Permission:** `roles.edit`

#### Preconditions

* Administrator is authenticated.
* Target role exists.
* Selected permissions exist in the permission catalog.

#### Main Flow

1. Administrator selects a role.
2. API retrieves the current permissions.
3. Administrator submits the new permission set.
4. API validates the permissions.
5. API updates the role-permission relationships.

#### Postconditions

* Role has the selected permissions.
* Removed permissions are no longer assigned.
* New permissions become effective for future authorized requests.

---

# 9. Grade / Level Management

### UC-GRADE-01 — View Grades / Levels

**Actor:** Administrator

**Permission:** `grades.view`

#### Postconditions

* Grades/levels are returned.

---

### UC-GRADE-02 — Create Grade / Level

**Actor:** Administrator

**Permission:** `grades.create`

#### Preconditions

* Grade/level information is valid.
* Permission is granted.

#### Postconditions

* Grade/level is created.

---

### UC-GRADE-03 — Edit Grade / Level

**Actor:** Administrator

**Permission:** `grades.edit`

#### Preconditions

* Grade/level exists.
* Submitted data is valid.

#### Postconditions

* Grade/level is updated.

---

### UC-GRADE-04 — Delete Grade / Level

**Actor:** Administrator

**Permission:** `grades.delete`

#### Preconditions

* Grade/level exists.
* Deletion does not violate dependencies.

#### Postconditions

* Grade/level is deleted/deactivated.

---

# 10. Class Management

### UC-CLASS-01 — View Classes

**Actor:** Administrator, Teacher, Student

**Permission:** `classes.view`

#### Postconditions

* Authorized classes are returned.

---

### UC-CLASS-02 — View Class Details

**Actor:** Administrator, Teacher

**Permission:** `classes.view`

#### Postconditions

* Class details and authorized relationships are returned.

---

### UC-CLASS-03 — Create Class

**Actor:** Administrator

**Permission:** `classes.create`

#### Preconditions

* Academic year exists.
* Grade/level exists.
* Class information is valid.
* Permission is granted.

#### Postconditions

* Class is created.
* Class belongs to the correct academic structure.

---

### UC-CLASS-04 — Edit Class

**Actor:** Administrator

**Permission:** `classes.edit`

#### Preconditions

* Class exists.
* Submitted information is valid.

#### Postconditions

* Class information is updated.

---

### UC-CLASS-05 — Delete Class

**Actor:** Administrator

**Permission:** `classes.delete`

#### Preconditions

* Class exists.
* Deletion is allowed by business rules.

#### Postconditions

* Class is deleted/deactivated.
* Related records remain consistent.

---

# 11. Subject Management

### UC-SUBJECT-01 — View Subjects

**Actor:** Administrator, Teacher, Student

**Permission:** `subjects.view`

#### Postconditions

* Authorized subjects are returned.

---

### UC-SUBJECT-02 — Create Subject

**Actor:** Administrator

**Permission:** `subjects.create`

#### Preconditions

* Subject information is valid.
* Permission is granted.

#### Postconditions

* Subject is created.

---

### UC-SUBJECT-03 — Edit Subject

**Actor:** Administrator

**Permission:** `subjects.edit`

#### Preconditions

* Subject exists.
* Submitted information is valid.

#### Postconditions

* Subject is updated.

---

### UC-SUBJECT-04 — Delete Subject

**Actor:** Administrator

**Permission:** `subjects.delete`

#### Preconditions

* Subject exists.
* Deletion is allowed by dependency rules.

#### Postconditions

* Subject is deleted/deactivated.

---

# 12. Schedule Management

### UC-SCHEDULE-01 — View Schedules

**Actor:** Administrator, Teacher, Student

**Permission:** `schedules.view`

#### Postconditions

* Authorized schedules are returned.

---

### UC-SCHEDULE-02 — Create Schedule

**Actor:** Administrator

**Permission:** `schedules.create`

#### Preconditions

* Class exists.
* Subject exists.
* Teacher exists if required.
* Schedule data is valid.
* No prohibited scheduling conflict exists.

#### Postconditions

* Schedule is created.

---

### UC-SCHEDULE-03 — Edit Schedule

**Actor:** Administrator

**Permission:** `schedules.edit`

#### Preconditions

* Schedule exists.
* Updated schedule data is valid.

#### Postconditions

* Schedule is updated.

---

### UC-SCHEDULE-04 — Delete Schedule

**Actor:** Administrator

**Permission:** `schedules.delete`

#### Preconditions

* Schedule exists.
* Permission is granted.

#### Postconditions

* Schedule is deleted/deactivated.

---

# 13. Attendance Management

### UC-ATTENDANCE-01 — Mark Attendance

**Actor:** Teacher

**Permission:** `attendance.create`

#### Preconditions

* Teacher is authenticated.
* Teacher has access to the class.
* Students are enrolled in the class.
* Attendance date/session is valid.

#### Main Flow

1. Teacher selects a class.
2. API verifies teacher authorization.
3. API retrieves enrolled students.
4. Teacher submits attendance statuses.
5. API validates the records.
6. API stores attendance.

#### Postconditions

* Attendance records are stored.
* Each applicable student has an attendance status.

---

### UC-ATTENDANCE-02 — Edit Attendance

**Actor:** Teacher

**Permission:** `attendance.edit`

#### Preconditions

* Attendance record exists.
* Teacher has access to the class.
* Editing is allowed.

#### Postconditions

* Attendance status is updated.

---

### UC-ATTENDANCE-03 — View Attendance

**Actors:** Administrator, Teacher, Student

**Permission:** `attendance.view`

#### Preconditions

* User is authenticated.
* User has access to the requested attendance data.

#### Postconditions

* Authorized attendance information is returned.
* Student can only access their own attendance where applicable.

---

# 14. Lesson Management

### UC-LESSON-01 — View Lessons

**Actors:** Teacher, Student

**Permission:** `lessons.view`

#### Postconditions

* Authorized lessons are returned.

---

### UC-LESSON-02 — Create Lesson

**Actor:** Teacher

**Permission:** `lessons.create`

#### Preconditions

* Teacher is authenticated.
* Teacher is assigned to the class/subject.
* Class and subject exist.
* Lesson information is valid.

#### Postconditions

* Lesson is created.
* Lesson is associated with the correct class and subject.

---

### UC-LESSON-03 — Edit Lesson

**Actor:** Teacher

**Permission:** `lessons.edit`

#### Preconditions

* Lesson exists.
* Teacher has access to the lesson.
* Updated data is valid.

#### Postconditions

* Lesson is updated.

---

### UC-LESSON-04 — Delete Lesson

**Actor:** Teacher

**Permission:** `lessons.delete`

#### Preconditions

* Lesson exists.
* Teacher has access.
* Deletion is allowed.

#### Postconditions

* Lesson is deleted/deactivated.

---

# 15. Homework Management

### UC-HOMEWORK-01 — View Homework

**Actors:** Teacher, Student

**Permission:** `homework.view`

#### Postconditions

* Authorized homework is returned.

---

### UC-HOMEWORK-02 — Create Homework

**Actor:** Teacher

**Permission:** `homework.create`

#### Preconditions

* Teacher has access to the class/subject.
* Class and subject exist.
* Homework data is valid.

#### Postconditions

* Homework is created.

---

### UC-HOMEWORK-03 — Edit Homework

**Actor:** Teacher

**Permission:** `homework.edit`

#### Preconditions

* Homework exists.
* Teacher has access.
* Updated data is valid.

#### Postconditions

* Homework is updated.

---

### UC-HOMEWORK-04 — Delete Homework

**Actor:** Teacher

**Permission:** `homework.delete`

#### Preconditions

* Homework exists.
* Teacher has access.
* Deletion is allowed.

#### Postconditions

* Homework is deleted/deactivated.

---

### UC-HOMEWORK-05 — Submit Homework

**Actor:** Student

**Permission:** `homework.submit`

#### Preconditions

* Student is authenticated.
* Homework exists.
* Homework is published.
* Student belongs to the assigned class.
* Submission is allowed.

#### Main Flow

1. Student submits an answer/file.
2. API validates the submission.
3. API verifies student access.
4. Submission is stored.
5. Submission status is updated.

#### Postconditions

* Submission is stored.
* Teacher can review the submission.

---

### UC-HOMEWORK-06 — Review Homework

**Actor:** Teacher

**Permission:** `homework.edit`

#### Preconditions

* Teacher has access to the homework.
* Student submission exists.

#### Main Flow

1. Teacher opens the submission.
2. Teacher reviews the work.
3. Teacher adds feedback/grade if supported.
4. API stores the review.

#### Postconditions

* Review information is stored.
* Student can view authorized feedback/result.

---

# 16. Quiz & Test Management

### UC-QUIZ-01 — View Quizzes

**Actors:** Teacher, Student

**Permission:** `quizzes.view`

#### Postconditions

* Authorized quiz information is returned.
* Student-safe quiz data is returned to students.

---

### UC-QUIZ-02 — Create Quiz

**Actor:** Teacher

**Permission:** `quizzes.create`

#### Preconditions

* Teacher has access to the class/subject.
* Quiz data is valid.
* Questions are valid.

#### Postconditions

* Quiz is created.
* Questions are stored.
* Correct answers are stored securely.

---

### UC-QUIZ-03 — Edit Quiz

**Actor:** Teacher

**Permission:** `quizzes.edit`

#### Preconditions

* Quiz exists.
* Teacher has access.
* Quiz can still be edited.

#### Postconditions

* Quiz information is updated.

---

### UC-QUIZ-04 — Delete Quiz

**Actor:** Teacher

**Permission:** `quizzes.delete`

#### Preconditions

* Quiz exists.
* Teacher has access.
* Deletion is allowed.

#### Postconditions

* Quiz is deleted/deactivated according to business rules.

---

### UC-QUIZ-05 — Publish Quiz

**Actor:** Teacher

**Permission:** `quizzes.edit`

#### Preconditions

* Quiz exists.
* Quiz contains valid questions.
* Teacher is authorized.

#### Postconditions

* Quiz becomes available to eligible students.

---

### UC-QUIZ-06 — Take Quiz

**Actor:** Student

**Permission:** `quizzes.submit`

#### Preconditions

* Student is authenticated.
* Quiz is published.
* Quiz is currently available.
* Student belongs to the assigned class.
* Retake rules permit the attempt.

#### Main Flow

1. Student requests the quiz.
2. API verifies student authorization.
3. API returns quiz data without exposing correct answers.
4. Student submits answers.
5. API validates the submission.
6. API evaluates the answers.
7. API stores the result.

#### Postconditions

* Quiz attempt is stored.
* Result is calculated.
* Correct answers are not exposed before submission.

---

# 17. Gradebook Management

### UC-GRADEBOOK-01 — View Grades

**Actors:** Administrator, Teacher, Student

**Permission:** `gradebook.view`

#### Preconditions

* User is authenticated.
* User is authorized to access the requested grades.

#### Postconditions

* Authorized grades are returned.
* Students can only access their own grades.

---

### UC-GRADEBOOK-02 — Enter Grades

**Actor:** Teacher

**Permission:** `gradebook.create`

#### Preconditions

* Teacher is authorized for the class/subject.
* Student exists.
* Assessment exists.
* Grade value is valid.

#### Main Flow

1. Teacher submits grades.
2. API validates grade values.
3. API checks teacher authorization.
4. API stores grades.

#### Postconditions

* Grades are stored.
* Grades are associated with the correct student, class, subject, and assessment.

---

### UC-GRADEBOOK-03 — Edit Grades

**Actor:** Teacher

**Permission:** `gradebook.edit`

#### Preconditions

* Grade record exists.
* Teacher is authorized.
* Updated grade is valid.

#### Postconditions

* Grade is updated.

---

### UC-GRADEBOOK-04 — Delete Grades

**Actor:** Teacher

**Permission:** `gradebook.delete`

#### Preconditions

* Grade record exists.
* Teacher is authorized.
* Deletion is allowed by grading rules.

#### Postconditions

* Grade is deleted according to business rules.

---

### UC-GRADEBOOK-05 — Calculate Grade

**Actor:** System

#### Preconditions

* Required assessment grades exist.
* Grading rules are configured.

#### Main Flow

1. System retrieves assessment grades.
2. System applies configured weights/rules.
3. System calculates the final result.
4. System stores or returns the calculated result.

#### Postconditions

* Calculated grade is available.
* Calculation follows configured grading rules.

---

# 18. Student Progress

### UC-PROGRESS-01 — View Student Progress

**Actor:** Teacher

**Permission:** `progress.view`

#### Preconditions

* Teacher is authenticated.
* Teacher has access to the student/class.
* Academic data exists.

#### Postconditions

* Authorized progress information is returned.
* No academic data is modified.

---

# 19. Dashboard

### UC-DASHBOARD-01 — View Administrator Dashboard

**Actor:** Administrator

#### Preconditions

* Administrator is authenticated.
* Dashboard access is authorized.

#### Postconditions

* Authorized statistics and summaries are returned.

---

### UC-DASHBOARD-02 — View Teacher Dashboard

**Actor:** Teacher

#### Preconditions

* Teacher is authenticated.
* Teacher account is active.

#### Postconditions

* Relevant teaching information is returned.

---

### UC-DASHBOARD-03 — View Student Dashboard

**Actor:** Student

#### Preconditions

* Student is authenticated.
* Student account is active.

#### Postconditions

* Student's authorized academic information is returned.

---

# 20. Reports

### UC-REPORT-01 — Generate Academic Report

**Actor:** Administrator

**Permission:** `reports.view`

#### Preconditions

* Administrator is authenticated.
* Required academic data exists.
* Report filters are valid.

#### Main Flow

1. Administrator selects report type.
2. Administrator selects filters.
3. API validates authorization.
4. API retrieves authorized data.
5. System generates the report.
6. Report is returned.

#### Postconditions

* Academic report is generated.
* Source data remains unchanged.

---

### UC-REPORT-02 — Generate Attendance Report

**Actors:** Administrator, Teacher

**Permission:** `reports.view`

#### Preconditions

* User is authenticated.
* User has access to attendance data.
* Attendance records exist.

#### Postconditions

* Attendance report is generated.
* Only authorized attendance information is included.

---

# 21. Communication

### UC-COMM-01 — View Announcements

**Actors:** Administrator, Teacher, Student

**Permission:** `announcements.view`

#### Postconditions

* Authorized announcements are returned.

---

### UC-COMM-02 — Create Announcement

**Actor:** Administrator

**Permission:** `announcements.create`

#### Preconditions

* Administrator is authenticated.
* Permission is granted.
* Announcement content is valid.
* Target audience is valid.

#### Postconditions

* Announcement is stored.
* Announcement is available to the selected audience.

---

### UC-COMM-03 — Edit Announcement

**Actor:** Administrator

**Permission:** `announcements.edit`

#### Preconditions

* Announcement exists.
* Administrator is authorized.

#### Postconditions

* Announcement is updated.

---

### UC-COMM-04 — Delete Announcement

**Actor:** Administrator

**Permission:** `announcements.delete`

#### Preconditions

* Announcement exists.
* Administrator is authorized.

#### Postconditions

* Announcement is deleted/deactivated.

---

### UC-COMM-05 — View Notifications

**Actors:** Administrator, Teacher, Student

**Permission:** `notifications.view`

#### Preconditions

* User is authenticated.
* Notification belongs to the user or authorized audience.

#### Postconditions

* Authorized notifications are returned.

---

# 22. File Management

### UC-FILE-01 — Upload File

**Actors:** Teacher, Student

#### Preconditions

* User is authenticated.
* User has upload permission.
* Related resource exists.
* File type is allowed.
* File size is within configured limits.
* Storage is available.

#### Main Flow

1. User uploads a file.
2. API validates the MIME type.
3. API validates the file size.
4. API stores the file.
5. API creates the file reference.
6. API returns the file information.

#### Postconditions

* File is stored.
* File is associated with the relevant resource.
* Authorized users can access it.

#### Production Requirement

Uploaded files should be malware-scanned in production.

---

### UC-FILE-02 — View File

**Actors:** Administrator, Teacher, Student

#### Preconditions

* User is authenticated.
* User has permission to access the file.
* File exists.

#### Postconditions

* File or secure file reference is returned.
* Unauthorized users cannot access the file.

---

### UC-FILE-03 — Delete File

**Actor:** Authorized User

#### Preconditions

* User is authenticated.
* User has delete permission.
* File exists.
* User has access to the related resource.

#### Postconditions

* File is deleted according to business rules.
* File reference is no longer active.

---

# 23. API Authorization

### UC-SECURITY-01 — Authorize API Request

**Actor:** System

#### Preconditions

* API endpoint requires authentication.
* Request contains an access token.

#### Main Flow

1. API receives the request.
2. Authentication middleware validates the access token.
3. System identifies the user.
4. System retrieves the user's role.
5. System retrieves the user's permissions.
6. System checks the required permission.
7. Request is allowed or rejected.

#### Postconditions

**Authorized:**

* Request continues to the controller/service.

**Unauthorized:**

* Request is rejected.
* Protected data is not exposed.
* Protected data is not modified.

---

# 24. Password Security

### UC-SECURITY-02 — Secure Password

**Actor:** System

#### Preconditions

* User password is received during account creation or password change.

#### Main Flow

1. API receives the password.
2. Password is validated.
3. Password is hashed using the configured password hashing mechanism.
4. Only the hash is stored.
5. Plaintext password is not stored.

#### Postconditions

* Password is securely stored.
* Plaintext password is not persisted.

---

# 25. Error Handling

### UC-SYSTEM-01 — Handle API Error

**Actor:** System

#### Preconditions

* API operation is requested.
* Validation, authentication, authorization, database, or application error may occur.

#### Main Flow

1. API receives the request.
2. Error occurs.
3. Backend catches/processes the error.
4. API returns a structured error response.
5. Sensitive internal details are excluded.

#### Postconditions

* Client receives an appropriate HTTP status.
* Client receives a structured error message.
* Database remains consistent.

---

# 26. General Backend Preconditions

Most protected backend use cases require:

1. API is running.
2. Database is available.
3. User is authenticated when required.
4. User account is active.
5. Required permission is granted.
6. Required database records exist.
7. Request data passes validation.
8. Business rules are satisfied.

---

# 27. General Backend Postconditions

Successful backend operations should result in:

1. Requested operation is completed.
2. Database remains consistent.
3. Authorization rules are enforced.
4. Correct API response is returned.
5. Updated data is available for subsequent requests.
6. Sensitive information is not exposed.

Failed operations should result in:

1. Unauthorized access is prevented.
2. Invalid data is rejected.
3. Unintended database changes are avoided.
4. Structured API error is returned.
5. Sensitive internal information is not exposed.

---

# 28. Core Backend Business Rules

### BR-01 — Authentication

Only authenticated users can access protected resources.

### BR-02 — Authorization

Every protected API operation must verify the required permission.

### BR-03 — Role-Based Access

A user's role determines the permissions assigned to that user.

### BR-04 — Permission Format

Backend permissions follow:

```text
<module>.<action>
```

Supported actions:

```text
view
create
edit
delete
```

Examples:

```text
users.view
users.create
users.edit
users.delete

students.view
students.create
students.edit
students.delete

classes.view
classes.create
classes.edit
classes.delete
```

### BR-05 — Password Security

Passwords must never be stored as plaintext.

### BR-06 — Refresh Token Security

Refresh tokens must be securely hashed and stored server-side.

### BR-07 — Refresh Token Rotation

Refresh tokens should be rotated when they are used to obtain a new access token.

### BR-08 — Logout

Logout must revoke the refresh-token session.

### BR-09 — Student Privacy

Students can access only their own protected academic information.

### BR-10 — Teacher Access

Teachers can manage academic data only for classes and subjects they are authorized to teach.

### BR-11 — Quiz Security

Students must not receive `correctAnswer` before quiz submission.

### BR-12 — Grade Security

Teachers can create or edit grades only for authorized classes and subjects.

### BR-13 — Attendance Security

Teachers can manage attendance only for authorized classes.

### BR-14 — File Security

Uploaded files must satisfy configured MIME-type and size restrictions.

### BR-15 — Backend Security Boundary

Frontend permission checks are for UI/UX only.

The backend API is the final security boundary and must independently authenticate and authorize every protected request.

---

# 29. Academic Data Relationship

The main academic structure is:

```text
School
   │
   ▼
Academic Year
   │
   ▼
Term
   │
   ▼
Grade / Level
   │
   ▼
Class
   │
   ├── Students
   ├── Teachers
   └── Subjects
          │
          ▼
       Schedule
          │
          ▼
        Lessons
          │
          ├── Homework
          │
          └── Quizzes
                   │
                   ▼
              Assessments
                   │
                   ▼
                Grades
```

---

# 30. Backend Use Case Summary

```text
Authentication
├── Login
├── Refresh Token
├── Logout
└── Current User

School
├── View
└── Edit

Academic Years
├── View
├── Create
├── Edit
└── Delete

Terms
├── View
├── Create
├── Edit
└── Delete

Users
├── View
├── View Details
├── Create
├── Edit
└── Delete

Teachers
├── View
├── View Details
├── Create
├── Edit
└── Delete

Students
├── View
├── View Details
├── Create
├── Edit
└── Delete

Roles
├── View
├── Create
├── Edit
├── Delete
└── Assign Permissions

Grades / Levels
├── View
├── Create
├── Edit
└── Delete

Classes
├── View
├── View Details
├── Create
├── Edit
└── Delete

Subjects
├── View
├── Create
├── Edit
└── Delete

Schedules
├── View
├── Create
├── Edit
└── Delete

Attendance
├── View
├── Mark
└── Edit

Lessons
├── View
├── Create
├── Edit
└── Delete

Homework
├── View
├── Create
├── Edit
├── Delete
├── Submit
└── Review

Quizzes
├── View
├── Create
├── Edit
├── Delete
├── Publish
└── Take

Gradebook
├── View
├── Create
├── Edit
├── Delete
└── Calculate

Progress
└── View

Dashboard
├── Administrator
├── Teacher
└── Student

Reports
├── Academic Reports
└── Attendance Reports

Communication
├── Announcements
│   ├── View
│   ├── Create
│   ├── Edit
│   └── Delete
└── Notifications
    └── View

Files
├── Upload
├── View
└── Delete

Security
├── Authentication
├── Authorization
├── Password Security
├── Refresh Token Security
└── Error Handling
```
