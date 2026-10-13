import React, { useEffect, useState } from 'react';

const API = 'http://localhost:5000/api';
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

function StatCard({ label, value, icon }) {
  return <div className="stat-card"><span className="stat-icon">{icon}</span><div><p>{label}</p><strong>{value}</strong></div></div>;
}
function SectionTitle({ eyebrow, title, subtitle }) {
  return <div className="section-title"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2><p>{subtitle}</p></div></div>;
}

export default function App() {
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('Overview');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [memberForm, setMemberForm] = useState({ name: '', email: '', phone: '', membershipType: 'Basic' });
  const [trainerForm, setTrainerForm] = useState({ name: '', email: '', specialty: '', experienceYears: 0 });
  const [packageForm, setPackageForm] = useState({ name: '', description: '', durationWeeks: 4, price: '', trainerId: '' });
  const [bookingForm, setBookingForm] = useState({ memberId: '', trainerId: '', slotDate: '', slotTime: '10:00', notes: '' });

  async function loadData() {
    setBusy(true);
    try {
      const [m, t, p, b] = await Promise.all([
        request('/members'), request('/trainers'), request('/packages'), request('/bookings')
      ]);
      setMembers(m); setTrainers(t); setPackages(p); setBookings(b);
      setNotice('');
    } catch (e) { setNotice(`${e.message}. Check that the backend and MySQL are running.`); }
    finally { setBusy(false); }
  }
  useEffect(() => { loadData(); }, []);

  async function submit(path, body, reset, success) {
    try {
      await request(path, { method: 'POST', body: JSON.stringify(body) });
      reset(); setNotice(success); await loadData();
    } catch (e) { setNotice(e.message); }
  }
  async function cancelBooking(id) {
    try { await request(`/bookings/${id}/cancel`, { method: 'PATCH' }); setNotice('Booking cancelled.'); await loadData(); }
    catch (e) { setNotice(e.message); }
  }

  const nav = ['Overview', 'Members', 'Trainers', 'Workout Packages', 'Bookings'];
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">G</div><div><strong>GYM<span>FLOW</span></strong><small>MEMBERSHIP STUDIO</small></div></div>
      <div className="side-label">WORKSPACE</div>
      <nav>{nav.map((item, i) => <button key={item} className={tab === item ? 'nav-item active' : 'nav-item'} onClick={() => setTab(item)}><span>{['◈','♙','✦','▤','◷'][i]}</span>{item}{tab === item && <i />}</button>)}</nav>
      <div className="sidebar-bottom"><div className="avatar">GF</div><div><b>Gym Admin</b><small>Workspace manager</small></div><span className="dots">•••</span></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <b>{tab}</b></div><div className="top-actions"><span className="status-dot"></span><span>System overview</span><div className="top-avatar">A</div></div></header>
      <div className="page-wrap">
        <div className="welcome-row"><div><p className="eyebrow">GYMFLOW DASHBOARD</p><h1>{tab === 'Overview' ? 'Your gym, in sync.' : tab}</h1><p className="subhead">{tab === 'Overview' ? 'Manage memberships, coaching and every training session.' : `Manage your ${tab.toLowerCase()} in one place.`}</p></div><button className="refresh-btn" onClick={loadData}>↻ <span>Refresh data</span></button></div>
        {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
        {tab === 'Overview' && <>
          <div className="stats-grid"><StatCard label="Total Members" value={members.length} icon="♙"/><StatCard label="Personal Trainers" value={trainers.length} icon="✦"/><StatCard label="Workout Packages" value={packages.length} icon="▤"/><StatCard label="All Bookings" value={bookings.length} icon="◷"/></div>
          <div className="content-grid">
            <section className="panel"><SectionTitle eyebrow="SCHEDULE" title="Upcoming sessions" subtitle="Your member and trainer bookings."/><BookingTable bookings={bookings.slice(0, 5)} onCancel={cancelBooking}/></section>
            <section className="panel trainer-panel"><SectionTitle eyebrow="YOUR COACHES" title="Meet the trainers" subtitle="Specialists ready to help."/>
              {trainers.slice(0, 4).map((t, i) => <div className="trainer-line" key={t.id}><div className={`trainer-avatar tone-${i % 4}`}>{t.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</div><div className="trainer-info"><b>{t.name}</b><small>{t.specialty} · {t.experienceYears} yrs experience</small></div><span className="arrow">↗</span></div>)}
              {!trainers.length && <Empty text="No trainers yet. Add your first trainer in the Trainers section."/>}
            </section>
          </div>
          <section className="panel package-panel"><SectionTitle eyebrow="TRAINING PLANS" title="Workout packages" subtitle="Packages offered by your trainers."/><PackageCards packages={packages.slice(0, 3)}/></section>
        </>}
        {tab === 'Members' && <div className="content-grid"><section className="panel"><SectionTitle eyebrow="MEMBERSHIP" title="Add a member" subtitle="Create a member profile."/><form className="form-grid" onSubmit={e => {e.preventDefault(); submit('/members', memberForm, () => setMemberForm({name:'',email:'',phone:'',membershipType:'Basic'}), 'Member added successfully.')}}><Field label="Full name"><input required value={memberForm.name} onChange={e=>setMemberForm({...memberForm,name:e.target.value})} placeholder="e.g. Priya Sharma"/></Field><Field label="Email"><input required type="email" value={memberForm.email} onChange={e=>setMemberForm({...memberForm,email:e.target.value})} placeholder="name@email.com"/></Field><Field label="Phone"><input value={memberForm.phone} onChange={e=>setMemberForm({...memberForm,phone:e.target.value})} placeholder="+91..."/></Field><Field label="Membership"><select value={memberForm.membershipType} onChange={e=>setMemberForm({...memberForm,membershipType:e.target.value})}><option>Basic</option><option>Standard</option><option>Premium</option></select></Field><button className="primary-btn" type="submit">+ Add member</button></form></section><section className="panel"><SectionTitle eyebrow="DIRECTORY" title="Members" subtitle={`${members.length} registered members`}/><div className="simple-list">{members.map(m=><div className="simple-row" key={m.id}><div className="mini-avatar">{m.name[0]}</div><div><b>{m.name}</b><small>{m.email}</small></div><span className="pill">{m.membershipType}</span></div>)}{!members.length&&<Empty text="Members will appear here after you add them."/ >}</div></section></div>}
        {tab === 'Trainers' && <div className="content-grid"><section className="panel"><SectionTitle eyebrow="COACHING TEAM" title="Add a trainer" subtitle="Register a personal trainer."/><form className="form-grid" onSubmit={e=>{e.preventDefault();submit('/trainers',trainerForm,()=>setTrainerForm({name:'',email:'',specialty:'',experienceYears:0}),'Trainer added successfully.')}}><Field label="Full name"><input required value={trainerForm.name} onChange={e=>setTrainerForm({...trainerForm,name:e.target.value})} placeholder="Trainer name"/></Field><Field label="Email"><input required type="email" value={trainerForm.email} onChange={e=>setTrainerForm({...trainerForm,email:e.target.value})} placeholder="trainer@email.com"/></Field><Field label="Specialty"><input required value={trainerForm.specialty} onChange={e=>setTrainerForm({...trainerForm,specialty:e.target.value})} placeholder="Strength, Yoga, HIIT..."/></Field><Field label="Experience (years)"><input type="number" min="0" value={trainerForm.experienceYears} onChange={e=>setTrainerForm({...trainerForm,experienceYears:Number(e.target.value)})}/></Field><button className="primary-btn" type="submit">+ Add trainer</button></form></section><section className="panel"><SectionTitle eyebrow="TEAM DIRECTORY" title="Trainers" subtitle={`${trainers.length} personal trainers`}/><div className="simple-list">{trainers.map((t,i)=><div className="simple-row" key={t.id}><div className={`trainer-avatar tone-${i%4}`}>{t.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</div><div><b>{t.name}</b><small>{t.specialty} · {t.email}</small></div><span className="pill">{t.experienceYears} yrs</span></div>)}{!trainers.length&&<Empty text="Add trainers to begin building your coaching team."/ >}</div></section></div>}
        {tab === 'Workout Packages' && <div className="content-grid"><section className="panel"><SectionTitle eyebrow="PROGRAM DESIGN" title="Create package" subtitle="Assign each package to a trainer."/><form className="form-grid" onSubmit={e=>{e.preventDefault();submit('/packages',{...packageForm,trainerId:Number(packageForm.trainerId),durationWeeks:Number(packageForm.durationWeeks),price:Number(packageForm.price)},()=>setPackageForm({name:'',description:'',durationWeeks:4,price:'',trainerId:''}),'Workout package created.')}}><Field label="Package name"><input required value={packageForm.name} onChange={e=>setPackageForm({...packageForm,name:e.target.value})} placeholder="e.g. Strength Starter"/></Field><Field label="Trainer"><select required value={packageForm.trainerId} onChange={e=>setPackageForm({...packageForm,trainerId:e.target.value})}><option value="">Choose trainer</option>{trainers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></Field><Field label="Duration (weeks)"><input required type="number" min="1" value={packageForm.durationWeeks} onChange={e=>setPackageForm({...packageForm,durationWeeks:e.target.value})}/></Field><Field label="Price (₹)"><input required type="number" min="0" step="0.01" value={packageForm.price} onChange={e=>setPackageForm({...packageForm,price:e.target.value})} placeholder="4999"/></Field><Field label="Description"><textarea value={packageForm.description} onChange={e=>setPackageForm({...packageForm,description:e.target.value})} placeholder="What is included?"/></Field><button className="primary-btn" type="submit" disabled={!trainers.length}>+ Create package</button>{!trainers.length&&<small className="hint">Add a trainer before creating a package.</small>}</form></section><section className="panel"><SectionTitle eyebrow="AVAILABLE PROGRAMS" title="Workout packages" subtitle={`${packages.length} programs available`}/><PackageCards packages={packages}/></section></div>}
        {tab === 'Bookings' && <div className="content-grid"><section className="panel"><SectionTitle eyebrow="SESSION PLANNER" title="Book a training slot" subtitle="Choose a member, trainer, date and time."/><form className="form-grid" onSubmit={e=>{e.preventDefault();submit('/bookings',{...bookingForm,memberId:Number(bookingForm.memberId),trainerId:Number(bookingForm.trainerId)},()=>setBookingForm({memberId:'',trainerId:'',slotDate:'',slotTime:'10:00',notes:''}),'Training session booked.')}}><Field label="Member"><select required value={bookingForm.memberId} onChange={e=>setBookingForm({...bookingForm,memberId:e.target.value})}><option value="">Choose member</option>{members.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></Field><Field label="Trainer"><select required value={bookingForm.trainerId} onChange={e=>setBookingForm({...bookingForm,trainerId:e.target.value})}><option value="">Choose trainer</option>{trainers.map(t=><option key={t.id} value={t.id}>{t.name} — {t.specialty}</option>)}</select></Field><Field label="Date"><input required type="date" min={new Date().toISOString().slice(0,10)} value={bookingForm.slotDate} onChange={e=>setBookingForm({...bookingForm,slotDate:e.target.value})}/></Field><Field label="Time"><select value={bookingForm.slotTime} onChange={e=>setBookingForm({...bookingForm,slotTime:e.target.value})}>{['06:00','07:00','08:00','09:00','10:00','11:00','12:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t=><option key={t}>{t}</option>)}</select></Field><Field label="Notes"><textarea value={bookingForm.notes} onChange={e=>setBookingForm({...bookingForm,notes:e.target.value})} placeholder="Training goals or notes"/></Field><button className="primary-btn" type="submit" disabled={!members.length||!trainers.length}>+ Book session</button></form></section><section className="panel"><SectionTitle eyebrow="BOOKING REGISTER" title="All sessions" subtitle={`${bookings.length} sessions recorded`}/><BookingTable bookings={bookings} onCancel={cancelBooking}/></section></div>}
        <footer>GYMFLOW <span>·</span> Built for better training days <span className="footer-right">{busy ? 'Syncing data…' : 'Connected to your workspace'}</span></footer>
      </div>
    </main>
  </div>;
}

function Field({label,children}) { return <label className="field"><span>{label}</span>{children}</label>; }
function Empty({text}) { return <div className="empty-state">{text}</div>; }
function PackageCards({packages}) {
  if (!packages.length) return <Empty text="No workout packages yet. Create a package to show it here."/>;
  return <div className="package-grid">{packages.map((p,i)=><div className="package-card" key={p.id}><div className={`package-symbol symbol-${i%3}`}>{['↗','◉','✳'][i%3]}</div><div className="package-duration">{p.durationWeeks} WEEKS</div><h3>{p.name}</h3><p>{p.description || 'A guided training plan designed around your goals.'}</p><div className="package-bottom"><div><small>PROGRAM PRICE</small><strong>₹{Number(p.price).toLocaleString('en-IN')}</strong></div><span>{p.Trainer?.name || 'Assigned trainer'}</span></div></div>)}</div>;
}
function BookingTable({bookings,onCancel}) {
  if (!bookings.length) return <Empty text="No sessions scheduled yet."/>;
  return <div className="table-wrap"><table><thead><tr><th>MEMBER / TRAINER</th><th>DATE & TIME</th><th>STATUS</th><th></th></tr></thead><tbody>{bookings.map(b=><tr key={b.id}><td><b>{b.Member?.name || `Member #${b.memberId}`}</b><small>{b.Trainer?.name || `Trainer #${b.trainerId}`}</small></td><td>{b.slotDate}<small>{b.slotTime}</small></td><td><span className={`status-pill ${b.status.toLowerCase()}`}>{b.status}</span></td><td>{b.status==='Booked'&&<button className="cancel-btn" onClick={()=>onCancel(b.id)} title="Cancel booking">×</button>}</td></tr>)}</tbody></table></div>;
}
