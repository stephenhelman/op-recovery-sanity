// Permissive local types for react-simple-maps (the package ships none, and the
// DefinitelyTyped @types target older React and clash with React 19's JSX). Kept
// intentionally loose — the component only needs the four exports below.
declare module 'react-simple-maps' {
  import type { ComponentType, ReactNode } from 'react';

  export const ComposableMap: ComponentType<Record<string, unknown>>;
  export const ZoomableGroup: ComponentType<Record<string, unknown>>;
  export const Geography: ComponentType<Record<string, unknown>>;
  export const Geographies: ComponentType<{
    geography: unknown;
    children: (arg: {
      geographies: Array<{ id: string | number; rsmKey: string }>;
    }) => ReactNode;
  }>;
}

declare module 'us-atlas/states-10m.json' {
  const topology: unknown;
  export default topology;
}
