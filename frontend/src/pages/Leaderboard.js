import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../api';

const SPORTS = ['All','Throwball','Volleyball','Basketball','Kho-Kho','Table Tennis','Badminton','Pickleball','Carrom'];
const SPORT_EMOJI = { Throwball:'🏐', Volleyball:'🏐', Basketball:'🏀', 'Kho-Kho':'🏃', 'Table Tennis':'🏓', Badminton:'🏸', Pickleball:'🏓', Carrom:'🎯' };

export default function Leaderboard() {
  const [teams, setTeams]   = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const sport = filter !== 'All' ? `?sport=${encodeURIComponent(filter)}` : '';
    API.get(`/users/leaderboard${sport}`)
      .then(({ data }) => setTeams(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const rankClass = i => i===0?'gold':i===1?'silver':i===2?'bronze':'';
  const rankEmoji = i => i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`;

  return (
    <Layout title="Leaderboards">
      <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
        {SPORTS.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={filter===s ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>
            {s!=='All' && SPORT_EMOJI[s]} {s}
          </button>
        ))}
      </div>

      {/* Podium top 3 */}
      {teams.length >= 3 && (
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:14, marginBottom:32, padding:'0 20px' }}>
          {[1,0,2].map(idx => {
            const t = teams[idx]; if (!t) return null;
            const h = [140,180,120][[1,0,2].indexOf(idx)];
            const colors = ['rgba(170,170,170,.3)','rgba(245,200,66,.3)','rgba(205,128,64,.3)'];
            const ci = [1,0,2].indexOf(idx);
            return (
              <div key={t._id} style={{ textAlign:'center', flex:1, maxWidth:180 }}>
                <div style={{ fontFamily:'var(--font-heading)', fontSize:13, color:'var(--text-secondary)', marginBottom:6 }}>{t.name}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:26, color:ci===1?'#f5c842':ci===0?'#aaa':'#cd8040' }}>{t.points} pts</div>
                <div style={{ height:h, marginTop:10, background:colors[ci], border:`1px solid ${colors[ci]}`, borderRadius:'8px 8px 0 0', display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:10, fontSize:28 }}>
                  {rankEmoji(idx)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <span className="card-title">🏆 Full Standings — {filter}</span>
          <span style={{ fontFamily:'var(--font-heading)', fontSize:11, color:'var(--text-muted)', letterSpacing:1 }}>{teams.length} teams</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Rank</th><th>Team</th><th>Sport</th><th style={{ textAlign:'center' }}>W</th><th style={{ textAlign:'center' }}>L</th><th style={{ textAlign:'center' }}>D</th><th style={{ textAlign:'center' }}>Pts</th><th>Form</th></tr>
            </thead>
            <tbody>
              {loading
                ? <tr><td colSpan={8} style={{ textAlign:'center', padding:28 }}><div className="spinner" style={{ margin:'0 auto' }} /></td></tr>
                : teams.length === 0
                  ? <tr><td colSpan={8} style={{ textAlign:'center', padding:28, color:'var(--text-muted)' }}>No teams found</td></tr>
                  : teams.map((t, i) => (
                    <tr key={t._id}>
                      <td><div className={`lb-rank ${rankClass(i)}`}>{rankEmoji(i)}</div></td>
                      <td>
                        <div style={{ fontFamily:'var(--font-heading)', fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>{SPORT_EMOJI[t.sport]} {t.name}</div>
                      </td>
                      <td><span className="badge badge-scheduled">{t.sport}</span></td>
                      <td style={{ textAlign:'center', color:'var(--success)', fontFamily:'var(--font-heading)', fontWeight:700 }}>{t.wins}</td>
                      <td style={{ textAlign:'center', color:'var(--danger)', fontFamily:'var(--font-heading)', fontWeight:700 }}>{t.losses}</td>
                      <td style={{ textAlign:'center', color:'var(--warning)', fontFamily:'var(--font-heading)', fontWeight:700 }}>{t.draws}</td>
                      <td style={{ textAlign:'center' }}>
                        <span style={{ fontFamily:'var(--font-display)', fontSize:22, color:'var(--text-primary)' }}>{t.points}</span>
                      </td>
                      <td>
                        <div style={{ display:'flex', gap:3 }}>
                          {Array.from({ length:Math.min(t.wins,5) }).map((_,j) => <div key={j} style={{ width:7, height:7, borderRadius:2, background:'var(--success)' }} />)}
                          {Array.from({ length:Math.min(t.losses,3) }).map((_,j) => <div key={j} style={{ width:7, height:7, borderRadius:2, background:'var(--danger)' }} />)}
                        </div>
                      </td>
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
