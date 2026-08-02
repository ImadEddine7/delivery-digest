import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { t } from '@/i18n'
import { DigestProvider } from '@/lib/context'
import { DigestPage } from '@/pages/Digest'
import { AdminPage } from '@/pages/Admin'
import { ArchivePage } from '@/pages/Archive'
import { cn } from '@/lib/utils'

function Nav() {
  const { pathname } = useLocation()
  const links = [
    { to: '/', label: t.nav.digest },
    { to: '/archive', label: t.nav.archive },
    { to: '/admin', label: t.nav.admin },
  ]

  return (
    <nav className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-lg no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-sm font-bold tracking-tight text-ink">{t.app.title}</Link>
        <div className="flex gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all',
                pathname === link.to ? 'bg-ink text-white' : 'text-slate hover:text-ink'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <HashRouter>
      <DigestProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<DigestPage />} />
          <Route path="/digest/:period" element={<DigestPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/archive" element={<ArchivePage />} />
        </Routes>
      </DigestProvider>
    </HashRouter>
  )
}
