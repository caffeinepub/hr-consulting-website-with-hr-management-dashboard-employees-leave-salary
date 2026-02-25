/**
 * Safe environment variable accessor compatible with Vite.
 * Vite uses import.meta.env instead of process.env.
 */

export function getEnv(key: string): string | undefined {
  // In Vite, environment variables are accessed via import.meta.env
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] as string | undefined;
  }
  return undefined;
}

export function getEnvOrDefault(key: string, defaultValue: string): string {
  return getEnv(key) ?? defaultValue;
}

/**
 * Get the Internet Identity provider URL from environment or use default.
 */
export function getInternetIdentityUrl(): string | undefined {
  // Check for VITE_II_URL first (Vite convention)
  const viteUrl = getEnv('VITE_II_URL');
  if (viteUrl) return viteUrl;
  
  // Fallback to II_URL for backward compatibility
  const iiUrl = getEnv('II_URL');
  if (iiUrl) return iiUrl;
  
  // Return undefined to use default from config
  return undefined;
}
