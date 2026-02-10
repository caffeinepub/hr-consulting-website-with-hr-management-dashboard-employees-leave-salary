import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Heart } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './auth/LoginButton';
import { scrollToSection, getSectionIdFromPath } from '@/utils/scrollToSection';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', sectionId: 'home' },
    { to: '/about', label: 'About Us', sectionId: 'about' },
    { to: '/services', label: 'Services', sectionId: 'services' },
    { to: '/recruitment', label: 'Recruitment', sectionId: 'recruitment' },
    { to: '/contact', label: 'Contact', sectionId: 'contact' },
  ];

  const handleNavClick = (e: React.MouseEvent, sectionId: string, path: string) => {
    e.preventDefault();
    
    // Close mobile menu if open
    setMobileMenuOpen(false);

    // If we're on the home page, just scroll
    if (location.pathname === '/') {
      scrollToSection(sectionId);
      window.history.pushState({}, '', `#${sectionId}`);
    } else {
      // Navigate to home page with hash
      navigate({ to: '/' }).then(() => {
        // Small delay to ensure page is rendered
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 100);
      });
      window.history.pushState({}, '', `/#${sectionId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/hr-logo.dim_512x512.png"
              alt="HR Consulting Logo"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold">HR Solutions</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={`#${link.sectionId}`}
                onClick={(e) => handleNavClick(e, link.sectionId, link.to)}
                className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/hr/employees' })}
            >
              HR Dashboard
            </Button>
            <LoginButton />
          </nav>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.to}
                    href={`#${link.sectionId}`}
                    onClick={(e) => handleNavClick(e, link.sectionId, link.to)}
                    className="text-lg font-medium transition-colors hover:text-primary cursor-pointer"
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate({ to: '/hr/employees' });
                  }}
                >
                  HR Dashboard
                </Button>
                <LoginButton />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-muted/40">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/assets/generated/hr-logo.dim_512x512.png"
                  alt="HR Consulting Logo"
                  className="h-8 w-8"
                />
                <span className="font-bold">HR Solutions</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional HR consulting and management services for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <a
                      href={`#${link.sectionId}`}
                      onClick={(e) => handleNavClick(e, link.sectionId, link.to)}
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: info@hrsolutions.com</li>
                <li>Phone: +91 98765 43210</li>
                <li>Office: Mumbai, India</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} HR Solutions. Built with{' '}
              <Heart className="inline h-4 w-4 text-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
