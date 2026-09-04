// src/routes/ParentRoutes.tsx
import type { ReactElement } from "react";
import { Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";

import ParentDashboard from "@/pages/Parent/Dashboard";
import Children from "@/pages/Parent/Children";
import ChildDetails from "@/pages/Parent/ChildDetails";
import Inbox from "@/pages/Messages/Inbox";
import Conversation from "@/pages/Messages/Conversation";
import AnnouncementsPage from "@/pages/Communication/Announcements";
import Notifications from "@/pages/Communication/Notifications";

export const parentRoutes = (): ReactElement => (
  <Route element={<AppLayout />}>
    <Route path="/parent/dashboard" element={<ParentDashboard />} />
    <Route path="/parent/children" element={<Children />} />
    <Route path="/parent/children/:id" element={<ChildDetails />} />
    <Route path="/parent/announcements" element={<AnnouncementsPage />} />
    <Route path="/parent/notifications" element={<Notifications />} />
    <Route path="/parent/messages" element={<Inbox />} />
    <Route path="/parent/messages/:id" element={<Conversation />} />
  </Route>
);