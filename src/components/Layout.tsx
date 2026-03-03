import React, { ReactNode, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useTVNavigation } from '../hooks/useTVNavigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { focusedId } = useTVNavigation('nav-home');

  useEffect(() => {
    // Initial focus
    const initial = document.getElementById('nav-home');
    if (initial) initial.focus();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-tv-bg overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full overflow-hidden relative">
        <div className="p-12 h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
