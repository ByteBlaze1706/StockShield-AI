import { Router } from "express";
import { GetCurrentAuthUserResponse, ExchangeMobileAuthorizationCodeBody, ExchangeMobileAuthorizationCodeResponse, LogoutMobileSessionResponse } from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";
import { clearSession, getSessionId, createSession, deleteSession, SESSION_COOKIE, SESSION_TTL } from "../lib/auth.js";

const router = Router();

function getSafeReturnTo(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

function setSessionCookie(res, sid) {
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL
  });
}

async function upsertUser(claims) {
  const userData = {
    id: claims.sub,
    email: claims.email || null,
    firstName: claims.first_name || null,
    lastName: claims.last_name || null,
    profileImageUrl: claims.profile_image_url || claims.picture
  };
  const [user] = await db.insert(usersTable).values(userData).onConflictDoUpdate({
    target: usersTable.id,
    set: {
      ...userData,
      updatedAt: new Date()
    }
  }).returning();
  return user;
}

router.get("/auth/user", (req, res) => {
  res.json(GetCurrentAuthUserResponse.parse({
    user: req.isAuthenticated() ? req.user : null
  }));
});

router.get("/login", async (req, res) => {
  const returnTo = getSafeReturnTo(req.query.returnTo);
  const dbUser = await upsertUser({
    sub: "demo-user-id",
    email: "demo@stockshield.ai",
    first_name: "Demo",
    last_name: "User",
    profile_image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=demo"
  });

  const now = Math.floor(Date.now() / 1000);
  const sessionData = {
    user: {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      profileImageUrl: dbUser.profileImageUrl
    },
    expires_at: now + 7 * 24 * 60 * 60
  };

  const sid = await createSession(sessionData);
  setSessionCookie(res, sid);
  res.redirect(returnTo);
});

router.get("/callback", (req, res) => {
  res.redirect("/dashboard");
});

router.get("/logout", async (req, res) => {
  const sid = getSessionId(req);
  await clearSession(res, sid);
  res.redirect("/");
});

router.post("/mobile-auth/token-exchange", async (req, res) => {
  const parsed = ExchangeMobileAuthorizationCodeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Missing or invalid required parameters"
    });
    return;
  }
  try {
    const dbUser = await upsertUser({
      sub: "demo-user-id",
      email: "demo@stockshield.ai",
      first_name: "Demo",
      last_name: "User",
      profile_image_url: "https://api.dicebear.com/7.x/bottts/svg?seed=demo"
    });

    const now = Math.floor(Date.now() / 1000);
    const sessionData = {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        profileImageUrl: dbUser.profileImageUrl
      },
      expires_at: now + 7 * 24 * 60 * 60
    };

    const sid = await createSession(sessionData);
    res.json(ExchangeMobileAuthorizationCodeResponse.parse({
      token: sid
    }));
  } catch (err) {
    req.log.error({
      err
    }, "Mobile token exchange error");
    res.status(500).json({
      error: "Token exchange failed"
    });
  }
});

router.post("/mobile-auth/logout", async (req, res) => {
  const sid = getSessionId(req);
  if (sid) await deleteSession(sid);
  res.json(LogoutMobileSessionResponse.parse({
    success: true
  }));
});

export default router;