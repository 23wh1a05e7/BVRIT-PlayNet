import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const SPORTS = ['Throwball','Volleyball','Basketball','Kho-Kho','Table Tennis','Badminton','Pickleball','Carrom'];
const SPORT_EMOJI = { Throwball:'🏐', Volleyball:'🏐', Basketball:'🏀', 'Kho-Kho':'🏃', 'Table Tennis':'🏓', Badminton:'🏸', Pickleball:'🏓', Carrom:'🎯' };

export default function Matches() {
  const { user } = useAuth();
  const [matches, setMatches]     = useState([]);
  const [teams, setTeams]         = useState([]);
  const [filter, setFilter]       = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [form, setForm] = useState({ sport:'Throwball', teamA:'', teamB:'', venue:'BVRIT Indoor Court', scheduledAt:'', notes:'' });
  const isAdmin = user?.role === 'admin' || user?.role === 'faculty';

  const fetchMatches = async () => {
    try {
      const status = filter !== 'all' ? `?status=${filter}` : '';
      const [m, t] = await Promise.all([API.get(`/matches${status}`), API.get('/teams')]);
      setMatches(m.data); setTeams(t.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMatches(); }, [filter]);

  const handleSchedule = async e => {
    e.preventDefault();
    try { await API.post('/matches', form); setShowModal(false); fetchMatches(); }
    catch(e) { alert(e.response?.data?.message || 'Error scheduling match'); }
  };

  const handleAttend = async id => {
    try { await API.post(`/matches/${id}/attend`); fetchMatches(); }
    catch(e) { alert('Error marking attendance'); }
  };

  const fmt = d => new Date(d).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });

  const VENUES = ['BVRIT Indoor Court','BVRIT Outdoor Ground','BVRIT Basketball Court','BVRIT TT Room','BVRIT Badminton Court','BVRIT Pickleball Court','BVRIT Indoor Hall'];

  return (
    <Layout title="Matches" actions={
      isAdmin && <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Schedule Match</button>
    }>
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {[['all','📋 All'],['scheduled','📅 Upcoming'],['live','🔴 Live'],['completed','✅ Completed']].map(([val,label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={filter === val ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {matches.length === 0 && <div className="empty-state"><div className="empty-icon">🏅</div><p>No matches found</p></div>}
          {matches.map(m => (
            <div key={m._id} className={`match-card${m.status === 'live' ? ' live' : ''}`}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:28 }}>{SPORT_EMOJI[m.sport] || '🏅'}</span>
                  <div>
                    <div style={{ fontFamily:'var(--font-heading)', fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>{m.sport}</div>
                    <div style={{ fontSize:12, color:'var(--text-muted)' }}>📍 {m.venue || 'TBD'}</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {m.status === 'live' && <span className="live-dot" />}
                  <span className={`badge badge-${m.status}`}>{m.status}</span>
                </div>
              </div>

              <div className="match-teams">
                <div className="match-team">
                  <div className="match-team-name">{m.teamA?.name || 'TBD'}</div>
                  {m.winner?._id === m.teamA?._id && <div style={{ fontSize:11, color:'var(--success)', fontFamily:'var(--font-heading)', marginTop:4, letterSpacing:1 }}>🏆 WINNER</div>}
                </div>
                <div style={{ textAlign:'center' }}>
                  {m.status === 'scheduled'
                    ? <div style={{ fontFamily:'var(--font-heading)', color:'var(--text-muted)', fontSize:18, letterSpacing:2 }}>VS</div>
                    : <div className="match-score">{m.scoreA} – {m.scoreB}</div>
                  }
                </div>
                <div className="match-team">
                  <div className="match-team-name">{m.teamB?.name || 'TBD'}</div>
                  {m.winner?._id === m.teamB?._id && <div style={{ fontSize:11, color:'var(--success)', fontFamily:'var(--font-heading)', marginTop:4, letterSpacing:1 }}>🏆 WINNER</div>}
                </div>
              </div>

              <div className="match-meta">
                <span>📅 {fmt(m.scheduledAt)}</span>
                <span>👥 {m.attendees?.length||0} attending</span>
                {m.status !== 'completed' && (
                  <button className="btn btn-outline btn-sm" onClick={() => handleAttend(m._id)}>✅ Mark Attendance</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Schedule Match</span>
              <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleSchedule}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Sport</label>
                  <select className="form-control" value={form.sport} onChange={e => setForm({...form, sport:e.target.value})}>
                    {SPORTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Team A</label>
                  <select className="form-control" value={form.teamA} onChange={e => setForm({...form, teamA:e.target.value})} required>
                    <option value="">Select Team A</option>
                    {teams.map(t => <option key={t._id} value={t._id}>{t.name} ({t.sport})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Team B</label>
                  <select className="form-control" value={form.teamB} onChange={e => setForm({...form, teamB:e.target.value})} required>
                    <option value="">Select Team B</option>
                    {teams.filter(t => t._id !== form.teamA).map(t => <option key={t._id} value={t._id}>{t.name} ({t.sport})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <select className="form-control" value={form.venue} onChange={e => setForm({...form, venue:e.target.value})}>
                    {VENUES.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date & Time</label>
                  <input className="form-control" type="datetime-local" value={form.scheduledAt} onChange={e => setForm({...form, scheduledAt:e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-control" rows={2} value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} placeholder="Optional notes..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Match</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
