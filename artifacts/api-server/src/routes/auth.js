import { Router } from "express";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { RegisterUserBody, LoginUserBody } from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";
import { clearSession, getSessionId, createSession, SESSION_COOKIE, SESSION_TTL } from "../lib/auth.js";

const router = Router();

function setSessionCookie(res, sid) {
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL
  });
}

router.get("/auth/user", (req, res) => {
  res.json({
    user: req.isAuthenticated() ? req.user : null
  });
});

router.post("/auth/register", async (req, res) => {
  const parsed = RegisterUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.errors[0]?.message || "Invalid registration input"
    });
    return;
  }

  const { username, email, password } = parsed.data;

  try {
    // Check if user already exists (by username or email)
    const existing = await db.select().from(usersTable).where(
      or(
        eq(usersTable.email, email.toLowerCase()),
        eq(usersTable.username, username.toLowerCase())
      )
    );

    if (existing.length > 0) {
      res.status(400).json({
        error: "Username or Email is already registered"
      });
      return;
    }

    // Hash the password securely with bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the new user
    const [newUser] = await db.insert(usersTable).values({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      emailVerified: false
    }).returning();

    // Create secure session
    const now = Math.floor(Date.now() / 1000);
    const sessionData = {
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName || null,
        lastName: newUser.lastName || null,
        profileImageUrl: newUser.profileImageUrl || null
      },
      expires_at: now + SESSION_TTL / 1000
    };

    const sid = await createSession(sessionData);
    setSessionCookie(res, sid);

    res.status(201).json({
      user: sessionData.user
    });
  } catch (error) {
    req.log.error({ err: error }, "User registration error");
    res.status(500).json({
      error: "Internal server error during registration"
    });
  }
});

router.post("/auth/login", async (req, res) => {
  const parsed = LoginUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: parsed.error.errors[0]?.message || "Invalid login input"
    });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const [dbUser] = await db.select().from(usersTable).where(
      eq(usersTable.email, email.toLowerCase())
    );

    if (!dbUser) {
      res.status(401).json({
        error: "Invalid email or password"
      });
      return;
    }

    // Verify hash
    const isValid = await bcrypt.compare(password, dbUser.passwordHash);
    if (!isValid) {
      res.status(401).json({
        error: "Invalid email or password"
      });
      return;
    }

    // Create session
    const now = Math.floor(Date.now() / 1000);
    const sessionData = {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        username: dbUser.username,
        firstName: dbUser.firstName || null,
        lastName: dbUser.lastName || null,
        profileImageUrl: dbUser.profileImageUrl || null
      },
      expires_at: now + SESSION_TTL / 1000
    };

    const sid = await createSession(sessionData);
    setSessionCookie(res, sid);

    res.json({
      user: sessionData.user
    });
  } catch (error) {
    req.log.error({ err: error }, "User login error");
    res.status(500).json({
      error: "Internal server error during login"
    });
  }
});

router.post("/auth/logout", async (req, res) => {
  try {
    const sid = getSessionId(req);
    await clearSession(res, sid);
    res.json({
      success: true
    });
  } catch (error) {
    req.log.error({ err: error }, "User logout error");
    res.status(500).json({
      error: "Internal server error during logout"
    });
  }
});

export default router;