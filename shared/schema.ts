import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Type definitions for service packages
export type ServicePackage = {
  name: string;
  description: string;
  price: number;
  features: string[];
  includes?: string[];
  durationHours?: number;
  setupTime?: string;
};

// User tables
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  phone: text("phone"),
  profileImage: text("profileImage"),
  userType: text("userType").notNull(), // 'customer' or 'business'
  createdAt: timestamp("createdAt").defaultNow(),
  businessName: text("businessName"),
  businessDescription: text("businessDescription"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
});

// Services categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description"),
});

// Event types
export const eventTypes = pgTable("eventTypes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  description: text("description"),
});

// Service listings
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(), // Business owner ID
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(), // Price indicator like "$", "$$", "$$$"
  priceDescription: text("priceDescription"),
  location: text("location"),
  images: json("images").$type<string[]>().default([]),
  packages: json("packages").$type<ServicePackage[]>().default([]),
  categoryId: integer("categoryId").notNull(),
  featured: boolean("featured").default(false),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("reviewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Service event type relation
export const serviceEventTypes = pgTable("serviceEventTypes", {
  id: serial("id").primaryKey(),
  serviceId: integer("serviceId").notNull(),
  eventTypeId: integer("eventTypeId").notNull(),
});

// Service tags
export const serviceTags = pgTable("serviceTags", {
  id: serial("id").primaryKey(),
  serviceId: integer("serviceId").notNull(),
  tag: text("tag").notNull(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  serviceId: integer("serviceId").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(), // Customer ID
  serviceId: integer("serviceId").notNull(),
  eventDate: timestamp("eventDate").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  fromUserId: integer("fromUserId").notNull(),
  toUserId: integer("toUserId").notNull(),
  content: text("content").notNull(),
  bookingId: integer("bookingId"),
  read: boolean("read").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
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
  zip: true,
});

export const insertCategorySchema = createInsertSchema(categories);
export const insertEventTypeSchema = createInsertSchema(eventTypes);
export const insertServiceSchema = createInsertSchema(services).omit({ rating: true, reviewCount: true });
export const insertServiceEventTypeSchema = createInsertSchema(serviceEventTypes);
export const insertServiceTagSchema = createInsertSchema(serviceTags);
export const insertReviewSchema = createInsertSchema(reviews);
export const insertBookingSchema = createInsertSchema(bookings).omit({ status: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ read: true });

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertEventType = z.infer<typeof insertEventTypeSchema>;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertServiceEventType = z.infer<typeof insertServiceEventTypeSchema>;
export type InsertServiceTag = z.infer<typeof insertServiceTagSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Select types
export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type EventType = typeof eventTypes.$inferSelect;
export type Service = typeof services.$inferSelect;
export type ServiceEventType = typeof serviceEventTypes.$inferSelect;
export type ServiceTag = typeof serviceTags.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Message = typeof messages.$inferSelect;

// Login schema for authentication
export const loginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginData = z.infer<typeof loginSchema>;
