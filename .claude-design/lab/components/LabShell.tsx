import React from 'react';

interface LabShellProps {
  children: React.ReactNode;
}

export function LabShell({ children }: LabShellProps) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}
