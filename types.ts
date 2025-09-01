import type React from 'react';

export interface AdFormat {
  id: string;
  name: string;
  description: string;
  prompt: string;
  // FIX: Changed type from React.ReactNode to React.ComponentType to store a reference to the component.
  icon: React.ComponentType;
}
