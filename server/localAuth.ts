import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User } from "@shared/schema";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupLocalAuth(app: Express) {
  // Local strategy for admin-created accounts
  passport.use('local', new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Check if this is a local account with password
        if (user.accountType !== 'local' || !user.password) {
          return done(null, false, { message: 'Invalid login method for this account' });
        }

        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Local auth routes
  app.post("/api/auth/local/login", (req, res, next) => {
    passport.authenticate('local', (err: any, user: User | false, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login session error" });
        }

        res.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            accountType: user.accountType
          }
        });
      });
    })(req, res, next);
  });

  // Generate temporary password for admin-created accounts
  app.post('/api/admin/set-password', async (req: any, res) => {
    try {
      // Check if user is admin
      const userEmail = req.user?.email || req.user?.claims?.email;
      if (userEmail !== "hello@roxzmedia.com") {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { userId, tempPassword } = req.body;
      
      if (!userId || !tempPassword) {
        return res.status(400).json({ message: "User ID and temporary password required" });
      }

      const hashedPassword = await hashPassword(tempPassword);
      
      await storage.updateUser(userId, {
        password: hashedPassword,
        accountType: 'local'
      });

      res.json({
        success: true,
        message: "Temporary password set successfully",
        tempPassword: tempPassword
      });

    } catch (error: any) {
      console.error("Error setting password:", error);
      res.status(500).json({ message: "Failed to set password" });
    }
  });

  return { hashPassword, comparePasswords };
}