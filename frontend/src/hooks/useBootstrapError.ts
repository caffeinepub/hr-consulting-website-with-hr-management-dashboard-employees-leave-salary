import { useState } from 'react';

export function useBootstrapError() {
  // Bootstrap functionality removed - no longer attempting admin role assignment
  const [bootstrapError] = useState<string | null>(null);
  return bootstrapError;
}
