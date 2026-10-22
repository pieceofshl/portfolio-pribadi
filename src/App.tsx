import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { AdminLayout } from './layouts/AdminLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { AboutPage } from './pages/AboutPage'
import { CertificatesPage } from './pages/CertificatesPage'
import { ContactPage } from './pages/ContactPage'
import { ExperiencePage } from './pages/ExperiencePage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { AdminCertificatesPage } from './pages/admin/AdminCertificatesPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminEducationPage } from './pages/admin/AdminEducationPage'
import { AdminExperiencePage } from './pages/admin/AdminExperiencePage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminProfilePage } from './pages/admin/AdminProfilePage'
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage'
import { AdminSocialLinksPage } from './pages/admin/AdminSocialLinksPage'

/**
 * Peta route sesuai sitemap PRD bagian 6.
 * Nama path publik mengikuti PRD agar tautan tidak berubah di tahap berikutnya.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Area publik */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="tentang" element={<AboutPage />} />
          <Route path="portofolio" element={<PortfolioPage />} />
          <Route path="portofolio/:slug" element={<ProjectDetailPage />} />
          <Route path="sertifikat" element={<CertificatesPage />} />
          <Route path="pengalaman" element={<ExperiencePage />} />
          <Route path="kontak" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Login admin (tanpa layout admin) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Area admin: kerangka, belum diproteksi (Tahap 4) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="proyek" element={<AdminProjectsPage />} />
          <Route path="sertifikat" element={<AdminCertificatesPage />} />
          <Route path="profil" element={<AdminProfilePage />} />
          <Route path="pendidikan" element={<AdminEducationPage />} />
          <Route path="pengalaman" element={<AdminExperiencePage />} />
          <Route path="sosial" element={<AdminSocialLinksPage />} />
          <Route
            path="*"
            element={
              <NotFoundPage
                title="Halaman admin tidak ditemukan"
                description="Menu admin yang Anda buka tidak tersedia. Gunakan navigasi di samping untuk kembali ke dashboard."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
