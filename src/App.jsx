import { useState } from 'react';
import DeliveryDigest from './components/DeliveryDigest';
import { requests } from './data/mockData';
import { darkTheme, lightTheme } from './data/themes';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsDark(!isDark)}
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 100,
          padding: '8px 14px',
          borderRadius: 8,
          border: `1px solid ${theme.border}`,
          background: theme.card,
          color: theme.text,
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: 500,
        }}
      >
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>
      <DeliveryDigest requests={requests} theme={theme} />
    </div>
  );
}
