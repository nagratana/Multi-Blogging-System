const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET = "memory-key";
const PORT = 4000;

app.use(cors());
app.use(express.json());

// --- IN-MEMORY DATABASE ---
let USERS = []; 
let POSTS = [];
let ID_COUNTER = 1;

// --- LOGGING ---
app.use((req, res, next) => {
    console.log(`🔔 ${req.method} ${req.url}`);
    next();
});

// --- LOGIN (Auto-Creates User based on Email) ---
app.post('/login', (req, res) => {
    const { email } = req.body;
    
    // 1. Generate a Username from the email (everything before @)
    // e.g., "nags@gmail.com" -> "nags"
    const derivedName = email.split('@')[0];

    let user = USERS.find(u => u.email === email);
    if (!user) {
        console.log(`✨ Creating New User: ${derivedName}`);
        user = { id: ID_COUNTER++, email: email, name: derivedName };
        USERS.push(user);
    }

    const token = jwt.sign({ id: user.id }, SECRET);
    res.json({ token });
});

// --- HELPER: Get User from Token ---
function getUserFromToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, SECRET);
        return USERS.find(u => u.id === decoded.id);
    } catch (e) {
        return null;
    }
}

// --- CREATE POST ---
app.post('/posts', (req, res) => {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({error: "Unauthorized"});

    const newPost = {
        id: POSTS.length + 1,
        title: req.body.title,
        content: req.body.content,
        author: { name: user.name }, // <--- USES REAL NAME NOW
        comments: [] // <--- Empty list for future comments
    };
    
    POSTS.unshift(newPost);
    console.log(`📝 Post created by ${user.name}`);
    res.json(newPost);
});

// --- ADD COMMENT (New Feature!) ---
app.post('/posts/:postId/comments', (req, res) => {
    const user = getUserFromToken(req);
    if (!user) return res.status(401).json({error: "Unauthorized"});

    const { postId } = req.params;
    const { content } = req.body;

    // Find the post in memory
    const post = POSTS.find(p => p.id == postId);
    if (!post) return res.status(404).json({error: "Post not found"});

    const newComment = {
        id: Math.random(), // Simple random ID
        content: content,
        author: { name: user.name } // <--- The Commenter's Name
    };

    post.comments.push(newComment);
    console.log(`💬 ${user.name} commented on Post #${postId}`);
    res.json(newComment);
});

// --- FEED ---
app.get('/feed', (req, res) => {
    res.json(POSTS);
});

// --- START ---
app.listen(PORT, () => {
    console.log("\n=========================================");
    console.log(`🚀 INTERACTIVE SERVER RUNNING ON PORT ${PORT}`);
    console.log("   - Real Usernames Enabled");
    console.log("   - Comments Enabled");
    console.log("=========================================\n");
});

// Keep alive
setInterval(() => {}, 100000);