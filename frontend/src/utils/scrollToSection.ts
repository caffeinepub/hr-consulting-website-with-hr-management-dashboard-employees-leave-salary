/**
 * Smoothly scrolls to a section by ID
 * @param sectionId - The ID of the section to scroll to (without the # prefix)
 */
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Gets the section ID from a navigation path
 * @param path - The navigation path (e.g., '/', '/about', '/services')
 * @returns The corresponding section ID
 */
export function getSectionIdFromPath(path: string): string {
  const pathToSection: Record<string, string> = {
    '/': 'home',
    '/about': 'about',
    '/services': 'services',
    '/recruitment': 'recruitment',
    '/contact': 'contact',
  };
  return pathToSection[path] || 'home';
}
