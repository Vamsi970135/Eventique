var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

// server/db.ts
import pkg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bookings: () => bookings,
  categories: () => categories,
  eventTypes: () => eventTypes,
  insertBookingSchema: () => insertBookingSchema,
  insertCategorySchema: () => insertCategorySchema,
  insertEventTypeSchema: () => insertEventTypeSchema,
  insertMessageSchema: () => insertMessageSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertServiceEventTypeSchema: () => insertServiceEventTypeSchema,
  insertServiceSchema: () => insertServiceSchema,
  insertServiceTagSchema: () => insertServiceTagSchema,
  insertUserSchema: () => insertUserSchema,
  loginSchema: () => loginSchema,
  messages: () => messages,
  reviews: () => reviews,
  serviceEventTypes: () => serviceEventTypes,
  serviceTags: () => serviceTags,
  services: () => services,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  phone: text("phone"),
  profileImage: text("profileImage"),
  userType: text("userType").notNull(),
  // 'customer' or 'business'
  createdAt: timestamp("createdAt").defaultNow(),
  businessName: text("businessName"),
  businessDescription: text("businessDescription"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip")
});
var categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description")
});
var eventTypes = pgTable("eventTypes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  description: text("description")
});
var services = pgTable("services", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  // Business owner ID
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  // Price indicator like "$", "$$", "$$$"
  priceDescription: text("priceDescription"),
  location: text("location"),
  images: json("images").$type().default([]),
  categoryId: integer("categoryId").notNull(),
  featured: boolean("featured").default(false),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("reviewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow()
});
var serviceEventTypes = pgTable("serviceEventTypes", {
  id: serial("id").primaryKey(),
  serviceId: integer("serviceId").notNull(),
  eventTypeId: integer("eventTypeId").notNull()
});
var serviceTags = pgTable("serviceTags", {
  id: serial("id").primaryKey(),
  serviceId: integer("serviceId").notNull(),
  tag: text("tag").notNull()
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  serviceId: integer("serviceId").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow()
});
var bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  // Customer ID
  serviceId: integer("serviceId").notNull(),
  eventDate: timestamp("eventDate").notNull(),
  status: text("status").notNull().default("pending"),
  // pending, confirmed, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow()
});
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  fromUserId: integer("fromUserId").notNull(),
  toUserId: integer("toUserId").notNull(),
  content: text("content").notNull(),
  bookingId: integer("bookingId"),
  read: boolean("read").default(false),
  createdAt: timestamp("createdAt").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  phone: true,
  profileImage: true,
  userType: true,
  businessName: true,
  businessDescription: true,
  address: true,
  city: true,
  state: true,
  zip: true
});
var insertCategorySchema = createInsertSchema(categories);
var insertEventTypeSchema = createInsertSchema(eventTypes);
var insertServiceSchema = createInsertSchema(services).omit({ rating: true, reviewCount: true });
var insertServiceEventTypeSchema = createInsertSchema(serviceEventTypes);
var insertServiceTagSchema = createInsertSchema(serviceTags);
var insertReviewSchema = createInsertSchema(reviews);
var insertBookingSchema = createInsertSchema(bookings).omit({ status: true });
var insertMessageSchema = createInsertSchema(messages).omit({ read: true });
var loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

// server/db.ts
import dotenv from "dotenv";
dotenv.config();
var { Pool } = pkg;
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
var db = drizzle(pool, { schema: schema_exports });

// server/storage.ts
import { eq, and } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var storage = {
  // Session store
  sessionStore: new MemoryStore({
    checkPeriod: 864e5
    // prune expired entries every 24h
  }),
  // User operations
  async createUser(userData) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  },
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  },
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },
  async updateUser(id, userUpdate) {
    const [user] = await db.update(users).set(userUpdate).where(eq(users.id, id)).returning();
    return user;
  },
  // Category operations
  async getCategories() {
    return await db.select().from(categories);
  },
  async getCategoryById(id) {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  },
  async createCategory(category) {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  },
  // Event type operations
  async getEventTypes() {
    return await db.select().from(eventTypes);
  },
  async getEventTypeById(id) {
    const [eventType] = await db.select().from(eventTypes).where(eq(eventTypes.id, id));
    return eventType;
  },
  async createEventType(eventType) {
    const [newEventType] = await db.insert(eventTypes).values(eventType).returning();
    return newEventType;
  },
  // Service operations
  async getServices(filter) {
    let query = db.select().from(services);
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        query = query.where(eq(services[key], value));
      }
    }
    return await query;
  },
  async getServiceById(id) {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  },
  async getServicesByUserId(userId) {
    return await db.select().from(services).where(eq(services.userId, userId));
  },
  async getServicesByCategory(categoryId) {
    return await db.select().from(services).where(eq(services.categoryId, categoryId));
  },
  async getFeaturedServices() {
    return await db.select().from(services).where(eq(services.featured, true));
  },
  async createService(serviceData) {
    const [service] = await db.insert(services).values(serviceData).returning();
    return service;
  },
  async updateService(id, serviceData) {
    const [service] = await db.update(services).set(serviceData).where(eq(services.id, id)).returning();
    return service;
  },
  async deleteService(id) {
    const result = await db.delete(services).where(eq(services.id, id));
    return result.rowsAffected > 0;
  },
  // Service Event Type operations
  async createServiceEventType(serviceEventType) {
    const [newServiceEventType] = await db.insert(serviceEventTypes).values(serviceEventType).returning();
    return newServiceEventType;
  },
  async getServiceEventTypesByServiceId(serviceId) {
    return await db.select().from(serviceEventTypes).where(eq(serviceEventTypes.serviceId, serviceId));
  },
  // Service Tags operations
  async createServiceTag(serviceTag) {
    const [newServiceTag] = await db.insert(serviceTags).values(serviceTag).returning();
    return newServiceTag;
  },
  async getServiceTagsByServiceId(serviceId) {
    return await db.select().from(serviceTags).where(eq(serviceTags.serviceId, serviceId));
  },
  // Review operations
  async createReview(reviewData) {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  },
  async getReviewsByServiceId(serviceId) {
    return await db.select().from(reviews).where(eq(reviews.serviceId, serviceId));
  },
  async getReviewsByUserId(userId) {
    return await db.select().from(reviews).where(eq(reviews.userId, userId));
  },
  // Booking operations
  async createBooking(bookingData) {
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return booking;
  },
  async getBookingById(id) {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  },
  async getBookingsByUserId(userId) {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  },
  async getBookingsByServiceId(serviceId) {
    return await db.select().from(bookings).where(eq(bookings.serviceId, serviceId));
  },
  async updateBookingStatus(id, status) {
    const [booking] = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
    return booking;
  },
  // Message operations
  async createMessage(messageData) {
    const [message] = await db.insert(messages).values(messageData).returning();
    return message;
  },
  async getMessagesByUserId(userId) {
    return await db.select().from(messages).where(eq(messages.fromUserId, userId)).or(eq(messages.toUserId, userId));
  },
  async getMessagesByBookingId(bookingId) {
    return await db.select().from(messages).where(eq(messages.bookingId, bookingId));
  },
  async getConversation(user1Id, user2Id) {
    return await db.select().from(messages).where(
      and(eq(messages.fromUserId, user1Id), eq(messages.toUserId, user2Id)).or(
        and(eq(messages.fromUserId, user2Id), eq(messages.toUserId, user1Id))
      )
    ).orderBy(messages.createdAt);
  },
  async markMessageAsRead(id) {
    const [message] = await db.update(messages).set({ read: true }).where(eq(messages.id, id)).returning();
    return message;
  }
};

// server/auth.ts
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "eventease-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1e3 * 60 * 60 * 24 * 7
      // 1 week
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password)
      });
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.login(user, (err2) => {
        if (err2) return next(err2);
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  setupAuth(app2);
  const httpServer = createServer(app2);
  app2.get("/api/categories", async (req, res) => {
    const categories2 = await storage.getCategories();
    res.json(categories2);
  });
  app2.get("/api/categories/:id", async (req, res) => {
    const category = await storage.getCategoryById(Number(req.params.id));
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  });
  app2.get("/api/event-types", async (req, res) => {
    const eventTypes2 = await storage.getEventTypes();
    res.json(eventTypes2);
  });
  app2.get("/api/event-types/:id", async (req, res) => {
    const eventType = await storage.getEventTypeById(Number(req.params.id));
    if (!eventType) return res.status(404).json({ message: "Event type not found" });
    res.json(eventType);
  });
  app2.get("/api/services", async (req, res) => {
    let services2;
    if (req.query.featured === "true") {
      services2 = await storage.getFeaturedServices();
    } else if (req.query.categoryId) {
      services2 = await storage.getServicesByCategory(Number(req.query.categoryId));
    } else {
      services2 = await storage.getServices();
    }
    res.json(services2);
  });
  app2.get("/api/services/:id", async (req, res) => {
    const service = await storage.getServiceById(Number(req.params.id));
    if (!service) return res.status(404).json({ message: "Service not found" });
    const tags = await storage.getServiceTagsByServiceId(service.id);
    const serviceEventTypes2 = await storage.getServiceEventTypesByServiceId(service.id);
    const owner = await storage.getUser(service.userId);
    if (!owner) return res.status(404).json({ message: "Service provider not found" });
    const { password, ...ownerWithoutPassword } = owner;
    res.json({
      ...service,
      tags: tags.map((tag) => tag.tag),
      eventTypes: serviceEventTypes2.map((set) => set.eventTypeId),
      owner: ownerWithoutPassword
    });
  });
  app2.post("/api/services", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.userType !== "business") return res.status(403).json({ message: "Only business users can create services" });
    try {
      const parsedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService({
        ...parsedData,
        userId: req.user.id
      });
      if (req.body.eventTypes && Array.isArray(req.body.eventTypes)) {
        for (const eventTypeId of req.body.eventTypes) {
          await storage.createServiceEventType({
            serviceId: service.id,
            eventTypeId: Number(eventTypeId)
          });
        }
      }
      if (req.body.tags && Array.isArray(req.body.tags)) {
        for (const tag of req.body.tags) {
          await storage.createServiceTag({
            serviceId: service.id,
            tag
          });
        }
      }
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      throw error;
    }
  });
  app2.put("/api/services/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const serviceId = Number(req.params.id);
    const service = await storage.getServiceById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (service.userId !== req.user?.id) return res.status(403).json({ message: "You can only update your own services" });
    try {
      const updatedService = await storage.updateService(serviceId, req.body);
      res.json(updatedService);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      throw error;
    }
  });
  app2.delete("/api/services/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const serviceId = Number(req.params.id);
    const service = await storage.getServiceById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (service.userId !== req.user?.id) return res.status(403).json({ message: "You can only delete your own services" });
    await storage.deleteService(serviceId);
    res.status(204).send();
  });
  app2.get("/api/business/services", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.userType !== "business") return res.status(403).json({ message: "Only business users can access this endpoint" });
    const services2 = await storage.getServicesByUserId(req.user.id);
    res.json(services2);
  });
  app2.get("/api/services/:id/reviews", async (req, res) => {
    const serviceId = Number(req.params.id);
    const reviews2 = await storage.getReviewsByServiceId(serviceId);
    const reviewsWithUser = await Promise.all(reviews2.map(async (review) => {
      const user = await storage.getUser(review.userId);
      if (!user) return { ...review, user: null };
      const { password, ...userWithoutPassword } = user;
      return {
        ...review,
        user: userWithoutPassword
      };
    }));
    res.json(reviewsWithUser);
  });
  app2.post("/api/services/:id/reviews", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.userType !== "customer") return res.status(403).json({ message: "Only customers can post reviews" });
    const serviceId = Number(req.params.id);
    const service = await storage.getServiceById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });
    try {
      const parsedData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id,
        serviceId
      });
      const review = await storage.createReview(parsedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      throw error;
    }
  });
  app2.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    let bookings2;
    if (req.user?.userType === "customer") {
      bookings2 = await storage.getBookingsByUserId(req.user.id);
    } else if (req.user?.userType === "business") {
      const services2 = await storage.getServicesByUserId(req.user.id);
      const serviceIds = services2.map((service) => service.id);
      bookings2 = [];
      for (const serviceId of serviceIds) {
        const serviceBookings = await storage.getBookingsByServiceId(serviceId);
        bookings2.push(...serviceBookings);
      }
    } else {
      return res.status(403).json({ message: "Invalid user type" });
    }
    const enrichedBookings = await Promise.all(bookings2.map(async (booking) => {
      const service = await storage.getServiceById(booking.serviceId);
      const customer = await storage.getUser(booking.userId);
      if (!service || !customer) return booking;
      const { password, ...customerWithoutPassword } = customer;
      return {
        ...booking,
        service,
        customer: customerWithoutPassword
      };
    }));
    res.json(enrichedBookings);
  });
  app2.post("/api/services/:id/book", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    if (req.user?.userType !== "customer") return res.status(403).json({ message: "Only customers can book services" });
    const serviceId = Number(req.params.id);
    const service = await storage.getServiceById(serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });
    try {
      const parsedData = insertBookingSchema.parse({
        ...req.body,
        userId: req.user.id,
        serviceId
      });
      const booking = await storage.createBooking(parsedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      throw error;
    }
  });
  app2.patch("/api/bookings/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const bookingId = Number(req.params.id);
    const booking = await storage.getBookingById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    const service = await storage.getServiceById(booking.serviceId);
    if (!service) return res.status(404).json({ message: "Service not found" });
    if (req.user?.userType === "business" && service.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only update bookings for your own services" });
    }
    if (req.user?.userType === "customer" && booking.userId !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own bookings" });
    }
    const { status } = req.body;
    if (!status || !["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updatedBooking = await storage.updateBookingStatus(bookingId, status);
    res.json(updatedBooking);
  });
  app2.get("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const messages2 = await storage.getMessagesByUserId(req.user.id);
    const conversations = messages2.reduce((acc, message) => {
      const otherUserId = message.fromUserId === req.user.id ? message.toUserId : message.fromUserId;
      if (!acc[otherUserId]) {
        acc[otherUserId] = [];
      }
      acc[otherUserId].push(message);
      return acc;
    }, {});
    const conversationsWithUserInfo = await Promise.all(
      Object.entries(conversations).map(async ([otherUserId, messages3]) => {
        const otherUser = await storage.getUser(Number(otherUserId));
        if (!otherUser) return null;
        const { password, ...otherUserWithoutPassword } = otherUser;
        const sortedMessages = [...messages3].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        const lastMessage = sortedMessages[sortedMessages.length - 1];
        const unreadCount = sortedMessages.filter((m) => !m.read && m.toUserId === req.user.id).length;
        return {
          otherUser: otherUserWithoutPassword,
          lastMessage,
          unreadCount
        };
      })
    );
    const validConversations = conversationsWithUserInfo.filter(Boolean);
    res.json(validConversations);
  });
  app2.get("/api/messages/:userId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const otherUserId = Number(req.params.userId);
    const otherUser = await storage.getUser(otherUserId);
    if (!otherUser) return res.status(404).json({ message: "User not found" });
    const conversation = await storage.getConversation(req.user.id, otherUserId);
    for (const message of conversation) {
      if (message.toUserId === req.user.id && !message.read) {
        await storage.markMessageAsRead(message.id);
      }
    }
    const updatedConversation = await storage.getConversation(req.user.id, otherUserId);
    res.json(updatedConversation);
  });
  app2.post("/api/messages/:userId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const toUserId = Number(req.params.userId);
    const recipient = await storage.getUser(toUserId);
    if (!recipient) return res.status(404).json({ message: "Recipient not found" });
    try {
      const parsedData = insertMessageSchema.parse({
        ...req.body,
        fromUserId: req.user.id,
        toUserId
      });
      const message = await storage.createMessage(parsedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      throw error;
    }
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
