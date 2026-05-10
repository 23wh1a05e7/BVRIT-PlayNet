import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function Announcements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', priority: 'medium', sport: 'all', isPinned: false });
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin' || user?.role === 'faculty';

  const fetchAnn = async () => {
    try { const { data } = await API.get('/announcements'); setAnnouncements(data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAnn(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try { await API.post('/announcements', form); setShowModal(false); fetchAnn(); }
    catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try { await API.delete(`/announcements/${id}`); fetchAnn(); }
    catch (e) { alert('Error deleting'); }
  };

  const fmtDate = d => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const priorityIcon = { high: '🚨', medium: '📌', low: '📝' };

  return (
    <Layout title="Announcements" actions={
      isAdmin && <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Post Announcement</button>
    }>
      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800 }}>
          {announcements.length === 0 && (
            <div className="empty-state"><div className="empty-icon">📢</div><p>No announcements yet</p></div>
          )}
          {announcements.map(a => (
            <div key={a._id} className="card" style={{ borderLeft: `3px solid ${a.priority === 'high' ? 'var(--danger)' : a.priority === 'medium' ? 'var(--warning)' : 'var(--border)'}` }}>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{ fontSize: 20 }}>{priorityIcon[a.priority]}</span>
                      {a.isPinned && <span className="badge" style={{ background: 'rgba(240,192,64,0.15)', color: 'var(--accent)', border: '1px solid rgba(240,192,64,0.3)', fontSize: 10 }}>📌 PINNED</span>}
                      <span className={`badge badge-${a.priority}`}>{a.priority}</span>
                      {a.sport !== 'all' && <span className="badge badge-scheduled">{a.sport}</span>}
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{a.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{a.content}</div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 14, fontFamily: 'var(--font-heading)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>
                      <span>👤 {a.author?.name}</span>
                      <span>🕐 {fmtDate(a.createdAt)}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a._id)}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Post New Announcement</span>
              <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Announcement title..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea className="form-control" rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required placeholder="Write announcement details..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sport</label>
                    <select className="form-control" value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })}>
                      <option value="all">All Sports</option>
                      {['Cricket', 'Football', 'Basketball', 'Volleyball', 'Badminton'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <input type="checkbox" id="pin" checked={form.isPinned} onChange={e => setForm({ ...form, isPinned: e.target.checked })} />
                  <label htmlFor="pin" style={{ fontFamily: 'var(--font-heading)', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>📌 Pin this announcement</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Post Announcement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
