import LanguageSwitcher from '@/components/common/LanguageSwitcher';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black px-4">
      {/* Language Switcher - Fixed Top Right */}
      <div className="fixed top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>
      
      {children}
    </div>
  );
}
