import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const SPORT_EMOJI = { Throwball:'🏐', Volleyball:'🏐', Basketball:'🏀', 'Kho-Kho':'🏃', 'Table Tennis':'🏓', Badminton:'🏸', Pickleball:'🏓', Carrom:'🎯' };
const SPORTS_LIST = ['Throwball','Volleyball','Basketball','Kho-Kho','Table Tennis','Badminton','Pickleball','Carrom'];

export function Results() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { API.get('/matches?status=completed').then(({data}) => setMatches(data)).catch(console.error).finally(() => setLoading(false)); }, []);
  const fmt = d => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  return (
    <Layout title="Results">
      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <div className="card">
          <div className="card-header"><span className="card-title">📊 Match Results</span><span style={{ fontFamily:'var(--font-heading)', fontSize:11, color:'var(--text-muted)' }}>{matches.length} matches</span></div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Date</th><th>Sport</th><th>Team A</th><th>Score</th><th>Team B</th><th>Winner</th><th>Venue</th></tr></thead>
              <tbody>
                {matches.length === 0
                  ? <tr><td colSpan={7} style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>No results yet</td></tr>
                  : matches.map(m => {
                    const aWon = m.winner && m.teamA && (m.winner._id===m.teamA._id||m.winner===m.teamA._id);
                    const bWon = m.winner && m.teamB && (m.winner._id===m.teamB._id||m.winner===m.teamB._id);
                    return (
                      <tr key={m._id}>
                        <td style={{ fontFamily:'var(--font-heading)', fontSize:11 }}>{fmt(m.scheduledAt)}</td>
                        <td>{SPORT_EMOJI[m.sport]} {m.sport}</td>
                        <td style={{ fontWeight:aWon?700:400, color:aWon?'var(--accent)':'var(--text-secondary)' }}>{m.teamA?.name}{aWon?' 🏆':''}</td>
                        <td style={{ textAlign:'center', fontFamily:'var(--font-display)', fontSize:20, color:'var(--text-primary)' }}>{m.scoreA}–{m.scoreB}</td>
                        <td style={{ fontWeight:bWon?700:400, color:bWon?'var(--accent)':'var(--text-secondary)' }}>{m.teamB?.name}{bWon?' 🏆':''}</td>
                        <td>{m.winner ? <span style={{ color:'var(--success)', fontFamily:'var(--font-heading)', fontSize:12 }}>{aWon?m.teamA?.name:m.teamB?.name}</span> : <span style={{ color:'var(--text-muted)' }}>Draw</span>}</td>
                        <td style={{ fontSize:11, color:'var(--text-muted)' }}>{m.venue||'—'}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}

export function Calendar() {
  const [matches, setMatches]     = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => { API.get('/matches').then(({data}) => setMatches(data)).catch(console.error); }, []);
  const year=currentDate.getFullYear(), month=currentDate.getMonth();
  const firstDay=new Date(year,month,1).getDay(), daysInMonth=new Date(year,month+1,0).getDate();
  const today=new Date();
  const getMatchesForDay = day => matches.filter(m => { const d=new Date(m.scheduledAt); return d.getFullYear()===year&&d.getMonth()===month&&d.getDate()===day; });
  const monthName=currentDate.toLocaleString('en-IN',{month:'long',year:'numeric'});
  const statusColor={live:'var(--live)',scheduled:'var(--accent)',completed:'var(--success)'};
  return (
    <Layout title="Sports" subtitle={<span style={{ color:'var(--accent)' }}>Calendar</span>}>
      <div style={{ display:'flex', gap:16, marginBottom:16, fontFamily:'var(--font-heading)', fontSize:11 }}>
        {[['Scheduled','var(--accent)'],['Live','var(--live)'],['Completed','var(--success)']].map(([l,c]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:2, background:c }} /><span style={{ color:'var(--text-muted)', letterSpacing:1 }}>{l}</span>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header">
          <button className="btn btn-outline btn-sm" onClick={() => setCurrentDate(new Date(year,month-1))}>← Prev</button>
          <span className="card-title" style={{ fontSize:18 }}>{monthName}</span>
          <button className="btn btn-outline btn-sm" onClick={() => setCurrentDate(new Date(year,month+1))}>Next →</button>
        </div>
        <div style={{ padding:16 }}>
          <div className="calendar-grid">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="calendar-day-header">{d}</div>)}
            {Array.from({length:firstDay}).map((_,i) => <div key={`e${i}`} className="calendar-day other-month" />)}
            {Array.from({length:daysInMonth}).map((_,i) => {
              const day=i+1; const dayMatches=getMatchesForDay(day);
              const isToday=today.getDate()===day&&today.getMonth()===month&&today.getFullYear()===year;
              return (
                <div key={day} className={`calendar-day${isToday?' today':''}`}>
                  <div className="calendar-day-num" style={{ color:isToday?'var(--accent)':undefined }}>{day}</div>
                  {dayMatches.map(m => (
                    <div key={m._id} className="calendar-event" style={{ background:`${statusColor[m.status]||'var(--accent)'}20`, color:statusColor[m.status]||'var(--accent)' }}>
                      {SPORT_EMOJI[m.sport]} {m.teamA?.name?.split(' ')[0]} vs {m.teamB?.name?.split(' ')[0]}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ marginTop:20 }}>
        <div style={{ fontFamily:'var(--font-heading)', fontSize:11, letterSpacing:2, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:12 }}>Matches This Month</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {matches.filter(m => { const d=new Date(m.scheduledAt); return d.getMonth()===month&&d.getFullYear()===year; }).sort((a,b) => new Date(a.scheduledAt)-new Date(b.scheduledAt)).map(m => (
            <div key={m._id} style={{ display:'flex', alignItems:'center', gap:14, background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 14px' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:24, color:'var(--accent)', width:32, textAlign:'center' }}>{new Date(m.scheduledAt).getDate()}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'var(--font-heading)', fontSize:13, color:'var(--text-primary)', fontWeight:700 }}>{m.teamA?.name} vs {m.teamB?.name}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{SPORT_EMOJI[m.sport]} {m.sport} · {m.venue||'TBD'} · {new Date(m.scheduledAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>
              </div>
              <span className={`badge badge-${m.status}`}>{m.status}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export function Gallery() {
  const cats = [
    {sport:'Throwball',   emoji:'🏐', desc:'Inter-dept Throwball Championship',    shots:24},
    {sport:'Volleyball',  emoji:'🏐', desc:'JNTUH Champions — Women\'s Volleyball', shots:38},
    {sport:'Basketball',  emoji:'🏀', desc:'VNR VJIET Champions — Basketball',      shots:20},
    {sport:'Kho-Kho',     emoji:'🏃', desc:'Osmania Univ Kho-Kho League',          shots:15},
    {sport:'Table Tennis',emoji:'🏓', desc:'MGIT Champions — Table Tennis',         shots:22},
    {sport:'Badminton',   emoji:'🏸', desc:'Vasavi College Badminton Runner-up',    shots:18},
    {sport:'Pickleball',  emoji:'🏓', desc:'BVRIT Pickleball Open 2024',            shots:12},
    {sport:'Carrom',      emoji:'🎯', desc:'Inter-dept Carrom Championship',        shots:16},
  ];
  return (
    <Layout title="Sports" subtitle={<span style={{ color:'var(--accent)' }}>Gallery</span>}>
      <div style={{ fontFamily:'var(--font-heading)', color:'var(--text-muted)', fontSize:12, letterSpacing:1, marginBottom:24 }}>📸 Sports memories from BVRIT Hyderabad & inter-college events</div>
      <div className="grid-4">
        {cats.map(({sport,emoji,desc,shots}) => (
          <div key={sport} className="card" style={{ cursor:'pointer' }}>
            <div style={{ height:120, background:'linear-gradient(135deg,rgba(124,111,247,.15),rgba(224,92,138,.08))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:52, borderBottom:'1px solid var(--border)', position:'relative' }}>
              {emoji}
              <div style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,.5)', borderRadius:20, padding:'2px 8px', fontSize:10, fontFamily:'var(--font-heading)', color:'#fff', letterSpacing:1 }}>{shots}</div>
            </div>
            <div style={{ padding:'12px 16px' }}>
              <div style={{ fontFamily:'var(--font-heading)', fontSize:14, fontWeight:700, color:'var(--text-primary)', marginBottom:3 }}>{sport}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:10 }}>{desc}</div>
              <span className="badge badge-scheduled" style={{ fontSize:9 }}>View Album</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export function Notifications() {
  const notifs = [
    {icon:'🔴', title:'CSE Smashers vs ECE Spikers is now LIVE — Throwball',    time:'2 min ago',  type:'danger'},
    {icon:'🏆', title:'BVRIT wins JNTUH Volleyball Championship!',              time:'1 hour ago', type:'success'},
    {icon:'👥', title:'You have been added to CSE Smashers team roster',        time:'2 hours ago',type:'info'},
    {icon:'📢', title:'New announcement: Annual Sports Meet — Nov 1–5',         time:'3 hours ago',type:'warning'},
    {icon:'📅', title:'New match scheduled: Kho-Kho on Nov 2 at 8 AM',         time:'1 day ago',  type:'info'},
    {icon:'🥈', title:'BVRIT wins Runner-up at CBIT Throwball Tournament',      time:'3 days ago', type:'success'},
    {icon:'✅', title:'Your attendance has been marked for today\'s match',     time:'3 days ago', type:'info'},
  ];
  const typeStyle = {danger:'rgba(255,68,102,.3)',success:'rgba(58,197,160,.3)',info:'rgba(124,111,247,.3)',warning:'rgba(240,160,48,.3)'};
  return (
    <Layout title="Notifications">
      <div style={{ maxWidth:680 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ fontFamily:'var(--font-heading)', fontSize:11, letterSpacing:2, color:'var(--text-muted)', textTransform:'uppercase' }}>{notifs.length} notifications</div>
          <button className="btn btn-outline btn-sm">Mark All Read</button>
        </div>
        {notifs.map((n,i) => (
          <div key={i} style={{ display:'flex', gap:14, padding:'14px 18px', background:'var(--bg-card)', border:'1px solid var(--border)', borderLeft:`3px solid ${typeStyle[n.type]}`, borderRadius:10, marginBottom:8, alignItems:'flex-start' }}>
            <span style={{ fontSize:20, flexShrink:0, marginTop:2 }}>{n.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'var(--font-heading)', fontSize:14, color:'var(--text-primary)', marginBottom:3 }}>{n.title}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)', fontFamily:'var(--font-heading)', letterSpacing:.5 }}>🕐 {n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export function Help() {
  const [openIdx, setOpenIdx] = useState(null);
  const faqs = [
    {q:'How do I register as a student?', a:'Click Register on the login page, select your branch (CSE/CSE-AIML/EEE/ECE), enter your roll number, and select the sports you are interested in.'},
    {q:'What sports are available at BVRIT?', a:'BVRIT offers 8 sports: Throwball, Volleyball, Basketball, Kho-Kho, Table Tennis, Badminton, Pickleball, and Carrom.'},
    {q:'How do I join a team?', a:'Go to the Teams page, filter by your preferred sport, and click "+ Join Team" on any available team.'},
    {q:'How are live scores updated?', a:'Sports Faculty and Admin update live scores from the Live Scores page. Scores auto-refresh every 15 seconds for all viewers.'},
    {q:'How can I view inter-college tournaments?', a:'Go to Events & Tournaments and click the "Inter-College" filter to see all tournaments BVRIT has participated in across Hyderabad colleges.'},
    {q:'How are leaderboard points calculated?', a:'Win = 3 points, Draw = 1 point, Loss = 0 points. Teams are ranked by points first, then by number of wins.'},
    {q:'How do I mark attendance for a match?', a:'Click the "✅ Mark Attendance" button on any upcoming or live match card to record your presence.'},
    {q:'Who can post announcements and schedule matches?', a:'Only Sports Faculty and Admin roles can post announcements, schedule matches, update scores, and manage tournaments.'},
  ];
  return (
    <Layout title="Help &" subtitle={<span style={{ color:'var(--accent)' }}>Support</span>}>
      <div style={{ maxWidth:700 }}>
        <div className="card" style={{ marginBottom:24 }}>
          <div style={{ padding:28, textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🏅</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:26, color:'var(--accent)', letterSpacing:2, marginBottom:8 }}>BVRIT PlayNet Support</div>
            <div style={{ color:'var(--text-secondary)', fontSize:13, lineHeight:1.7 }}>
              For technical issues, contact the Sports Department.<br />
              📧 sports@bvrit.ac.in · 📍 Sports Room, BVRIT Hyderabad
            </div>
          </div>
        </div>
        <div style={{ fontFamily:'var(--font-heading)', fontSize:11, letterSpacing:2, color:'var(--text-muted)', textTransform:'uppercase', marginBottom:14 }}>Frequently Asked Questions</div>
        {faqs.map((f,i) => (
          <div key={i} className="card" style={{ marginBottom:8 }}>
            <div onClick={() => setOpenIdx(openIdx===i?null:i)} style={{ padding:'14px 18px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontFamily:'var(--font-heading)', fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>❓ {f.q}</div>
              <span style={{ color:'var(--accent)', fontSize:16, flexShrink:0, marginLeft:10 }}>{openIdx===i?'▲':'▼'}</span>
            </div>
            {openIdx===i && <div style={{ padding:'0 18px 14px', fontSize:13, color:'var(--text-secondary)', lineHeight:1.7, borderTop:'1px solid var(--border)', paddingTop:12 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <Layout title="My Profile">
      <div style={{ maxWidth:580 }}>
        <div className="card">
          <div style={{ padding:'28px 24px', textAlign:'center', borderBottom:'1px solid var(--border)', background:'linear-gradient(135deg,rgba(124,111,247,.08),rgba(224,92,138,.05))' }}>
            <div style={{ width:76, height:76, borderRadius:'50%', background:'linear-gradient(135deg,var(--accent),var(--accent2))', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontSize:38, color:'#fff', margin:'0 auto 14px', border:'3px solid var(--border-accent)' }}>{user.name?.charAt(0)}</div>
            <div style={{ fontFamily:'var(--font-heading)', fontSize:22, fontWeight:700, color:'var(--text-primary)' }}>{user.name}</div>
            <div style={{ fontFamily:'var(--font-heading)', fontSize:11, letterSpacing:3, color:'var(--text-muted)', textTransform:'uppercase', marginTop:4 }}>{user.role} · {user.department}</div>
            {user.sports?.length > 0 && (
              <div style={{ display:'flex', gap:6, justifyContent:'center', flexWrap:'wrap', marginTop:12 }}>
                {user.sports.map(s => <span key={s} className="badge badge-scheduled" style={{ fontSize:10 }}>{SPORT_EMOJI[s]} {s}</span>)}
              </div>
            )}
          </div>
          <div style={{ padding:'8px 24px 20px' }}>
            {[['📧','Email',user.email],['🎫','Roll Number',user.rollNumber],['🏫','Branch',user.department],['📚','Year',user.year],['📱','Phone',user.phone]].map(([icon,label,value]) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontSize:18, width:22 }}>{icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-heading)', fontSize:9, letterSpacing:2, color:'var(--text-muted)', textTransform:'uppercase' }}>{label}</div>
                  <div style={{ fontFamily:'var(--font-heading)', fontSize:14, color: value?'var(--text-primary)':'var(--text-muted)', marginTop:2 }}>{value||'—'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
