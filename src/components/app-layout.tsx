interface AppLayoutProps {
  children: React.ReactNode;
  className: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <main className={`min-h-screen flex flex-col items-center ${className}`}>
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 w-full">
          {children}
        </div>
      </div>
    </main>
  );
}
