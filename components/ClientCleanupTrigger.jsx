'use client';

import { useEffect } from 'react';

export default function ClientCleanupTrigger() {
  useEffect(() => {
    fetch('/api/cleanup');
  }, []);

  return null; // This component doesn't render anything visible
}