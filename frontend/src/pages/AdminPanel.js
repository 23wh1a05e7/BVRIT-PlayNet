import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'faculty')) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [m, t, ann, tour] = await Promise.all([
        API.get('/matches'), API.get('/teams'), API.get('/announcements'), API.get('/tournaments')
      ]);
      setMatches(m.data);
      setStats({
        matches: m.data.length, teams: t.data.length,
        announcements: ann.data.length, tournaments: tour.data.length,
        live: m.data.filter(x => x.status === 'live').length,
        completed: m.data.filter(x => x.status === 'completed').length,
      });
    } catch (e) { console.error(e); }
    try {
      const { data } = await API.get('/users');
      setUsers(data);
    } catch (e) { /* students only for admin */ }
    setLoading(false);
  };

  const handleMatchStatus = async (id, status) => {
    try { await API.put(`/matches/${id}/score`, { status }); fetchData(); }
    catch (e) { alert('Error updating match'); }
  };

  const fmt = d => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  if (loading) return <Layout title="Admin Panel"><div className="loading-screen"><div className="spinner" /></div></Layout>;

  return (
    <Layout title="Admin" subtitle={<span style={{ color: 'var(--accent)' }}>Panel</span>}>
      {/* Overview stats */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[
          { icon: '⚡', value: stats.matches, label: 'Total Matches', color: 'var(--accent)' },
          { icon: '👥', value: stats.teams, label: 'Teams', color: 'var(--accent3)' },
          { icon: '🔴', value: stats.live, label: 'Live Now', color: 'var(--live)' },
          { icon: '✅', value: stats.completed, label: 'Completed', color: 'var(--success)' },
          { icon: '🏆', value: stats.tournaments, label: 'Tournaments', color: 'var(--warning)' },
          { icon: '📢', value: stats.announcements, label: 'Announcements', color: 'var(--text-secondary)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>{s.icon}</div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-secondary)', borderRadius: 10, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {[['overview', '📊 Match Management'], ['users', '👥 Registered Users']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={tab === key ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="card">
          <div className="card-header"><span className="card-title">All Matches — Admin View</span></div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Sport</th><th>Team A</th><th>Score</th><th>Team B</th>
                  <th>Venue</th><th>Scheduled</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {matches.map(m => (
                  <tr key={m._id}>
                    <td style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)' }}>{m.sport}</td>
                    <td style={{ fontWeight: 600 }}>{m.teamA?.name}</td>
                    <td style={{ fontFamily: 'var(--font-display)', fontSize: 20, textAlign: 'center', color: 'var(--text-primary)' }}>
                      {m.scoreA} – {m.scoreB}
                    </td>
                    <td style={{ fontWeight: 600 }}>{m.teamB?.name}</td>
                    <td>{m.venue || '—'}</td>
                    <td style={{ fontSize: 12, fontFamily: 'var(--font-heading)' }}>{fmt(m.scheduledAt)}</td>
                    <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {m.status === 'scheduled' && (
                          <button className="btn btn-sm" style={{ background: 'rgba(255,58,58,0.15)', color: 'var(--live)', border: '1px solid rgba(255,58,58,0.3)', fontFamily: 'var(--font-heading)', fontSize: 11 }}
                            onClick={() => handleMatchStatus(m._id, 'live')}>
                            ▶ Go Live
                          </button>
                        )}
                        {m.status === 'live' && (
                          <button className="btn btn-sm" style={{ background: 'rgba(46,204,113,0.15)', color: 'var(--success)', border: '1px solid rgba(46,204,113,0.3)', fontFamily: 'var(--font-heading)', fontSize: 11 }}
                            onClick={() => handleMatchStatus(m._id, 'completed')}>
                            ✅ End Match
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Registered Students</span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', fontSize: 12 }}>{users.length} students</span>
          </div>
          {users.length === 0 ? (
            <div className="empty-state" style={{ padding: 40 }}><div className="empty-icon">👥</div><p>Student data requires admin token access</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Name</th><th>Roll No</th><th>Department</th><th>Year</th><th>Sports</th><th>Email</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</td>
                      <td style={{ fontFamily: 'var(--font-heading)', fontSize: 13 }}>{u.rollNumber || '—'}</td>
                      <td><span className="badge badge-scheduled">{u.department || '—'}</span></td>
                      <td>{u.year || '—'}</td>
                      <td style={{ fontSize: 12 }}>{u.sports?.join(', ') || '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
