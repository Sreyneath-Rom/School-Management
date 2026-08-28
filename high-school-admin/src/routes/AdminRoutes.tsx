// src/routes/AdminRoutes.tsx
import { Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import AppLayout from "@/layouts/AppLayout";

// Setup
import Dashboard from "@/pages/Dashboard/Dashboard";
import SchoolSetup from "@/pages/Setup/SchoolSetup";
import AcademicYears from "@/pages/Setup/AcademicYears";
import Terms from "@/pages/Setup/Terms";
import Subjects from "@/pages/Setup/Subjects";
import Rooms from "@/pages/Setup/Rooms";
import Roles from "@/pages/Setup/Roles";
import Users from "@/pages/Setup/Users";
import TranslationManager from "@/pages/Setup/TranslationManager";

// Academic
import Classes from "@/pages/Academic/Classes";
import ClassSubjects from "@/pages/Academic/ClassSubjects";
import Schedules from "@/pages/Setup/Schedules";
import Lessons from "@/pages/Academic/Lessons";
import Homework from "@/pages/Academic/Homework";
import Quizzes from "@/pages/Academic/Quizzes";
import Grades from "@/pages/Academic/Grades";

// Exams
import ExamList from "@/pages/Exams/ExamList";
import ExamForm from "@/pages/Exams/ExamForm";
import ExamSchedules from "@/pages/Exams/ExamSchedules";
import MarkEntry from "@/pages/Exams/MarkEntry";
import ReportCard from "@/pages/Exams/ReportCard";

// Students
import StudentList from "@/pages/Students/StudentList";
import StudentProfiles from "@/pages/Students/StudentProfiles";
import Attendance from "@/pages/Students/Attendance";
import LeaveRequests from "@/pages/Students/LeaveRequests";

// Teachers
import TeacherList from "@/pages/Teachers/TeacherList";
import TeacherProfiles from "@/pages/Teachers/TeacherProfiles";
import TeacherAssignments from "@/pages/Teachers/TeacherAssignments";
import TeacherAttendance from "@/pages/Teachers/TeacherAttendance";

// Fees & Finance
import FeeStructure from "@/pages/Fees/FeeStructure";
import Invoices from "@/pages/Fees/Invoices";
import Payments from "@/pages/Fees/Payments";
import PaymentHistory from "@/pages/Fees/PaymentHistory";

// Library
import BookList from "@/pages/Library/BookList";
import LibraryCategories from "@/pages/Library/LibraryCategories";
import BorrowForm from "@/pages/Library/BorrowForm";
import ReturnForm from "@/pages/Library/ReturnForm";
import OverdueBooks from "@/pages/Library/OverdueBooks";

// Transport
import RoutesList from "@/pages/Transport/RoutesList";
import Vehicles from "@/pages/Transport/Vehicles";
import Drivers from "@/pages/Transport/Drivers";
import TransportAssignments from "@/pages/Transport/TransportAssignments";

// Hostel
import HostelRooms from "@/pages/Hostel/HostelRooms";
import RoomAllocation from "@/pages/Hostel/RoomAllocation";
import HostelFees from "@/pages/Hostel/HostelFees";

// Inventory
import ItemCategories from "@/pages/Inventory/ItemCategories";
import InventoryItems from "@/pages/Inventory/InventoryItems";
import ItemIssuance from "@/pages/Inventory/ItemIssuance";
import Suppliers from "@/pages/Inventory/Suppliers";

// Calendar
import CalendarView from "@/pages/Calendar/CalendarView";
import EventForm from "@/pages/Calendar/EventForm";

// Communication & Messages
import AnnouncementsPage from "@/pages/Communication/Announcements";
import Notifications from "@/pages/Communication/Notifications";
import Inbox from "@/pages/Messages/Inbox";
import Conversation from "@/pages/Messages/Conversation";

// Reports
import AttendanceReport from "@/pages/Reports/AttendanceReport";
import GradeReport from "@/pages/Reports/GradeReport";
import StudentReport from "@/pages/Reports/StudentReport";
import TeacherReport from "@/pages/Reports/TeacherReport";

// System
import AuditLogs from "@/pages/System/AuditLogs";

export const adminRoutes = (): ReactElement => (
  <Route element={<AppLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />

    {/* Setup */}
    <Route path="/setup/school" element={<SchoolSetup />} />
    <Route path="/setup/academic-years" element={<AcademicYears />} />
    <Route path="/setup/terms" element={<Terms />} />
    <Route path="/setup/subjects" element={<Subjects />} />
    <Route path="/setup/rooms" element={<Rooms />} />
    <Route path="/setup/roles" element={<Roles />} />
    <Route path="/setup/users" element={<Users />} />
    <Route path="/setup/translations" element={<TranslationManager />} />

    {/* Academic */}
    <Route path="/academic/classes" element={<Classes />} />
    <Route path="/academic/class-subjects" element={<ClassSubjects />} />
    <Route path="/academic/schedules" element={<Schedules />} />
    <Route path="/academic/lessons" element={<Lessons />} />
    <Route path="/academic/homework" element={<Homework />} />
    <Route path="/academic/quizzes" element={<Quizzes />} />
    <Route path="/academic/grades" element={<Grades />} />

    {/* Exams */}
    <Route path="/academic/exams" element={<ExamList />} />
    <Route path="/academic/exams/create" element={<ExamForm />} />
    <Route path="/academic/exams/:id/edit" element={<ExamForm />} />
    <Route path="/academic/exam-schedules" element={<ExamSchedules />} />
    <Route path="/academic/mark-entry" element={<MarkEntry />} />
    <Route path="/academic/exams/:id/marks" element={<MarkEntry />} />
    <Route path="/academic/report-cards" element={<ReportCard />} />

    {/* Students */}
    <Route path="/students" element={<StudentList />} />
    <Route path="/students/profiles" element={<StudentProfiles />} />
    <Route path="/students/attendance" element={<Attendance />} />
    <Route path="/students/leave-requests" element={<LeaveRequests />} />

    {/* Teachers */}
    <Route path="/teachers" element={<TeacherList />} />
    <Route path="/teachers/profiles" element={<TeacherProfiles />} />
    <Route path="/teachers/assignments" element={<TeacherAssignments />} />
    <Route path="/teachers/attendance" element={<TeacherAttendance />} />

    {/* Fees */}
    <Route path="/fees/structures" element={<FeeStructure />} />
    <Route path="/fees/invoices" element={<Invoices />} />
    <Route path="/fees/payments" element={<Payments />} />
    <Route path="/fees/history" element={<PaymentHistory />} />

    {/* Library */}
    <Route path="/library/books" element={<BookList />} />
    <Route path="/library/categories" element={<LibraryCategories />} />
    <Route path="/library/borrow" element={<BorrowForm />} />
    <Route path="/library/returns" element={<ReturnForm />} />
    <Route path="/library/overdue" element={<OverdueBooks />} />

    {/* Transport */}
    <Route path="/transport/routes" element={<RoutesList />} />
    <Route path="/transport/vehicles" element={<Vehicles />} />
    <Route path="/transport/drivers" element={<Drivers />} />
    <Route path="/transport/assignments" element={<TransportAssignments />} />

    {/* Hostel */}
    <Route path="/hostel/rooms" element={<HostelRooms />} />
    <Route path="/hostel/allocation" element={<RoomAllocation />} />
    <Route path="/hostel/fees" element={<HostelFees />} />

    {/* Inventory */}
    <Route path="/inventory/categories" element={<ItemCategories />} />
    <Route path="/inventory/items" element={<InventoryItems />} />
    <Route path="/inventory/issuance" element={<ItemIssuance />} />
    <Route path="/inventory/suppliers" element={<Suppliers />} />

    {/* Calendar */}
    <Route path="/calendar" element={<CalendarView />} />
    <Route path="/calendar/events" element={<CalendarView />} />
    <Route path="/calendar/events/create" element={<EventForm />} />
    <Route path="/calendar/events/:id/edit" element={<EventForm />} />
    <Route path="/calendar/holidays" element={<CalendarView />} />

    {/* Messages */}
    <Route path="/messages" element={<Inbox />} />
    <Route path="/messages/:id" element={<Conversation />} />

    {/* Communication */}
    <Route path="/communication/announcements" element={<AnnouncementsPage />} />
    <Route path="/communication/notifications" element={<Notifications />} />

    {/* Reports */}
    <Route path="/reports/attendance" element={<AttendanceReport />} />
    <Route path="/reports/academic" element={<GradeReport />} />
    <Route path="/reports/grades" element={<GradeReport />} />
    <Route path="/reports/students" element={<StudentReport />} />
    <Route path="/reports/teachers" element={<TeacherReport />} />
    <Route path="/reports/finance" element={<Invoices />} />
    <Route path="/reports/library" element={<BookList />} />

    {/* System */}
    <Route path="/system/logs" element={<AuditLogs />} />
    <Route path="/system/activity" element={<AuditLogs />} />
    <Route path="/system/settings" element={<SchoolSetup />} />

    {/* Fallback */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Route>
);