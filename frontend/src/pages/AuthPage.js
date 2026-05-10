import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SPORTS   = ['Throwball','Volleyball','Basketball','Kho-Kho','Table Tennis','Badminton','Pickleball','Carrom'];
const BRANCHES = ['CSE','CSE-AIML','EEE','ECE'];
const YEARS    = ['1st','2nd','3rd','4th'];
const SE = { Throwball:'🏐', Volleyball:'🏐', Basketball:'🏀', 'Kho-Kho':'🏃', 'Table Tennis':'🏓', Badminton:'🏸', Pickleball:'🏓', Carrom:'🎯' };

export default function AuthPage() {
  const [tab, setTab]     = useState('login');
  const [error, setError] = useState('');
  const [form, setForm]   = useState({ name:'', email:'', password:'', role:'student', rollNumber:'', department:'CSE', year:'1st', phone:'', sports:[] });
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({...form,[e.target.name]:e.target.value});
  const toggleSport  = s => setForm(f => ({...f, sports: f.sports.includes(s) ? f.sports.filter(x=>x!==s) : [...f.sports,s]}));

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    const result = tab==='login' ? await login(form.email,form.password) : await register(form);
    if (result.success) navigate('/');
    else setError(result.message);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-big">PlayNet</div>
          <div className="logo-sub">BVRIT Hyderabad · Women's College of Engineering</div>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab${tab==='login'?' active':''}`}    onClick={() => {setTab('login');setError('');}}>Login</button>
          <button className={`auth-tab${tab==='register'?' active':''}`} onClick={() => {setTab('register');setError('');}}>Register</button>
        </div>

        {error && <div className="error-msg">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-control" name="role" value={form.role} onChange={handleChange}>
                  <option value="student">Student</option>
                  <option value="faculty">Sports Faculty</option>
                </select>
              </div>
              {form.role==='student' && (
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div className="form-group">
                    <label className="form-label">Roll Number</label>
                    <input className="form-control" name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="21BQ1A0501"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <select className="form-control" name="year" value={form.year} onChange={handleChange}>
                      {YEARS.map(y=><option key={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Branch</label>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:4}}>
                  {BRANCHES.map(b => (
                    <button type="button" key={b} onClick={() => setForm({...form,department:b})}
                      style={{padding:'4px 14px',borderRadius:20,fontSize:12,cursor:'pointer',transition:'all .15s',
                        background:form.department===b?'var(--accent)':'var(--bg-secondary)',
                        color:form.department===b?'#fff':'var(--text-secondary)',
                        border:`0.5px solid ${form.department===b?'var(--accent)':'var(--border-strong)'}`}}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX"/>
              </div>
              <div className="form-group">
                <label className="form-label">Sports Interests</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:4}}>
                  {SPORTS.map(s => (
                    <button type="button" key={s} onClick={() => toggleSport(s)}
                      style={{padding:'4px 12px',borderRadius:20,fontSize:11,cursor:'pointer',transition:'all .15s',
                        background:form.sports.includes(s)?'var(--accent-light)':'var(--bg-secondary)',
                        color:form.sports.includes(s)?'var(--accent)':'var(--text-secondary)',
                        border:`0.5px solid ${form.sports.includes(s)?'var(--accent)':'var(--border-strong)'}`}}>
                      {SE[s]} {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@bvrit.ac.in" required/>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required/>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%',marginTop:6}} disabled={loading}>
            {loading ? '⏳ Please wait...' : tab==='login' ? 'Login to PlayNet' : 'Create Account'}
          </button>
        </form>

        <div style={{textAlign:'center',marginTop:18,fontSize:11,color:'var(--text-muted)'}}>
          BVRIT Hyderabad College of Engineering for Women
        </div>
      </div>
    </div>
  );
}
