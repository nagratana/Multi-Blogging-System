import { useEffect, useState } from 'react';
import axios from 'axios';

interface Comment {
  id: number;
  content: string;
  rating?: number;
  author: { name: string };
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: { name: string };
  comments: Comment[];
  createdAt?: string;
}



function App() {
  const [view, setView] = useState<'login' | 'feed' | 'single'>('feed');
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [posts, setPosts] = useState<Post[]>([]);

  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState('');

  // --- DARK MODE STATE ---
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) { document.body.classList.add('dark-mode'); }
    else { document.body.classList.remove('dark-mode'); }
  }, [darkMode]);

  const [email, setEmail] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);

  const BASE_URL = 'http://localhost:4000';

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/feed`);
      setPosts(res.data);
      if (activePost) {
        const updated = res.data.find((p: Post) => p.id === activePost.id);
        if (updated) setActivePost(updated);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchPosts(); }, []);

  // Filter posts based on search query
  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.author.name.toLowerCase().includes(query)
    );
  });

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return alert("Please enter an email");
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password: "password-ignored" });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setView('feed');
      setEmail('');
    } catch (err) { alert("Login failed."); }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setView('feed');
    setActivePost(null);
  };

  const handleCreatePost = async () => {
    if (!token || !newTitle || !newContent) return;
    await axios.post(`${BASE_URL}/posts`,
      { title: newTitle, content: newContent },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewTitle('');
    setNewContent('');
    fetchPosts();
  };

  const handleAddComment = async () => {
    if (!token || !activePost || !newComment) return;
    const payload: { content: string; rating?: number } = { content: newComment };
    if (newRating > 0) {
      payload.rating = newRating;
    }
    await axios.post(`${BASE_URL}/posts/${activePost.id}/comments`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewComment('');
    setNewRating(0);
    fetchPosts();
  };

  const openPost = (post: Post) => {
    setActivePost(post);
    setView('single');
    window.scrollTo(0, 0);
  };

  const goBack = () => {
    setActivePost(null);
    setView('feed');
    setSearchQuery('');
  };

  // --- MOUSE FOLLOWER ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="container">
      <div className="animated-background"></div>
      <div
        className="cursor-glow"
        style={{
          left: mousePos.x,
          top: mousePos.y
        }}
      />

      {/* --- HEADER --- */}
      {view !== 'login' && (
        <header className="fade-in">
          {/* LEFT BUTTON */}
          <div className="header-left">
            <button className="blog-btn" onClick={goBack}>
              <svg className="button-cosm" xmlnsXlink="http://www.w3.org/1999/xlink" fill={darkMode ? "#ffffff" : "#000000"} width="128" height="128" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                <path d="M243.07324,157.43945c-1.2334-1.47949-23.18847-27.34619-60.46972-41.05859-1.67579-17.97412-8.25293-34.36328-18.93653-46.87158C149.41309,52.8208,128.78027,44,104,44,54.51074,44,22.10059,88.57715,20.74512,90.4751a3.99987,3.99987,0,0,0,6.50781,4.65234C27.5625,94.6958,58.68359,52,104,52c22.36816,0,40.89648,7.85107,53.584,22.70508,8.915,10.437,14.65625,23.9541,16.65528,38.894A133.54185,133.54185,0,0,0,136,108c-25.10742,0-46.09473,6.48486-60.69434,18.75391-12.65234,10.63379-19.91015,25.39355-19.91015,40.49463a43.61545,43.61545,0,0,0,12.69336,31.21923C76.98438,207.3208,89.40234,212,104,212c23.98047,0,44.37305-9.4668,58.97461-27.37744,12.74512-15.6333,20.05566-37.145,20.05566-59.01953,0-.1128-.001-.22559-.001-.33838,33.62988,13.48486,53.62207,36.96631,53.89746,37.2959a4.00015,4.00015,0,0,0,6.14648-5.1211ZM104,204c-27.89746,0-40.60449-19.05078-40.60449-36.75146C63.39551,142.56592,86.11621,116,136,116a124.37834,124.37834,0,0,1,38.97266,6.32617q.05712,1.63038.05761,3.27686C175.03027,177.07129,139.29785,204,104,204Z"></path>
              </svg>
              <svg className="highlight" viewBox="0 0 144.75738 77.18431" preserveAspectRatio="none"><g transform="translate(-171.52826,-126.11624)"><g fill="none" strokeWidth="17" strokeLinecap="round" strokeMiterlimit="10"><path d="M180.02826,169.45123c0,0 12.65228,-25.55115 24.2441,-25.66863c6.39271,-0.06479 -5.89143,46.12943 4.90937,50.63857c10.22345,4.2681 24.14292,-52.38336 37.86455,-59.80493c3.31715,-1.79413 -5.35094,45.88889 -0.78872,58.34589c5.19371,14.18125 33.36934,-58.38221 36.43049,-56.91633c4.67078,2.23667 -0.06338,44.42744 5.22574,47.53647c6.04041,3.55065 19.87185,-20.77286 19.87185,-20.77286"></path></g></g></svg>
              BLOG
            </button>
          </div>

          {/* CENTER: SEARCH BAR */}
          <div className="search-input-container">
            <input
              type="text"
              name="text"
              className="search-input"
              placeholder="SEARCH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">
              <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g> <path opacity="1" d="M14 5H20" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="1" d="M14 8H17" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path> <path opacity="1" d="M22 22L20 20" stroke="#000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </span>
          </div>

          {/* RIGHT SIDE: LOGIN + TOGGLE */}
          <div className="header-right">
            {!token ? (
              <button className="login-btn" onClick={() => setView('login')}>
                <div className="login-bgContainer"><span>Login</span><span>Login</span></div>
                <div className="login-arrowContainer"><svg width="25" height="25" viewBox="0 0 45 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M43.7678 20.7678C44.7441 19.7915 44.7441 18.2085 43.7678 17.2322L27.8579 1.32233C26.8816 0.34602 25.2986 0.34602 24.3223 1.32233C23.346 2.29864 23.346 3.88155 24.3223 4.85786L38.4645 19L24.3223 33.1421C23.346 34.1184 23.346 35.7014 24.3223 36.6777C25.2986 37.654 26.8816 37.654 27.8579 36.6777L43.7678 20.7678ZM0 21.5L42 21.5V16.5L0 16.5L0 21.5Z" fill="black"></path></svg></div>
              </button>
            ) : (
              <button className="retro-action-btn" onClick={handleLogout}>LOG OUT</button>
            )}

            <label className="switch">
              <input id="input" type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <div className="slider round">
                <div className="sun-moon">
                  <svg id="moon-dot-1" className="moon-dot" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="moon-dot-2" className="moon-dot" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="moon-dot-3" className="moon-dot" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="light-ray-1" className="light-ray" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="light-ray-2" className="light-ray" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="light-ray-3" className="light-ray" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>

                  <svg id="cloud-1" className="cloud-dark" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="cloud-2" className="cloud-dark" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="cloud-3" className="cloud-dark" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="cloud-4" className="cloud-light" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="cloud-5" className="cloud-light" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="cloud-6" className="cloud-light" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                </div>
                <div className="stars">
                  <svg id="star-1" className="star" viewBox="0 0 20 20">
                    <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                  </svg>
                  <svg id="star-2" className="star" viewBox="0 0 20 20">
                    <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                  </svg>
                  <svg id="star-3" className="star" viewBox="0 0 20 20">
                    <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                  </svg>
                  <svg id="star-4" className="star" viewBox="0 0 20 20">
                    <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                  </svg>
                </div>
              </div>
            </label>
          </div>
        </header>
      )}

      {/* --- LOGIN VIEW --- */}
      {view === 'login' && (
        <div className="fade-in">
          <form className="form" onSubmit={handleLogin}>
            <p>
              Welcome,<span>sign in to continue</span>
            </p>
            <button className="oauthButton" type="button">
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                <path d="M1 1h22v22H1z" fill="none"></path>
              </svg>
              Continue with Google
            </button>
            <button className="oauthButton" type="button">
              <svg className="icon" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
              </svg>
              Continue with Github
            </button>
            <div className="separator">
              <div></div>
              <span>OR</span>
              <div></div>
            </div>
            <input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="oauthButton" type="submit">
              Continue
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 17 5-5-5-5"></path><path d="m13 17 5-5-5-5"></path></svg>
            </button>
          </form>
        </div>
      )}

      {/* --- FEED VIEW --- */}
      {view === 'feed' && (
        <div className="fade-in">
          {token && (
            <div className="nb-card" style={{ background: darkMode ? '#2c2c2c' : '#fff', borderColor: '#3b82f6', marginBottom: '3rem' }}>
              <h3 className="nb-title" style={{ fontSize: '1.5rem', color: darkMode ? '#fff' : '#000' }}>Create Post</h3>
              <input className="neu-input" placeholder="Title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              <textarea className="neu-input" placeholder="Content..." rows={3} value={newContent} onChange={e => setNewContent(e.target.value)} />
              <div className="flex-right">
                <button className="retro-action-btn" onClick={handleCreatePost}>PUBLISH</button>
              </div>
            </div>
          )}

          {/* GRID LAYOUT FOR POSTS */}
          <div className="feed-grid">
            {/* Using filteredPosts here instead of posts to enable searching */}
            {filteredPosts.map(post => (
              <article key={post.id} className="nb-card" onClick={() => openPost(post)}>
                <div className="nb-header">
                  <span className="nb-tag-date">{new Date().toLocaleDateString()}</span>
                  <span className="nb-tag-cat">Blog</span>
                </div>
                <h3 className="nb-title">{post.title}</h3>
                <p className="nb-content" style={{ color: darkMode ? '#ddd' : '#1f2937' }}>"{post.content.substring(0, 100)}..."</p>
                <div className="nb-footer"><p className="nb-author">-{post.author.name}-</p></div>
              </article>
            ))}
          </div>

          {/* Cat Animation */}
          <div className="loader" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            <div className="wrapper">
              <div className="catContainer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 733 673" className="catbody">
                  <path fill="#212121" d="M111.002 139.5C270.502 -24.5001 471.503 2.4997 621.002 139.5C770.501 276.5 768.504 627.5 621.002 649.5C473.5 671.5 246 687.5 111.002 649.5C-23.9964 611.5 -48.4982 303.5 111.002 139.5Z"></path>
                  <path fill="#212121" d="M184 9L270.603 159H97.3975L184 9Z"></path>
                  <path fill="#212121" d="M541 0L627.603 150H454.397L541 0Z"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 158 564" className="tail">
                  <path fill="#191919" d="M5.97602 76.066C-11.1099 41.6747 12.9018 0 51.3036 0V0C71.5336 0 89.8636 12.2558 97.2565 31.0866C173.697 225.792 180.478 345.852 97.0691 536.666C89.7636 553.378 73.0672 564 54.8273 564V564C16.9427 564 -5.4224 521.149 13.0712 488.085C90.2225 350.15 87.9612 241.089 5.97602 76.066Z"></path>
                </svg>
                <div className="text">
                  <span className="bigzzz">Z</span>
                  <span className="zzz">Z</span>
                </div>
              </div>
              <div className="wallContainer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 500 126" className="wall">
                  <line strokeWidth="6" stroke="#7C7C7C" y2="3" x2="450" y1="3" x1="50"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="85" x2="400" y1="85" x1="100"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="122" x2="375" y1="122" x1="125"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="43" x2="500" y1="43"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="1.99391" x2="115.5" y1="43.0061" x1="115.5"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="2.00002" x2="189" y1="43.0122" x1="189"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="2.00612" x2="262.5" y1="43.0183" x1="262.5"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="2.01222" x2="336" y1="43.0244" x1="336"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="2.01833" x2="409.5" y1="43.0305" x1="409.5"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="43" x2="153" y1="84.0122" x1="153"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="43" x2="228" y1="84.0122" x1="228"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="43" x2="303" y1="84.0122" x1="303"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="43" x2="378" y1="84.0122" x1="378"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="84" x2="192" y1="125.012" x1="192"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="84" x2="267" y1="125.012" x1="267"></line>
                  <line strokeWidth="6" stroke="#7C7C7C" y2="84" x2="342" y1="125.012" x1="342"></line>
                </svg>
              </div>
            </div>
          </div>

          {filteredPosts.length === 0 && (
            <div style={{ textAlign: 'center', color: '#888', width: '100%', gridColumn: '1 / -1' }}>
              {posts.length === 0 && !token ? 'No posts yet.' : 'No matching posts found.'}
            </div>
          )}
        </div>
      )}

      {/* --- SINGLE POST VIEW --- */}
      {view === 'single' && activePost && (
        <div className="fade-in">
          <div style={{ marginBottom: '20px' }}>
            <button className="retro-action-btn" onClick={goBack}>&larr; BACK</button>
          </div>

          <article className="nb-card" style={{ cursor: 'default', transform: 'none' }}>
            <div className="nb-header"><span className="nb-tag-date">{new Date().toLocaleDateString()}</span><span className="nb-tag-cat">Read</span></div>
            <h1 className="nb-title" style={{ fontSize: '2.5rem' }}>{activePost.title}</h1>
            <div className="nb-content" style={{ fontStyle: 'normal', borderLeftWidth: '6px', color: darkMode ? '#ddd' : '#1f2937' }}>{activePost.content}</div>
            <div className="nb-footer" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
              <p className="nb-author">Author: {activePost.author.name}</p>

              {/* Comments */}
              <div style={{ width: '100%', borderTop: '2px dashed #000', paddingTop: '20px' }}>
                <h4 style={{ margin: '0 0 15px 0', textTransform: 'uppercase', fontWeight: 900 }}>Comments ({activePost.comments.length})</h4>
                {activePost.comments.map((c, idx) => (
                  <div key={idx} style={{ background: darkMode ? '#333' : '#f3f4f6', padding: '10px', borderLeft: '3px solid #000', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b style={{ textTransform: 'uppercase' }}>{c.author.name}:</b>
                      {(c.rating ?? 0) > 0 && <span style={{ color: '#ff9e0b' }}>{"★".repeat(c.rating ?? 0)}</span>}
                    </div>
                    <div style={{ marginTop: '5px' }}>{c.content}</div>
                  </div>
                ))}

                {token && (
                  <div style={{ marginTop: '20px' }}>
                    <div className="radio">
                      <input id="rating-5" type="radio" name="rating" value="5" checked={newRating === 5} onChange={() => setNewRating(5)} />
                      <label htmlFor="rating-5" title="5 stars">
                        <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                        </svg>
                      </label>

                      <input id="rating-4" type="radio" name="rating" value="4" checked={newRating === 4} onChange={() => setNewRating(4)} />
                      <label htmlFor="rating-4" title="4 stars">
                        <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                        </svg>
                      </label>

                      <input id="rating-3" type="radio" name="rating" value="3" checked={newRating === 3} onChange={() => setNewRating(3)} />
                      <label htmlFor="rating-3" title="3 stars">
                        <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                        </svg>
                      </label>

                      <input id="rating-2" type="radio" name="rating" value="2" checked={newRating === 2} onChange={() => setNewRating(2)} />
                      <label htmlFor="rating-2" title="2 stars">
                        <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                        </svg>
                      </label>

                      <input id="rating-1" type="radio" name="rating" value="1" checked={newRating === 1} onChange={() => setNewRating(1)} />
                      <label htmlFor="rating-1" title="1 star">
                        <svg viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path>
                        </svg>
                      </label>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input className="neu-input" placeholder="Comment..." value={newComment} onChange={e => setNewComment(e.target.value)} style={{ marginBottom: 0, flexGrow: 1 }} />
                      <button className="retro-action-btn" onClick={handleAddComment}>POST</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}

export default App;