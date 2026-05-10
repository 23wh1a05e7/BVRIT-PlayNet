import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const SPORT_EMOJI = { Throwball:'🏐', Volleyball:'🏐', Basketball:'🏀', 'Kho-Kho':'🏃', 'Table Tennis':'🏓', Badminton:'🏸', Pickleball:'🏓', Carrom:'🎯' };

export default function LiveScores() {
  const { user }        = useAuth();
  const [liveMatches, setLive] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [updateForm, setUpdateForm] = useState({});
  const isAdmin = user?.role === 'admin' || user?.role === 'faculty';

  const fetchLive = async () => {
    try { const { data } = await API.get('/matches/live'); setLive(data); }
    catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchLive();
    const interval = setInterval(fetchLive, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleScoreUpdate = async (matchId) => {
    const f = updateForm[matchId] || {};
    try {
      await API.put(`/matches/${matchId}/score`, { scoreA: parseInt(f.scoreA)||0, scoreB: parseInt(f.scoreB)||0, status: f.status||'live' });
      fetchLive();
    } catch(e) { alert('Error updating score'); }
  };

  return (
    <Layout title="Live" subtitle={<span style={{ color:'var(--live)' }}>Scores</span>}>
      <div style={{ background:'rgba(163,45,45,.05)', border:'1px solid rgba(163,45,45,.2)', borderRadius:10, padding:'10px 18px', marginBottom:20, display:'flex', alignItems:'center', gap:10, fontFamily:'var(--font-heading)', fontSize:12, color:'var(--text-secondary)', letterSpacing:1 }}>
        <span className="live-dot" />Auto-refreshes every 15 seconds · {new Date().toLocaleTimeString('en-IN')}
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> :
        liveMatches.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📺</div><p>No matches live right now</p></div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {liveMatches.map(m => (
              <div key={m._id} style={{ background:'var(--bg-card)', border:'1px solid rgba(163,45,45,.3)', borderRadius:16, overflow:'hidden' }}>
                <div style={{ background:'linear-gradient(135deg,rgba(163,45,45,.08),rgba(255,68,102,.05))', padding:'14px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(163,45,45,.2)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:28 }}>{SPORT_EMOJI[m.sport]||'🏅'}</span>
                    <span style={{ fontFamily:'var(--font-heading)', fontSize:16, fontWeight:700, letterSpacing:1 }}>{m.sport}</span>
                  </div>
                  <span className="badge badge-live"><span className="live-dot" />LIVE</span>
                </div>
                <div style={{ padding:'28px 22px' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:20 }}>
                    <div style={{ flex:1, textAlign:'center' }}>
                      <div style={{ fontFamily:'var(--font-heading)', fontSize:18, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>{m.teamA?.name}</div>
                      <div style={{ fontFamily:'var(--font-display)', fontSize:64, color:'var(--accent)', lineHeight:1 }}>{m.scoreA}</div>
                    </div>
                    <div style={{ textAlign:'center', flexShrink:0 }}>
                      <div style={{ fontFamily:'var(--font-heading)', color:'var(--text-muted)', fontSize:13, letterSpacing:3, marginBottom:6 }}>VS</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-heading)' }}>📍 {m.venue}</div>
                    </div>
                    <div style={{ flex:1, textAlign:'center' }}>
                      <div style={{ fontFamily:'var(--font-heading)', fontSize:18, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>{m.teamB?.name}</div>
                      <div style={{ fontFamily:'var(--font-display)', fontSize:64, color:'var(--accent)', lineHeight:1 }}>{m.scoreB}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:'center', marginTop:14, color:'var(--text-muted)', fontFamily:'var(--font-heading)', fontSize:12, letterSpacing:1 }}>
                    👥 {m.attendees?.length||0} watching
                  </div>
                </div>
                {isAdmin && (
                  <div style={{ padding:'14px 22px', borderTop:'1px solid var(--border)', background:'rgba(0,0,0,.2)' }}>
                    <div style={{ fontFamily:'var(--font-heading)', fontSize:11, letterSpacing:2, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:10 }}>⚙️ Update Score</div>
                    <div style={{ display:'flex', gap:10, alignItems:'flex-end', flexWrap:'wrap' }}>
                      {[['scoreA', m.teamA?.name], ['scoreB', m.teamB?.name]].map(([key, label]) => (
                        <div key={key}>
                          <label className="form-label">{label}</label>
                          <input className="form-control" type="number" min="0" style={{ width:90 }}
                            defaultValue={key==='scoreA'?m.scoreA:m.scoreB}
                            onChange={e => setUpdateForm(f => ({ ...f, [m._id]: { ...f[m._id], [key]: e.target.value } }))} />
                        </div>
                      ))}
                      <div>
                        <label className="form-label">Status</label>
                        <select className="form-control" style={{ width:140 }} defaultValue="live"
                          onChange={e => setUpdateForm(f => ({ ...f, [m._id]: { ...f[m._id], status: e.target.value } }))}>
                          <option value="live">🔴 Live</option>
                          <option value="completed">✅ Completed</option>
                          <option value="cancelled">❌ Cancelled</option>
                        </select>
                      </div>
                      <button className="btn btn-primary" onClick={() => handleScoreUpdate(m._id)}>Update Score</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
    </Layout>
  );
}
