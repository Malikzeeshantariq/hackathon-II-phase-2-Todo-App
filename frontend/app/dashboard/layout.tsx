/**
 * T026: Protected dashboard layout.
 *
 * Spec Reference: AR-001 - Protected routes require authentication
 */

import AuthGuard from "@/components/AuthGuard"
import SignOutButton from "@/components/SignOutButton"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Todo App</h1>
            <nav>
              <SignOutButton />
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
