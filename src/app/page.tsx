import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";

export default async function Home() {
  const session = await auth();
  
  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="bg-linear-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Communication Made Accessible
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Pictalk is an Augmentative and Alternative Communication (AAC) app
              that helps children and individuals with communication challenges
              express themselves through icons and speech.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-medium text-white hover:bg-primary-hover transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-8 py-3 text-lg font-medium text-primary hover:bg-blue-50 dark:hover:bg-gray-900 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Icon-Based Communication</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Tap icons to build sentences and express needs, feelings, and more.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🔊</div>
                <h3 className="text-xl font-semibold mb-2">Text-to-Speech</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Built-in speech output to communicate your messages clearly.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-2">Works Offline</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Progressive Web App that works even without an internet connection.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-6xl text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 Pictalk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

