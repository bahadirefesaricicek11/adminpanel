import Link from "next/link";
import { Brush, BarChart3, Users, Zap, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-blue-800/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold text-white">
            <Brush className="text-blue-400" size={28} />
            <span>PaintCo Admin</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/login"
              className="px-4 py-2 rounded-lg text-white hover:bg-slate-800 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-white">
            Professional Painting <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Management</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Complete admin panel for managing your painting business. Track jobs, manage teams, and grow your business with real-time insights.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/admin"
              className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Access Admin Panel <ArrowRight size={18} />
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-400/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-20">
          <div className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">48</div>
            <div className="text-slate-400 mt-2">Active Team Members</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">243</div>
            <div className="text-slate-400 mt-2">Completed Projects</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">$156.5k</div>
            <div className="text-slate-400 mt-2">Total Revenue</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-lg p-8 hover:border-blue-400/50 transition-all hover:bg-white/10">
            <BarChart3 className="text-blue-400 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-white mb-3">Dashboard Analytics</h3>
            <p className="text-slate-400">
              Real-time insights into your business performance, revenue tracking, and project metrics.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-lg p-8 hover:border-blue-400/50 transition-all hover:bg-white/10">
            <Users className="text-blue-400 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-white mb-3">Team Management</h3>
            <p className="text-slate-400">
              Manage painters, coordinators, and inspectors. Track team member status and roles.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-lg p-8 hover:border-blue-400/50 transition-all hover:bg-white/10">
            <Brush className="text-blue-400 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-white mb-3">Job Tracking</h3>
            <p className="text-slate-400">
              Organize and track all painting projects from quote to completion with progress monitoring.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-lg p-8 hover:border-blue-400/50 transition-all hover:bg-white/10">
            <Zap className="text-blue-400 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-white mb-3">Real-Time Data</h3>
            <p className="text-slate-400">
              Live database integration with Supabase for instant updates across all operations.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-lg p-8 hover:border-blue-400/50 transition-all hover:bg-white/10">
            <CheckCircle className="text-blue-400 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-white mb-3">Project Management</h3>
            <p className="text-slate-400">
              Track multiple project types (Interior, Exterior, Commercial) with budget and timeline management.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white/5 backdrop-blur-sm border border-blue-400/20 rounded-lg p-8 hover:border-blue-400/50 transition-all hover:bg-white/10">
            <BarChart3 className="text-blue-400 mb-4" size={32} />
            <h3 className="text-xl font-semibold text-white mb-3">Analytics & Reporting</h3>
            <p className="text-slate-400">
              Visualize trends, revenue, and performance metrics with interactive charts and data visualization.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to manage your painting business?
          </h2>
          <p className="text-slate-300 mb-8">
            Access the admin panel to start tracking jobs, managing your team, and growing your business.
          </p>
          <Link
            href="/admin/login"
            className="inline-block px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Login to Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-800/30 bg-slate-900/50 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>
            PaintCo Admin Panel • Built with{" "}
            <span className="text-blue-400">Next.js</span> & <span className="text-blue-400">Supabase</span>
          </p>
          <p className="mt-2 text-sm">© 2024 PaintCo. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
      </div>
    </main>
  );
}
