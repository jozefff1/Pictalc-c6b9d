import { auth } from '@/lib/auth/config';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Dashboard</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Welcome back, {session.user?.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Role: <span className="font-medium capitalize">{session.user?.role}</span>
          </p>
        </div>

        {/* Quick Start - Communicate Button */}
        <div className="mb-6">
          <Link
            href="/communicate"
            className="
              inline-flex items-center gap-3
              px-8 py-4 rounded-xl
              bg-primary text-white
              hover:bg-primary-hover
              shadow-lg hover:shadow-xl
              transition-all
              text-lg font-semibold
            "
          >
            <span className="text-2xl">💬</span>
            Start Communicating
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/communicate" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Start communicating with icons
            </p>
          </Link>

          <Link href="/dashboard/history" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📊</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Communication History</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Review past sentences and replay them
            </p>
          </Link>

          <Link href="/dashboard/settings" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⚙️</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Customize your experience
            </p>
          </Link>

          <Link href="/dashboard/icons" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🖼️</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Custom Icons</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Upload your own AAC icons and images
            </p>
          </Link>

          <Link href="/dashboard/patients" className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👥</span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Patients &amp; Participants</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Invite participants and manage privacy settings
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
