import { useState, useEffect, useRef } from 'react';

const STATUS_LABELS = {
  besoin_emis: "Besoin émis",
  qualification: "Qualification",
  valide: "Validé",
  annule: "Annulé",
};

function getStatusColor(status, theme) {
  switch (status) {
    case 'valide': return { bg: theme.greenDim, text: theme.green, border: theme.greenBorder };
    case 'qualification': return { bg: theme.amberDim, text: theme.amber, border: theme.amberBorder };
    case 'besoin_emis': return { bg: theme.blueDim, text: theme.blue, border: theme.blueBorder };
    case 'annule': return { bg: theme.redDim, text: theme.red, border: theme.redBorder };
    default: return { bg: theme.grayDim, text: theme.gray, border: theme.grayBorder };
  }
}

function getPriorityColor(priority, theme) {
  switch (priority) {
    case 'high': return { bg: theme.redDim, text: theme.red, border: theme.redBorder };
    case 'medium': return { bg: theme.amberDim, text: theme.amber, border: theme.amberBorder };
    case 'low': return { bg: theme.grayDim, text: theme.gray, border: theme.grayBorder };
    default: return { bg: theme.grayDim, text: theme.gray, border: theme.grayBorder };
  }
}

function getProfileStatusColor(status, theme) {
  switch (status) {
    case 'valide': return theme.green;
    case 'presente': return theme.blue;
    case 'refuse': return theme.red;
    case 'identifie': return theme.gray;
    default: return theme.textMute;
  }
}

function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [value, duration]);

  return <span>{display}</span>;
}

function KPICard({ label, value, icon, color, theme }) {
  return (
    <div style={{
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 14,
      padding: '20px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      boxShadow: `0 1px 3px ${theme.border}22`,
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.8rem', color: theme.textMute, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      </div>
      <span style={{ fontSize: '2rem', fontWeight: 700, color: color || theme.text }}>
        <AnimatedNumber value={value} />
      </span>
    </div>
  );
}

function StatusPill({ status, theme }) {
  const colors = getStatusColor(status, theme);
  return (
    <span style={{
      padding: '4px 10px',
      borderRadius: 12,
      fontSize: '0.75rem',
      fontWeight: 600,
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      whiteSpace: 'nowrap',
    }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function PriorityBadge({ priority, theme }) {
  const colors = getPriorityColor(priority, theme);
  return (
    <span style={{
      padding: '3px 8px',
      borderRadius: 10,
      fontSize: '0.7rem',
      fontWeight: 600,
      background: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      textTransform: 'uppercase',
    }}>
      {priority}
    </span>
  );
}

function getDaysSince(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function SLAIndicator({ createdAt, status, theme }) {
  if (status === 'valide' || status === 'annule') return null;
  const days = getDaysSince(createdAt);
  let color = theme.green;
  let label = `${days}d`;
  if (days > 14) { color = theme.red; label = `${days}d ⚠`; }
  else if (days > 7) { color = theme.amber; }
  return <span style={{ fontSize: '0.75rem', color, fontWeight: 600 }}>{label}</span>;
}

export default function DeliveryDigest({ requests, theme }) {
  const [filter, setFilter] = useState('all');

  if (!requests || requests.length === 0) {
    return (
      <div style={{ background: theme.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.textMute, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
          <h2 style={{ color: theme.text, marginBottom: 8 }}>No requests yet</h2>
          <p>Sourcing requests will appear here once created.</p>
        </div>
      </div>
    );
  }

  const openRequests = requests.filter(r => r.status !== 'annule');
  const completed = requests.filter(r => r.status === 'valide');
  const highPriority = requests.filter(r => r.priority === 'high' && r.status !== 'annule');
  const inQualification = requests.filter(r => r.status === 'qualification');
  const totalProfiles = openRequests.reduce((sum, r) => sum + r.profiles.length, 0);
  const avgProfiles = openRequests.length > 0 ? Math.round(totalProfiles / openRequests.length) : 0;

  const staleRequests = openRequests.filter(r => getDaysSince(r.createdAt) > 14);
  const noProfiles = openRequests.filter(r => r.profiles.length === 0);

  const filtered = filter === 'all' ? requests.filter(r => r.status !== 'annule') :
    filter === 'high' ? highPriority :
    filter === 'qualification' ? inQualification :
    filter === 'valide' ? completed :
    requests;

  const tableData = [...filtered].sort((a, b) => b.profiles.length - a.profiles.length).slice(0, 6);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', padding: '24px 32px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: theme.text }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Delivery Digest</h1>
            <span style={{ padding: '3px 10px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600, background: theme.greenDim, color: theme.green, border: `1px solid ${theme.greenBorder}` }}>Live</span>
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: theme.textSub, margin: '4px 0' }}>Today overview</h2>
          <p style={{ fontSize: '0.8rem', color: theme.textMute, margin: 0 }}>Updated {dateStr} · {openRequests.length} active items</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <KPICard label="Open requests" value={openRequests.length} icon="📋" color={theme.blue} theme={theme} />
        <KPICard label="Completed" value={completed.length} icon="✅" color={theme.green} theme={theme} />
        <KPICard label="Avg. profiles" value={avgProfiles} icon="👤" color={theme.text} theme={theme} />
        <KPICard label="High priority" value={highPriority.length} icon="🔥" color={theme.red} theme={theme} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All active' },
          { key: 'high', label: 'High priority' },
          { key: 'qualification', label: 'In qualification' },
          { key: 'valide', label: 'Completed' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: `1px solid ${filter === f.key ? theme.blue : theme.border}`,
              background: filter === f.key ? theme.blueDim : 'transparent',
              color: filter === f.key ? theme.blue : theme.textSub,
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        {/* Table */}
        <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: `0 1px 3px ${theme.border}22` }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${theme.border}`, background: theme.columnHeader }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Latest delivery queue</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: theme.textMute, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Ref</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: theme.textMute, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Title</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', color: theme.textMute, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Client</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', color: theme.textMute, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Profiles</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', color: theme.textMute, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Priority</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', color: theme.textMute, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', color: theme.textMute, fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>SLA</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map(req => (
                  <tr key={req.id} style={{ borderBottom: `1px solid ${theme.border}`, cursor: req.whozLink ? 'pointer' : 'default', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.surface}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => req.whozLink && window.open(req.whozLink, '_blank')}
                  >
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: theme.blue }}>{req.ref}</td>
                    <td style={{ padding: '10px 14px', color: theme.text, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{req.title}</td>
                    <td style={{ padding: '10px 14px', color: theme.textSub }}>{req.client}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 600 }}>{req.profiles.length}</span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}><PriorityBadge priority={req.priority} theme={theme} /></td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}><StatusPill status={req.status} theme={theme} /></td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}><SLAIndicator createdAt={req.createdAt} status={req.status} theme={theme} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 18, boxShadow: `0 1px 3px ${theme.border}22` }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 600 }}>Delivery insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.blue, display: 'inline-block' }} />
                <span style={{ color: theme.textSub }}><strong style={{ color: theme.text }}>{openRequests.length}</strong> total active requests</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.amber, display: 'inline-block' }} />
                <span style={{ color: theme.textSub }}><strong style={{ color: theme.text }}>{inQualification.length}</strong> in qualification</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.green, display: 'inline-block' }} />
                <span style={{ color: theme.textSub }}><strong style={{ color: theme.text }}>{totalProfiles}</strong> total profiles sourced</span>
              </div>
              {staleRequests.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.red, display: 'inline-block' }} />
                  <span style={{ color: theme.red }}><strong>{staleRequests.length}</strong> at risk (&gt;14 days)</span>
                </div>
              )}
              {noProfiles.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.amber, display: 'inline-block' }} />
                  <span style={{ color: theme.amber }}><strong>{noProfiles.length}</strong> with no profiles yet</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile breakdown */}
          <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 18, boxShadow: `0 1px 3px ${theme.border}22` }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 600 }}>Profile funnel</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['identifie', 'presente', 'valide', 'refuse'].map(status => {
                const count = requests.flatMap(r => r.profiles).filter(p => p.status === status).length;
                const total = requests.flatMap(r => r.profiles).length || 1;
                const pct = Math.round((count / total) * 100);
                const color = getProfileStatusColor(status, theme);
                const labels = { identifie: 'Identified', presente: 'Presented', valide: 'Validated', refuse: 'Refused' };
                return (
                  <div key={status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 3 }}>
                      <span style={{ color: theme.textSub }}>{labels[status]}</span>
                      <span style={{ color, fontWeight: 600 }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: theme.grayDim, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
