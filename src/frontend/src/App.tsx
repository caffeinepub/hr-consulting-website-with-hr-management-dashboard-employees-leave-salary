import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import RecruitmentPage from './pages/RecruitmentPage';
import ContactPage from './pages/ContactPage';
import PublicLayout from './components/PublicLayout';
import HrLayout from './pages/hr/HrLayout';
import EmployeesPage from './pages/hr/EmployeesPage';
import EmployeeDetailPage from './pages/hr/EmployeeDetailPage';
import JobRolesPage from './pages/hr/JobRolesPage';
import ContactMessagesPage from './pages/hr/ContactMessagesPage';
import QuickLeaveMarkPage from './pages/hr/QuickLeaveMarkPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
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

const hrRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hr',
  component: () => (
    <ProtectedRoute>
      <HrLayout />
    </ProtectedRoute>
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

const routeTree = rootRoute.addChildren([
  publicRoute.addChildren([
    homeRoute,
    aboutRoute,
    servicesRoute,
    serviceDetailRoute,
    recruitmentRoute,
    contactRoute,
  ]),
  hrRoute.addChildren([
    hrEmployeesRoute,
    hrEmployeeDetailRoute,
    hrJobRolesRoute,
    hrContactMessagesRoute,
    hrQuickLeaveMarkRoute,
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
