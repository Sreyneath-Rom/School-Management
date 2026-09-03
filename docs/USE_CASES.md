# High School Management System — Use Cases

## Preconditions and Postconditions

---

# 1. Authentication

## UC-AUTH-01 — Login

**Actor:** Administrator, Teacher, Student

**Description:**
Allows a registered user to authenticate and access the system.

### Preconditions

* The user has a registered account.
* The account is active.
* The login API is available.
* The user provides valid login credentials.
* The database is available.

### Main Flow

1. User opens the login page.
2. User enters email/identifier and password.
3. System validates the input.
4. Frontend sends `POST /api/v1/auth/login`.
5. API validates the credentials.
6. API generates access and refresh tokens.
7. Frontend stores the authentication state.
8. Frontend calls `/api/v1/auth/me`.
9. System retrieves the user's role and permissions.
10. System redirects the user to the appropriate dashboard.

### Postconditions

* User is authenticated.
* A valid access token is available.
* A refresh token is stored server-side.
* User role is available.
* User permissions are available.
* User is redirected to the appropriate role dashboard.

### Alternative Flow

If credentials are invalid:

* Authentication fails.
* No authenticated session is created.
* An error message is displayed.
* User remains on the login page.

---

# 2. Refresh Authentication Session

## UC-AUTH-02 — Refresh Token

**Actor:** System

**Description:**
Allows an authenticated user to obtain a new access token when the current token expires.

### Preconditions

* User previously authenticated.
* A refresh token exists.
* Refresh token has not expired.
* Refresh token has not been revoked.
* API is available.

### Main Flow

1. User makes an API request.
2. API returns `401 Unauthorized`.
3. Frontend sends the refresh token to `/auth/refresh`.
4. API validates the refresh token.
5. API rotates the refresh token.
6. API generates a new access token.
7. Frontend updates authentication state.
8. Frontend retries the original request.

### Postconditions

* A new access token is issued.
* The previous refresh token is invalidated/rotated.
* The original API request can be retried.
* User remains authenticated.

### Alternative Flow

If the refresh token is invalid or expired:

* Session refresh fails.
* Authentication state is cleared.
* User is redirected to `/login`.

---

# 3. Logout

## UC-AUTH-03 — Logout

**Actor:** Administrator, Teacher, Student

### Preconditions

* User is authenticated.
* A valid user session exists.

### Main Flow

1. User clicks Logout.
2. Frontend calls `/auth/logout`.
3. API revokes the refresh token/session.
4. Frontend clears authentication state.
5. User is redirected to `/login`.

### Postconditions

* Refresh token is revoked.
* User session is terminated.
* Authentication state is cleared.
* Protected pages are no longer accessible.
* User is redirected to the login page.

---

# 4. School Management

## UC-SCHOOL-01 — View School Profile

**Actor:** Administrator

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
5. API retrieves school information.
6. Frontend displays the school profile.

### Postconditions

* Current school information is displayed.
* No school information is modified.

---

## UC-SCHOOL-02 — Update School Profile

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `school.edit` permission.
* School record exists.
* Submitted information passes validation.
* API and database are available.

### Main Flow

1. Administrator opens School Profile.
2. System loads current information.
3. Administrator edits the information.
4. Administrator submits the form.
5. Frontend validates the form.
6. API validates the request.
7. API updates the school record.
8. System displays a success message.

### Postconditions

* School information is updated.
* Updated information is stored in PostgreSQL.
* The frontend displays the updated information.

---

# 5. Academic Year Management

## UC-ACADEMIC-01 — Create Academic Year

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has permission to create academic years.
* Required academic year information is provided.
* Academic year does not already exist.
* API and database are available.

### Main Flow

1. Administrator opens Academic Years.
2. Administrator clicks Create.
3. Administrator enters academic year information.
4. System validates the information.
5. API creates the academic year.
6. System refreshes the academic year list.

### Postconditions

* A new academic year exists.
* Academic year information is stored in the database.
* The new academic year appears in the academic year list.

---

## UC-ACADEMIC-02 — Edit Academic Year

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has edit permission.
* Academic year exists.
* Submitted information is valid.

### Postconditions

* Academic year information is updated.
* Updated information is stored in the database.
* Changes are reflected in the frontend.

---

## UC-ACADEMIC-03 — Delete Academic Year

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has delete permission.
* Academic year exists.
* Academic year is not protected by active dependent records, or deletion rules allow the operation.

### Main Flow

1. Administrator selects an academic year.
2. Administrator clicks Delete.
3. System asks for confirmation.
4. Administrator confirms.
5. API validates authorization and dependencies.
6. Academic year is deleted or deactivated.

### Postconditions

* Academic year is no longer available as an active record.
* Related data remains consistent.
* Academic year list is refreshed.

---

# 6. Term Management

## UC-TERM-01 — Manage Terms

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has term management permission.
* Academic year exists.
* Term information is valid.

### Main Flow

1. Administrator opens Terms.
2. Administrator creates or edits a term.
3. Administrator provides:

   * Name
   * Academic year
   * Start date
   * End date
   * Status
4. System validates the data.
5. API saves the term.

### Postconditions

* Term is created or updated.
* Term belongs to the selected academic year.
* Term dates and status are stored.
* Updated term appears in the term list.

---

# 7. User Management

## UC-USER-01 — Create User

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `users.create`.
* Required user information is provided.
* Email/identifier is not already used.
* Selected role exists.

### Main Flow

1. Administrator opens Users.
2. Clicks Create User.
3. Enters user information.
4. Selects a role.
5. System validates the form.
6. API creates the user.
7. Password is securely hashed.
8. User is returned to the frontend.

### Postconditions

* User account is created.
* Password is stored securely as a hash.
* User is assigned a role.
* User can authenticate if the account is active.

---

## UC-USER-02 — Edit User

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `users.edit`.
* Target user exists.
* Submitted information is valid.

### Postconditions

* User information is updated.
* Updated role/status is stored if changed.
* Frontend displays the updated user.

---

## UC-USER-03 — Delete User

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has `users.delete`.
* Target user exists.
* User is allowed to be deleted/deactivated.

### Postconditions

* User is deleted or deactivated according to business rules.
* User can no longer access the system if deactivated.
* Related records remain consistent.

---

# 8. Teacher Management

## UC-TEACHER-01 — Manage Teachers

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has teacher/user management permission.
* Teacher account information is valid.

### Main Flow

1. Administrator opens Teachers.
2. Administrator creates, edits, views, or deactivates a teacher.
3. System validates the request.
4. API processes the operation.
5. Database is updated.

### Postconditions

* Teacher information is created or updated.
* Teacher account status is correct.
* Teacher can be assigned to permitted academic entities.

---

# 9. Student Management

## UC-STUDENT-01 — Manage Students

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has student management permission.
* Student information is valid.
* Required class/academic information exists if enrollment is being performed.

### Postconditions

* Student record is created or updated.
* Student can be assigned to a class.
* Student information is available to authorized users.

---

# 10. Roles & Permissions

## UC-RBAC-01 — Manage Roles

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has role management permission.
* Role information is valid.

### Postconditions

* Role is created, updated, or deleted according to system rules.
* Role information is stored in the database.

---

## UC-RBAC-02 — Assign Permissions

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has permission to manage roles.
* Target role exists.
* Selected permissions exist in the permission catalog.

### Main Flow

1. Administrator selects a role.
2. System loads current permissions.
3. Administrator changes permissions.
4. Administrator saves changes.
5. API validates permissions.
6. API replaces the role's permission set.

### Postconditions

* Role has the selected permissions.
* Removed permissions are no longer assigned.
* Added permissions become effective immediately.
* Future requests use the updated permission set.

---

# 11. Grade / Level Management

## UC-GRADE-01 — Manage Grades / Levels

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has grade/level management permission.
* Grade/level information is valid.

### Postconditions

* Grade/level is created, updated, or deleted.
* Academic structure remains consistent.
* Grade/level can be associated with classes.

---

# 12. Class Management

## UC-CLASS-01 — Manage Classes

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has class management permission.
* Academic year exists.
* Grade/level exists.
* Class information is valid.

### Main Flow

1. Administrator opens Classes.
2. Administrator creates or edits a class.
3. Administrator selects the academic year and grade.
4. Administrator assigns teachers/students where applicable.
5. System validates the request.
6. API saves the class.

### Postconditions

* Class exists under the correct academic structure.
* Assigned students and teachers are stored.
* Class can be used for schedules, lessons, attendance, homework, and quizzes.

---

# 13. Subject Management

## UC-SUBJECT-01 — Manage Subjects

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has subject management permission.
* Subject information is valid.

### Postconditions

* Subject is created, updated, or deleted.
* Subject can be assigned to classes and teachers.
* Subject is available for schedules and academic activities.

---

# 14. Schedule Management

## UC-SCHEDULE-01 — Manage Schedule

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has schedule management permission.
* Class exists.
* Subject exists.
* Teacher exists if required.
* Schedule information is valid.
* No conflicting schedule exists, according to business rules.

### Main Flow

1. Administrator selects a class.
2. Administrator selects a subject.
3. Administrator selects a teacher.
4. Administrator selects day/time/room.
5. System validates the schedule.
6. API stores the schedule.

### Postconditions

* Schedule is stored.
* Class timetable is updated.
* Teacher timetable is updated.
* Students can view the timetable if authorized.

---

# 15. Attendance Management

## UC-ATTENDANCE-01 — Mark Attendance

**Actor:** Teacher

### Preconditions

* Teacher is authenticated.
* Teacher has `attendance.create` or equivalent permission.
* Teacher is assigned to the selected class.
* Class exists.
* Students are enrolled in the class.
* Attendance date is valid.
* Attendance records have not already been finalized for the same session, unless editing is allowed.

### Main Flow

1. Teacher opens Attendance.
2. Teacher selects class.
3. Teacher selects date/session.
4. System loads enrolled students.
5. Teacher marks each student:

   * Present
   * Absent
   * Late
   * Permission
6. Teacher submits attendance.
7. API validates authorization.
8. API saves attendance.

### Postconditions

* Attendance records are stored.
* Each enrolled student has an attendance status for the session.
* Attendance information is available to authorized users.

---

## UC-ATTENDANCE-02 — View Attendance

**Actors:** Administrator, Teacher, Student

### Preconditions

**Administrator:**

* Authenticated.
* Has attendance view permission.

**Teacher:**

* Authenticated.
* Has attendance view permission.
* Has access to the selected class.

**Student:**

* Authenticated.
* Has attendance view permission.
* Student is viewing their own attendance.

### Postconditions

* Authorized attendance information is displayed.
* No attendance information is modified.

---

# 16. Lesson Management

## UC-LESSON-01 — Create Lesson

**Actor:** Teacher

### Preconditions

* Teacher is authenticated.
* Teacher has lesson creation permission.
* Teacher is assigned to the selected class/subject.
* Class exists.
* Subject exists.
* Lesson information is valid.

### Main Flow

1. Teacher opens Lessons.
2. Teacher clicks Create Lesson.
3. Teacher selects class and subject.
4. Teacher enters lesson content.
5. Teacher adds materials if required.
6. Teacher saves the lesson.
7. API validates and stores the lesson.

### Postconditions

* Lesson is stored.
* Lesson is associated with the correct class and subject.
* Authorized students can view the lesson if published/available.

---

## UC-LESSON-02 — View Lessons

**Actors:** Teacher, Student

### Preconditions

**Teacher:**

* Authenticated.
* Has lesson view permission.
* Has access to the lesson.

**Student:**

* Authenticated.
* Enrolled in the relevant class.
* Lesson is available to students.

### Postconditions

* Authorized lesson content is displayed.
* Lesson data is not modified.

---

# 17. Homework

## UC-HOMEWORK-01 — Create Homework

**Actor:** Teacher

### Preconditions

* Teacher is authenticated.
* Teacher has homework creation permission.
* Teacher is assigned to the class/subject.
* Class exists.
* Subject exists.
* Due date is valid.
* Homework information is valid.

### Postconditions

* Homework is created.
* Homework is associated with the correct class and subject.
* Homework status is stored.
* Students can access it when published.

---

## UC-HOMEWORK-02 — Submit Homework

**Actor:** Student

### Preconditions

* Student is authenticated.
* Student has homework submission permission.
* Homework exists.
* Homework is published.
* Student belongs to the assigned class.
* Submission deadline has not passed, or late submissions are allowed.

### Main Flow

1. Student opens Homework.
2. Student selects an assignment.
3. Student enters an answer or uploads required files.
4. Student submits the assignment.
5. API validates the submission.
6. Submission is stored.

### Postconditions

* Student submission is stored.
* Submission is associated with the correct student and homework.
* Submission status is updated.
* Teacher can review the submission.

---

## UC-HOMEWORK-03 — Review Homework

**Actor:** Teacher

### Preconditions

* Teacher is authenticated.
* Teacher has homework review permission.
* Homework exists.
* Teacher is assigned to the relevant class/subject.
* Student submission exists.

### Postconditions

* Submission is reviewed.
* Teacher feedback is stored if provided.
* Grade is stored if provided.
* Student can view the permitted feedback/result.

---

# 18. Quiz & Test Management

## UC-QUIZ-01 — Create Quiz

**Actor:** Teacher

### Preconditions

* Teacher is authenticated.
* Teacher has quiz creation permission.
* Teacher is assigned to the relevant class/subject.
* Class exists.
* Subject exists.
* Questions are valid.
* Quiz duration/schedule is valid.

### Postconditions

* Quiz is created.
* Questions are stored.
* Correct answers are securely stored.
* Quiz is associated with the correct class and subject.
* Quiz can be published.

---

## UC-QUIZ-02 — Publish Quiz

**Actor:** Teacher

### Preconditions

* Teacher is authenticated.
* Teacher has quiz edit/publish permission.
* Quiz exists.
* Quiz contains valid questions.
* Quiz is ready for publication.

### Postconditions

* Quiz status becomes published/available.
* Eligible students can access the quiz.
* Quiz remains protected from unauthorized users.

---

## UC-QUIZ-03 — Take Quiz

**Actor:** Student

### Preconditions

* Student is authenticated.
* Student has quiz-taking permission.
* Quiz is published.
* Quiz is available at the current date/time.
* Student belongs to the assigned class.
* Student has not already submitted the quiz, unless retakes are allowed.

### Main Flow

1. Student opens the quiz.
2. API returns student-safe quiz data.
3. Student answers questions.
4. Student submits the quiz.
5. API validates the submission.
6. System evaluates the answers.
7. System calculates the result.

### Postconditions

* Student's quiz submission is stored.
* Quiz result is calculated.
* Correct answers are not exposed before submission.
* Student can view the permitted result.

---

# 19. Grade Management

## UC-GRADEBOOK-01 — Enter Grades

**Actor:** Teacher

### Preconditions

* Teacher is authenticated.
* Teacher has grade creation/edit permission.
* Teacher is assigned to the relevant class/subject.
* Student exists.
* Assessment exists.
* Grade value is within the allowed range.

### Main Flow

1. Teacher selects class.
2. Teacher selects subject.
3. Teacher selects assessment type.
4. System loads students.
5. Teacher enters grades.
6. System validates grade values.
7. Teacher submits.
8. API saves grades.

### Postconditions

* Grades are stored.
* Grades are associated with the correct student, subject, class, and assessment.
* Students can view grades when published/authorized.

---

## UC-GRADEBOOK-02 — Calculate Grade

**Actor:** System

### Preconditions

* Required assessment grades exist.
* Grading rules are configured.
* Student and subject records are valid.

### Main Flow

1. System retrieves assessment scores.
2. System applies configured weights/rules.
3. System calculates the result.
4. System stores or returns the calculated result.

### Postconditions

* Final/calculated grade is available.
* Calculation is based on the configured grading rules.
* Result can be displayed in reports or student records.

---

## UC-GRADEBOOK-03 — View Grades

**Actors:** Administrator, Teacher, Student

### Preconditions

**Administrator:**

* Authenticated.
* Has grade view permission.

**Teacher:**

* Authenticated.
* Has grade view permission.
* Has access to the relevant class/subject.

**Student:**

* Authenticated.
* Has grade view permission.
* Is viewing their own grades.

### Postconditions

* Authorized grade information is displayed.
* No grade data is modified.

---

# 20. Student Progress

## UC-PROGRESS-01 — View Student Progress

**Actor:** Teacher

### Preconditions

* Teacher is authenticated.
* Teacher has student progress permission.
* Teacher has access to the selected student/class.
* Student has academic data.

### Postconditions

* Authorized progress information is displayed.
* Teacher can review academic performance.
* No student academic data is modified.

---

# 21. Dashboard

## UC-DASHBOARD-01 — Administrator Dashboard

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has dashboard access.
* Required dashboard API endpoints are available.

### Postconditions

* Administrator dashboard is displayed.
* Authorized statistics and summaries are shown.
* No underlying data is modified.

---

## UC-DASHBOARD-02 — Teacher Dashboard

**Actor:** Teacher

### Preconditions

* Teacher is authenticated.
* Teacher has dashboard access.
* Teacher has assigned classes or teaching activities.

### Postconditions

* Teacher dashboard is displayed.
* Teacher sees relevant classes, tasks, attendance, and academic information.

---

## UC-DASHBOARD-03 — Student Dashboard

**Actor:** Student

### Preconditions

* Student is authenticated.
* Student has dashboard access.
* Student has an active student profile.

### Postconditions

* Student dashboard is displayed.
* Student sees their authorized classes, timetable, homework, quizzes, grades, and attendance.

---

# 22. Reports

## UC-REPORT-01 — Generate Academic Report

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has report permission.
* Required academic data exists.
* Selected report filters are valid.

### Main Flow

1. Administrator opens Reports.
2. Selects report type.
3. Selects academic year/term/class/student as required.
4. System retrieves authorized data.
5. System generates the report.
6. Report is displayed or exported.

### Postconditions

* Academic report is generated.
* Report contains authorized academic information.
* No source academic records are modified.

---

## UC-REPORT-02 — Generate Attendance Report

**Actors:** Administrator, Teacher

### Preconditions

* User is authenticated.
* User has attendance report permission.
* User has access to the selected data.
* Attendance records exist.

### Postconditions

* Attendance report is generated.
* Report contains only authorized attendance data.
* Original attendance records remain unchanged.

---

# 23. Communication

## UC-COMM-01 — Create Announcement

**Actor:** Administrator

### Preconditions

* Administrator is authenticated.
* Administrator has announcement creation permission.
* Announcement content is valid.
* Target audience is valid.

### Postconditions

* Announcement is stored.
* Announcement is available to the selected audience.
* Relevant users can receive/view the announcement.

---

## UC-COMM-02 — View Notification

**Actors:** Administrator, Teacher, Student

### Preconditions

* User is authenticated.
* User has notification view permission.
* Notification belongs to the user or their authorized audience.

### Postconditions

* Notification is displayed.
* Notification read status may be updated if supported.
* Unauthorized notifications remain inaccessible.

---

# 24. File Upload

## UC-FILE-01 — Upload File

**Actors:** Teacher, Student

### Preconditions

* User is authenticated.
* User has permission to upload files.
* User has access to the related lesson/homework.
* File exists.
* File type is allowed.
* File size is within the configured limit.
* Upload storage is available.

### Main Flow

1. User selects a file.
2. Frontend sends the file to the API.
3. API validates MIME type.
4. API validates file size.
5. API stores the file.
6. API returns the file reference.

### Postconditions

* File is stored successfully.
* File is associated with the relevant lesson/homework/submission.
* Authorized users can access the file.

### Production Requirement

File contents should be scanned for malware before being accepted in production.

---

# 25. Permission Enforcement

## UC-SECURITY-01 — Authorize API Request

**Actor:** System

### Preconditions

* API endpoint requires authentication.
* Request contains an access token.
* User account exists.

### Main Flow

1. API receives request.
2. Authentication middleware validates the token.
3. System identifies the user.
4. System retrieves the user's role.
5. System loads permissions.
6. System checks required permission.
7. Request is allowed or rejected.

### Postconditions

**If authorized:**

* Request proceeds to the route/service.

**If unauthorized:**

* Request is rejected.
* Protected data is not modified or exposed.

---

# 26. Error Handling

## UC-SYSTEM-01 — Handle Failed Request

**Actor:** System

### Preconditions

* A user or system operation has been initiated.
* API or database processing may fail.

### Main Flow

1. Request is received.
2. Error occurs during validation, authorization, database access, or processing.
3. Backend handles the error.
4. API returns a structured error response.
5. Frontend displays a friendly error message.

### Postconditions

* User receives an understandable error message.
* Sensitive internal error details are not exposed.
* System remains available where possible.
* Failed operations do not leave inconsistent data.

---

# 27. Use Case Relationship Summary

```text id="4cq7jv"
                    Authentication
                          │
                          ▼
                Role & Permission Check
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
       Admin           Teacher          Student
          │               │               │
          ▼               ▼               ▼
       School          Classes          Classes
       Users           Lessons          Timetable
       Roles           Homework         Lessons
       Classes         Quizzes          Homework
       Subjects        Attendance        Quizzes
       Schedules       Grades            Grades
       Reports         Progress          Attendance
       Reports
```

---

# 28. General Preconditions

Most protected system use cases require:

1. User is authenticated.
2. User account is active.
3. Required permission exists.
4. Required database records exist.
5. Request data passes validation.
6. API is available.
7. Database is available.

---

# 29. General Postconditions

Successful operations should generally result in:

1. Requested data is created, updated, retrieved, or deleted.
2. Database remains consistent.
3. Authorization rules remain enforced.
4. Frontend receives a successful API response.
5. User receives appropriate feedback.
6. Updated data is reflected in subsequent requests.

Failed operations should generally result in:

1. No unauthorized data access.
2. No unintended database changes.
3. A structured API error.
4. A user-friendly frontend error message.
5. System remains in a consistent state.

---

# 30. Core Business Rules

## BR-01 — Authentication

Only authenticated users can access protected resources.

## BR-02 — Authorization

Every protected API operation must verify the user's permission.

## BR-03 — Role

A user's role determines the permissions available to that user.

## BR-04 — Password Security

Passwords must never be stored as plaintext.

## BR-05 — Refresh Token Security

Refresh tokens must be hashed and stored server-side.

## BR-06 — Quiz Security

Students must never receive `correctAnswer` before quiz submission.

## BR-07 — Attendance

Teachers may only manage attendance for classes they are authorized to teach.

## BR-08 — Grades

Teachers may only manage grades for authorized classes and subjects.

## BR-09 — Student Privacy

Students may access only their own academic information.

## BR-10 — File Upload

Uploaded files must comply with configured file type and size restrictions.

## BR-11 — Academic Structure

Academic records should follow:

```text id="8upn9m"
School
 ↓
Academic Year
 ↓
Term
 ↓
Grade / Level
 ↓
Class
 ↓
Subject
 ↓
Schedule
 ↓
Lesson
 ↓
Homework / Quiz
 ↓
Assessment
 ↓
Grade
```

## BR-12 — Backend Security

Frontend permission checks are for user experience only. Backend authorization is the final security boundary.
