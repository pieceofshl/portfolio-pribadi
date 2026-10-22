import { Outlet } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'

/** Kerangka area publik: navbar, konten halaman, footer. */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
      >
        Lewati ke konten utama
      </a>
      <Navbar />
      <main id="konten-utama" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
