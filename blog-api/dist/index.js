"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
// 1. SETUP
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const SECRET = "garbage-key"; // We don't care about security anymore
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 2. THE "ANYTHING GOES" LOGIN
// You can enter ANY email and ANY password. It will just work.
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    console.log(`\n🔓 Login attempt for: ${email}`);
    // Try to find user, or just create one on the fly
    let user = yield prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log("✨ New email detected. Creating user automatically...");
        user = yield prisma.user.create({
            data: {
                email,
                name: "Guest User",
                password: "ignored" // We save garbage here
            }
        });
    }
    // Generate a token so the Frontend doesn't break
    const token = jsonwebtoken_1.default.sign({ id: user.id }, SECRET);
    console.log("✅ Login Successful. Token sent.");
    res.json({ token });
}));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, SECRET);
            req.user = decoded;
        }
        catch (e) { } // Ignore errors, just let them pass
    }
    next();
};
// 4. CREATE POST
app.post('/posts', authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // If we don't know who you are, just assign it to User #1 (The Admin)
        const authorId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 1;
        const post = yield prisma.post.create({
            data: {
                title: req.body.title,
                content: req.body.content,
                authorId
            },
        });
        console.log(`📝 Post created by User ${authorId}`);
        res.json(post);
    }
    catch (error) {
        console.error("Post failed:", error);
        res.status(400).json({ error: "Could not create post" });
    }
}));
// 5. FEED
app.get('/feed', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author: true }
    });
    res.json(posts);
}));
// 6. START
app.listen(3000, () => {
    console.log("\n==================================");
    console.log("🚀 OPEN SERVER RUNNING ON PORT 3000");
    console.log("==================================");
});
