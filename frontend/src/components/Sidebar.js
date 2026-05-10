import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label:'Dashboard',            icon:'🏠', path:'/' },
  { label:'Announcements',        icon:'📢', path:'/announcements' },
  { label:'Sports Calendar',      icon:'📅', path:'/calendar' },
  { label:'Events & Tournaments', icon:'🏆', path:'/tournaments' },
  { label:'Teams',                icon:'👥', path:'/teams' },
  { label:'Matches',              icon:'⚡', path:'/matches' },
  { label:'Live Scores',          icon:'🔴', path:'/live' },
  { label:'Results',              icon:'📊', path:'/results' },
  { label:'Leaderboards',         icon:'🥇', path:'/leaderboard' },
  { label:'Gallery',              icon:'🖼️',  path:'/gallery' },
  { label:'Notifications',        icon:'🔔', path:'/notifications' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-title">PlayNet</div>
        <div className="logo-sub">BVRIT Hyderabad</div>
        <div className="logo-women">Women's College of Engineering</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>{item.label}
          </NavLink>
        ))}

        {user && (user.role === 'admin' || user.role === 'faculty') && (
          <>
            <div className="nav-section-label" style={{ marginTop:8 }}>Admin</div>
            <NavLink to="/admin" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <span className="nav-icon">⚙️</span>Admin Panel
            </NavLink>
          </>
        )}

        <div className="nav-section-label" style={{ marginTop:8 }}>Account</div>
        <NavLink to="/profile" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">👤</span>My Profile
        </NavLink>
        <NavLink to="/help" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">❓</span>Help & Support
        </NavLink>
        <div className="nav-item" onClick={handleLogout} style={{ color:'#A32D2D', cursor:'pointer' }}>
          <span className="nav-icon">🚪</span>Logout
        </div>
      </nav>

      {user && (
        <div className="sidebar-user">
          <div className="user-avatar">{user.name?.charAt(0)}</div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.department} · {user.role}</div>
          </div>
        </div>
      )}
    </aside>
  );
}
