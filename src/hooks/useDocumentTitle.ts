import { useEffect } from 'react'

const SITE_NAME = 'Portofolio Nama Pemilik'

/**
 * Mengatur judul tab browser per halaman.
 * SEO lengkap (description & metadata sosial) dikerjakan pada Tahap 6.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME
  }, [title])
}
