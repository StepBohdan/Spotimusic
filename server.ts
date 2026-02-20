import express from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Secret } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import "dotenv/config";


const ACCESS_SECRET = (process.env.JWT_ACCESS_SECRET as string) || "ACCESS_SECRET_DEMO";
const REFRESH_SECRET = (process.env.JWT_REFRESH_SECRET as string) || "REFRESH_SECRET_DEMO";

type User = {
  id: string;
  email: string;
  username: string;
  passHash: string;
};

const users = new Map<string, User>();          // email -> User
const usersByUsername = new Map<string, User>(); // username -> User
const refreshStore = new Map<string, string>(); // userId -> refreshToken

const app = express();

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(cookieParser());

// utils

function signAccess(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET as Secret, { expiresIn: "15m" });
}

function signRefresh(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET as Secret, { expiresIn: "7d" });
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: false,  
    sameSite: "strict",
    path: "/auth/refresh",
  });
}


interface AuthUser {
  sub: string;
  email?: string;
  username?: string;
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "no token" });
  }

  const token = header.slice("Bearer ".length);

  try {
    req.user = jwt.verify(token, ACCESS_SECRET as Secret) as AuthUser;
    return next();
  } catch {
    return res.status(401).json({ message: "invalid token" });
  }
}


app.post("/auth/register", async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "email, password and username required" });
  }

  if (users.has(email)) {
    return res.status(409).json({ message: "email already exists" });
  }

  if (usersByUsername.has(username.toLowerCase())) {
    return res.status(409).json({ message: "username already exists" });
  }

  const passHash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();

  const user: User = { id, email, username, passHash };
  users.set(email, user);
  usersByUsername.set(username.toLowerCase(), user);

  const accessToken = signAccess({ sub: id, email, username });
  const refreshToken = signRefresh({ sub: id });

  refreshStore.set(id, refreshToken);
  setRefreshCookie(res, refreshToken);

  return res.status(201).json({
    accessToken,
    user: { id, email, username },
  });
});


app.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.get(email);

  if (!user) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.passHash);

  if (!ok) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const accessToken = signAccess({ sub: user.id, email: user.email, username: user.username });
  const refreshToken = signRefresh({ sub: user.id });

  refreshStore.set(user.id, refreshToken);
  setRefreshCookie(res, refreshToken);

  return res.json({
    accessToken,
    user: { id: user.id, email: user.email, username: user.username },
  });
});



app.post("/auth/refresh", (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "no refresh token" });
  }

  try {
    const payload = jwt.verify(token, REFRESH_SECRET as Secret) as jwt.JwtPayload;
    const userId = payload.sub as string;

    const stored = refreshStore.get(userId);
    if (!stored || stored !== token) {
      return res.status(401).json({ message: "refresh revoked" });
    }

    // Get user data to include in access token
    const user = Array.from(users.values()).find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const accessToken = signAccess({ sub: userId, email: user.email, username: user.username });
    return res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: "invalid refresh token" });
  }
});

app.get("/me", auth, (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "unauthorized" });
  }

  const userId = req.user.sub;
  const user = Array.from(users.values()).find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }

  return res.json({
    user: {
      sub: user.id,
      email: user.email,
      username: user.username,
    },
  });
});


app.post("/auth/logout", (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      const payload = jwt.verify(token, REFRESH_SECRET as Secret) as jwt.JwtPayload;
      const userId = payload.sub as string;
      refreshStore.delete(userId);
    } catch {
      // Ignore invalid/expired refresh tokens during logout
    }
  }

  res.clearCookie("refreshToken", { path: "/auth/refresh" });
  return res.json({ ok: true });
});



const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

