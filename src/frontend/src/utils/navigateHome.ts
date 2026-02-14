/**
 * Utility to navigate to the homepage, clear any hash, and scroll to top.
 * This ensures clicking the logo always results in URL '/' (no hash) and scrolls to the home section.
 */

interface NavigateHomeOptions {
  currentPathname: string;
  currentHash: string;
  navigate: (options: { to: string }) => Promise<void>;
}

export async function navigateHome(options: NavigateHomeOptions): Promise<void> {
  const { currentPathname, currentHash, navigate } = options;

  // If we're on the homepage with a hash, clear it and scroll to top
  if (currentPathname === '/' && currentHash) {
    // Clear the hash from the URL
    window.history.replaceState({}, '', '/');
    // Scroll to the home section (top of page)
    const homeElement = document.getElementById('home');
    if (homeElement) {
      homeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  // If we're on the homepage without a hash, just scroll to top
  if (currentPathname === '/') {
    const homeElement = document.getElementById('home');
    if (homeElement) {
      homeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  // If we're on a different route, navigate to home
  await navigate({ to: '/' });
  // Ensure URL is clean (no hash)
  window.history.replaceState({}, '', '/');
  // Small delay to ensure page is rendered, then scroll to top
  setTimeout(() => {
    const homeElement = document.getElementById('home');
    if (homeElement) {
      homeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 100);
}
