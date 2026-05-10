import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ title, subtitle, children, actions }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">
              {title} {subtitle && <span>{subtitle}</span>}
            </div>
          </div>
          {actions && <div style={{ display: 'flex', gap: 12 }}>{actions}</div>}
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
