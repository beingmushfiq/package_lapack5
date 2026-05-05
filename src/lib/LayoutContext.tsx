import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutState {
  showHeader: boolean;
  showFooter: boolean;
  showSubNavbar: boolean;
}

interface LayoutContextType {
  layout: LayoutState;
  setLayout: (layout: Partial<LayoutState>) => void;
  resetLayout: () => void;
}

const defaultLayout: LayoutState = {
  showHeader: true,
  showFooter: true,
  showSubNavbar: true,
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayoutState] = useState<LayoutState>(defaultLayout);

  const setLayout = (newLayout: Partial<LayoutState>) => {
    setLayoutState((prev) => ({ ...prev, ...newLayout }));
  };

  const resetLayout = () => {
    setLayoutState(defaultLayout);
  };

  return (
    <LayoutContext.Provider value={{ layout, setLayout, resetLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
