import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import RecruitmentPage from './pages/RecruitmentPage';
import ContactPage from './pages/ContactPage';
import TeamPage from './pages/TeamPage';
import ComplianceFirstPage from './pages/ComplianceFirstPage';
import TailoredSolutionsPage from './pages/TailoredSolutionsPage';
import GamePage from './pages/GamePage';
import PublicLayout from './components/PublicLayout';
import HrLayout from './pages/hr/HrLayout';
import EmployeesPage from './pages/hr/EmployeesPage';
import EmployeeDetailPage from './pages/hr/EmployeeDetailPage';
import JobRolesPage from './pages/hr/JobRolesPage';
import ContactMessagesPage from './pages/hr/ContactMessagesPage';
import QuickLeaveMarkPage from './pages/hr/QuickLeaveMarkPage';
import TasksPage from './pages/hr/TasksPage';
import HrEmployeeTasksPage from './pages/hr/HrEmployeeTasksPage';
import HrEmployeeSalaryPage from './pages/hr/HrEmployeeSalaryPage';
import HrEmployeePayslipsPage from './pages/hr/HrEmployeePayslipsPage';
import EmployeeDashboardPage from './pages/employee/EmployeeDashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';

function RootComponent() {
  return (
    <>
      <ProfileSetupDialog />
      <Outlet />
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: PublicLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/about',
  component: AboutPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/services',
  component: ServicesPage,
});

const serviceDetailRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/services/$slug',
  component: ServiceDetailPage,
});

const recruitmentRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/recruitment',
  component: RecruitmentPage,
});

const contactRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/contact',
  component: ContactPage,
});

const teamRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/team',
  component: TeamPage,
});

const complianceFirstRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/compliance-first',
  component: ComplianceFirstPage,
});

const tailoredSolutionsRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/tailored-solutions',
  component: TailoredSolutionsPage,
});

const gameRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/game',
  component: GamePage,
});

const employeeDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employee-dashboard',
  component: () => (
    <ProtectedRoute>
      <EmployeeDashboardPage />
    </ProtectedRoute>
  ),
});

const hrRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hr',
  component: () => (
    <AdminProtectedRoute>
      <HrLayout />
    </AdminProtectedRoute>
  ),
});

const hrEmployeesRoute = createRoute({
  getParentRoute: () => hrRoute,
  path: '/employees',
  component: EmployeesPage,
});

const hrEmployeeDetailRoute = createRoute({
  getParentRoute: () => hrRoute,
  path: '/employees/$employeeId',
  component: EmployeeDetailPage,
});

const hrEmployeeTasksRoute = createRoute({
  getParentRoute: () => hrRoute,
  path: '/employees/$employeeId/tasks',
  component: HrEmployeeTasksPage,
});

const hrEmployeeSalaryRoute = createRoute({
  getParentRoute: () => hrRoute,
  path: '/employees/$employeeId/salary',
  component: HrEmployeeSalaryPage,
});

const hrEmployeePayslipsRoute = createRoute({
  getParentRoute: () => hrRoute,
  path: '/employees/$employeeId/payslips',
  component: HrEmployeePayslipsPage,
});

const hrJobRolesRoute = createRoute({
  getParentRoute: () => hrRoute,
  path: '/job-roles',
  component: JobRolesPage,
});

const hrContactMessagesRoute = createRoute({
  getParentRoute: () => hrRoute,
  path: '/contact-messages',
  component: ContactMessagesPage,
});

const hrQuickLeaveMarkRoute = createRoute({
  getParentRoute: () => hrRoute,
  path: '/quick-leave',
  component: QuickLeaveMarkPage,
});

const hrTasksRoute = createRoute({
  getParentRoute: () => hrRoute,
  path: '/tasks',
  component: TasksPage,
});

const routeTree = rootRoute.addChildren([
  publicRoute.addChildren([
    homeRoute,
    aboutRoute,
    servicesRoute,
    serviceDetailRoute,
    recruitmentRoute,
    contactRoute,
    teamRoute,
    complianceFirstRoute,
    tailoredSolutionsRoute,
    gameRoute,
  ]),
  employeeDashboardRoute,
  hrRoute.addChildren([
    hrEmployeesRoute,
    hrEmployeeDetailRoute,
    hrEmployeeTasksRoute,
    hrEmployeeSalaryRoute,
    hrEmployeePayslipsRoute,
    hrJobRolesRoute,
    hrContactMessagesRoute,
    hrQuickLeaveMarkRoute,
    hrTasksRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
