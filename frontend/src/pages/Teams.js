import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const SPORTS = ['All','Throwball','Volleyball','Basketball','Kho-Kho','Table Tennis','Badminton','Pickleball','Carrom'];
const SPORT_EMOJI  = { Throwball:'🏐', Volleyball:'🏐', Basketball:'🏀', 'Kho-Kho':'🏃', 'Table Tennis':'🏓', Badminton:'🏸', Pickleball:'🏓', Carrom:'🎯' };
const SPORT_COLOR  = { Throwball:'#E91E63', Volleyball:'#9C27B0', Basketball:'#FF9800', 'Kho-Kho':'#FF5722', 'Table Tennis':'#2196F3', Badminton:'#00BCD4', Pickleball:'#4CAF50', Carrom:'#795548' };

export default function Teams() {
  const { user } = useAuth();
  const [teams, setTeams]       = useState([]);
  const [filter, setFilter]     = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]         = useState({ name:'', sport:'Throwball', coach:'', description:'' });
  const [loading, setLoading]   = useState(true);
  const [msg, setMsg]           = useState('');

  const fetchTeams = async () => {
    try {
      const sport = filter !== 'All' ? `?sport=${encodeURIComponent(filter)}` : '';
      const { data } = await API.get(`/teams${sport}`);
      setTeams(data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTeams(); }, [filter]);

  const handleCreate = async e => {
    e.preventDefault();
    try {
      await API.post('/teams', form);
      setShowModal(false);
      setMsg('✅ Team created successfully!');
      fetchTeams();
    } catch(e) { setMsg('❌ ' + (e.response?.data?.message || 'Error')); }
  };

  const handleJoin = async id => {
    try { await API.post(`/teams/${id}/join`); setMsg('✅ Joined team!'); fetchTeams(); }
    catch(e) { setMsg('❌ ' + (e.response?.data?.message || 'Error')); }
  };

  return (
    <Layout title="Teams" actions={
      <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Team</button>
    }>
      {msg && (
        <div className="error-msg" style={{ background: msg.startsWith('✅') ? 'rgba(46,204,113,0.1)' : undefined, borderColor: msg.startsWith('✅') ? 'rgba(46,204,113,0.3)' : undefined, color: msg.startsWith('✅') ? 'var(--success)' : undefined, marginBottom:20 }}>{msg}</div>
      )}

      {/* Sport Filter */}
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {SPORTS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={filter === s ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>
            {s !== 'All' && SPORT_EMOJI[s]} {s}
          </button>
        ))}
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <div className="grid-3">
          {teams.map(team => {
            const isMember  = team.members?.some(m => m._id === user?._id || m === user?._id);
            const isCaptain = team.captain?._id === user?._id || team.captain === user?._id;
            const color     = SPORT_COLOR[team.sport] || '#f0c040';
            return (
              <div key={team._id} className="card" style={{ display:'flex', flexDirection:'column' }}>
                <div style={{ background:`linear-gradient(135deg, ${color}22, transparent)`, padding:'24px 20px 20px', borderBottom:'1px solid var(--border)', textAlign:'center' }}>
                  <div style={{ fontSize:52, marginBottom:8 }}>{SPORT_EMOJI[team.sport] || '🏅'}</div>
                  <div style={{ fontFamily:'var(--font-heading)', fontSize:18, fontWeight:700, color:'var(--text-primary)' }}>{team.name}</div>
                  <div style={{ color, fontFamily:'var(--font-heading)', fontSize:12, letterSpacing:2, textTransform:'uppercase', marginTop:4 }}>{team.sport}</div>
                </div>
                <div style={{ padding:'16px 20px', flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-around', marginBottom:16 }}>
                    {[['W',team.wins,'var(--success)'],['L',team.losses,'var(--danger)'],['D',team.draws,'var(--warning)'],['PTS',team.points,'var(--accent)']].map(([k,v,c]) => (
                      <div key={k} style={{ textAlign:'center' }}>
                        <div style={{ fontFamily:'var(--font-display)', fontSize:22, color:c }}>{v}</div>
                        <div style={{ fontSize:10, color:'var(--text-muted)', fontFamily:'var(--font-heading)', letterSpacing:2 }}>{k}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:4 }}>👥 {team.members?.length||0} members{team.coach ? ` · 🏋️ ${team.coach}` : ''}</div>
                  {team.captain?.name && <div style={{ fontSize:12, color:'var(--text-secondary)' }}>⭐ Captain: {team.captain.name}</div>}
                  {team.description && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:8, fontStyle:'italic' }}>{team.description}</div>}
                </div>
                <div style={{ padding:'12px 20px', borderTop:'1px solid var(--border)' }}>
                  {isCaptain ? (
                    <span style={{ fontFamily:'var(--font-heading)', fontSize:12, color:'var(--accent)', letterSpacing:1 }}>⭐ You are Captain</span>
                  ) : isMember ? (
                    <span style={{ fontFamily:'var(--font-heading)', fontSize:12, color:'var(--success)', letterSpacing:1 }}>✅ Member</span>
                  ) : (
                    <button className="btn btn-outline btn-sm" style={{ width:'100%' }} onClick={() => handleJoin(team._id)}>+ Join Team</button>
                  )}
                </div>
              </div>
            );
          })}
          {teams.length === 0 && <div className="empty-state" style={{ gridColumn:'1/-1' }}><div className="empty-icon">👥</div><p>No teams found</p></div>}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create New Team</span>
              <button onClick={() => setShowModal(false)} className="btn btn-outline btn-sm">✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Team Name</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. CSE Smashers" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Sport</label>
                  <select className="form-control" value={form.sport} onChange={e => setForm({...form, sport:e.target.value})}>
                    {SPORTS.slice(1).map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Coach Name</label>
                  <input className="form-control" value={form.coach} onChange={e => setForm({...form, coach:e.target.value})} placeholder="Optional" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm({...form, description:e.target.value})} placeholder="Brief description..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Team</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
