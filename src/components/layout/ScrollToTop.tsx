import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Kembalikan posisi scroll ke atas saat berpindah halaman. */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}
