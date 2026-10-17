import { useState } from 'react';

// usage: <Tabs tabs={[{ label: 'Classes', content: <GestionClasses /> }, ...]} />
export default function Tabs({ tabs }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-color)',
          marginBottom: 20,
          gap: 4,
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            onClick={() => setActiveIndex(index)}
            style={{
              background: index === activeIndex ? 'var(--bg-panel-light)' : 'transparent',
              color: index === activeIndex ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: index === activeIndex ? '2px solid var(--text-primary)' : '2px solid transparent',
              borderRadius: '6px 6px 0 0',
              padding: '10px 18px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: index === activeIndex ? 600 : 400,
              margin: 0,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[activeIndex].content}</div>
    </div>
  );
}