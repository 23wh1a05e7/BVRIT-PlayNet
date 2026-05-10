import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const SPORTS = ['Throwball','Volleyball','Basketball','Kho-Kho','Table Tennis','Badminton','Pickleball','Carrom'];
const SPORT_EMOJI = { Throwball:'🏐', Volleyball:'🏐', Basketball:'🏀', 'Kho-Kho':'🏃', 'Table Tennis':'🏓', Badminton:'🏸', Pickleball:'🏓', Carrom:'🎯' };
const RESULT_COLOR = { '🏆': 'var(--accent)', '🥈': '#9090b8', '🥉': '#cd7f32' };

export default function Tournaments() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams]             = useState([]);
  const [filter, setFilter]           = useState('all');
  const [showModal, setShowModal]     = useState(false);
  const [loading, setLoading]         = useState(true);
  const [form, setForm] = useState({
    name:'', sport:'Throwball', description:'', startDate:'', endDate:'',
    venue:'', maxTeams:8, prize:'', registrationDeadline:'',
    type:'internal', hostCollege:'BVRIT Hyderabad'
  });
  const isAdmin = user?.role === 'admin' || user?.role === 'faculty';

  const fetchData = async () => {
    try {
      const [t, tm] = await Promise.all([API.get('/tournaments'), API.get('/teams')]);
      setTournaments(t.data); setTeams(tm.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async e => {
    e.preventDefault();
    try { await API.post('/tournaments', form); setShowModal(false); fetchData(); }
    catch(e) { alert(e.response?.data?.message || 'Error'); }
  };

  const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  const statusColors = { upcoming:'var(--warning)', ongoing:'var(--live)', completed:'var(--success)' };

  const filtered = tournaments.filter(t =>
    filter === 'all' ? true :
    filter === 'internal' ? t.type === 'internal' :
    filter === 'inter-college' ? t.type === 'inter-college' :
    t.status === filter
  );

  return (
    <Layout title="Events &" subtitle={<span>Tournaments</span>} actions={
      isAdmin && <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Tournament</button>
    }>
      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {[['all','📋 All'],['internal','🏫 BVRIT Internal'],['inter-college','🌆 Inter-College'],['upcoming','📅 Upcoming'],['completed','✅ Completed']].map(([val,label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={filter === val ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>
            {label}
          </button>
        ))}
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {filtered.length === 0 && <div className="empty-state"><div className="empty-icon">🏆</div><p>No tournaments found</p></div>}
          {filtered.map(t => (
            <div key={t._id} className="card">
              <div style={{ padding:24 }}>
                {/* Type badge */}
                <div style={{ display:'flex', gap:10, marginBottom:14, flexWrap:'wrap' }}>
                  <span className={`badge badge-${t.status}`}>{t.status}</span>
                  <span className="badge" style={{
                    background: t.type === 'inter-college' ? 'rgba(58,143,255,0.15)' : 'rgba(240,192,64,0.15)',
                    color:      t.type === 'inter-college' ? 'var(--accent3)' : 'var(--accent)',
                    border:     t.type === 'inter-college' ? '1px solid rgba(58,143,255,0.3)' : '1px solid rgba(240,192,64,0.3)',
                  }}>
                    {t.type === 'inter-college' ? '🌆 Inter-College' : '🏫 BVRIT Internal'}
                  </span>
                  {/* Result badge */}
                  {t.result && (
                    <span className="badge" style={{ background:'rgba(240,192,64,0.1)', border:'1px solid rgba(240,192,64,0.3)', color:'var(--accent)' }}>
                      {t.result}
                    </span>
                  )}
                </div>

                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:20 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                      <span style={{ fontSize:32 }}>{SPORT_EMOJI[t.sport] || '🏅'}</span>
                      <div>
                        <div style={{ fontFamily:'var(--font-heading)', fontSize:20, fontWeight:700, color:'var(--text-primary)' }}>{t.name}</div>
                        <div style={{ fontFamily:'var(--font-heading)', fontSize:12, color:statusColors[t.status], letterSpacing:2, textTransform:'uppercase', marginTop:2 }}>
                          {t.sport} · Hosted by {t.hostCollege}
                        </div>
                      </div>
                    </div>

                    {t.description && <div style={{ color:'var(--text-secondary)', fontSize:14, marginBottom:16, lineHeight:1.6 }}>{t.description}</div>}

                    <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
                      {[['📅','Dates',`${fmtDate(t.startDate)} – ${fmtDate(t.endDate)}`],['📍','Venue',t.venue||'TBD'],['👥','Teams',`${t.teams?.length||0}/${t.maxTeams}`],['🎁','Prize',t.prize||'TBD']].map(([icon,label,value]) => (
                        <div key={label}>
                          <div style={{ fontFamily:'var(--font-heading)', fontSize:10, color:'var(--text-muted)', letterSpacing:2, textTransform:'uppercase' }}>{icon} {label}</div>
                          <div style={{ fontFamily:'var(--font-heading)', fontSize:13, color:'var(--text-primary)', marginTop:2 }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Participating colleges */}
                {t.type === 'inter-college' && t.participatingColleges?.length > 0 && (
                  <div style={{ marginTop:16, paddingTop:14, borderTop:'1px solid var(--border)' }}>
                    <div style={{ fontFamily:'var(--font-heading)', fontSize:11, letterSpacing:2, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:8 }}>
                      🌆 Participating Colleges
                    </div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {t.participatingColleges.map((college, i) => (
                        <span key={i} style={{
                          background: college === 'BVRIT' ? 'rgba(240,192,64,0.15)' : 'var(--bg-primary)',
                          border: college === 'BVRIT' ? '1px solid rgba(240,192,64,0.4)' : '1px solid var(--border)',
                          borderRadius:6, padding:'3px 10px',
                          fontFamily:'var(--font-heading)', fontSize:12,
                          color: college === 'BVRIT' ? 'var(--accent)' : 'var(--text-secondary)',
                          fontWeight: college === 'BVRIT' ? 700 : 400,
                        }}>
                          {college === 'BVRIT' ? '⭐ ' : ''}{college}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Internal teams */}
                {t.type === 'internal' && t.teams?.length > 0 && (
                  <div style={{ marginTop:16, paddingTop:14, borderTop:'1px solid var(--border)' }}>
                    <div style={{ fontFamily:'var(--font-heading)', fontSize:11, letterSpacing:2, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:8 }}>
                      Participating Teams
                    </div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {t.teams.map(team => (
                        <span key={team._id} style={{ background:'var(--bg-primary)', border:'1px solid var(--border)', borderRadius:6, padding:'3px 10px', fontFamily:'var(--font-heading)', fontSize:12, color:'var(--text-secondary)' }}>
                          {team.name}
                        </span>
                      ))}
                    </div>
                  </div>
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
              <span className="modal-title">Create Tournament</span>
              <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tournament Name</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. BVRIT Annual Sports Meet 2024" required />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div className="form-group">
                    <label className="form-label">Sport</label>
                    <select className="form-control" value={form.sport} onChange={e => setForm({...form, sport:e.target.value})}>
                      {SPORTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-control" value={form.type} onChange={e => setForm({...form, type:e.target.value})}>
                      <option value="internal">BVRIT Internal</option>
                      <option value="inter-college">Inter-College</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Host College</label>
                  <input className="form-control" value={form.hostCollege} onChange={e => setForm({...form, hostCollege:e.target.value})} placeholder="BVRIT Hyderabad" />
                </div>
                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <input className="form-control" value={form.venue} onChange={e => setForm({...form, venue:e.target.value})} placeholder="Venue address" />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-control" type="date" value={form.startDate} onChange={e => setForm({...form, startDate:e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input className="form-control" type="date" value={form.endDate} onChange={e => setForm({...form, endDate:e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Prize</label>
                  <input className="form-control" value={form.prize} onChange={e => setForm({...form, prize:e.target.value})} placeholder="Trophy + Certificate" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Tournament details..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Tournament</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
