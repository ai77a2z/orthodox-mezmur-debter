import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';
import React from 'react';

function Home() {
  const [topHymns, setTopHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/hymns?limit=6')
      .then(res => res.json())
      .then(data => {
        setTopHymns(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="main-content">
      <section className="hero">
        <h1>Welcome to Amharic Mezmur</h1>
        <p>Discover and share your favorite Amharic hymns and spiritual songs</p>
      </section>

      <section className="featured-hymns">
        <h2>Featured Hymns</h2>
        {loading ? (
          <p>Loading hymns...</p>
        ) : (
          <div className="hymn-grid">
            {topHymns.map(hymn => (
              <div key={hymn.id} className="hymn-card" onClick={() => navigate(`/hymn/${hymn.id}`)}>
                <h3>{hymn.title}</h3>
                {hymn.author && <p className="author">By {hymn.author}</p>}
                <p className="preview">
                  {hymn.lyrics.split('\n')[0].substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        )}
        <button className="browse-all" onClick={() => navigate('/browse')}>Browse All Hymns</button>
      </section>

      <section className="info-section">
        <div className="info-card">
          <h3>How To Use</h3>
          <p>Learn how to navigate and make the most of our platform.</p>
          <button onClick={() => navigate('/how-to')}>Learn More</button>
        </div>
        
        <div className="info-card">
          <h3>Donate</h3>
          <p>Support our mission to preserve and share Amharic hymns.</p>
          <button onClick={() => navigate('/donate')}>Donate Now</button>
        </div>
        
        <div className="info-card">
          <h3>Volunteer</h3>
          <p>Join our community of contributors and help us grow.</p>
          <button onClick={() => navigate('/volunteer')}>Get Involved</button>
        </div>
      </section>
    </div>
  );
}
function Browse() {
  const [hymns, setHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/hymns')
      .then(res => res.json())
      .then(data => {
        setHymns(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch hymns.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="main-content"><p>Loading...</p></div>;
  if (error) return <div className="main-content"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!hymns.length) return <div className="main-content"><p>No hymns found.</p></div>;

  return (
    <div className="main-content">
      <h2>Browse Hymns</h2>
      <ul className="browse-list">
        {hymns.map(hymn => (
          <li key={hymn.id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/hymn/${hymn.id}`)}>
            <h3 style={{ marginBottom: 0 }}>{hymn.title}</h3>
            {hymn.author && <p style={{ margin: '0.5rem 0 0.5rem 0' }}><strong>Author:</strong> {hymn.author}</p>}
            <small style={{ color: 'var(--color-muted)' }}>Added: {new Date(hymn.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
function SubmitLyrics() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!title || !lyrics) {
      setStatus({ error: 'Title and lyrics are required.' });
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/submit-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, lyrics })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ success: 'Lyrics submitted successfully!' });
        setTitle(''); setAuthor(''); setLyrics('');
      } else {
        setStatus({ error: data.error || 'Submission failed.' });
      }
    } catch (err) {
      setStatus({ error: 'Network error.' });
    }
  };

  return (
    <div>
      <h2>Submit Lyrics</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div>
          <label>Title*<br/>
            <input value={title} onChange={e => setTitle(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>Author<br/>
            <input value={author} onChange={e => setAuthor(e.target.value)} />
          </label>
        </div>
        <div>
          <label>Lyrics*<br/>
            <textarea value={lyrics} onChange={e => setLyrics(e.target.value)} required rows={6} style={{ width: '100%' }} />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {status?.success && <p style={{ color: 'green' }}>{status.success}</p>}
      {status?.error && <p style={{ color: 'red' }}>{status.error}</p>}
    </div>
  );
}

function SubmitTitles() {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!title) {
      setStatus({ error: 'Title is required.' });
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/submit-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ success: 'Title submitted successfully!' });
        setTitle('');
      } else {
        setStatus({ error: data.error || 'Submission failed.' });
      }
    } catch (err) {
      setStatus({ error: 'Network error.' });
    }
  };

  return (
    <div>
      <h2>Submit Song Titles</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div>
          <label>Title*<br/>
            <input value={title} onChange={e => setTitle(e.target.value)} required />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {status?.success && <p style={{ color: 'green' }}>{status.success}</p>}
      {status?.error && <p style={{ color: 'red' }}>{status.error}</p>}
    </div>
  );
}
function About() {
  return <h2>About</h2>;
}
function Contact() {
  return <h2>Contact</h2>;
}
function Donate() {
  return <h2>Donate</h2>;
}
function Volunteer() {
  return <h2>Volunteer</h2>;
}
function HowToUse() {
  return (
    <div className="how-to-use">
      <div className="container">
        <h1>How to Use Amharic Mezmur</h1>
        
        <section className="section">
          <h2>Getting Started</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create an Account</h3>
                <p>Click on 'Sign Up' in the navigation bar and fill in your details to create a free account. You'll need to provide a valid email address and create a secure password.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Verify Your Email</h3>
                <p>Check your email for a verification link. Click it to activate your account and start using all features.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Browsing Hymns</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Explore the Collection</h3>
                <p>Use the 'Browse' page to view all available hymns. You can scroll through the list or use the search bar to find specific hymns by title or author.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>View Hymn Details</h3>
                <p>Click on any hymn to view its full lyrics, author information, and related hymns.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Contributing Hymns</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Submit New Lyrics</h3>
                <p>Click 'Submit Lyrics' in the navigation menu. Fill in the title, author (if known), and the complete lyrics. Make sure to format the lyrics with line breaks between verses.</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Review Process</h3>
                <p>Your submission will be reviewed by our team to ensure accuracy and quality. You'll be notified once it's approved and published.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Edit Your Submissions</h3>
                <p>View your submitted hymns in your profile and request edits if needed by contacting our support team.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section tips">
          <h2>Tips for Best Experience</h2>
          <ul>
            <li>Use the search function with keywords to quickly find specific hymns</li>
            <li>Create playlists of your favorite hymns for easy access</li>
            <li>Report any issues or inaccuracies you find in hymns</li>
            <li>Share hymns with friends using the share button</li>
          </ul>
        </section>

        <section className="section support">
          <h2>Need Help?</h2>
          <p>If you have any questions or need assistance, please visit our <Link to="/contact">Contact</Link> page or email us at support@amharicmezmur.com</p>
        </section>
      </div>
    </div>
  );
}

function Admin() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState(null);

  const fetchSubmissions = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/submissions')
      .then(res => res.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch submissions.');
        setLoading(false);
      });
  };

  React.useEffect(() => {
    fetchSubmissions();
  }, []);

  const approveSubmission = async (id) => {
    setActionStatus(null);
    try {
      const res = await fetch(`http://localhost:3001/api/submissions/${id}/approve`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActionStatus({ success: 'Submission approved.' });
        fetchSubmissions();
      } else {
        setActionStatus({ error: data.error || 'Approval failed.' });
      }
    } catch {
      setActionStatus({ error: 'Network error.' });
    }
  };

  const deleteSubmission = async (id) => {
    setActionStatus(null);
    try {
      const res = await fetch(`http://localhost:3001/api/submissions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setActionStatus({ success: 'Submission deleted.' });
        fetchSubmissions();
      } else {
        setActionStatus({ error: data.error || 'Delete failed.' });
      }
    } catch {
      setActionStatus({ error: 'Network error.' });
    }
  };

  if (loading) return <div className="main-content"><p>Loading...</p></div>;
  if (error) return <div className="main-content"><p style={{ color: 'red' }}>{error}</p></div>;

  return (
    <div className="main-content">
      <h2>Admin Approval</h2>
      {actionStatus?.success && <p style={{ color: 'green' }}>{actionStatus.success}</p>}
      {actionStatus?.error && <p style={{ color: 'red' }}>{actionStatus.error}</p>}
      {submissions.length === 0 ? (
        <p>No pending submissions.</p>
      ) : (
        <ul className="browse-list">
          {submissions.map(sub => (
            <li key={sub.id} className="card">
              <h3>{sub.title || '(No Title)'}</h3>
              {sub.type === 'lyrics' && (
                <>
                  {sub.author && <p><strong>Author:</strong> {sub.author}</p>}
                  <pre>{sub.lyrics}</pre>
                </>
              )}
              <small style={{ color: 'var(--color-muted)' }}>Submitted: {new Date(sub.created_at).toLocaleString()}</small>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button onClick={() => approveSubmission(sub.id)}>Approve</button>
                <button onClick={() => deleteSubmission(sub.id)} style={{ background: '#b03', color: '#fff' }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HymnDetail() {
  const { id } = useParams();
  const [hymn, setHymn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/hymns/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setHymn(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch hymn.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="main-content"><p>Loading...</p></div>;
  if (error) return <div className="main-content"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!hymn) return null;

  return (
    <div className="main-content">
      <div className="card">
        <h2>{hymn.title}</h2>
        {hymn.author && <p><strong>Author:</strong> {hymn.author}</p>}
        <pre>{hymn.lyrics}</pre>
        <small style={{ color: 'var(--color-muted)' }}>Added: {new Date(hymn.created_at).toLocaleString()}</small>
      </div>
    </div>
  );
}

function Signup({ setAuthUser }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setAuthUser(data.username);
        setStatus({ success: 'Signup successful! Redirecting...' });
        setTimeout(() => navigate('/'), 1000);
      } else {
        setStatus({ error: data.error || 'Signup failed.' });
      }
    } catch {
      setStatus({ error: 'Network error.' });
    }
  };

  return (
    <div className="main-content">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>Username*<br/>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label>Email*<br/>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>Password*<br/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      {status?.success && <p style={{ color: 'green' }}>{status.success}</p>}
      {status?.error && <p style={{ color: 'red' }}>{status.error}</p>}
    </div>
  );
}

function Login({ setAuthUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        setAuthUser(data.username);
        setStatus({ success: 'Login successful! Redirecting...' });
        setTimeout(() => navigate('/'), 1000);
      } else {
        setStatus({ error: data.error || 'Login failed.' });
      }
    } catch {
      setStatus({ error: 'Network error.' });
    }
  };

  return (
    <div className="main-content">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>Username*<br/>
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label>Password*<br/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <button type="submit">Login</button>
      </form>
      {status?.success && <p style={{ color: 'green' }}>{status.success}</p>}
      {status?.error && <p style={{ color: 'red' }}>{status.error}</p>}
    </div>
  );
}

function RequireAuth({ children }) {
  const authUser = localStorage.getItem('username');
  const navigate = useNavigate();
  useEffect(() => {
    if (!authUser) navigate('/login');
  }, [authUser, navigate]);
  return authUser ? children : null;
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in');
      setLoading(false);
      return;
    }
    fetch('http://localhost:3001/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Network error');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="main-content"><p>Loading...</p></div>;
  if (error) return <div className="main-content"><p style={{ color: 'red' }}>{error}</p></div>;
  if (!profile) return null;

  return (
    <div className="main-content">
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Joined:</strong> {new Date(profile.created_at).toLocaleString()}</p>
    </div>
  );
}

function App() {
  const location = useLocation();
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/browse', label: 'Browse' },
    { to: '/submit-lyrics', label: 'Submit Lyrics' },
    { to: '/submit-titles', label: 'Submit Song Titles' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/donate', label: 'Donate' },
    { to: '/volunteer', label: 'Volunteer' },
    { to: '/how-to-use', label: 'How to Use' },
  ];

  // Dark/Light mode state
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'dark';
  });

  useEffect(() => {
    if (mode === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(m => (m === 'dark' ? 'light' : 'dark'));
  };

  // Auth state
  const [authUser, setAuthUser] = useState(() => localStorage.getItem('username'));

  // Update auth state on login/signup/logout
  useEffect(() => {
    const onStorage = () => setAuthUser(localStorage.getItem('username'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setAuthUser(null);
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        background: 'var(--color-bg-light)',
        color: 'var(--color-text)',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: '1rem 0',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {navLinks.map(link => (
            (link.to !== '/login' && link.to !== '/signup' && link.to !== '/profile') && (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  color: location.pathname === link.to ? 'var(--color-accent)' : 'var(--color-primary)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  borderBottom: location.pathname === link.to ? '2px solid var(--color-accent)' : 'none',
                  paddingBottom: 2,
                  transition: 'color 0.2s, border-bottom 0.2s',
                }}
              >
                {link.label}
              </Link>
            )
          ))}
          {!authUser ? (
            <>
              <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Login</Link>
              <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/profile" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Profile</Link>
              <span style={{ color: 'var(--color-muted)', marginLeft: '1rem' }}>Hi, {authUser}</span>
              <button onClick={logout} style={{ marginLeft: '1rem', background: 'var(--color-card)', color: 'var(--color-primary)', border: '1px solid var(--color-border)', borderRadius: 20, padding: '0.4rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Logout</button>
            </>
          )}
          <button onClick={toggleMode} style={{ marginLeft: '2rem', background: 'var(--color-card)', color: 'var(--color-primary)', border: '1px solid var(--color-border)', borderRadius: 20, padding: '0.4rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
            {mode === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </nav>
      <div style={{ marginTop: '90px' }}>
        <Routes>
          <Route path="/" element={<div className="main-content"><Home /></div>} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/submit-lyrics" element={<RequireAuth><div className="main-content"><SubmitLyrics /></div></RequireAuth>} />
          <Route path="/submit-titles" element={<RequireAuth><div className="main-content"><SubmitTitles /></div></RequireAuth>} />
          <Route path="/about" element={<div className="main-content"><About /></div>} />
          <Route path="/contact" element={<div className="main-content"><Contact /></div>} />
          <Route path="/donate" element={<div className="main-content"><Donate /></div>} />
          <Route path="/volunteer" element={<div className="main-content"><Volunteer /></div>} />
          <Route path="/how-to-use" element={<div className="main-content"><HowToUse /></div>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/hymn/:id" element={<HymnDetail />} />
          <Route path="/signup" element={<Signup setAuthUser={setAuthUser} />} />
          <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
