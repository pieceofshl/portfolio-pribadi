import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { StageNotice } from '../../components/admin/StageNotice'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { socialLinks } from '../../data/mockData'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function AdminSocialLinksPage() {
  useDocumentTitle('Kelola Tautan Sosial')

  return (
    <div className="space-y-7">
      <AdminPageHeader
        eyebrow="Kelola"
        title="Tautan sosial"
        description="Tautan yang muncul di halaman kontak dan footer. Urutan serta visibilitas diatur admin."
        action={
          <Button disabled title="Form tautan sosial aktif pada Tahap 4">
            + Tambah tautan
          </Button>
        }
      />

      <StageNotice>
        Validasi URL, pengurutan ulang, dan tombol hapus belum berfungsi. Satu contoh tautan
        berstatus disembunyikan agar tampilan status bisa diperiksa.
      </StageNotice>

      <ul className="divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-ink-900/50">
        {socialLinks.map((link, index) => (
          <li
            key={link.id}
            className="grid gap-3 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-5 sm:p-5"
          >
            <span className="grid size-8 place-items-center rounded-lg border border-hairline bg-ink-800 font-mono text-[10px] text-muted">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium">{link.platform}</p>
              <p className="mt-1 truncate text-xs text-muted">{link.label}</p>
              <p className="mt-1 truncate font-mono text-[10px] text-muted/80">{link.url}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <Badge tone={link.isVisible ? 'accent' : 'warning'}>
                {link.isVisible ? 'Tampil' : 'Disembunyikan'}
              </Badge>
              <Button variant="secondary" size="sm" disabled title="Edit aktif pada Tahap 4">
                Edit
              </Button>
              <Button variant="ghost" size="sm" disabled title="Hapus aktif pada Tahap 4">
                Hapus
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {socialLinks.length} tautan · {socialLinks.filter((link) => link.isVisible).length} tampil
      </p>
    </div>
  )
}
