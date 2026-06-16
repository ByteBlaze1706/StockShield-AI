
const API_BASE = "https://stock-shield-ai-api-server.vercel.app/api";

async function runTests() {
  console.log("🚀 Starting E2E Integration Verification Tests...");

  // Generate dynamic unique credentials for testing
  const testId = Math.random().toString(36).substring(7);
  const username = `testuser_${testId}`;
  const email = `test_${testId}@example.com`;
  const password = `securepass123_${testId}`;

  // Helper to store cookies
  let authCookie = null;

  // 1. Verify that unauthorized access to protected resources returns 401
  console.log("\n1. Testing unauthorized access to /watchlist...");
  const resWatchlistUnauth = await fetch(`${API_BASE}/watchlist`);
  console.log(`Status (Expected 401): ${resWatchlistUnauth.status}`);
  if (resWatchlistUnauth.status !== 401) {
    throw new Error("Protected route /watchlist did not return 401 for unauthenticated client");
  }

  // 2. Register a new user
  console.log("\n2. Registering a new user...");
  const resRegister = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });
  console.log(`Status (Expected 201): ${resRegister.status}`);
  if (resRegister.status !== 201) {
    const errData = await resRegister.json().catch(() => ({}));
    throw new Error(`Registration failed: ${JSON.stringify(errData)}`);
  }
  const registerData = await resRegister.json();
  console.log("Registered user response:", JSON.stringify(registerData));
  if (!registerData.user || registerData.user.username !== username) {
    throw new Error("Registration response does not contain the registered user");
  }

  // Save the session cookie
  const setCookie = resRegister.headers.get("set-cookie");
  if (setCookie) {
    authCookie = setCookie.split(";")[0];
    console.log("Captured Session Cookie:", authCookie);
  }

  // 3. Verify that GET /auth/user resolves the registered user
  console.log("\n3. Testing GET /auth/user with session...");
  const resGetUser = await fetch(`${API_BASE}/auth/user`, {
    headers: authCookie ? { Cookie: authCookie } : {}
  });
  console.log(`Status (Expected 200): ${resGetUser.status}`);
  const userData = await resGetUser.json();
  console.log("Current user:", JSON.stringify(userData));
  if (!userData.user || userData.user.email !== email) {
    throw new Error("Current user session could not be resolved");
  }

  // 4. Test login with wrong credentials
  console.log("\n4. Testing login with invalid password...");
  const resLoginFail = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "wrong_password" })
  });
  console.log(`Status (Expected 401): ${resLoginFail.status}`);
  if (resLoginFail.status !== 401) {
    throw new Error("Login with wrong credentials did not fail with 401");
  }

  // 5. Test login with correct credentials
  console.log("\n5. Testing login with correct credentials...");
  const resLoginSuccess = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  console.log(`Status (Expected 200): ${resLoginSuccess.status}`);
  if (resLoginSuccess.status !== 200) {
    throw new Error("Login failed with correct credentials");
  }

  // 6. Test adding to watchlist (scoping)
  console.log("\n6. Testing adding item to watchlist...");
  const resAddWatchlist = await fetch(`${API_BASE}/watchlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authCookie ? { Cookie: authCookie } : {})
    },
    body: JSON.stringify({ ticker: "AAPL", stockName: "Apple Inc." })
  });
  console.log(`Status (Expected 201): ${resAddWatchlist.status}`);
  if (resAddWatchlist.status !== 201) {
    const err = await resAddWatchlist.text();
    throw new Error(`Failed to add watchlist item: ${err}`);
  }
  const watchlistItem = await resAddWatchlist.json();
  console.log("Added Watchlist Item:", JSON.stringify(watchlistItem));

  // 7. Verify watchlist retrieval
  console.log("\n7. Retrieving user watchlist...");
  const resGetWatchlist = await fetch(`${API_BASE}/watchlist`, {
    headers: authCookie ? { Cookie: authCookie } : {}
  });
  console.log(`Status (Expected 200): ${resGetWatchlist.status}`);
  const watchlistItems = await resGetWatchlist.json();
  console.log(`Watchlist items count: ${watchlistItems.length}`);
  if (watchlistItems.length === 0 || watchlistItems[0].ticker !== "AAPL") {
    throw new Error("Watchlist item was not saved or retrieved correctly");
  }

  // 8. Test logout
  console.log("\n8. Logging out...");
  const resLogout = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: authCookie ? { Cookie: authCookie } : {}
  });
  console.log(`Status (Expected 200): ${resLogout.status}`);
  const logoutData = await resLogout.json();
  console.log("Logout response:", JSON.stringify(logoutData));

  // 9. Verify that user session is cleared
  console.log("\n9. Verifying session is cleared...");
  const resGetUserAfterLogout = await fetch(`${API_BASE}/auth/user`, {
    headers: authCookie ? { Cookie: authCookie } : {}
  });
  const userAfterLogout = await resGetUserAfterLogout.json();
  console.log("User session after logout:", JSON.stringify(userAfterLogout));
  if (userAfterLogout.user !== null) {
    throw new Error("User session was not cleared after logout");
  }

  console.log("\n🎉 All E2E Integration Verification Tests Passed Successfully!");
}

runTests().catch(err => {
  console.error("\n❌ E2E Integration Verification Tests Failed:");
  console.error(err);
  process.exit(1);
});
