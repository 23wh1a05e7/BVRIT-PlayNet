import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SE = { Throwball:'🏐', Volleyball:'🏐', Basketball:'🏀', 'Kho-Kho':'🏃', 'Table Tennis':'🏓', Badminton:'🏸', Pickleball:'🏓', Carrom:'🎯' };

export default function Dashboard() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [anns, setAnns]       = useState([]);
  const [teams, setTeams]     = useState([]);
  const [tours, setTours]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get('/matches'), API.get('/announcements'), API.get('/teams'), API.get('/tournaments')])
      .then(([m,a,t,tr]) => { setMatches(m.data); setAnns(a.data.slice(0,4)); setTeams(t.data); setTours(tr.data); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const live     = matches.filter(m => m.status === 'live');
  const upcoming = matches.filter(m => m.status === 'scheduled').slice(0,4);
  const interTours = tours.filter(t => t.type === 'inter-college' && t.result);
  const fmt  = d => new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
  const fmtT = d => new Date(d).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'});

  if (loading) return <Layout title="Dashboard"><div className="loading-screen"><div className="spinner"/><span style={{color:'var(--text-muted)',fontSize:13}}>Loading PlayNet...</span></div></Layout>;

  return (
    <Layout title="Dashboard" actions={
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        {live.length > 0 && <span className="badge badge-live"><span className="live-dot"/>Live {live.length}</span>}
        <span style={{fontSize:13,color:'var(--text-muted)'}}>3 alerts</span>
        <div className="user-avatar" style={{width:30,height:30,fontSize:13}}>{user?.name?.charAt(0)}</div>
      </div>
    }>
      {/* Welcome */}
      <div style={{background:'linear-gradient(135deg,#E6F1FB,#EAF3DE)',border:'0.5px solid #B5D4F4',borderRadius:'var(--radius-md)',padding:'18px 22px',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontSize:18,fontWeight:500,color:'var(--text-primary)'}}>Welcome back, {user?.name?.split(' ')[0]}!</div>
          <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:3}}>{user?.department} · {user?.year} Year · {user?.role?.charAt(0).toUpperCase()+user?.role?.slice(1)}</div>
        </div>
        <div style={{fontSize:32}}>🏆</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[['🏅',matches.length,'Total Matches'],['👥',teams.length,'Active Teams'],['🏆',tours.length,'Tournaments'],['🔴',live.length,'Live Now'],['🌆',tours.filter(t=>t.type==='inter-college').length,'Inter-College']].map(([icon,val,label]) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-info"><div className="stat-value">{val}</div><div className="stat-label">{label}</div></div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{marginBottom:16}}>
        {/* Live Matches */}
        <div className="card">
          <div className="card-header"><span className="card-title">Live Matches</span><Link to="/live" className="btn btn-outline btn-sm">View All</Link></div>
          <div className="card-body">
            {live.length === 0
              ? <div className="empty-state" style={{padding:'20px 0'}}><div className="empty-icon" style={{fontSize:28}}>📺</div><p>No live matches</p></div>
              : live.map(m => (
                <div key={m._id} className="match-card live" style={{marginBottom:10}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                    <span style={{fontSize:13,color:'var(--text-secondary)'}}>{SE[m.sport]} {m.sport}</span>
                    <span className="badge badge-live"><span className="live-dot"/>LIVE</span>
                  </div>
                  <div className="match-teams">
                    <div className="match-team"><div className="match-team-name" style={{fontSize:13}}>{m.teamA?.name}</div></div>
                    <div className="match-score" style={{fontSize:28}}>{m.scoreA}–{m.scoreB}</div>
                    <div className="match-team"><div className="match-team-name" style={{fontSize:13}}>{m.teamB?.name}</div></div>
                  </div>
                  <div style={{fontSize:11,color:'var(--text-muted)',marginTop:8}}>📍 {m.venue}</div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Announcements */}
        <div className="card">
          <div className="card-header"><span className="card-title">Announcements</span><Link to="/announcements" className="btn btn-outline btn-sm">View All</Link></div>
          <div className="card-body">
            {anns.map(a => (
              <div key={a._id} className="announcement-item">
                <div className="ann-icon">{a.priority==='high'?'🚨':a.priority==='medium'?'📌':'📝'}</div>
                <div style={{flex:1}}>
                  <div className="ann-title">{a.title}</div>
                  <div className="ann-content" style={{WebkitLineClamp:2,display:'-webkit-box',WebkitBoxOrient:'vertical',overflow:'hidden'}}>{a.content}</div>
                  <div className="ann-meta">
                    <span className={`badge badge-${a.priority}`}>{a.priority}</span>
                    <span>{fmt(a.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inter-college results */}
      {interTours.length > 0 && (
        <div className="card" style={{marginBottom:16}}>
          <div className="card-header"><span className="card-title">Inter-College Results</span><Link to="/tournaments" className="btn btn-outline btn-sm">All Tournaments</Link></div>
          <div className="card-body">
            <div className="grid-3" style={{gap:10}}>
              {interTours.slice(0,3).map(t => (
                <div key={t._id} style={{background:'var(--bg-secondary)',border:'0.5px solid var(--border)',borderRadius:'var(--radius-sm)',padding:12}}>
                  <div style={{fontSize:20,marginBottom:5}}>{SE[t.sport]}</div>
                  <div style={{fontSize:12,fontWeight:500,color:'var(--text-primary)',marginBottom:2}}>{t.sport}</div>
                  <div style={{fontSize:10,color:'var(--text-muted)',marginBottom:6}}>{t.hostCollege}</div>
                  <div style={{fontSize:12,fontWeight:500,color:t.result.includes('🏆')?'var(--success)':t.result.includes('🥈')?'var(--text-muted)':'var(--warning)'}}>{t.result}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming schedule */}
      <div className="card">
        <div className="card-header"><span className="card-title">Upcoming Matches</span><Link to="/matches" className="btn btn-outline btn-sm">Full Schedule</Link></div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Sport</th><th>Team A</th><th>vs</th><th>Team B</th><th>Venue</th><th>Date & Time</th><th>Status</th></tr></thead>
            <tbody>
              {upcoming.length === 0
                ? <tr><td colSpan={7} style={{textAlign:'center',padding:24,color:'var(--text-muted)'}}>No upcoming matches</td></tr>
                : upcoming.map(m => (
                  <tr key={m._id}>
                    <td style={{fontWeight:500,color:'var(--accent)'}}>{SE[m.sport]} {m.sport}</td>
                    <td style={{fontWeight:500,color:'var(--text-primary)'}}>{m.teamA?.name}</td>
                    <td style={{color:'var(--text-muted)',fontSize:11}}>VS</td>
                    <td style={{fontWeight:500,color:'var(--text-primary)'}}>{m.teamB?.name}</td>
                    <td style={{fontSize:12}}>{m.venue}</td>
                    <td style={{fontSize:12}}>{fmt(m.scheduledAt)} · {fmtT(m.scheduledAt)}</td>
                    <td><span className={`badge badge-${m.status}`}>{m.status}</span></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
