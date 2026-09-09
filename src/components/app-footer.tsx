import { ThemeSwitcher } from '@/components/theme-switcher';

function AppFooter() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>
        Powered by{' '}
        <a
          href="https://supabase.com/"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Supabase
        </a>
      </p>
      <ThemeSwitcher />
    </footer>
  );
}

export default AppFooter;
