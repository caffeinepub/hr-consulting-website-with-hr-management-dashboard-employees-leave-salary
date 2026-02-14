import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Users, Briefcase, Mail, LogOut, CalendarCheck, ListTodo, UserCircle } from 'lucide-react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import MobileMenuToggleIcon from '@/components/nav/MobileMenuToggleIcon';

export default function HrLayout() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const hrMenuItems = [
    { to: '/hr/employees', label: 'Employees', icon: Users },
    { to: '/hr/tasks', label: 'Tasks', icon: ListTodo },
    { to: '/hr/job-roles', label: 'Job Roles', icon: Briefcase },
    { to: '/hr/contact-messages', label: 'Contact Messages', icon: Mail },
    { to: '/hr/quick-leave', label: 'Quick Leave Mark', icon: CalendarCheck },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden" style={{ backgroundColor: '#131E3A' }}>
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Toggle menu">
              <MobileMenuToggleIcon open={menuOpen} />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-64 flex flex-col p-0 max-h-screen overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <h2 className="text-lg font-bold px-4 py-4 mb-2">HR Dashboard</h2>
              <nav className="flex flex-col gap-2">
                {hrMenuItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-semibold px-4 py-2 text-muted-foreground">Employee</h3>
                <Link
                  to="/employee-dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserCircle className="h-5 w-5" />
                  <span>Employee Dashboard</span>
                </Link>
              </div>
            </div>
            <div className="shrink-0 p-4 border-t border-border bg-background">
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: '/' })}
          >
            Back to Site
          </Button>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 w-full min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
