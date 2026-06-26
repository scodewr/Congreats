import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import AnimatedRoute from './AnimatedRoute'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <AnimatedRoute key={location.pathname}>
              <Outlet />
            </AnimatedRoute>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
