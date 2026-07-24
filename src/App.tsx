import { BrowserRouter as Router, Routes, Route } from "react-router";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ERPDashboard from "./pages/CollegeERP/ERPDashboard";
import ClassesManagement from "./pages/CollegeERP/ClassesManagement";
import CampusPrint from "./pages/CollegeERP/CampusPrint";
import CRManagement from "./pages/CollegeERP/CRManagement";
import MessagesManagement from "./pages/CollegeERP/MessagesManagement";
import ResourceManagement from "./pages/CollegeERP/ResourceManagement";
import ComingSoonPage from "./pages/CollegeERP/ComingSoonPage";
import CommunicationSettings from "./pages/CollegeERP/CommunicationSettings";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<ERPDashboard />} />
            <Route path="/classes" element={<ClassesManagement />} />
            <Route path="/campus-print" element={<CampusPrint />} />
            <Route path="/cr-management" element={<CRManagement />} />
            <Route path="/messages" element={<MessagesManagement />} />
            <Route path="/communication-settings" element={<CommunicationSettings />} />
            <Route path="/resources" element={<ResourceManagement />} />
            <Route path="/coming-soon/:module" element={<ComingSoonPage />} />

            {/* Legacy Pages */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

          
          </Route>



          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
