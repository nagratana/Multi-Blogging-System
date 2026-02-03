var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function runSecureTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const BASE_URL = 'http://localhost:3000';
        const email = `secureUser${Date.now()}@example.com`;
        const password = "complexPassword123";
        console.log("🔐 Starting SECURE API Test...\n");
        // 1. REGISTER
        console.log("1. Registering User...");
        yield fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name: "Secure Alice" })
        });
        console.log("✅ Registered.");
        // 2. LOGIN (Get Token)
        console.log("\n2. Logging In...");
        const loginRes = yield fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const { token } = yield loginRes.json();
        console.log("✅ Login Success. Token received:", token.substring(0, 20) + "...");
        // 3. Create Post (USING TOKEN)
        console.log("\n3. Creating Post with Token...");
        const postRes = yield fetch(`${BASE_URL}/posts`, {
            method: 'POST',
            // NOTICE: We attach the token to the header now!
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: "My Secure Blog",
                content: "Nobody can fake this post."
            })
        });
        if (postRes.status === 200) {
            const post = yield postRes.json();
            console.log("✅ Post Created ID:", post.id);
        }
        else {
            console.log("❌ Failed:", yield postRes.json());
        }
    });
}
runSecureTest();
