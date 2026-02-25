import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import LoginButton from './auth/LoginButton';
import { scrollToSection } from '@/utils/scrollToSection';
import { navigateHome } from '@/utils/navigateHome';
import FadeNavLabel from './nav/FadeNavLabel';
import MobileMenuToggleIcon from './nav/MobileMenuToggleIcon';
import SlideInOnViewText from './animations/SlideInOnViewText';
import { useIsEmployeeAssociated } from '@/hooks/useQueries';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: isEmployee } = useIsEmployeeAssociated();

  const navLinks = [
    { to: '/', label: 'Home', sectionId: 'home' },
    { to: '/about', label: 'About Us', sectionId: 'about' },
    { to: '/services', label: 'Services', sectionId: 'services' },
    { to: '/recruitment', label: 'Recruitment', sectionId: 'recruitment' },
    { to: '/contact', label: 'Contact', sectionId: 'contact' },
  ];

  const mobileNavLinks = [
    { to: '/', label: 'Home', sectionId: 'home', isRoute: false },
    { to: '/about', label: 'About Us', sectionId: 'about', isRoute: false },
    { to: '/services', label: 'Services', sectionId: 'services', isRoute: false },
    { to: '/game', label: 'Game', sectionId: null, isRoute: true },
    { to: '/recruitment', label: 'Recruitment', sectionId: 'recruitment', isRoute: false },
    { to: '/contact', label: 'Contact', sectionId: 'contact', isRoute: false },
    ...(isEmployee ? [{ to: '/employee', label: 'Employee Dashboard', sectionId: null, isRoute: true }] : []),
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

  const handleMobileNavClick = (
    e: React.MouseEvent,
    link: { to: string; label: string; sectionId: string | null; isRoute: boolean }
  ) => {
    if (link.isRoute) {
      // Direct route navigation
      e.preventDefault();
      setMobileMenuOpen(false);
      navigate({ to: link.to });
    } else if (link.sectionId) {
      // Smooth scroll navigation
      handleNavClick(e, link.sectionId, link.to);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateHome({
      currentPathname: location.pathname,
      currentHash: location.hash,
      navigate,
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#131E3A' }}>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 shadow-sm">
        <div className="container flex h-20 items-center justify-between">
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg cursor-pointer"
            aria-label="Go to home"
          >
            <div className="relative">
              <img
                src="/assets/generated/vishwesh-hr-logo-modern.dim_512x512.png"
                alt="Vishwesh HR Solutions Logo"
                className="h-12 w-12 motion-safe:transition-transform motion-safe:group-hover:scale-110 motion-safe:duration-300"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <FadeNavLabel>
                <SlideInOnViewText delay={0.1}>HR</SlideInOnViewText>{' '}
                <SlideInOnViewText delay={0.2}>Solutions</SlideInOnViewText>
              </FadeNavLabel>
            </span>
          </a>

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
                {mobileNavLinks.map((link, index) => (
                  <a
                    key={link.to}
                    href={link.isRoute ? link.to : `#${link.sectionId}`}
                    onClick={(e) => handleMobileNavClick(e, link)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleMobileNavClick(e as any, link);
                      }
                    }}
                    className="mobile-menu-item px-5 py-4 text-base font-bold rounded-xl motion-safe:transition-all motion-safe:duration-300 hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 hover:text-primary focus-visible:bg-gradient-to-r focus-visible:from-primary/20 focus-visible:to-accent/20 focus-visible:text-primary cursor-pointer border border-transparent hover:border-primary/30 focus-visible:border-primary/30 shadow-sm hover:shadow-md hover:shadow-primary/10"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                    tabIndex={0}
                    role="link"
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

      <footer className="border-t border-border/40 py-12 bg-background/50 backdrop-blur-sm">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <a
                href="/"
                onClick={handleLogoClick}
                className="flex items-center gap-3 mb-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg cursor-pointer w-fit"
                aria-label="Go to home"
              >
                <img
                  src="/assets/generated/vishwesh-hr-logo-modern.dim_512x512.png"
                  alt="Vishwesh HR Solutions Logo"
                  className="h-10 w-10 motion-safe:transition-transform motion-safe:group-hover:scale-110 motion-safe:duration-300"
                />
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  <FadeNavLabel>
                    <SlideInOnViewText delay={0.1}>HR</SlideInOnViewText>{' '}
                    <SlideInOnViewText delay={0.2}>Solutions</SlideInOnViewText>
                  </FadeNavLabel>
                </span>
              </a>
              <p className="text-sm text-muted-foreground">
                Comprehensive HR solutions for modern businesses
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <a
                      href={`#${link.sectionId}`}
                      onClick={(e) => handleNavClick(e, link.sectionId, link.to)}
                      className="text-sm text-muted-foreground hover:text-primary motion-safe:transition-colors cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <address className="text-sm text-muted-foreground not-italic space-y-2">
                <p>Nagpur, Maharashtra, India</p>
                <p>
                  <a href="mailto:info@hrsolutions.com" className="hover:text-primary motion-safe:transition-colors">
                    info@hrsolutions.com
                  </a>
                </p>
              </address>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} HR Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
