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
    <nav className="sticky top-0 z-40 border-b border-slate/10 bg-white/95 backdrop-blur no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-sm font-bold text-accent">{t.app.title}</Link>
        <div className="flex gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                pathname === link.to ? 'bg-accent text-white' : 'text-slate hover:bg-mist'
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
