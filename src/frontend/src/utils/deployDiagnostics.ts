/**
 * Deploy diagnostics helper for troubleshooting deployment issues.
 * Logs key runtime configuration and initialization state to the browser console.
 */

import { getEnv } from './env';

export interface DiagnosticInfo {
  timestamp: string;
  environment: {
    mode: string;
    baseUrl: string;
    iiUrl: string | undefined;
  };
  canister: {
    backendId: string | undefined;
  };
  build: {
    isDev: boolean;
    isProd: boolean;
  };
}

export function collectDiagnostics(): DiagnosticInfo {
  const isDev = getEnv('DEV') === 'true' || getEnv('MODE') === 'development';
  const isProd = getEnv('PROD') === 'true' || getEnv('MODE') === 'production';
  
  return {
    timestamp: new Date().toISOString(),
    environment: {
      mode: getEnv('MODE') || 'unknown',
      baseUrl: getEnv('BASE_URL') || '/',
      iiUrl: getEnv('VITE_II_URL') || getEnv('II_URL') || 'not set',
    },
    canister: {
      backendId: getEnv('VITE_BACKEND_CANISTER_ID') || getEnv('CANISTER_ID_BACKEND') || 'not set',
    },
    build: {
      isDev,
      isProd,
    },
  };
}

export function logDiagnostics(): void {
  const diagnostics = collectDiagnostics();
  
  console.group('🔍 Caffeine Deploy Diagnostics');
  console.log('Timestamp:', diagnostics.timestamp);
  console.log('Environment:', diagnostics.environment);
  console.log('Canister:', diagnostics.canister);
  console.log('Build:', diagnostics.build);
  console.groupEnd();
}

export function logActorInitialization(success: boolean, error?: Error): void {
  if (success) {
    console.log('✅ Backend actor initialized successfully');
  } else {
    console.error('❌ Backend actor initialization failed:', error?.message || 'Unknown error');
    if (error?.stack) {
      console.debug('Stack trace:', error.stack);
    }
  }
}

export function logIdentityStatus(isAuthenticated: boolean, principal?: string): void {
  if (isAuthenticated && principal) {
    console.log('🔐 User authenticated:', principal);
  } else {
    console.log('👤 Anonymous user');
  }
}
