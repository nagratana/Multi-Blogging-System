import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import cors from 'cors'; 

// 1. SETUP
const prisma = new PrismaClient();
const app = express();
const SECRET = "garbage-key"; // We don't care about security anymore

app.use(cors());
app.use(express.json());

// 2. THE "ANYTHING GOES" LOGIN
// You can enter ANY email and ANY password. It will just work.
app.post('/login', async (req, res) => {
  const { email } = req.body;
  console.log(`\n🔓 Login attempt for: ${email}`);

  // Try to find user, or just create one on the fly
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log("✨ New email detected. Creating user automatically...");
    user = await prisma.user.create({
      data: { 
        email, 
        name: "Guest User", 
        password: "ignored" // We save garbage here
      }
    });
  }

  // Generate a token so the Frontend doesn't break
  const token = jwt.sign({ id: user.id }, SECRET);
  console.log("✅ Login Successful. Token sent.");
  res.json({ token });
});

// 3. DUMB AUTH MIDDLEWARE
// We still need this to know WHO is posting, but it trusts the token we just made.
interface AuthRequest extends Request { user?: { id: number } }

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, SECRET) as { id: number };
      req.user = decoded;
    } catch (e) {} // Ignore errors, just let them pass
  }
  next();
};

// 4. CREATE POST
app.post('/posts', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // If we don't know who you are, just assign it to User #1 (The Admin)
    const authorId = req.user?.id || 1; 
    
    const post = await prisma.post.create({
      data: { 
        title: req.body.title, 
        content: req.body.content, 
        authorId 
      },
    });
    console.log(`📝 Post created by User ${authorId}`);
    res.json(post);
  } catch (error) {
    console.error("Post failed:", error);
    res.status(400).json({ error: "Could not create post" });
  }
});

// 5. FEED
app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  });
  res.json(posts);
});

// 6. START
app.listen(3000, () => {
  console.log("\n==================================");
  console.log("🚀 OPEN SERVER RUNNING ON PORT 3000");
  console.log("==================================");
});