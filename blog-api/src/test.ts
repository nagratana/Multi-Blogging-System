async function runSecureTest() {
  const BASE_URL = 'http://localhost:3000';
  const email = `secureUser${Date.now()}@example.com`;
  const password = "complexPassword123";

  console.log("🔐 Starting SECURE API Test...\n");

  // 1. REGISTER
  console.log("1. Registering User...");
  await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name: "Secure Alice" })
  });
  console.log("✅ Registered.");

  // 2. LOGIN (Get Token)
  console.log("\n2. Logging In...");
  const loginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const { token } = await loginRes.json();
  console.log("✅ Login Success. Token received:", token.substring(0, 20) + "...");

  // 3. Create Post (USING TOKEN)
  console.log("\n3. Creating Post with Token...");
  const postRes = await fetch(`${BASE_URL}/posts`, {
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
    const post = await postRes.json();
    console.log("✅ Post Created ID:", post.id);
  } else {
    console.log("❌ Failed:", await postRes.json());
  }
}

runSecureTest();