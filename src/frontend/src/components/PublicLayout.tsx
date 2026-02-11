import { Outlet, useNavigate, useLocation, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import LoginButton from './auth/LoginButton';
import { scrollToSection } from '@/utils/scrollToSection';
import FadeNavLabel from './nav/FadeNavLabel';
import MobileMenuToggleIcon from './nav/MobileMenuToggleIcon';

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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#131E3A' }}>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 shadow-sm">
        <div className="container flex h-20 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
            aria-label="Go to home"
          >
            <div className="relative">
              <img
                src="/assets/generated/hr-logo.dim_512x512.png"
                alt="HR Consulting Logo"
                className="h-12 w-12 motion-safe:transition-transform motion-safe:group-hover:scale-110 motion-safe:duration-300"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <FadeNavLabel>HR Solutions</FadeNavLabel>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={`#${link.sectionId}`}
                onClick={(e) => handleNavClick(e, link.sectionId, link.to)}
                className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 hover:bg-accent/10 hover:text-primary focus-visible:bg-accent/10 focus-visible:text-primary cursor-pointer relative group"
              >
                <FadeNavLabel>{link.label}</FadeNavLabel>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary motion-safe:transition-all motion-safe:duration-300 motion-safe:group-hover:w-3/4 motion-reduce:hidden" />
              </a>
            ))}
            <div className="ml-2 pl-2 border-l border-border/40 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: '/hr/employees' })}
                className="font-semibold shadow-sm hover:shadow-md motion-safe:transition-all motion-safe:duration-300"
              >
                <FadeNavLabel>HR Dashboard</FadeNavLabel>
              </Button>
              <div className="motion-safe:animate-fade-in">
                <LoginButton />
              </div>
            </div>
          </nav>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-accent/20 rounded-xl border-2 border-primary/30 hover:border-primary/60 motion-safe:transition-all motion-safe:duration-300 shadow-lg shadow-primary/10"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <MobileMenuToggleIcon open={mobileMenuOpen} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="mobile-menu-panel w-[300px] sm:w-[340px] border-l-2 border-primary/30">
              <nav className="flex flex-col gap-1 mt-16">
                {navLinks.map((link, index) => (
                  <a
                    key={link.to}
                    href={`#${link.sectionId}`}
                    onClick={(e) => handleNavClick(e, link.sectionId, link.to)}
                    className="mobile-menu-item px-5 py-4 text-base font-bold rounded-xl motion-safe:transition-all motion-safe:duration-300 hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 hover:text-primary focus-visible:bg-gradient-to-r focus-visible:from-primary/20 focus-visible:to-accent/20 focus-visible:text-primary cursor-pointer border border-transparent hover:border-primary/30 focus-visible:border-primary/30 shadow-sm hover:shadow-md hover:shadow-primary/10"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <FadeNavLabel>{link.label}</FadeNavLabel>
                  </a>
                ))}
                <div className="mt-6 pt-6 border-t-2 border-primary/20 space-y-4">
                  <Button
                    variant="outline"
                    className="w-full font-bold text-base py-6 rounded-xl border-2 border-primary/40 hover:border-primary hover:bg-primary/10 shadow-md hover:shadow-lg hover:shadow-primary/20 motion-safe:transition-all motion-safe:duration-300"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate({ to: '/hr/employees' });
                    }}
                  >
                    <FadeNavLabel>HR Dashboard</FadeNavLabel>
                  </Button>
                  <div className="motion-safe:animate-fade-in">
                    <LoginButton />
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-muted/30 backdrop-blur-sm">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <Link
                to="/"
                className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg w-fit"
                aria-label="Go to home"
              >
                <img
                  src="/assets/generated/hr-logo.dim_512x512.png"
                  alt="HR Consulting Logo"
                  className="h-10 w-10 motion-safe:transition-transform motion-safe:group-hover:scale-110 motion-safe:duration-300"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  HR Solutions
                </span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional HR consulting and management services for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-foreground">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <a
                      href={`#${link.sectionId}`}
                      onClick={(e) => handleNavClick(e, link.sectionId, link.to)}
                      className="text-muted-foreground hover:text-primary transition-colors cursor-pointer inline-block font-medium"
                    >
                      <FadeNavLabel>{link.label}</FadeNavLabel>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-foreground">Contact</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-medium text-foreground">Email:</span>
                  <span>info@hrsolutions.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-foreground">Phone:</span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-medium text-foreground">Office:</span>
                  <span>Mumbai, India</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1.5 flex-wrap">
              <span>© {new Date().getFullYear()} HR Solutions.</span>
              <span className="flex items-center gap-1.5">
                Built with <Heart className="inline h-4 w-4 text-red-500 motion-safe:animate-pulse" /> using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                    window.location.hostname
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-primary transition-colors underline decoration-primary/30 hover:decoration-primary"
                >
                  caffeine.ai
                </a>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
